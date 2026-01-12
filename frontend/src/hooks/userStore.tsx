import { create } from "zustand";

import { 
  type ImageKey,
  type ImageTransformState,
  createInitialImageState
 } from "@/runtime/image.runtime";

import {
  type CharacterId,
  type WeaponId,
  type SelectedCharacterRuntime,
  createInitialSelectedCharacterRuntime
} from "@/runtime/character.runtime";

import { type EchoRuntime } from "@/runtime/echo.runtime";

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

  setWeapon: (weaponId: WeaponId | null) => void;

  setConstell: (character: number, weapon: number) => void;

  setEcho: (index: 0 | 1 | 2 | 3 | 4, echo: EchoRuntime | null) => void;

  resetSelectedCharacter: () => void;

  //#endregion
};

export const useUserStore = create<UserStore>((set) => ({
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

  setSelectedCharacter: (characterId) =>
    set((state) => ({
      ...state,
      selectedCharacter: {
        ...state.selectedCharacter,
        characterId,
      },
    })),

  setWeapon: (weaponId) =>
    set((state) => ({
      ...state,
      selectedCharacter: {
        ...state.selectedCharacter,
        weaponId,
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

  //#endregion

}));
