import { character } from "@/datas/characters";
import type { CharacterData, CharacterStat } from "@/types/character.type";
import type { EchoRuntime, EchoStatOption } from "@/runtime/echo.runtime";
import { characterStat } from "@/datas/characterStats";
import { weaponStat } from "@/datas/weaponStats";
import type { WeaponId } from "@/datas/weapon";

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
    resBns: 0,
    critRate: 0,
    critDmg: 0,
    elementBns: {
      aero: 0,
      fusion: 0,
      glacio: 0,
      electro: 0,
      havoc: 0,
      spectro: 0,
    },
    attackTypeBns: {
      basic: 0,
      heavy: 0,
      skill: 0,
      liberation: 0,
      heal: 0,
    },
  };

  stats.hp = C_baseStat.baseHp;
  stats.atk = C_baseStat.baseAtk + W_baseStat.atk;
  stats.def = C_baseStat.baseDef;

  stats.resBns = C_baseStat.ResonanceBns;
  stats.critRate = C_baseStat.CritRate;
  stats.critDmg = C_baseStat.CritDmg;

  stats.elementBns[characterData.element] = C_baseStat.typeBns[0];
  stats.attackTypeBns[characterData.type] = C_baseStat.typeBns[1];

  return stats;
};

export const calcFinalStat = (data: CharacterData) => {
  const id = data.characterId
  const characterData = character[id];
  const C_baseStat = characterStat[id];
  const W_baseStat = weaponStat[data?.weaponId || "dummy"];
  const stats: CharacterStat = {
    hp: 0,
    atk: 0,
    def: 0,
    resBns: 0,
    critRate: 0,
    critDmg: 0,
    elementBns: {
      aero: 0,
      fusion: 0,
      glacio: 0,
      electro: 0,
      havoc: 0,
      spectro: 0,
    },
    attackTypeBns: {
      basic: 0,
      heavy: 0,
      skill: 0,
      liberation: 0,
      heal: 0,
    },
  };

  stats.hp = C_baseStat.baseHp;
  stats.atk = C_baseStat.baseAtk + W_baseStat.atk;
  stats.def = C_baseStat.baseDef;

  stats.resBns = C_baseStat.ResonanceBns;
  stats.critRate = C_baseStat.CritRate;
  stats.critDmg = C_baseStat.CritDmg;

  stats.elementBns[characterData.element] = C_baseStat.typeBns[0];
  stats.attackTypeBns[characterData.type] = C_baseStat.typeBns[1];

  return stats;
};
