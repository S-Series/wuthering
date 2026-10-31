import { character } from "@/datas/characters";
import type { CharacterData, CharacterStat, ScoreList } from "@/types/character.type";
import type { EchoRuntime, EchoStatOption } from "@/runtime/echo.runtime";
import { characterStat, type CharacterId } from "@/datas/characterStats";
import { getCharacterConstellStatBonuses } from "@/datas/characterConstellStats";
import { weaponStat } from "@/datas/weaponStats";
import { weaponDict, type WeaponId } from "@/datas/weapon";
import { FixedStats, type StatId } from "@/datas/stats";
import { echoDict, getEchoCostKey, type EchoCostKey, type EchoData, type EchoId } from "@/datas/echos";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { characterScoreSheet, getCharacterScore, type CharacterScore } from "@/datas/characterScoreSheet";
import { characterMeta, getCharacterMeta, type CharacterMeta } from "@/datas/characters.meta";
import { isValidEchoMainOption } from "./echoMainOption.helpers";
import { getCritRateBudget } from "./critRateScore.helpers";
import { getCharacterScoringStats } from "./scoreSetEffects";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SubIndex = 0 | 1 | 2 | 3 | 4;

export const setWeaponId = (
  data: CharacterData,
  weaponId: WeaponId | null
): CharacterData => {
  return { ...data, weaponId };
};

export const setEchoDataIndexes = (
  data: CharacterData,
  echoDataIndexes: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ]
): CharacterData => {
  return { ...data, echoDataIndex: echoDataIndexes };
};

export const patchConstell = (
  data: CharacterData,
  isMain: boolean,
  value: number
): Partial<CharacterData> => {
  const next: CharacterData["constell"] = [data.constell[0], data.constell[1]];

  next[isMain ? 0 : 1] = isMain ? value : Math.max(1, value);

  return { constell: next };
};

const updateEchoAtPatch = (
  data: CharacterData,
  echoIndex: EchoIndex,
  fn: (echo: EchoRuntime) => EchoRuntime
): Partial<CharacterData> => {
  const prev = data.echoData[echoIndex];
  if (!prev) return {};

  const nextEchoData: CharacterData["echoData"] = [...data.echoData];
  nextEchoData[echoIndex] = fn(prev);

  return { echoData: nextEchoData };
};

export const setEchoId = (
  data: CharacterData,
  echoIndex: EchoIndex,
  echoId: EchoId
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => ({ ...e, echoId }));
};

export const setEchoSetId = (
  data: CharacterData,
  echoIndex: EchoIndex,
  setId: HarmonyId
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => ({ ...e, setId }));
};

export const setEchoCost = (
  data: CharacterData,
  echoIndex: EchoIndex,
  cost: EchoRuntime["cost"]
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => ({ ...e, cost }));
};

export const patchEchoMainOption = (
  data: CharacterData,
  echoIndex: EchoIndex,
  patch: Partial<EchoStatOption>
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => ({
    ...e,
    mainOption: { ...e.mainOption, ...patch },
  }));
};

export const patchEchoSubOption = (
  data: CharacterData,
  echoIndex: EchoIndex,
  subIndex: SubIndex,
  patch: Partial<EchoStatOption>
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => {
    const nextSubs = [...e.subOptions] as EchoRuntime["subOptions"];
    nextSubs[subIndex] = { ...nextSubs[subIndex], ...patch };
    return { ...e, subOptions: nextSubs };
  });
};

export const patchEchoAt = (
  data: CharacterData,
  echoIndex: EchoIndex,
  patch: Partial<EchoRuntime>
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => ({
    ...e,
    ...patch,
  }));
};

export const calcBaseStat = (data: CharacterData) => {
  const id = data.characterId;
  const characterData = character[id];
  const C_baseStat = characterStat[id];
  const W_baseStat = weaponStat[data?.weaponId || "dummy"];
  const stats: CharacterStat = {
    hp: 0,
    atk: 0,
    def: 0,
    resonanceBns: 0,
    critRate: 0,
    critDmg: 0,

    aero: 0,
    fusion: 0,
    glacio: 0,
    electro: 0,
    havoc: 0,
    spectro: 0,

    basic: 0,
    heavy: 0,
    skill: 0,
    liberation: 0,
    heal: 0,

    dummy: 0,
  };

  stats.hp = C_baseStat.baseHp;
  stats.atk = C_baseStat.baseAtk + W_baseStat.atk;
  stats.def = C_baseStat.baseDef;

  stats.resonanceBns = C_baseStat.ResonanceBns;
  stats.critRate = C_baseStat.CritRate;
  stats.critDmg = C_baseStat.CritDmg;

  stats[characterData.element] = C_baseStat.typeBns[0];
  stats[characterData.type] = C_baseStat.typeBns[1];

  return stats;
};

export type GaugeStatId = "hp" | "atk" | "def" | "resonanceBns" | "critRate" | "critDmg";
export type StatContribution = {
  kind: "base" | "nodes" | "chain" | "weaponBase" | "weaponPrimary" | "weaponEffect" | "echoFixed" | "echoMain" | "echoSub" | "mainEcho" | "harmony" | "rounding";
  statId: GaugeStatId;
  value: number;
  percent?: number;
  multiplierBase?: number;
  name?: { kr: string; en: string; jp: string; zh: string };
  slot?: number;
  level?: number;
};

export const calcCharacterStatDetails = (
  data: CharacterData,
  echoIdx: number[],
  harmonySet: Partial<Record<HarmonyId, number>>
) => {
  const id : CharacterId = data.characterId;
  const characterData = character[id];
  const characterEchoData = data.echoData;
  const C_baseStat = characterStat[id];
  const W_baseStat = weaponStat[data?.weaponId || "dummy"];
  const contributions: StatContribution[] = [];
  const record = (statId: StatId, value: number, source: Omit<StatContribution, "statId" | "value">) => {
    if (value === 0) return;
    const percentStat = statId === "hpPct" ? "hp" : statId === "atkPct" ? "atk" : statId === "defPct" ? "def" : null;
    if (percentStat) {
      const multiplierBase = percentStat === "hp" ? C_baseStat.baseHp : percentStat === "atk" ? C_baseStat.baseAtk + W_baseStat.atk : C_baseStat.baseDef;
      contributions.push({ ...source, statId: percentStat, value: multiplierBase * value / 100, percent: value, multiplierBase });
    } else if (statId === "resonanceBns" || statId === "critRate" || statId === "critDmg" || statId === "hp" || statId === "atk" || statId === "def") {
      contributions.push({ ...source, statId, value });
    }
  };
  record("hp", C_baseStat.baseHp, { kind: "base" });
  record("atk", C_baseStat.baseAtk, { kind: "base" });
  record("def", C_baseStat.baseDef, { kind: "base" });
  record("atk", W_baseStat.atk, { kind: "weaponBase", name: data.weaponId ? weaponDict[data.weaponId] : undefined });
  record("resonanceBns", C_baseStat.ResonanceBns, { kind: "base" });
  // The table stores innate 5% crit rate together with unlocked skill nodes.
  record("critRate", 5, { kind: "base" });
  record("critRate", C_baseStat.CritRate - 5, { kind: "nodes" });
  record("critDmg", 150, { kind: "base" });
  record("critDmg", C_baseStat.CritDmg - 150, { kind: "nodes" });
  const stats: CharacterStat = {
    hp: 0,
    atk: 0,
    def: 0,
    resonanceBns: 0,
    critRate: 0,
    critDmg: 0,

    aero: 0,
    fusion: 0,
    glacio: 0,
    electro: 0,
    havoc: 0,
    spectro: 0,

    basic: 0,
    heavy: 0,
    skill: 0,
    liberation: 0,
    heal: 0,

    dummy: 0,
  };

  const equipmentStats: Record<StatId, number> = {
    dummy: 0,
    hp: 0,
    hpPct: 0,
    atk: 0,
    atkPct: 0,
    def: 0,
    defPct: 0,

    resonanceBns: 0,
    critRate: 0,
    critDmg: 0,
    healBns: 0,

    typeBns: 0, // All Element Bonus
    aeroBns: 0,
    fusionBns: 0,
    glacioBns: 0,
    electroBns: 0,
    spectroBns: 0,
    havocBns: 0,

    basicBns: 0,
    heavyBns: 0,
    skillBns: 0,
    liberationBns: 0,
  };

  equipmentStats.hpPct += C_baseStat.hpPct;
  equipmentStats.atkPct += C_baseStat.atkPct;
  equipmentStats.defPct += C_baseStat.defPct;
  record("hpPct", C_baseStat.hpPct, { kind: "nodes" });
  record("atkPct", C_baseStat.atkPct, { kind: "nodes" });
  record("defPct", C_baseStat.defPct, { kind: "nodes" });

  equipmentStats[`${characterData.element}Bns`] += C_baseStat.typeBns[0];
  equipmentStats[`${characterData.type}Bns`] += C_baseStat.typeBns[1];

  const constellStatBonuses = getCharacterConstellStatBonuses(
    id,
    data.constell[0]
  );

  for (const bonus of constellStatBonuses) {
    equipmentStats[bonus.statId] += bonus.value;
    record(bonus.statId, bonus.value, { kind: "chain", level: data.constell[0] });
  }

  const weaponName = data.weaponId ? weaponDict[data.weaponId] : undefined;
  equipmentStats[W_baseStat.statType[0]] += W_baseStat.value[0];
  record(W_baseStat.statType[0], W_baseStat.value[0], { kind: "weaponPrimary", name: weaponName });
  const weaponEffectValue = W_baseStat.value[1] * (1 + (Math.max(1, data.constell[1]) - 1) * 0.25);
  equipmentStats[W_baseStat.statType[1]] += weaponEffectValue;
  record(W_baseStat.statType[1], weaponEffectValue, { kind: "weaponEffect", name: weaponName, level: Math.max(1, data.constell[1]) });
  
  // Should i remove magic number 5?
  for (let i = 0; i < 5; i++) {
    const loopData = characterEchoData[echoIdx[i]];

    if (loopData.cost === 4) equipmentStats.atk += 150;
    if (loopData.cost === 3) equipmentStats.atk += 100;
    if (loopData.cost === 1) equipmentStats.hp += 2280;
    if (loopData.cost === 4) record("atk", 150, { kind: "echoFixed", slot: i + 1 });
    if (loopData.cost === 3) record("atk", 100, { kind: "echoFixed", slot: i + 1 });
    if (loopData.cost === 1) record("hp", 2280, { kind: "echoFixed", slot: i + 1 });

    equipmentStats[loopData.mainOption.statId] +=
      loopData.mainOption.statValue !== -1 ? loopData.mainOption.statValue : 0;
    record(loopData.mainOption.statId, loopData.mainOption.statValue !== -1 ? loopData.mainOption.statValue : 0, { kind: "echoMain", slot: i + 1 });

    for (let j = 0; j < 5; j++) {
      equipmentStats[loopData.subOptions[j].statId] +=
        loopData.subOptions[j].statValue !== -1
          ? loopData.subOptions[j].statValue
          : 0;
      record(loopData.subOptions[j].statId, loopData.subOptions[j].statValue !== -1 ? loopData.subOptions[j].statValue : 0, { kind: "echoSub", slot: i + 1 });
    }
  }

  const mainSlot = characterEchoData[echoIdx[0]];
  const cost = mainSlot.cost;
  const mainEchoId = mainSlot.echoId;

  console.log(mainEchoId);

  if (mainEchoId) {
    const costKey: EchoCostKey | null = getEchoCostKey(cost);
    if (costKey){
      const mainEcho: Omit<EchoData, "id"> | null  = echoDict[costKey][mainEchoId];

      if (mainEcho) {
        const mainEchoStats = mainEcho.getStats(id);
        for (const stat of mainEchoStats) {
          equipmentStats[stat.statId] += stat.value;
          record(stat.statId, stat.value, { kind: "mainEcho", name: mainEcho });
        }
      }
    }
  }

  /// ======================================================

  const harmonyStats: Record<StatId, number> = {
    dummy: 0,
    hp: 0,
    hpPct: 0,
    atk: 0,
    atkPct: 0,
    def: 0,
    defPct: 0,

    resonanceBns: 0,
    critRate: 0,
    critDmg: 0,
    healBns: 0,

    typeBns: 0, // All Element Bonus
    aeroBns: 0,
    fusionBns: 0,
    glacioBns: 0,
    electroBns: 0,
    spectroBns: 0,
    havocBns: 0,

    basicBns: 0,
    heavyBns: 0,
    skillBns: 0,
    liberationBns: 0,
  };

  for (const [id, activeCount] of Object.entries(harmonySet)) {
    const harmonyId = id as HarmonyId;
    if (!activeCount) continue;

    const harmonyData = harmony[harmonyId];
    if (!harmonyData) continue;

    const activeOptions = harmonyData.option.filter(
      (opt) => activeCount >= opt.count
    );

    for (const option of activeOptions) {
      for (const stat of option.options) {
        harmonyStats[stat.statId] += stat.value;
        record(stat.statId, stat.value, { kind: "harmony", name: harmonyData, level: option.count });
      }
    }
  }

  /// ======================================================



  /// ======================================================

  stats.hp =
    -1 +
    Math.round(
      C_baseStat.baseHp +
        equipmentStats.hp +
        (C_baseStat.baseHp * equipmentStats.hpPct) / 100 +
        (C_baseStat.baseHp * harmonyStats.hpPct) / 100
    );
  stats.atk =
    -1 +
    Math.round(
      C_baseStat.baseAtk +
        W_baseStat.atk +
        equipmentStats.atk +
        ((C_baseStat.baseAtk + W_baseStat.atk) * equipmentStats.atkPct) / 100 +
        ((C_baseStat.baseAtk + W_baseStat.atk) * harmonyStats.atkPct) / 100
    );
  stats.def =
    +1 +
    Math.round(
      C_baseStat.baseDef +
        equipmentStats.def +
        (C_baseStat.baseDef * equipmentStats.defPct) / 100 +
        (C_baseStat.baseDef * harmonyStats.defPct) / 100
    );

  stats.resonanceBns =
    C_baseStat.ResonanceBns +
    equipmentStats.resonanceBns +
    harmonyStats.resonanceBns;
  stats.critRate =
    C_baseStat.CritRate + equipmentStats.critRate + harmonyStats.critRate;
  stats.critDmg =
    C_baseStat.CritDmg + equipmentStats.critDmg + harmonyStats.critDmg;

  stats[characterData.element] =
    C_baseStat.typeBns[0] +
    equipmentStats[`${characterData.element}Bns`] +
    +harmonyStats[`${characterData.element}Bns`] +
    equipmentStats.typeBns +
    harmonyStats.typeBns;
  stats[characterData.type] =
    C_baseStat.typeBns[1] +
    equipmentStats[`${characterData.type}Bns`] +
    harmonyStats[`${characterData.type}Bns`];

  for (const statId of ["hp", "atk", "def"] as const) {
    const rawTotal = contributions.filter((source) => source.statId === statId).reduce((sum, source) => sum + source.value, 0);
    const adjustment = stats[statId] - rawTotal;
    if (Math.abs(adjustment) > 1e-9) record(statId, adjustment, { kind: "rounding" });
  }
  return { stats, contributions };
};

export const calcFinalStat = (
  data: CharacterData,
  echoIdx: number[],
  harmonySet: Partial<Record<HarmonyId, number>>,
) => calcCharacterStatDetails(data, echoIdx, harmonySet).stats;

export const calcEchoScore = (
  cId: CharacterId,
  sheet: CharacterScore,
  echo: EchoRuntime,
  magicNumber: number,
  metaData: CharacterMeta,
): [number, number] => {
  const options = echo.subOptions;

  let cv = 0;
  let av = 0;

  for (const item of options){
    const statId: StatId = item.statId;
    const value: number = item.statValue;

    if (statId === FixedStats.critRate.id) {cv += value * 2}
    if (statId === FixedStats.critDmg.id) {cv += value * 1}
    if (statId !== FixedStats.resonanceBns.id) {
      const weight = sheet[statId] ?? 0;
      av += value * weight;
    }
    if (statId === FixedStats[metaData.statType].id) {
      const statType = metaData.statType;
      let baseValue = 0
      if (statType === "hp") baseValue = characterStat[cId].baseHp;
      if (statType === "atk")
        baseValue = characterStat[cId].baseAtk + 500 /*weapon standard*/;
      if (statType === "def") baseValue = characterStat[cId].baseDef;

      const standard = baseValue / 100;
      const retValue = value / standard;
      console.log(standard, retValue);
      av += retValue;
    }
  }

  av *= magicNumber;

  if (metaData.isNeedCrit) {
    if (
      options.some((item) => item.statId === FixedStats.critRate.id) &&
      options.some((item) => item.statId === FixedStats.critDmg.id)
    )
      av += 10;
  } else {
    av += 10;
  }

  // 주옵 무효 2랭크 다운
  if (!isValidEchoMainOption(metaData, echo.cost, echo.mainOption.statId)) av -= 10;

  return[cv, av];
};

/** Keep the original whole-score multiplier independent of the equipped crit budget. */
function getEchoScoreMultiplier(cId: CharacterId): number {
  const sheet = characterScoreSheet[cId];
  const cMeta = characterMeta[cId];
  const resCount = Math.ceil(cMeta.subResReq / 12.4);
  const scoreList = [
    // higest value * score value = maxScore
    11.6 * (sheet.hpPct ?? 0),
    11.6 * (sheet.atkPct ?? 0),
    14.7 * (sheet.defPct ?? 0),
    10.5 * (sheet.critRate ?? 0),
    21.0 * (sheet.critDmg ?? 0),
    11.6 * (sheet.basicBns ?? 0),
    11.6 * (sheet.heavyBns ?? 0),
    11.6 * (sheet.skillBns ?? 0),
    11.6 * (sheet.liberationBns ?? 0),
  ];
  const sorted = [...scoreList].sort((a, b) => b - a)

  const scoreLarge = sorted.slice(0, 5).reduce((sum, value) => sum + value, 0);
  const scoreSmall = sorted.slice(0, 4).reduce((sum, value) => sum + value, 0);

  return 90 / ((scoreLarge * (5 - resCount) + scoreSmall * resCount) / 5);
}

export const calcAllEchoScore = (
  character: CharacterData
): ScoreList => {
  const fallback: ScoreList = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
  const cId = character.characterId;
  if (!cId) return fallback;
  const sheet = characterScoreSheet[cId];
  const cMeta = characterMeta[cId];
  if (!sheet || !cMeta) return fallback;
  const magicNumber = getEchoScoreMultiplier(cId);

  const ret: ScoreList = [...fallback];
  for (let i = 0; i < 10; i++) {
    const echoData = character.echoData[i];
    ret[i] = calcEchoScore(cId, sheet, echoData, magicNumber, cMeta);
  }
  return ret;
};

export function getCritRateScoreAdjustment(cData: CharacterData, cStat: CharacterStat) {
  const equipped = cData.echoDataIndex.slice(0,5).map(index => cData.echoData[index]);
  const { stats: scoringStats, assumption: conditionalSet } = getCharacterScoringStats(cData, cStat);
  const budget = getCritRateBudget(scoringStats.critRate,equipped);
  const weight = characterScoreSheet[cData.characterId].critRate ?? 0;
  const active = (budget.available < budget.maximum || budget.wasted > 0) && weight > 0;
  // Score the converted CR value with the original weights; replace only the raw CR contribution.
  const scoreDelta = active
    ? (budget.scoringValue - budget.substats) * weight * getEchoScoreMultiplier(cData.characterId)
    : 0;
  return { ...budget, conditionalSet, scoringStats, active, scoreDelta };
}

export const calcFinalScore = (
  cData: CharacterData,
  cStat: CharacterStat,
  wId: WeaponId | null,
  sData: ScoreList,
): [number, number] => {  
  const fallback: [number, number] = [0, 0];

  const cId = cData.characterId;
  if (!cId) return fallback;
  const cMeta = getCharacterMeta(cId, cData.constell[0]);
  if (!cMeta) return fallback;

  let cv = 0;
  let av = 0;

  // 선정된 5개의 에코 데이터 인덱스
  const indexed = cData.echoDataIndex.slice(0, 5);

  // 점수 테이블의 모든 점수 합산값
  for (const idx of indexed) {
    const target = sData[idx];
    cv += target[0];
    av += target[1];
  }

  const critAdjustment = getCritRateScoreAdjustment(cData,cStat);
  av += critAdjustment.scoreDelta;

  const eData: [
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime
  ] = [
    cData.echoData[indexed[0]],
    cData.echoData[indexed[1]],
    cData.echoData[indexed[2]],
    cData.echoData[indexed[3]],
    cData.echoData[indexed[4]],
  ];
  const cSheet = getCharacterScore(cId, wId, cData.constell[0], eData);
  if (!cSheet) return fallback;

  // 공효가 요구치 보다 부족
  const cRes = critAdjustment.scoringStats.resonanceBns;
  const mRes = cMeta.resReq;

  if (cRes < mRes) {
    const requirement = mRes - cRes;

    // 부옵이 저옵이라 모자람 => 경우에 따라 사이클 지장 X
    if (requirement <= 5) {
      av = av - 10;
      av = av - (requirement - 0) * (cSheet.resonanceBns ?? 0);
    }

    // 부옵이 1개 이상 모자람
    else if (requirement <= 15) {
      av = av - 20;
      av = av - (requirement - 5) * (cSheet.resonanceBns ?? 0);
    }

    // 공효 신경 아예 안썼음
    else {
      av = av - 40;
      av = av - (requirement - 15) * (cSheet.resonanceBns ?? 0);
    }
  }

  console.log("Score Comp.", cSheet.scoreComp ?? 0);
  av += cSheet.scoreComp ?? 0;

  av = Math.min(500, Math.max(av , 0));

  cv = Math.round(cv * 10) / 10;
  av = Math.round(av * 10) / 10;
  
  return [cv, av];
}
