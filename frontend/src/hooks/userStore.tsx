import { create } from "zustand";

export type ImageTransformState = {
  src: string | null;
  x: number;
  y: number;
  scale: number;
};

type ImageKey = "characterImage" | "namecardImage";

const createInitialImageState = (): ImageTransformState => ({
  src: null,
  x: 0,
  y: 0,
  scale: 1,
});

type UserStore = {
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
};

export const useUserStore = create<UserStore>((set) => ({
  characterImage: createInitialImageState(),
  namecardImage: createInitialImageState(),

  setImageSrc: (key, src) =>
    set((state) => ({
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
      [key]: {
        ...state[key],
        ...partial,
      },
    })),

  replaceImageState: (key, next) =>
    set(() => ({
      [key]: { ...next },
    })),

  resetImage: (key) =>
    set(() => ({
      [key]: createInitialImageState(),
    })),

  resetAllImages: () =>
    set(() => ({
      characterImage: createInitialImageState(),
      namecardImage: createInitialImageState(),
    })),
}));
