import { character } from "@/datas/characters";
import type { CharacterData, CharacterStat } from "@/types/character.type";
import type { EchoRuntime, EchoStatOption } from "@/runtime/echo.runtime";
import { characterStat } from "@/datas/characterStats";
import { weaponStat } from "@/datas/weaponStats";
import type { WeaponId } from "@/datas/weapon";
import type { StatId } from "@/datas/stats";

type EchoIndex = 0 | 1 | 2 | 3 | 4;

export const setWeaponId = (
  data: CharacterData,
  weaponId: WeaponId | null
): CharacterData => {
  return { ...data, weaponId };
};

export const setConstell = (
  data: CharacterData,
  isMain: boolean,
  value: 0 | 1 | 2 | 3 | 4 | 5,
): CharacterData => {
  const next: [number, number] = [...data.constell];
  if (isMain) next[0] = value;
  else next[1] = value;
  return { ...data, constell: next };
};

const updateEchoAtPatch = (
  data: CharacterData,
  echoIndex: EchoIndex,
  fn: (echo: EchoRuntime) => EchoRuntime
): Partial<CharacterData> => {
  const prev = data.echoData[echoIndex];
  if (!prev) return {}; // 방어 (길이 깨졌거나 비어있을 때)

  const nextEchoData: CharacterData["echoData"] = [...data.echoData];
  nextEchoData[echoIndex] = fn(prev);

  return { echoData: nextEchoData };
};

export const setEchoId = (
  data: CharacterData,
  echoIndex: EchoIndex,
  echoId: string
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => ({ ...e, echoId }));
};

export const setEchoSetId = (
  data: CharacterData,
  echoIndex: EchoIndex,
  setId: string
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
  subIndex: EchoIndex,
  patch: Partial<EchoStatOption>
): Partial<CharacterData> => {
  return updateEchoAtPatch(data, echoIndex, (e) => {
    const nextSubs = [...e.subOptions] as EchoRuntime["subOptions"];
    nextSubs[subIndex] = { ...nextSubs[subIndex], ...patch };
    return { ...e, subOptions: nextSubs };
  });
};

export const calcBaseStat = (data: CharacterData) => {
  const id = data.characterId
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

export const calcFinalStat = (data: CharacterData) => {
  const id = data.characterId
  const characterData = character[id];
  const characterEchoData = data.echoData
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
    
  }
  
  equipmentStats.hpPct += C_baseStat.hpPct;
  equipmentStats.atkPct += C_baseStat.atkPct;
  equipmentStats.defPct += C_baseStat.defPct;
  
  equipmentStats[`${characterData.element}Bns`] += C_baseStat.typeBns[0] 
  equipmentStats[`${characterData.type}Bns`] += C_baseStat.typeBns[1]

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

    for (let j = 0; j < 5; j++){
      equipmentStats[loopData.subOptions[j].statId] +=
        loopData.subOptions[j].statValue !== -1 ? loopData.subOptions[j].statValue : 0;
    }
  }

  stats.hp = -1 + Math.round(C_baseStat.baseHp + equipmentStats.hp + C_baseStat.baseHp * equipmentStats.hpPct / 100);
  stats.atk = -1 + Math.round(C_baseStat.baseAtk + W_baseStat.atk + equipmentStats.atk + (C_baseStat.baseAtk + W_baseStat.atk) * equipmentStats.atkPct / 100);
  stats.def = +1 + Math.round(C_baseStat.baseDef + equipmentStats.def + C_baseStat.baseDef * equipmentStats.defPct / 100);

  stats.resonanceBns = C_baseStat.ResonanceBns + equipmentStats.resonanceBns;
  stats.critRate = C_baseStat.CritRate + equipmentStats.critRate;
  stats.critDmg = C_baseStat.CritDmg + equipmentStats.critDmg;

  stats[characterData.element] = C_baseStat.typeBns[0] + equipmentStats[`${characterData.element}Bns`] + equipmentStats.typeBns;
  stats[characterData.type] = C_baseStat.typeBns[1] + equipmentStats[`${characterData.type}Bns`];

  console.log(equipmentStats);

  return stats;
};
