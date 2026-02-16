import { create } from "zustand";
import {
  type ImageKey,
  type ImageTransformState,
  createInitialImageState
} from "@/runtime/image.runtime";

type UiStore = {
  characterImage: ImageTransformState;
  namecardImage: ImageTransformState;

  setImageSrc: (key: ImageKey, src: string | null) => void;
  setImageTransform: (key: ImageKey, partial: Partial<ImageTransformState>) => void;
  replaceImageState: (key: ImageKey, next: ImageTransformState) => void;

  resetImage: (key: ImageKey) => void;
  resetAllImages: () => void;
};

export const useImgStore = create<UiStore>((set) => ({
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
    set(() => ({
      characterImage: createInitialImageState(),
      namecardImage: createInitialImageState(),
    })),
}));
