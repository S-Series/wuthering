export type ImageKey = "characterImage" | "namecardImage";

export type ImageTransformState = {
  src: string | null;
  x: number;
  y: number;
  scale: number;
};

export const createInitialImageState = (): ImageTransformState => ({
  src: null,
  x: 0,
  y: 0,
  scale: 1,
});