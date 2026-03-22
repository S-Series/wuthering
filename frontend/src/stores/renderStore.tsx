import { create } from "zustand";

type RenderStore = {
  renderedBlob: Blob | null;
  renderedImageUrl: string | null;
  isRendering: boolean;
  error: string | null;

  setRendering: (value: boolean) => void;
  setError: (value: string | null) => void;
  setRenderedImage: (blob: Blob | null) => void;
  clearRenderedImage: () => void;
};

export const useRenderStore = create<RenderStore>((set, get) => ({
  renderedBlob: null,
  renderedImageUrl: null,
  isRendering: false,
  error: null,

  setRendering: (value) => set({ isRendering: value }),
  setError: (value) => set({ error: value }),

  setRenderedImage: (blob) => {
    const prevUrl = get().renderedImageUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    if (!blob) {
      set({
        renderedBlob: null,
        renderedImageUrl: null,
      });
      return;
    }

    const nextUrl = URL.createObjectURL(blob);

    set({
      renderedBlob: blob,
      renderedImageUrl: nextUrl,
    });
  },

  clearRenderedImage: () => {
    const prevUrl = get().renderedImageUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    set({
      renderedBlob: null,
      renderedImageUrl: null,
      error: null,
    });
  },
}));