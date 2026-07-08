import { Fragment, type ReactNode } from "react";

import { characterGuideData } from "@/datas/characters.guide";
import { getCharacterMeta } from "@/datas/characters.meta";
import { character } from "@/datas/characters";
import { echoDict, type EchoData } from "@/datas/echos";
import { harmony } from "@/datas/harmonies";
import { FixedStats, type StatId } from "@/datas/stats";
import { weaponDict, type WeaponId } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { getCharacterScore } from "@/datas/characterScoreSheet";
import { locale } from "@/locales/locale";
import { useAppStore, type LangType } from "@/stores/appStore";
import type { CharacterData, CharacterStat } from "@/types/character.type";

import "./Detail.css";
import { characterStat } from "@/datas/characterStats";
import { useCharacter } from "@/stores/characterDataStore";

type Props = {
  cData: CharacterData;
};

function getEchoData(echoId: string): Omit<EchoData, "id"> | null {
  for (const echoes of Object.values(echoDict)) {
    if (echoId in echoes) return echoes[echoId];
  }

  return null;
}

function getStatLabel(statId: StatId, lang: LangType) {
  const label = FixedStats[statId][lang];
  if (lang !== "en") return label;

  return label
    .replace(/\bDamage\b/gi, "DMG")
    .replace(/\bBonus\b/gi, "%")
    .replace(/\s+%/g, "%");
}

function StatSlot({
  statId,
  lang,
  suffix,
}: {
  statId: StatId;
  lang: LangType;
  suffix?: ReactNode;
}) {
  return (
    <div className="stat-slot">
      <img src={`/ico/stats/${statId}.webp`} />
      <span className={`${lang}-font`}>
        {getStatLabel(statId, lang)}
        {suffix}
      </span>
    </div>
  );
}

function isPercentStat(statId: StatId) {
  return statId.includes("crit") || statId.includes("Pct") || statId.includes("Bns");
}

function formatStatValue(statId: StatId, value: number) {
  return isPercentStat(statId) ? `${value.toFixed(1)}%` : `${Math.round(value)}`;
}

function getPrimaryTargetValue(cData: CharacterData, statId: StatId) {
  if (statId !== FixedStats.atk.id) return null;

  return Math.round((characterStat[cData.characterId].baseAtk + 500) * 2 + 350);
}

function getRecommendedWeaponCritBonus(weaponId: WeaponId | undefined) {
  const stat = weaponId ? weaponStat[weaponId] : null;
  const primaryStatId = stat?.statType[0];
  const primaryValue = stat?.value[0] ?? 0;
  const bonus = {
    critRate: 0,
    critDmg: 0,
  };

  if (primaryStatId === FixedStats.critRate.id) {
    bonus.critRate += primaryValue;
    bonus.critDmg += 44;
  }

  if (primaryStatId === FixedStats.critDmg.id) {
    bonus.critDmg += primaryValue;
    bonus.critRate += 22;
  }

  return bonus;
}

function getTargetValue(
  statId: StatId,
  cData: CharacterData,
  recommendedWeaponId: WeaponId | undefined
): number | null {
  if (statId === FixedStats.critRate.id || statId === FixedStats.critDmg.id) {
    const baseStat = characterStat[cData.characterId];
    const weaponCritBonus = getRecommendedWeaponCritBonus(recommendedWeaponId);

    if (statId === FixedStats.critRate.id) {
      return baseStat.CritRate + weaponCritBonus.critRate + 35;
    }

    return baseStat.CritDmg + weaponCritBonus.critDmg + 70;
  }

  return null;
}

function getRecommendedLabel(statId: StatId, targetValue: number | null) {
  if (targetValue !== null) return formatStatValue(statId, targetValue);

  return "권장";
}

function getFinalStatValue(stat: CharacterStat | null, statId: StatId) {
  if (!stat) return 0;

  const statKeyMap: Partial<Record<StatId, keyof CharacterStat>> = {
    [FixedStats.hp.id]: "hp",
    [FixedStats.atk.id]: "atk",
    [FixedStats.def.id]: "def",
    [FixedStats.resonanceBns.id]: "resonanceBns",
    [FixedStats.critRate.id]: "critRate",
    [FixedStats.critDmg.id]: "critDmg",
    [FixedStats.aeroBns.id]: "aero",
    [FixedStats.fusionBns.id]: "fusion",
    [FixedStats.glacioBns.id]: "glacio",
    [FixedStats.electroBns.id]: "electro",
    [FixedStats.havocBns.id]: "havoc",
    [FixedStats.spectroBns.id]: "spectro",
    [FixedStats.basicBns.id]: "basic",
    [FixedStats.heavyBns.id]: "heavy",
    [FixedStats.skillBns.id]: "skill",
    [FixedStats.liberationBns.id]: "liberation",
    [FixedStats.healBns.id]: "heal",
    [FixedStats.dummy.id]: "dummy",
  };
  const key = statKeyMap[statId];

  return key ? stat[key] : 0;
}

function getResonancePenalty(cData: CharacterData, resonanceValue: number) {
  const meta = getCharacterMeta(cData.characterId, cData.constell[0]);
  const shortage = Math.max(0, meta.resReq - resonanceValue);
  if (shortage <= 0) {
    return { shortage, penalty: 0, invalidMainOptionCount: 0 };
  }

  const indexed = cData.echoDataIndex.slice(0, 5);
  const selectedEchoData = [
    cData.echoData[indexed[0]],
    cData.echoData[indexed[1]],
    cData.echoData[indexed[2]],
    cData.echoData[indexed[3]],
    cData.echoData[indexed[4]],
  ] as [
    CharacterData["echoData"][number],
    CharacterData["echoData"][number],
    CharacterData["echoData"][number],
    CharacterData["echoData"][number],
    CharacterData["echoData"][number],
  ];
  const scoreSheet = getCharacterScore(
    cData.characterId,
    cData.weaponId,
    cData.constell[0],
    selectedEchoData
  );
  const resonanceScoreWeight = scoreSheet.resonanceBns ?? 0;
  let penalty = 0;

  if (shortage <= 5) {
    penalty = 10 + shortage * resonanceScoreWeight;
  } else if (shortage <= 15) {
    penalty = 20 + (shortage - 5) * resonanceScoreWeight;
  } else {
    penalty = 40 + (shortage - 15) * resonanceScoreWeight;
  }

  return {
    shortage,
    penalty: Math.round(penalty * 10) / 10,
    invalidMainOptionCount: Math.ceil(shortage / 32),
  };
}

function TargetOptionRow({
  statId,
  lang,
  currentValue,
  targetValue,
}: {
  statId: StatId;
  lang: LangType;
  currentValue: number;
  targetValue: number | null;
}) {
  const passed = targetValue === null ? null : currentValue >= targetValue;

  return (
    <div className={`target-option-row ${passed === true ? "passed" : ""} ${passed === false ? "pending" : ""}`}>
      <img src={`/ico/stats/${statId}.webp`} />
      <span className={`${lang}-font target-option-name`}>
        {getStatLabel(statId, lang)}
      </span>
      <span className="num-font target-option-value">
        {getRecommendedLabel(statId, targetValue)}
      </span>
      <span className={`${lang}-font target-option-status`}>
        {passed === null ? "확인" : passed ? "달성" : "미달"}
      </span>
    </div>
  );
}

export default function CardDetail({ cData }: Props) {
  const { lang, imgVer } = useAppStore();
  const { characterFinalStat } = useCharacter();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const localeText = locale(lang).cardDetail;

  const characterData = character[cData.characterId];
  const guide = characterGuideData[cData.characterId];
  const meta = getCharacterMeta(cData.characterId, cData.constell[0]);
  const mainEcho = getEchoData(guide.guideMainEcho);
  const cost1MainStat = `${meta.statType}Pct` as StatId;
  const targetPrimaryStat =
    meta.statType === "atk" ? FixedStats.atk.id : cost1MainStat;
  const effectiveSubStats: StatId[] = meta.isNeedCrit
    ? [FixedStats.critRate.id, FixedStats.critDmg.id, cost1MainStat]
    : [cost1MainStat];
  const secondarySubStats: StatId[] = [
    FixedStats.resonanceBns.id,
    FixedStats[`${characterData.type}Bns`].id,
  ];
  const targetOptionStats = Array.from(
    new Set<StatId>([
      targetPrimaryStat,
      ...(meta.isNeedCrit
        ? [FixedStats.critRate.id, FixedStats.critDmg.id]
        : []),
      FixedStats.resonanceBns.id,
    ])
  );
  const resonanceValue = getFinalStatValue(characterFinalStat, FixedStats.resonanceBns.id);
  const resonancePenalty = getResonancePenalty(cData, resonanceValue);
  const characterImageId = cData.characterId.includes("rover")
    ? "rover"
    : cData.characterId;

  return (
    <div className="card-detail-body">
      <div className="title-area">
        <img
          src={`${BASE_URL}/character/${characterImageId}/ico.webp?v=${imgVer}`}
        />
        <span className={`${lang}-font`}>
          {characterData[lang]} {localeText.sections.target}
        </span>
      </div>

      <div className="content-area">
        <div className="inner-slot detail-area">
          <span className={`${lang}-font`}>{localeText.sections.party}</span>

          <div className="party-slot">
            <img
              src={`${BASE_URL}/character/${characterImageId}/stand.png?v=${imgVer}`}
            />

            <div className={`party-detail-slot ${lang}-font`}>
              {guide.guideParties.map((party, index) => (
                <div
                  className={`party-detail-item ${
                    index < guide.guideParties.length - 1 ? "has-divider" : ""
                  }`}
                  key={`${cData.characterId}-party-${index}`}
                >
                  <span>{localeText.parties[party.nameKey]}</span>
                  <div className="character-icon-slot">
                    {party.characters.map((partyCharacterId) => (
                      <div
                        className="party-character-image-slot"
                        key={partyCharacterId}
                      >
                        <img
                          src={`${BASE_URL}/character/${
                            partyCharacterId.includes("rover")
                              ? "rover"
                              : partyCharacterId
                          }/ico.webp?v=${imgVer}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Array.from({
                length: Math.max(0, 3 - guide.guideParties.length),
              }).map((_, index) => (
                <div
                  aria-hidden="true"
                  className="party-detail-spacer"
                  key={`${cData.characterId}-party-spacer-${index}`}
                />
              ))}
            </div>
          </div>

          <span className={`inner-title ${lang}-font`}>
            {localeText.sections.skill}
          </span>

          <div className="skill-slot">
            {guide.guideSkillOrder.map((skill) => (
              <div className="container" key={skill}>
                <img
                  src={`/ico/stats/${
                    skill === "basic" ||
                    skill === "skill" ||
                    skill === "liberation"
                      ? `${skill}Bns`
                      : skill
                  }.webp`}
                />
                <span>{localeText.skills[skill]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="inner-slot weapon-area">
          <span className={`${lang}-font`}>{localeText.sections.weapon}</span>

          <div className="weapon-image-slot">
            {guide.guideWeapons.map((weaponId, index) => {
              const weaponData = weaponDict[weaponId];

              return (
                <img
                  key={weaponId}
                  className={index === 0 ? "main" : "sub"}
                  src={`${BASE_URL}/weapon/${characterData.weapon}/${weaponData.imgKey}.png?v=${imgVer}`}
                  title={String(weaponData[lang])}
                />
              );
            })}
          </div>
        </div>

        <div className="inner-slot echo-area">
          <span className={`${lang}-font`}>{localeText.sections.echo}</span>

          <div className="echo-recommend-slot">
            <div className="detail-echo-image-slot">
              <img
                className="echo"
                src={`${BASE_URL}/ico/echos/${guide.guideMainEcho}.webp?v=${imgVer}`}
              />
            </div>
            <div className="echo-data-field">
              <span className={`${lang}-font`}>
                {mainEcho?.[lang] ?? guide.guideMainEcho}
              </span>
              <div className="divider" />
              {meta.harmonySets.map((harmonyId, index) => (
                <Fragment key={harmonyId}>
                  <div
                    className={`harmony-slot ${index === 0 ? "main" : "sub"}`}
                  >
                    <img src={`/ico/harmony/${harmonyId}.png`} />
                    <span className={`${lang}-font`}>
                      {harmony[harmonyId][lang]}
                    </span>
                  </div>
                  {index === 0 && meta.harmonySets.length > 1 && (
                    <div className="divider" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="inner-slot option-area">
          <span className={`${lang}-font`}>{localeText.sections.main}</span>

          <div className="stat-list-slot">
            <span className={`${lang}-font`}>Cost 4</span>
            <div className="divider" />
            {meta.cost4MainStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}

            <div className="split" />
            <span className={`${lang}-font`}>Cost 3</span>
            <div className="divider" />
            {meta.cost3MainStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}

            <div className="split" />
            <span className={`${lang}-font`}>Cost 1</span>
            <div className="divider" />
            <StatSlot statId={cost1MainStat} lang={lang} />
          </div>
        </div>

        <div className="inner-slot option-area">
          <span className={`${lang}-font`}>{localeText.sections.sub}</span>

          <div className="stat-list-slot">
            <span className={`${lang}-font`}>
              {localeText.subStats.priority}
            </span>
            <div className="divider" />
            {effectiveSubStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}

            <div className="split" />
            <span className={`${lang}-font`}>
              {localeText.subStats.secondary}
            </span>
            <div className="divider" />
            {secondarySubStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}
          </div>
        </div>

        <div className="inner-slot stat-area">
          <span className={`${lang}-font`}>{localeText.sections.target}</span>

          <div className="target-option-list">
            {targetOptionStats.map((statId) => {
              const targetValue =
                statId === FixedStats.resonanceBns.id
                  ? meta.resReq
                  : getPrimaryTargetValue(cData, statId) ??
                    getTargetValue(statId, cData, guide.guideWeapons[0]);

              return (
                <TargetOptionRow
                  key={statId}
                  statId={statId}
                  lang={lang}
                  currentValue={getFinalStatValue(characterFinalStat, statId)}
                  targetValue={targetValue}
                />
              );
            })}
          </div>

          <div className="resonance-penalty-row">
            <div className="resonance-penalty-item">
              <span className={`${lang}-font`}>목표공효</span>
              <em className="num-font">-{resonancePenalty.shortage.toFixed(1)}%</em>
            </div>
            <div className="resonance-penalty-item">
              <span className={`${lang}-font`}>주옵션 무효</span>
              <em className="num-font">{resonancePenalty.invalidMainOptionCount}개</em>
            </div>
            <div className="resonance-penalty-item">
              <span className={`${lang}-font`}>최종점수</span>
              <em className="num-font">-{resonancePenalty.penalty.toFixed(1)}점</em>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
