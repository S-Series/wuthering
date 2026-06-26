import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  downloadCharacterCloudData,
  isMembershipUser,
  uploadCharacterCloudData,
} from "@/api/characterCloudSync.api";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import { useOverlay } from "@/contexts/PopupContext";
import { character, characterIds } from "@/datas/characters";
import type { CharacterId } from "@/datas/characterStats";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { weaponDict } from "@/datas/weapon";
import { locale } from "@/locales/locale";
import { calcAllEchoScore, calcFinalScore, calcFinalStat } from "@/runtime/characterData.helpers";
import { useAppStore, type LangType } from "@/stores/appStore";
import { useAuthStore, type CloudCharacterDataCache } from "@/stores/authStore";
import { readCharacterDataSnapshot } from "@/stores/characterDataStorage";
import { useCharacter } from "@/stores/characterDataStore";
import type { CharacterData } from "@/types/character.type";

import "./CloudSyncManager.css";

type CardLocaleText = ReturnType<typeof locale>["card"];

type CloudSyncDataSummary = {
  characterName: string;
  weapon: string;
  echo: string;
  score: string;
  updatedAt?: string;
};

type CloudSyncAction = "upload" | "download";

const CLOUD_SYNC_DATE_LOCALE: Record<LangType, string> = {
  kr: "ko-KR",
  en: "en-US",
  jp: "ja-JP",
  zh: "zh-CN",
};

const ALL_CHARACTERS_LABEL: Record<LangType, string> = {
  kr: "전체 캐릭터",
  en: "All Characters",
  jp: "全キャラクター",
  zh: "全部角色",
};

function formatCloudSyncDate(updatedAt: string, lang: LangType) {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) return updatedAt;

  return new Intl.DateTimeFormat(CLOUD_SYNC_DATE_LOCALE[lang], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function countConfiguredEcho(data: CharacterData) {
  return data.echoData.filter((echo) => {
    if (echo.echoId || echo.setId) return true;
    if (echo.mainOption.statId !== "dummy" || echo.mainOption.statValue > 0) {
      return true;
    }

    return echo.subOptions.some(
      (option) => option.statId !== "dummy" || option.statValue > 0
    );
  }).length;
}

function getHarmonySetFromData(data: CharacterData) {
  const values = Object.fromEntries(
    Object.values(harmony).map((item) => [item.id, 0])
  ) as Record<HarmonyId, number>;

  for (const idx of data.echoDataIndex.slice(0, 5)) {
    const item = data.echoData[idx];
    if (!item?.setId) continue;
    if (!Object.prototype.hasOwnProperty.call(values, item.setId)) continue;
    values[item.setId] += 1;
  }

  return Object.fromEntries(
    Object.entries(values)
      .map(([id, count]) => {
        const harmonyId = id as HarmonyId;
        const optionCounts = harmony[harmonyId].option.map((opt) => opt.count);
        const activeCount = optionCounts
          .filter((requiredCount) => count >= requiredCount)
          .sort((a, b) => b - a)[0] ?? 0;

        return [harmonyId, activeCount] as const;
      })
      .filter(([, activeCount]) => activeCount > 0)
  ) as Partial<Record<HarmonyId, number>>;
}

function getCharacterDataScore(data: CharacterData) {
  const dataHarmonySet = getHarmonySetFromData(data);
  const finalStat = calcFinalStat(data, data.echoDataIndex, dataHarmonySet);
  const scoreList = calcAllEchoScore(data);
  return calcFinalScore(data, finalStat, data.weaponId ?? null, scoreList)[1];
}

function createDataNoneSummary(
  characterName: string,
  localeText: CardLocaleText,
  updatedAt?: string
): CloudSyncDataSummary {
  return {
    characterName,
    weapon: localeText.cloudSyncDataNone,
    echo: localeText.cloudSyncDataNone,
    score: localeText.cloudSyncDataNone,
    updatedAt,
  };
}

function createFailedSummary(localeText: CardLocaleText): CloudSyncDataSummary {
  return {
    characterName: localeText.cloudSyncDateLoadFailed,
    weapon: localeText.cloudSyncDateLoadFailed,
    echo: localeText.cloudSyncDateLoadFailed,
    score: localeText.cloudSyncDateLoadFailed,
    updatedAt: localeText.cloudSyncDateLoadFailed,
  };
}

function createLoadingSummary(localeText: CardLocaleText): CloudSyncDataSummary {
  return {
    characterName: localeText.cloudSyncDateLoading,
    weapon: localeText.cloudSyncDateLoading,
    echo: localeText.cloudSyncDateLoading,
    score: localeText.cloudSyncDateLoading,
    updatedAt: localeText.cloudSyncDateLoading,
  };
}

function createSummaryFromCharacterData({
  data,
  characterName,
  lang,
  localeText,
  updatedAt,
}: {
  data: CharacterData;
  characterName: string;
  lang: LangType;
  localeText: CardLocaleText;
  updatedAt?: string;
}): CloudSyncDataSummary {
  const weaponName = data.weaponId
    ? weaponDict[data.weaponId]?.[lang] ?? localeText.cloudSyncNoWeapon
    : localeText.cloudSyncNoWeapon;

  const score = (() => {
    try {
      return `${getCharacterDataScore(data).toFixed(1)}pt`;
    } catch {
      return localeText.cloudSyncDataNone;
    }
  })();

  return {
    characterName,
    weapon: weaponName,
    echo: `${countConfiguredEcho(data)}/10`,
    score,
    updatedAt,
  };
}

function createSummaryFromSnapshot({
  data,
  lang,
  localeText,
  updatedAt,
}: {
  data: Partial<Record<CharacterId, CharacterData>>;
  lang: LangType;
  localeText: CardLocaleText;
  updatedAt?: string;
}): CloudSyncDataSummary {
  const configuredCharacters = characterIds.filter((id) => {
    const item = data[id];
    if (!item) return false;
    if (item.weaponId) return true;
    return countConfiguredEcho(item) > 0;
  });

  return {
    characterName: ALL_CHARACTERS_LABEL[lang],
    weapon: `${configuredCharacters.length}/${characterIds.length}`,
    echo: `${configuredCharacters.reduce((sum, id) => sum + countConfiguredEcho(data[id]!), 0)}`,
    score: localeText.cloudSyncDataNone,
    updatedAt,
  };
}

function CloudSyncDataCard({
  title,
  summary,
  localeText,
}: {
  title: string;
  summary: CloudSyncDataSummary;
  localeText: CardLocaleText;
}) {
  return (
    <section className="cloud-sync-data-card">
      <span>{title}</span>
      <b>{summary.characterName}</b>
      <div className="cloud-sync-data-rows">
        <p>
          <span>{localeText.cloudSyncWeapon}</span>
          <strong>{summary.weapon}</strong>
        </p>
        <p>
          <span>{localeText.cloudSyncEchoCount}</span>
          <strong>{summary.echo}</strong>
        </p>
        <p>
          <span>{localeText.cloudSyncScore}</span>
          <strong>{summary.score}</strong>
        </p>
        {summary.updatedAt ? (
          <p>
            <span>{localeText.cloudSyncUpdatedAt}</span>
            <strong>{summary.updatedAt}</strong>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function CloudSyncConfirmDialog({
  message,
  localeText,
  showDownloadAllOption = false,
  initialDownloadAllCharacters = false,
  lockDownloadAllOption = false,
  onConfirm,
  onCancel,
  onComplete,
  onRunningChange,
}: {
  message: string;
  localeText: CardLocaleText;
  showDownloadAllOption?: boolean;
  initialDownloadAllCharacters?: boolean;
  lockDownloadAllOption?: boolean;
  onConfirm: (options?: { downloadAllCharacters: boolean }) => Promise<void>;
  onCancel: () => void;
  onComplete: () => void;
  onRunningChange: (isRunning: boolean) => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [downloadAllCharacters, setDownloadAllCharacters] = useState(
    initialDownloadAllCharacters
  );

  const execute = async () => {
    setIsRunning(true);
    onRunningChange(true);

    try {
      await onConfirm({ downloadAllCharacters });
    } finally {
      onRunningChange(false);
      setIsRunning(false);
    }

    onCancel();
    onComplete();
  };

  return (
    <div className="cloud-sync-confirm">
      <p>{message}</p>
      {showDownloadAllOption ? (
        <label className="cloud-sync-confirm__option">
          <input
            type="checkbox"
            checked={downloadAllCharacters}
            disabled={isRunning || lockDownloadAllOption}
            onChange={(event) =>
              setDownloadAllCharacters(event.currentTarget.checked)
            }
          />
          <span>{localeText.cloudSyncDownloadAllCharacters}</span>
        </label>
      ) : null}
      <strong>{localeText.cloudSyncIrreversibleWarning}</strong>
      <div className="cloud-sync-confirm__actions">
        <button
          type="button"
          className="cancel"
          disabled={isRunning}
          onClick={onCancel}
        >
          {localeText.cloudSyncCancel}
        </button>
        <button
          type="button"
          className="confirm"
          disabled={isRunning}
          onClick={execute}
        >
          {isRunning
            ? localeText.cloudSyncExecuting
            : localeText.cloudSyncExecute}
        </button>
      </div>
    </div>
  );
}

function CloudSyncPanel({
  lang,
  localeText,
  selectedCharacterId,
  characterName,
  currentData,
  cloudCache,
  refreshCloudCharacterData,
  onUpload,
  onDownload,
}: {
  lang: LangType;
  localeText: CardLocaleText;
  selectedCharacterId?: CharacterId;
  characterName: string;
  currentData: CloudSyncDataSummary;
  cloudCache: CloudCharacterDataCache;
  refreshCloudCharacterData: (options?: {
    force?: boolean;
    characterId?: CharacterId;
  }) => Promise<void>;
  onUpload: () => Promise<void>;
  onDownload: (options?: { downloadAllCharacters: boolean }) => Promise<void>;
}) {
  const { openElevatedOverlay, closeElevatedOverlay } = useElevatedOverlay();
  const { closeOverlay } = useOverlay();
  const [runningAction, setRunningAction] = useState<CloudSyncAction | null>(null);
  const cloudRetryAttemptedRef = useRef(false);
  const isAllCharactersMode = !selectedCharacterId;

  const cloudData = useMemo(() => {
    if (cloudCache.status === "loading" || cloudCache.status === "idle") {
      return createLoadingSummary(localeText);
    }

    if (cloudCache.status === "error") {
      return createFailedSummary(localeText);
    }

    const formattedDate = cloudCache.updatedAt
      ? formatCloudSyncDate(cloudCache.updatedAt, lang)
      : localeText.cloudSyncDataNone;

    if (isAllCharactersMode) {
      return createSummaryFromSnapshot({
        data: cloudCache.data,
        lang,
        localeText,
        updatedAt: formattedDate,
      });
    }

    const targetData = cloudCache.data[selectedCharacterId];

    if (!targetData) {
      return createDataNoneSummary(characterName, localeText, formattedDate);
    }

    return createSummaryFromCharacterData({
      data: targetData,
      characterName,
      lang,
      localeText,
      updatedAt: formattedDate,
    });
  }, [
    characterName,
    cloudCache,
    isAllCharactersMode,
    lang,
    localeText,
    selectedCharacterId,
  ]);

  const openCloudSyncConfirm = (action: CloudSyncAction) => {
    const isUpload = action === "upload";

    openElevatedOverlay(
      <CloudSyncConfirmDialog
        message={
          isUpload
            ? localeText.cloudSyncUploadConfirmMessage
            : localeText.cloudSyncDownloadConfirmMessage
        }
        localeText={localeText}
        showDownloadAllOption={!isUpload}
        initialDownloadAllCharacters={isAllCharactersMode}
        lockDownloadAllOption={isAllCharactersMode}
        onConfirm={isUpload ? onUpload : onDownload}
        onCancel={closeElevatedOverlay}
        onComplete={closeOverlay}
        onRunningChange={(isRunning) =>
          setRunningAction(isRunning ? action : null)
        }
      />,
      {
        title: isUpload
          ? localeText.cloudSyncUploadConfirmTitle
          : localeText.cloudSyncDownloadConfirmTitle,
        width: "min(92vw, 28rem)",
        ratio: null,
        closeOnEsc: false,
        closeOnBackdrop: false,
        showCloseButton: false,
      }
    );
  };

  useEffect(() => {
    if (cloudCache.status === "loading") return;
    if (cloudRetryAttemptedRef.current) return;

    const hasCloudData =
      cloudCache.status === "success" &&
      Boolean(cloudCache.updatedAt) &&
      (isAllCharactersMode || Boolean(cloudCache.data[selectedCharacterId]));

    if (hasCloudData) return;

    cloudRetryAttemptedRef.current = true;
    void refreshCloudCharacterData({
      force: true,
      characterId: selectedCharacterId,
    });
  }, [
    cloudCache.data,
    cloudCache.status,
    cloudCache.updatedAt,
    isAllCharactersMode,
    refreshCloudCharacterData,
    selectedCharacterId,
  ]);

  return (
    <div className="cloud-sync-panel" data-card-guide="cloud-sync-panel">
      <p className="cloud-sync-caption">{localeText.cloudSyncDescription}</p>
      <div className="cloud-sync-data-grid">
        <CloudSyncDataCard
          title={localeText.cloudSyncCurrentData}
          summary={currentData}
          localeText={localeText}
        />
        <CloudSyncDataCard
          title={localeText.cloudSyncCloudData}
          summary={cloudData}
          localeText={localeText}
        />
      </div>
      <div className="cloud-sync-actions">
        <button
          type="button"
          className="cloud-sync-action"
          disabled={runningAction !== null}
          onClick={() => openCloudSyncConfirm("upload")}
        >
          <strong>{localeText.cloudSyncUpload}</strong>
          <span>{localeText.cloudSyncUploadDescription}</span>
        </button>
        <button
          type="button"
          className="cloud-sync-action"
          disabled={runningAction !== null}
          onClick={() => openCloudSyncConfirm("download")}
        >
          <strong>{localeText.cloudSyncDownload}</strong>
          <span>{localeText.cloudSyncDownloadDescription}</span>
        </button>
      </div>
    </div>
  );
}

export default function CloudSyncManager() {
  const location = useLocation();
  const { lang } = useAppStore();
  const localeText = locale(lang).card;
  const { openOverlay } = useOverlay();
  const {
    characterId,
    characterData,
    replaceCharacterData,
    replaceCharacterDataSnapshot,
  } = useCharacter();
  const {
    user,
    cloudCharacterData,
    refreshCloudCharacterData,
    setCloudCharacterDataSnapshot,
  } = useAuthStore();

  const selectedCharacterId = location.pathname.startsWith("/card")
    ? characterId
    : undefined;
  const selectedCharacter = selectedCharacterId
    ? character[selectedCharacterId] ?? character.rover_spectro
    : null;

  const currentData = useMemo(() => {
    if (!selectedCharacterId || !selectedCharacter) {
      return createSummaryFromSnapshot({
        data: readCharacterDataSnapshot(),
        lang,
        localeText,
      });
    }

    return createSummaryFromCharacterData({
      data: characterData,
      characterName: selectedCharacter[lang] ?? selectedCharacter.kr,
      lang,
      localeText,
    });
  }, [
    characterData,
    lang,
    localeText,
    selectedCharacter,
    selectedCharacterId,
  ]);

  const handleCloudUpload = useCallback(async () => {
    if (!user) {
      alert(localeText.cloudSyncLoginRequired);
      return;
    }

    if (!isMembershipUser(user)) {
      alert(localeText.cloudSyncMembershipRequired);
      return;
    }

    const data = selectedCharacterId ? characterData : readCharacterDataSnapshot();

    let result;

    try {
      result = await uploadCharacterCloudData(data, selectedCharacterId);
    } catch {
      alert(localeText.cloudSyncRequestFailed);
      return;
    }

    if (!result.ok) {
      alert(result.message);
      return;
    }

    alert(localeText.cloudSyncSuccess);

    if (!selectedCharacterId) {
      setCloudCharacterDataSnapshot(readCharacterDataSnapshot(), result.updatedAt);
      return;
    }

    setCloudCharacterDataSnapshot(
      {
        ...cloudCharacterData.data,
        [selectedCharacterId]: characterData,
      },
      result.updatedAt
    );
  }, [
    characterData,
    cloudCharacterData.data,
    localeText,
    selectedCharacterId,
    setCloudCharacterDataSnapshot,
    user,
  ]);

  const handleCloudDownload = useCallback(async (options?: { downloadAllCharacters: boolean }) => {
    if (!user) {
      alert(localeText.cloudSyncLoginRequired);
      return;
    }

    if (!isMembershipUser(user)) {
      alert(localeText.cloudSyncMembershipRequired);
      return;
    }

    const downloadAllCharacters =
      !selectedCharacterId || options?.downloadAllCharacters === true;
    let result;

    try {
      result = await downloadCharacterCloudData(
        downloadAllCharacters ? undefined : selectedCharacterId
      );
    } catch {
      alert(localeText.cloudSyncRequestFailed);
      return;
    }

    if (!result.ok) {
      alert(result.message);
      return;
    }

    if (downloadAllCharacters) {
      if (!result.updatedAt || Object.keys(result.data).length === 0) {
        alert(localeText.cloudSyncNoCloudData);
        return;
      }

      replaceCharacterDataSnapshot(result.data);
      setCloudCharacterDataSnapshot(result.data, result.updatedAt);
      alert(localeText.cloudSyncDownloadSuccess);
      return;
    }

    const targetData = result.data[selectedCharacterId];

    if (!result.updatedAt || !targetData) {
      alert(localeText.cloudSyncNoCloudData);
      return;
    }

    replaceCharacterData(selectedCharacterId, targetData);
    setCloudCharacterDataSnapshot(
      {
        ...cloudCharacterData.data,
        [selectedCharacterId]: targetData,
      },
      result.updatedAt
    );
    alert(localeText.cloudSyncDownloadSuccess);
  }, [
    cloudCharacterData.data,
    localeText,
    replaceCharacterData,
    replaceCharacterDataSnapshot,
    selectedCharacterId,
    setCloudCharacterDataSnapshot,
    user,
  ]);

  const openCloudSyncManager = useCallback(() => {
    openOverlay(
      <CloudSyncPanel
        lang={lang}
        localeText={localeText}
        selectedCharacterId={selectedCharacterId}
        characterName={currentData.characterName}
        currentData={currentData}
        cloudCache={cloudCharacterData}
        refreshCloudCharacterData={refreshCloudCharacterData}
        onUpload={handleCloudUpload}
        onDownload={handleCloudDownload}
      />,
      {
        title: localeText.cloudSync,
        width: "min(88vw, 34rem)",
        height: null,
        ratio: null,
      }
    );
  }, [
    cloudCharacterData,
    currentData,
    handleCloudDownload,
    handleCloudUpload,
    lang,
    localeText,
    openOverlay,
    refreshCloudCharacterData,
    selectedCharacterId,
  ]);

  useEffect(() => {
    const handleOpenCloudSync = () => openCloudSyncManager();

    window.addEventListener("wuthering:open-cloud-sync", handleOpenCloudSync);

    return () => {
      window.removeEventListener("wuthering:open-cloud-sync", handleOpenCloudSync);
    };
  }, [openCloudSyncManager]);

  return null;
}
