import {
  MemoryCache,
  createMixedBufferCacheKey,
  createStableCacheKey,
} from "./memoryCache.js";

import {
  RENDER_CARD_CACHE_MAX_ENTRIES,
  RENDER_CARD_CACHE_TTL_MS,
  YOUTUBE_LATEST_CACHE_MAX_ENTRIES,
  YOUTUBE_LATEST_CACHE_TTL_MS,
} from "../config/env.js";

export type OcrCacheValue = {
  contentType: string;
  body: string;
};

export type RenderCardCacheValue = {
  contentType: string;
  buffer: Buffer;
};

export type YoutubeLatestCacheValue = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
} | null;

export const cacheStore = {
  ocr: new MemoryCache<OcrCacheValue>(30_000, 100),

  renderCard: new MemoryCache<RenderCardCacheValue>(
    RENDER_CARD_CACHE_TTL_MS,
    RENDER_CARD_CACHE_MAX_ENTRIES
  ),

  youtubeLatest: new MemoryCache<YoutubeLatestCacheValue>(
    YOUTUBE_LATEST_CACHE_TTL_MS,
    YOUTUBE_LATEST_CACHE_MAX_ENTRIES
  ),
};

export function createOcrCacheKey(input: {
  lang: string;
  mimetype: string;
  buffer: Buffer;
}) {
  return createMixedBufferCacheKey(
    "ocr",
    `${input.lang}:${input.mimetype}`,
    input.buffer
  );
}

export function createRenderCardCacheKey(input: {
  uid: string;
  body: unknown;
}) {
  return createStableCacheKey("render-card", {
    uid: input.uid,
    body: input.body,
  });
}

export function createYoutubeLatestCacheKey(input: {
  lang: string;
  type: string;
}) {
  return createStableCacheKey("youtube-latest", input);
}