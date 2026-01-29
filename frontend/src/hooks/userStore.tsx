import { create } from "zustand";
import type { CharacterId } from "@/datas/characterStats";

import { 
  type ImageKey,
  type ImageTransformState,
  createInitialImageState
 } from "@/runtime/image.runtime";

import {
  type CharacterFinalStat,
  type WeaponData,
  type SelectedCharacterRuntime,
  createInitialSelectedCharacterRuntime,
} from "@/runtime/character.runtime";

import { type EchoRuntime } from "@/runtime/echo.runtime";
import { characterStat } from "@/datas/characterStats";
import { FixedStats, type StatId } from "@/datas/stats";

type UserStore = {
  //#region Images
  characterImage: ImageTransformState;
  namecardImage: ImageTransformState;

  setImageSrc: (key: ImageKey, src: string | null) => void;

  setImageTransform: (
    key: ImageKey,
    partial: Partial<ImageTransformState>
  ) => void;

  replaceImageState: (
    key: ImageKey,
    next: ImageTransformState
  ) => void;

  resetImage: (key: ImageKey) => void;
  resetAllImages: () => void;

  //#endregion

  //#region Characters
  selectedCharacter: SelectedCharacterRuntime;

  setSelectedCharacter: (characterId: CharacterId | null) => void;

  setWeapon: (weaponData: WeaponData | null) => void;

  setConstell: (character: number, weapon: number) => void;

  setEcho: (index: 0 | 1 | 2 | 3 | 4, echo: EchoRuntime | null) => void;

  resetSelectedCharacter: () => void;

  getFinalStat: () => CharacterFinalStat | null;

  //#endregion
};

export const useUserStore = create<UserStore>((set, get) => ({
  //#region Images
  characterImage: createInitialImageState(),
  namecardImage: createInitialImageState(),

  setImageSrc: (key, src) =>
    set((state) => ({
      ...state,
      [key]: {
        ...state[key],
        src,
        x: 0,
        y: 0,
        scale: 1,
      },
    })),

  setImageTransform: (key, partial) =>
    set((state) => ({
      ...state,
      [key]: {
        ...state[key],
        ...partial,
      },
    })),

  replaceImageState: (key, next) =>
    set((state) => ({
      ...state,
      [key]: { ...next },
    })),

  resetImage: (key) =>
    set((state) => ({
      ...state,
      [key]: createInitialImageState(),
    })),

  resetAllImages: () =>
    set((state) => ({
      ...state,
      characterImage: createInitialImageState(),
      namecardImage: createInitialImageState(),
    })),

  //#endregion

  //#region Characters
  selectedCharacter: createInitialSelectedCharacterRuntime(),

  setSelectedCharacter: (characterId: CharacterId | null) => {
    console.log("id:", characterId);
    localStorage.setItem("selectedCharacterId", characterId || "rover_spectro");
    const stats = characterId !== null ? characterStat[characterId] : null;

    set((state) => ({
      ...state,
      selectedCharacter: {
        ...state.selectedCharacter,
        characterId,
        characterStat: stats,
      },
    }))
  },

  setWeapon: (weaponData) =>
    set((state) => ({
      ...state,
      selectedCharacter: {
        ...state.selectedCharacter,
        weaponData,
      },
    })),

  setConstell: (character, weapon) =>
    set((state) => ({
      ...state,
      selectedCharacter: {
        ...state.selectedCharacter,
        constell: [character, weapon],
      },
    })),

  setEcho: (index, echo) =>
    set((state) => {
      const nextEchoes = [...state.selectedCharacter.echoes] as typeof state.selectedCharacter.echoes;
      nextEchoes[index] = echo;

      return {
        ...state,
        selectedCharacter: {
          ...state.selectedCharacter,
          echoes: nextEchoes,
        },
      };
    }),

  resetSelectedCharacter: () =>
    set((state) => ({
      ...state,
      selectedCharacter: createInitialSelectedCharacterRuntime(),
    })),

  getFinalStat: () => {
    const { selectedCharacter } = get();
    const baseStat = selectedCharacter.characterStat;
    const weaponData = selectedCharacter.weaponData;
    const echoData = selectedCharacter.echoes;

    /*
    console.log("c:", baseStat);
    console.log("w:", weaponData);
    console.log("e:", echoData);
    */

    //$ 변수 선언
    const temp: Record<StatId, number> = {
      //* base stats
      [FixedStats.hp.id]: 0,
      [FixedStats.atk.id]: 0,
      [FixedStats.def.id]: 0,
      [FixedStats.ResonanceBns.id]: 0,
      [FixedStats.CritRate.id]: 0,
      [FixedStats.CritDmg.id]: 0,

      //* element type stats
      [FixedStats.AeroBns.id]: 0,
      [FixedStats.FusionBns.id]: 0,
      [FixedStats.GlacioBns.id]: 0,
      [FixedStats.ElectroBns.id]: 0,
      [FixedStats.HavocBns.id]: 0,
      [FixedStats.SpectroBns.id]: 0,

      //* attack type stats
      [FixedStats.basicBns.id]: 0,
      [FixedStats.heavyBns.id]: 0,
      [FixedStats.skillBns.id]: 0,
      [FixedStats.liberationBns.id]: 0,
      [FixedStats.healBns.id]: 0,

      //* always Zero
      [FixedStats.dummy.id]: 0,
      [FixedStats.hpPct.id]: 0,
      [FixedStats.atkPct.id]: 0,
      [FixedStats.defPct.id]: 0,
      [FixedStats.typeBns.id]: 0,
    }

    const values: Record<StatId, number> = {
      //* base stats
      [FixedStats.hp.id]: 0,
      [FixedStats.atk.id]: 0,
      [FixedStats.def.id]: 0,
      [FixedStats.ResonanceBns.id]: 0,
      [FixedStats.CritRate.id]: 0,
      [FixedStats.CritDmg.id]: 0,

      //* element type stats
      [FixedStats.AeroBns.id]: 0,
      [FixedStats.FusionBns.id]: 0,
      [FixedStats.GlacioBns.id]: 0,
      [FixedStats.ElectroBns.id]: 0,
      [FixedStats.HavocBns.id]: 0,
      [FixedStats.SpectroBns.id]: 0,

      //* attack type stats
      [FixedStats.basicBns.id]: 0,
      [FixedStats.heavyBns.id]: 0,
      [FixedStats.skillBns.id]: 0,
      [FixedStats.liberationBns.id]: 0,
      [FixedStats.healBns.id]: 0,

      //* always Zero
      [FixedStats.dummy.id]: 0,
      [FixedStats.hpPct.id]: 0,
      [FixedStats.atkPct.id]: 0,
      [FixedStats.defPct.id]: 0,
      [FixedStats.typeBns.id]: 0,
    }

    //$ 계산 전 데이터 정리
    //* 캐릭터 데이터
    if (baseStat !== null) {
      temp.hpPct += baseStat.hpPct ;
      temp.atkPct += baseStat.atkPct;
      temp.defPct += baseStat.defPct;
    }
    //* 무기 데이터
    if (weaponData !== null) {
      temp[weaponData.statType[0]] += weaponData.value[0];
      temp[weaponData.statType[1]] += weaponData.value[1];
    }
    //* 에코 데이터
    if (echoData !== null) {
      for (let i = 0; i < 5; i++) {
        if (echoData[i] !== null) {
          const echo = echoData[i];
          if (!echo) continue;

          if (echoData[i]?.cost === 4) temp.atk += 150;
          else if (echoData[i]?.cost === 3) temp.atk += 100;
          else temp.hp += 2280;

          temp[echo.mainOption.statId] += 10;
          for (let j = 0; j < 5; j++) {
            temp[echo.subOptions[j].statId] += echo.subOptions[j].statValue;
          }
        }
      }
    }

    //$ 데이터 계산
    values.hp = (baseStat?.baseHp ?? 0);
    values.atk = ((baseStat?.baseAtk ?? 0) + (weaponData?.atk ?? 0));
    values.def = (baseStat?.baseDef ?? 0);
    values.ResonanceBns = (baseStat?.ResonanceBns ?? 0);
    values.CritRate = (baseStat?.CritRate ?? 0);
    values.CritDmg = (baseStat?.CritDmg ?? 0);

    //$ 데이터 변수화
    const ret: CharacterFinalStat = {
      hp: values.hp,
      atk: values.atk,
      def: values.def,
      resBns: values.ResonanceBns,
      critRate: values.CritRate,
      critDmg: values.CritDmg,
      attackBns: {
        basic: values.basicBns,
        heavy: values.heavyBns,
        skill: values.skillBns,
        liberation: values.liberationBns,
        heal: values.healBns,
      },
      elementBns: {
        aero: values.AeroBns,
        fusion: values.FusionBns,
        glacio: values.GlacioBns,
        electro: values.ElectroBns,
        havoc: values.HavocBns,
        spectro: values.SpectroBns,
      }
    }

    //$ return
    return ret;
  },

  //#endregion

}));
