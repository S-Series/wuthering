import { create } from "zustand";

import {
  saveRenderedBlob,
  loadRenderedBlob,
  clearRenderedBlob as clearRenderedBlobFromDb,
} from "@/lib/renderedImage.db";

type RenderStore = {
  renderedBlob: Blob | null;
  renderedImageUrl: string | null;
  isRendering: boolean;
  error: string | null;

  setRendering: (value: boolean) => void;
  setError: (value: string | null) => void;
  setRenderedImage: (blob: Blob | null) => void;
  clearRenderedImage: () => void;
  hydrateRenderedImage: () => Promise<void>;
};

export const useRenderStore = create<RenderStore>((set, get) => ({
  renderedBlob: null,
  renderedImageUrl: null,
  isRendering: false,
  error: null,

  setRendering: (value) => set({ isRendering: value }),
  setError: (value) => set({ error: value }),

  setRenderedImage: async (blob) => {
    const prevUrl = get().renderedImageUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    if (!blob) {
      set({
        renderedBlob: null,
        renderedImageUrl: null,
      });
      await clearRenderedBlobFromDb();
      return;
    }

    const nextUrl = URL.createObjectURL(blob);

    set({
      renderedBlob: blob,
      renderedImageUrl: nextUrl,
    });

    await saveRenderedBlob(blob);
  },

  clearRenderedImage: async () => {
    const prevUrl = get().renderedImageUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    set({
      renderedBlob: null,
      renderedImageUrl: null,
      error: null,
    });

    await clearRenderedBlobFromDb();
  },

  hydrateRenderedImage: async () => {
    const blob = await loadRenderedBlob();
    if (!blob) return;

    const prevUrl = get().renderedImageUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const nextUrl = URL.createObjectURL(blob);

    set({
      renderedBlob: blob,
      renderedImageUrl: nextUrl,
    });
  },
}));