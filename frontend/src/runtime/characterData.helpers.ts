import { character } from "@/datas/characters";
import type { CharacterData, CharacterStat, ScoreList } from "@/types/character.type";
import type { EchoRuntime, EchoStatOption } from "@/runtime/echo.runtime";
import { characterStat, type CharacterId } from "@/datas/characterStats";
import { weaponStat } from "@/datas/weaponStats";
import type { WeaponId } from "@/datas/weapon";
import { FixedStats, type StatId } from "@/datas/stats";
import { echoDict, getEchoCostKey, type EchoCostKey, type EchoData, type EchoId } from "@/datas/echos";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { characterScoreSheet, type CharacterScore } from "@/datas/characterScoreSheet";
import { characterMeta, type CharacterMeta } from "@/datas/characters.meta";

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

  next[isMain ? 0 : 1] = value;

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

export const calcFinalStat = (
  data: CharacterData,
  harmonySet: Partial<Record<HarmonyId, number>>
) => {
  const id : CharacterId = data.characterId;
  const characterData = character[id];
  const characterEchoData = data.echoData;
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

  equipmentStats[`${characterData.element}Bns`] += C_baseStat.typeBns[0];
  equipmentStats[`${characterData.type}Bns`] += C_baseStat.typeBns[1];

  equipmentStats[W_baseStat.statType[0]] += W_baseStat.value[0];
  equipmentStats[W_baseStat.statType[1]] += W_baseStat.value[1];
  // Should i remove magic number 5?
  for (let i = 0; i < 5; i++) {
    const loopData = characterEchoData[i];

    if (loopData.cost === 4) equipmentStats.atk += 150;
    if (loopData.cost === 3) equipmentStats.atk += 100;
    if (loopData.cost === 1) equipmentStats.hp += 2280;

    equipmentStats[loopData.mainOption.statId] +=
      loopData.mainOption.statValue !== -1 ? loopData.mainOption.statValue : 0;

    for (let j = 0; j < 5; j++) {
      equipmentStats[loopData.subOptions[j].statId] +=
        loopData.subOptions[j].statValue !== -1
          ? loopData.subOptions[j].statValue
          : 0;
    }
  }

  const cost = data.echoData[0].cost;
  const mainEchoId = data.echoData[0].echoId;

  console.log(mainEchoId);

  if (mainEchoId) {
    const costKey: EchoCostKey | null = getEchoCostKey(cost);
    if (costKey){
      const mainEcho: Omit<EchoData, "id"> | null  = echoDict[costKey][mainEchoId];

      if (mainEcho) {
        const mainEchoStats = mainEcho.getStats(id);
        for (const stat of mainEchoStats) {
          equipmentStats[stat.statId] += stat.value;
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

    const activeOption = harmonyData.option.find(
      (opt) => opt.count === activeCount
    );
    if (!activeOption) continue;

    for (const stat of activeOption.options) {
      harmonyStats[stat.statId] += stat.value;
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

  return stats;
};

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
  if (echo.cost === 4) {
    if (
      !metaData.cost4MainStats.some((item) => item === echo.mainOption.statId)
    ) { av = av - 10; }
  }
  if (echo.cost === 3) {
    if (
      !metaData.cost3MainStats.some((item) => item === echo.mainOption.statId)
    ) { av = av - 10; }
  }
  if (echo.cost === 1) {
    const statKey : StatId = `${metaData.statType}Pct`
    if (!(echo.mainOption.statId === statKey)) av = av - 10; 
  }

  return[cv, av];
};

export const calcAllEchoScore = (
  character: CharacterData
): ScoreList => {
  const fallback: ScoreList = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]

  const cId = character.characterId;
  if (!cId) return fallback;

  const sheet = characterScoreSheet[cId];
  if (!sheet) return fallback;

  const cMeta = characterMeta[cId];
  if (!cMeta) return fallback;

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

  const magicNumber = 90 / ((scoreLarge * (5 - resCount) + scoreSmall * resCount) / 5);

  const ret: ScoreList = [...fallback];
  for (let i = 0; i < 10; i++) {
    const echoData = character.echoData[i];
    ret[i] = calcEchoScore(cId, sheet, echoData, magicNumber, cMeta);
  }
  return ret;
};

export const calcFinalScore = (
  cData: CharacterData,
  cStat: CharacterStat,
  sData: ScoreList,
): [number, number] => {  
  const fallback: [number, number] = [0, 0];

  const cId = cData.characterId;
  if (!cId) return fallback;
  const cMeta = characterMeta[cId];
  if (!cMeta) return fallback;
  const cSheet = characterScoreSheet[cId];
  if (!cSheet) return fallback;

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

  // 공효가 요구치 보다 부족
  const cRes = cStat.resonanceBns;
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
  
  return [cv, av];
}
