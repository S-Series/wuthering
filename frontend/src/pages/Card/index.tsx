import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAppStore, type LangType } from "@/stores/appStore";
import { useImgStore } from "@/stores/imgStore";
import { useOverlay } from "@/contexts/PopupContext";
import { useCharacter } from "@/stores/characterDataStore";

import ImagePicker from "@/components/ImagePicker";
import StatSlot from "@/components/features/Card/StatSlot";
import EchoSlot from "@/components/features/Card/EchoSlot";
import OcrPlayground from "@/components/features/Card/OcrSlot";
import CardDetail from "./Detail";
import CardGuideOverlay from "@/components/features/Card/CardGuideOverlay";

import { character } from "@/datas/characters"
import { type Character } from "@/datas/characters"
import { type CharacterId } from "@/datas/characterStats";
import { weaponDict } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { ATTACK_TYPE_STAT_MAP, ELEMENT_STAT_MAP, FixedStats, type StatId } from "@/datas/stats";

import { getCharacterRank } from "@/types/character.type";
import { type CharacterData } from "@/types/character.type";
import { type WeaponData } from "@/runtime/character.runtime";
import {
  calcAllEchoScore,
  calcFinalScore,
  calcFinalStat,
  patchConstell,
} from "@/runtime/characterData.helpers";

import { locale } from "@/locales/locale";

import { createPayloadData, getRenderCardStatus, requestRenderCard } from "@/api/render.api";
import { logClientEvent } from "@/api/logger";
import {
  downloadCharacterCloudData,
  isMembershipUser,
  uploadCharacterCloudData,
} from "@/api/characterCloudSync.api";
import { useAuthStore } from "@/stores/authStore";
import Select, { type StylesConfig } from "react-select";
import { useStyleStore, type SelectOption } from "@/stores/styleStore";
import { useRenderStore } from "@/stores/renderStore";
import { readCharacterDataSnapshot } from "@/stores/characterDataStorage";

import "./index.css"
import "./contents.main.css"
import CardCharacterSection from "./Character";

type CardLocaleText = ReturnType<typeof locale>["card"];

type CloudSyncDataSummary = {
  characterName: string;
  weapon: string;
  echo: string;
  score: string;
  updatedAt?: string;
};

const CLOUD_SYNC_DATE_LOCALE: Record<LangType, string> = {
  kr: "ko-KR",
  en: "en-US",
  jp: "ja-JP",
  zh: "zh-CN",
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

function createFailedSummary(
  localeText: CardLocaleText
): CloudSyncDataSummary {
  return {
    characterName: localeText.cloudSyncDateLoadFailed,
    weapon: localeText.cloudSyncDateLoadFailed,
    echo: localeText.cloudSyncDateLoadFailed,
    score: localeText.cloudSyncDateLoadFailed,
    updatedAt: localeText.cloudSyncDateLoadFailed,
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

function CloudSyncPanel({
  lang,
  localeText,
  characterId,
  characterName,
  currentData,
  onUpload,
  onDownload,
}: {
  lang: LangType;
  localeText: CardLocaleText;
  characterId: CharacterId;
  characterName: string;
  currentData: CloudSyncDataSummary;
  onUpload: () => void;
  onDownload: () => void;
}) {
  const [cloudData, setCloudData] = useState<CloudSyncDataSummary>(() => ({
    characterName: localeText.cloudSyncDateLoading,
    weapon: localeText.cloudSyncDateLoading,
    echo: localeText.cloudSyncDateLoading,
    score: localeText.cloudSyncDateLoading,
    updatedAt: localeText.cloudSyncDateLoading,
  }));

  useEffect(() => {
    let isMounted = true;

    downloadCharacterCloudData()
      .then((result) => {
        if (!isMounted) return;

        if (!result.ok) {
          setCloudData(createFailedSummary(localeText));
          return;
        }

        const formattedDate = result.updatedAt
          ? formatCloudSyncDate(result.updatedAt, lang)
          : localeText.cloudSyncDataNone;

        const targetData = result.data[characterId];

        if (!targetData) {
          setCloudData(
            createDataNoneSummary(characterName, localeText, formattedDate)
          );
          return;
        }

        setCloudData(
          createSummaryFromCharacterData({
            data: targetData,
            characterName,
            lang,
            localeText,
            updatedAt: formattedDate,
          })
        );
      })
      .catch(() => {
        if (!isMounted) return;
        setCloudData(createFailedSummary(localeText));
      });

    return () => {
      isMounted = false;
    };
  }, [
    lang,
    characterId,
    characterName,
    localeText,
    localeText.cloudSyncDateLoadFailed,
  ]);

  return (
    <div className="cloud-sync-panel">
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
          onClick={onUpload}
        >
          <strong>{localeText.cloudSyncUpload}</strong>
          <span>{localeText.cloudSyncUploadDescription}</span>
        </button>
        <button
          type="button"
          className="cloud-sync-action"
          onClick={onDownload}
        >
          <strong>{localeText.cloudSyncDownload}</strong>
          <span>{localeText.cloudSyncDownloadDescription}</span>
        </button>
      </div>
    </div>
  );
}

export default function Card() {
  const {
    lang,
    imgVer,
    isAppStorageReady,
    cardGuideDismissed,
    cardGuideAutoOpenHandled,
    setCardGuideAutoOpenHandled,
    saveCardGuideDismissed,
  } = useAppStore();
  const { characterId, setCharacterId, patchCharacterData, replaceCharacterDataSnapshot, characterData, characterBaseStat, characterFinalStat, equipmentScore, finalScore, harmonySet, statColors } = useCharacter();
  const { baseSelectStyles } = useStyleStore();
  const { openOverlay, closeOverlay } = useOverlay();
  const { user, gameProfile } = useAuthStore();
  const { setRenderedImage } = useRenderStore();

  const navigate = useNavigate();
  const localeText = locale(lang).card;

  const openCharacterWeaponManager = () => {
    openOverlay(<CardCharacterSection />, {
      title: `${localeText.cMenu} / ${localeText.wMenu}`,
      width: "min(92vw, 78rem)",
      height: "min(82vh, 52rem)",
      ratio: null,
    });
  };

  const openEchoDataManager = () => {
    openOverlay(<OcrPlayground />, {
      title: localeText.oMenu,
      width: "min(90vw, 90rem)",
      height: "min(80vh, 80rem)",
      ratio: null,
    });
  };

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const SCOREBOARD_URL = "https://docs.google.com/spreadsheets/d/169EqXJatZIMqL0MPbHF6Eg9DgLFcaxjE6hG03gYZ-_U/edit?gid=1750559029#gid=1750559029";
  const UI_BUTTON_POS = [
    { x: 85.5, y: 62.8 },
    { x: 73.89, y: 72.1 },
    { x: 60, y: 79.5 },
    { x: 45, y: 85 },
    { x: 29.3, y: 88.3 },
    { x: 13, y: 88.9 },
  ]
  const [searchParams] = useSearchParams();
  const { characterId: paramCharacterId } = useParams<{ characterId?: string }>();
  const queryCharacterId = searchParams.get("character") ?? "empty";


  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const openCardGuide = useCallback(() => {
    setCardGuideAutoOpenHandled(true);
    setIsGuideOpen(true);

    if (!window.location.hash.startsWith("#card-guide")) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#card-guide`
      );
    }
  }, [setCardGuideAutoOpenHandled]);

  const closeGuide = () => {
    setIsGuideOpen(false);

    if (window.location.hash.startsWith("#card-guide")) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
  };

  //* == Character ================================================//
  const selectedCharacterData = useMemo<Character>(() => {
    return character[characterId] ?? character["rover_spectro"];
  }, [characterId])

  const STAT_IDS = useMemo(() => {
    return [
      FixedStats.hp.id,
      FixedStats.atk.id,
      FixedStats.def.id,
      FixedStats.resonanceBns.id,
      FixedStats.critRate.id,
      FixedStats.critDmg.id,
      ELEMENT_STAT_MAP[selectedCharacterData.element] || FixedStats.dummy.id,
      ATTACK_TYPE_STAT_MAP[selectedCharacterData.type] || FixedStats.dummy.id,
    ]
  }, [selectedCharacterData.element, selectedCharacterData.type])

  //* == Weapon ================================================//
  const weaponData = useMemo<WeaponData | null>(() => {
    const id = characterData.weaponId;
    if (!id) return null;
    const base = weaponDict[id];
    const stat = weaponStat[id];
    if (!base || !stat) return null;

    return { ...base, ...stat }
  }, [characterData.weaponId])

  const configuredEchoCount = useMemo(() => {
    return countConfiguredEcho(characterData);
  }, [characterData]);

  const cloudSyncCurrentData = useMemo(() => {
    const characterName = selectedCharacterData[lang] ?? selectedCharacterData.kr;
    const weaponName = weaponData?.[lang] ?? localeText.cloudSyncNoWeapon;

    return {
      characterName,
      weapon: weaponName,
      echo: `${configuredEchoCount}/10`,
      score: `${finalScore[1].toFixed(1)}pt`,
    };
  }, [
    configuredEchoCount,
    finalScore,
    lang,
    localeText.cloudSyncNoWeapon,
    selectedCharacterData,
    weaponData,
  ]);

  const weaponConstellOption: SelectOption[] = [
    { value: "1", label: "✦" },
    { value: "2", label: "✦✦" },
    { value: "3", label: "✦✦✦" },
    { value: "4", label: "✦✦✦✦" },
    { value: "5", label: "✦✦✦✦✦" },
  ]

  //* == Image ================================================//
  const namecardImage = useImgStore((s) => s.namecardImage);

  const setImageSrc = useImgStore((s) => s.setImageSrc);
  // const resetImage = useUserStore((s) => s.resetImage);

  //* == Init Datas ================================================//

  function isCharacterId(value: string): value is CharacterId {
    return Object.prototype.hasOwnProperty.call(character, value);
  }

  useEffect(() => {
    const fromParam =
      paramCharacterId && isCharacterId(paramCharacterId)
        ? paramCharacterId
        : undefined;

    const fromQuery =
      isCharacterId(queryCharacterId) ? queryCharacterId : undefined;

    const fromStorage = localStorage.getItem("selectedCharacterId");

    if (fromParam) {
      setCharacterId(fromParam);
      return;
    }

    if (fromQuery) {
      setCharacterId(fromQuery);
      navigate("/card", { replace: true });
      return;
    }

    if (fromStorage && isCharacterId(fromStorage)) {
      setCharacterId(fromStorage);
      return;
    }

    setCharacterId("rover_spectro");
  }, [navigate, paramCharacterId, queryCharacterId, setCharacterId])

  const BASE_STATS_MAP = useMemo<Partial<Record<StatId, number>>>(() => {
    return {
      //* base stats
      [FixedStats.hp.id]: characterBaseStat?.hp || 0,
      [FixedStats.atk.id]: (characterBaseStat?.atk || 0) + (weaponData?.atk || 0),
      [FixedStats.def.id]: characterBaseStat?.def || 0,
      [FixedStats.resonanceBns.id]: characterBaseStat?.resonanceBns || 0,
      [FixedStats.critRate.id]: characterBaseStat?.critRate || 0,
      [FixedStats.critDmg.id]: characterBaseStat?.critDmg || 0,

      //* element type stats
      [FixedStats.aeroBns.id]: characterBaseStat?.aero || 0,
      [FixedStats.fusionBns.id]: characterBaseStat?.fusion || 0,
      [FixedStats.glacioBns.id]: characterBaseStat?.glacio || 0,
      [FixedStats.electroBns.id]: characterBaseStat?.electro || 0,
      [FixedStats.havocBns.id]: characterBaseStat?.havoc || 0,
      [FixedStats.spectroBns.id]: characterBaseStat?.spectro || 0,

      //* attack type stats
      [FixedStats.basicBns.id]: characterBaseStat?.basic || 0,
      [FixedStats.heavyBns.id]: characterBaseStat?.heavy || 0,
      [FixedStats.skillBns.id]: characterBaseStat?.skill || 0,
      [FixedStats.liberationBns.id]: characterBaseStat?.liberation || 0,
      [FixedStats.healBns.id]: characterBaseStat?.heal || 0,
    }
  }, [characterBaseStat, weaponData?.atk]);

  const FINAL_STATS_MAP = useMemo<Partial<Record<StatId, number>>>(() => {
    return {
      //* base stats
      [FixedStats.hp.id]: characterFinalStat?.hp || 0,
      [FixedStats.atk.id]: characterFinalStat?.atk || 0,
      [FixedStats.def.id]: characterFinalStat?.def || 0,
      [FixedStats.resonanceBns.id]: characterFinalStat?.resonanceBns || 0,
      [FixedStats.critRate.id]: characterFinalStat?.critRate || 0,
      [FixedStats.critDmg.id]: characterFinalStat?.critDmg || 0,

      //* element type stats
      [FixedStats.aeroBns.id]: characterFinalStat?.aero || 0,
      [FixedStats.fusionBns.id]: characterFinalStat?.fusion || 0,
      [FixedStats.glacioBns.id]: characterFinalStat?.glacio || 0,
      [FixedStats.electroBns.id]: characterFinalStat?.electro || 0,
      [FixedStats.havocBns.id]: characterFinalStat?.havoc || 0,
      [FixedStats.spectroBns.id]: characterFinalStat?.spectro || 0,

      //* attack type stats
      [FixedStats.basicBns.id]: characterFinalStat?.basic || 0,
      [FixedStats.heavyBns.id]: characterFinalStat?.heavy || 0,
      [FixedStats.skillBns.id]: characterFinalStat?.skill || 0,
      [FixedStats.liberationBns.id]: characterFinalStat?.liberation || 0,
      [FixedStats.healBns.id]: characterFinalStat?.heal || 0,
    }
  }, [characterFinalStat]);

  const dropStyle: StylesConfig<SelectOption, false> = {
    ...baseSelectStyles,
    menu: (base, state) => {
      const common = baseSelectStyles.menu
        ? baseSelectStyles.menu(base, state)
        : base;

      return {
        ...common,
        right: 0,
        minWidth: "100%",
        width: "max-content",
        maxWidth: "200%",
        textAlign: "center",
      };
    },
  }

  const refreshRenderStatus = async () => {
    try {
      const data = await getRenderCardStatus();
      setRenderStatus(data.status);
      setRetryAfterSec(data.retryAfterSec);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = async () => {
    if (!user) {
      alert("Need to login")
    }

    const testing = (user && gameProfile && characterFinalStat) ? createPayloadData(
      lang, user, gameProfile, characterData, characterFinalStat, harmonySet, equipmentScore, finalScore, statColors
    ) : null;

    if (!testing) return;

    try {
      //! Debug code 
      /// const blob = await requestRenderCardDirect(testing);
      const blob = await requestRenderCard(testing);
      setRenderedImage(blob);
      alert("Complete!")
    } catch (e) {
      console.error(e);
    } finally {
      await refreshRenderStatus();
    }
  };

  const handleCloudUpload = async () => {
    if (!user) {
      alert(localeText.cloudSyncLoginRequired);
      return;
    }

    if (!isMembershipUser(user)) {
      alert(localeText.cloudSyncMembershipRequired);
      return;
    }

    const result = await uploadCharacterCloudData(readCharacterDataSnapshot());

    if (!result.ok) {
      alert(result.message);
      return;
    }

    alert(localeText.cloudSyncSuccess);
    closeOverlay();
  };

  const handleCloudDownload = async () => {
    if (!user) {
      alert(localeText.cloudSyncLoginRequired);
      return;
    }

    if (!isMembershipUser(user)) {
      alert(localeText.cloudSyncMembershipRequired);
      return;
    }

    const result = await downloadCharacterCloudData();

    if (!result.ok) {
      alert(result.message);
      return;
    }

    if (!result.updatedAt) {
      alert(localeText.cloudSyncNoCloudData);
      return;
    }

    replaceCharacterDataSnapshot(result.data);
    alert(localeText.cloudSyncDownloadSuccess);
    closeOverlay();
  };

  const openCloudSyncManager = () => {
    openOverlay(
      <CloudSyncPanel
        lang={lang}
        localeText={localeText}
        characterId={characterId}
        characterName={cloudSyncCurrentData.characterName}
        currentData={cloudSyncCurrentData}
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
  };

  type RenderStatus = "ready" | "lock" | "cooldown";
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("ready");
  const [retryAfterSec, setRetryAfterSec] = useState(0);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getRenderCardStatus();
        setRenderStatus(data.status);
        setRetryAfterSec(data.retryAfterSec);
      } catch (e) {
        console.error(e);
      }
    };

    loadStatus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRetryAfterSec((prev) => {
        if (prev <= 1) {
          setRenderStatus((current) =>
            current === "lock" || current === "cooldown" ? "ready" : current
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatRemain = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const renderedImageUrl = useRenderStore((state) => state.renderedImageUrl);
  const hydrateRenderedImage = useRenderStore((state) => state.hydrateRenderedImage);

  useEffect(() => {
    hydrateRenderedImage();
  }, [hydrateRenderedImage]);

  useEffect(() => {
    if (
      !isAppStorageReady ||
      cardGuideDismissed ||
      cardGuideAutoOpenHandled
    ) {
      return;
    }

    const openGuideId = window.setTimeout(() => {
      openCardGuide();
    }, 0);

    return () => {
      window.clearTimeout(openGuideId);
    };
  }, [
    cardGuideAutoOpenHandled,
    cardGuideDismissed,
    isAppStorageReady,
    openCardGuide,
  ]);


  //* == return data ================================================//
  return (
    <div id="card-page-slot">
      {isGuideOpen && (
        <CardGuideOverlay
          dismissed={cardGuideDismissed}
          onDismissedChange={saveCardGuideDismissed}
          onClose={closeGuide}
        />
      )}

      <section className="card-management-bar" data-card-guide="management">
        <button
          type="button"
          onClick={openCharacterWeaponManager}
        >
          <span>{localeText.characterWeaponData}</span>
        </button>
        <button
          type="button"
          onClick={openEchoDataManager}
        >
          <span>{localeText.oMenu}</span>
        </button>
        <button type="button" onClick={openCloudSyncManager}>
          <span>{localeText.cloudSync}</span>
        </button>
      </section>

      <div className="card-section left">
        <div className="card-contents">
          <div className="card-contents-slot header">
            <div className="item-slot" data-card-guide="actions">
              <button
                type="button"
                className="card-page-button content top"
                onClick={openCardGuide}
              >
                <span>{localeText.help}</span>
              </button>
              <button
                className="card-page-button content top"
                disabled={renderStatus !== "ready" || retryAfterSec > 0}
                onClick={handlePreview}
                onMouseOver={() => console.log(renderStatus)}
              >
                <span>
                  {localeText.request} {formatRemain(retryAfterSec)}
                </span>
              </button>
              <button
                className="card-page-button content top"
                disabled={!renderedImageUrl}
                onClick={() =>
                  openOverlay(
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={renderedImageUrl ?? ""}
                        style={{
                          width: "100%",
                          height: "auto",
                          border: "1px solid #fff",
                          filter: "drop-shadow(0 2px 4px #000)",
                        }}
                      />
                      <button
                        style={{
                          marginTop: "2rem",
                          height: "2rem",
                          width: "fit-content",
                          minWidth: "8rem",
                          color: "#fff",
                          fontSize: "min(1vw, 1rem)",
                        }}
                        onClick={() => {
                          try {
                            if (!renderedImageUrl) {
                              void logClientEvent({
                                feature: "download",
                                eventName: "image_download",
                                result: "fail",
                                message: "rendered image is missing",
                                meta: { characterId },
                              });
                              return;
                            }

                            const a = document.createElement("a");
                            a.href = renderedImageUrl;
                            a.download = `${characterId}.png`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();

                            void logClientEvent({
                              feature: "download",
                              eventName: "image_download",
                              result: "success",
                              meta: { characterId },
                            });
                          } catch (error) {
                            void logClientEvent({
                              feature: "download",
                              eventName: "image_download",
                              result: "fail",
                              message:
                                error instanceof Error
                                  ? error.message
                                  : "download failed",
                              meta: { characterId },
                            });
                          }
                        }}
                      >
                        {localeText.download}
                      </button>
                    </div>,
                    { title: `${localeText.download}` }
                  )
                }
              >
                <span>{localeText.download}</span>
              </button>
            </div>

            <div className="item-slot">
              <button className="card-page-button content top">
                <span>{localeText.plate1}</span>
              </button>
              <button className="card-page-button content top">
                <span>{localeText.plate2}</span>
              </button>
            </div>
          </div>

          {/* == //$ Main Content */}
          <div className="card-contents-slot main" data-card-guide="preview">
            <div className="main-item-slot character">
              <div className="card-character-slot">
                <img className="character-img"
                  src={`${BASE_URL}/character/${
                    characterId?.includes("rover")
                      ? `rover?v=${imgVer}`
                      : characterId
                  }/stand.png?v=${imgVer}`}
                  onClick={openCharacterWeaponManager}
                />

                <div className="constell-overlay">
                  <img
                    className=""
                    src={`/ui/CharacterC${characterData.constell[0]}.png`}
                  />
                  {UI_BUTTON_POS.map((item, idx) => {
                    return (
                      <button
                        key={`character-constell-button${idx}`}
                        className={`constell-button ${
                          characterData.constell[0] > idx ? "active" : ""
                        }`}
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        onClick={() => {
                          patchCharacterData(
                            patchConstell(
                              characterData,
                              true,
                              characterData.constell[0] === idx + 1
                                ? 0
                                : idx + 1
                            )
                          );
                        }}
                      >
                        <img
                          className="constell-image"
                          src={`${BASE_URL}/character/${
                            characterId?.includes("rover")
                              ? "rover"
                              : characterId
                          }/C${idx + 1}.png`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="account-info region en-font">{`Asia Server`}</span>
                <span className="account-info player-name en-font">{`Lv.-- Guest Player`}</span>
                <span className="account-info player-uid en-font">{`UID. - - -  - - -  - - -`}</span>
                <span className={`character-name ${lang}-font`}>
                  {selectedCharacterData[lang]?.charAt(0).toUpperCase() +
                    selectedCharacterData[lang]?.slice(1)}
                </span>

                <img
                  className="character-icon element"
                  alt="element icon"
                  src={`/ico/element/${selectedCharacterData.element}.png`}
                />
                <img
                  className="character-icon stat-type"
                  alt="stat type icon"
                  src={`/ico/stats/atk.webp`}
                />
                <img
                  className="character-icon attack-type"
                  alt="attack type icon"
                  src={`/ico/stats/${selectedCharacterData.type}Bns.webp`}
                />
                <img
                  className="character-icon weapon-type"
                  alt="weapon type icon"
                  src={`/ico/weapon_type/${selectedCharacterData.weapon}.webp`}
                />
              </div>
            </div>

            <div className="main-item-slot weapon">
              <div className="weapon-info-img">
                <img
                  alt="weapon icon"
                  src={`${BASE_URL}/weapon/${selectedCharacterData.weapon}/${weaponData?.imgKey}.png?v=${imgVer}`}
                  onError={(e) => {
                    e.currentTarget.dataset.fallback = "true";
                    e.currentTarget.src = "/default.webp";
                  }}
                />
              </div>

              <div className="weapon-constell-select en-font">
                <Select
                  isSearchable={false}
                  styles={dropStyle}
                  options={weaponConstellOption}
                  value={weaponConstellOption.find(
                    (item) =>
                      item.value === characterData.constell[1].toString()
                  )}
                  menuShouldScrollIntoView={false}
                  menuPortalTarget={document.body}
                  onChange={(opt) => {
                    const value = Number(opt?.value);
                    patchCharacterData(
                      patchConstell(characterData, false, value)
                    );
                  }}
                />
              </div>

              <div className="weapon-info-slot">
                <span className="weapon-name">
                  {`${weaponData?.[lang] || "- - - - - - - - - -"}`}
                </span>

                <img
                  className="weapon-stat-icon main"
                  alt="stat icon"
                  src={`/ico/stats/atk.webp`}
                />
                <span className="weapon-stat num-font main">{`${
                  weaponData?.atk || "- - -"
                }`}</span>

                <img
                  className="weapon-stat-icon sub"
                  alt="stat icon"
                  src={`/ico/stats/${weaponData?.statType[0]}.webp`}
                  onError={(e) => {
                    e.currentTarget.dataset.fallback = "true";
                    e.currentTarget.src = "/default.webp";
                  }}
                />
                <span className="weapon-stat num-font sub">
                  {`${weaponData?.value[0].toFixed(1) || "- - -"}`}
                  <em>%</em>
                </span>
              </div>
            </div>

            <div className="main-item-slot stats">
              {STAT_IDS.map((item: StatId) => {
                return (
                  <StatSlot
                    key={`character-stat-slot-${item}`}
                    statId={item}
                    statValue={FINAL_STATS_MAP?.[item] ?? 0}
                    plusValue={
                      (FINAL_STATS_MAP?.[item] ?? 0) -
                      (BASE_STATS_MAP?.[item] ?? 0)
                    }
                  />
                );
              })}

              <div className="harmony-slot">
                {Object.entries(harmonySet).map(([id, number]) => {
                  const harmonyId = id as HarmonyId;
                  return (
                    <div className="container" key={harmonyId}>
                      <img src={`/ico/harmony/${harmonyId}.png`} />
                      <span className={`${lang}-font`}>
                        {harmony[harmonyId][lang]}{" "}
                        <em className="num-font">[{number}]</em>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="score-slot">
                <span className="en-font">
                  Cv. <em className="num-font">{finalScore[0].toFixed(1)}</em>pt
                </span>
                <span className="en-font">
                  Av. <em className="num-font">{finalScore[1].toFixed(1)}</em>pt
                </span>
              </div>
            </div>

            <div className="main-item-slot description">
              <span className="en-font kuro">
                Unofficial Fan Project: All assets © Kuro Games{" "}
              </span>
              <span className="en-font powered">Powered by. SSeries </span>
              <span className="en-font link">
                <em>
                  <img className="link-image" src="/link.png" />
                  WuWa.dev
                </em>{" "}
                © 2025
              </span>
            </div>

            <div className="main-item-slot namecard">
              <div className="namecard-score">
                <img
                  alt="rank icon"
                  src={`/ico/rank/${getCharacterRank(finalScore[1])}.png`}
                />
                <span className="en-font">
                  Av. <em className="num-font">{finalScore[1].toFixed(1)}</em>pt
                </span>
              </div>

              <div className="namecard-image">
                <ImagePicker
                  src={namecardImage.src}
                  defaultSrc={`${BASE_URL}/character/${
                    characterId.includes("rover") ? "rover" : characterId
                  }/art.png`}
                  onChangeSrc={(src) => setImageSrc("namecardImage", src)}
                />
              </div>
            </div>

            <div className="main-item-slot echos">
              {[0, 1, 2, 3, 4].map((idx) => {
                return (
                  <EchoSlot
                    key={`echos-slot-${idx}`}
                    index={characterData.echoDataIndex[idx]}
                  />
                );
              })}
            </div>
          </div>
          {/* == //$ Main Content End */}

          <div className="card-contents-slot footer">
            <div className="item-slot">
              <button className="card-page-button content bottom"
                disabled={true}>
                <span>{/*localeText.image1*/} 캐릭터 이미지 관리</span>
              </button>
            </div>

            <div className="item-slot">
              <button
                className="card-page-button content bottom"
                data-card-guide="scoreboard"
                onClick={() => window.open(SCOREBOARD_URL, "_blank")}
              >
                <span>{localeText.scoreboard}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="card-detail-guide-target" data-card-guide="detail">
          <CardDetail cData={characterData}/>
        </div>
      </div>
    </div>
  );
}
