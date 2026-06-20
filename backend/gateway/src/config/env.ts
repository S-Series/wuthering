import "dotenv/config";

export const YOUTUBE_PLAYLISTS = {
  kr: {
    officialTrailer: "PLAGF9ih-Y53e0M90IIYhfRKMKSRng6ozg",
    characterTrailer: "PLAGF9ih-Y53cN-fYA-utvml3AvPtTdJFi",
    characterIntro: "PLAGF9ih-Y53f2Pa4hy833eLYC_IwWrBxU",
  },
  en: {
    officialTrailer: "PLkJ-t-Cn6PgqeqMkD3Xo3V5boAhJE0sX6",
    characterTrailer: "PLkJ-t-Cn6PgrUDbYKmw0zLIPPqKgV2Bs4",
    characterIntro: "PLkJ-t-Cn6PgqQgpevPiarIlXlV7uZ19TM",
  },
  jp: {
    officialTrailer: "PLeKyAnyrBcFi84TS1ZwDAZRUqh1Y6Q3xn",
    characterTrailer: "PLeKyAnyrBcFgW4ng9syP1TB4SWqW_kiiG",
    characterIntro: "PLeKyAnyrBcFjOrx9GlvNyk_f7phwjhLya",
  },
  zh: {
    officialTrailer: "PLeKyAnyrBcFi84TS1ZwDAZRUqh1Y6Q3xn",
    characterTrailer: "PLeKyAnyrBcFgW4ng9syP1TB4SWqW_kiiG",
    characterIntro: "PLeKyAnyrBcFjOrx9GlvNyk_f7phwjhLya",
  },
} as const;

export const allowedLangs = ["kr", "en", "jp", "zh"] as const;
export type Lang = (typeof allowedLangs)[number];

export function normalizeLang(raw: string | undefined): Lang {
  return (allowedLangs as readonly string[]).includes(raw ?? "")
    ? (raw as Lang)
    : "kr";
}

export const allowedTypes = [
  "officialTrailer",
  "characterTrailer",
  "characterIntro",
] as const;
export type YtType = (typeof allowedTypes)[number];

export function normalizeType(raw: unknown): YtType {
  const v = typeof raw === "string" ? raw : "";
  return (allowedTypes as readonly string[]).includes(v)
    ? (v as YtType)
    : "officialTrailer";
}

export const OCR_UPSTREAM_URL = (process.env.OCR_UPSTREAM_URL ?? "").trim();

export const OCR_UPSTREAM = {
  kr: (OCR_UPSTREAM_URL || process.env.OCR_UPSTREAM_KR || "").trim(),
  en: (OCR_UPSTREAM_URL || process.env.OCR_UPSTREAM_EN || "").trim(),
  jp: (OCR_UPSTREAM_URL || process.env.OCR_UPSTREAM_JP || "").trim(),
  zh: (OCR_UPSTREAM_URL || process.env.OCR_UPSTREAM_ZH || "").trim(),
} as const;

export const RENDER_UPSTREAM = (process.env.RENDER_UPSTREAM ?? "").trim();

export const PORT = Number(process.env.PORT ?? 8080);
export const OCR_CONCURRENCY = Number(process.env.OCR_CONCURRENCY ?? 2);
export const RENDER_CARD_CACHE_TTL_MS = Number(
  process.env.RENDER_CARD_CACHE_TTL_MS ?? 30 * 60 * 1000
);
export const RENDER_CARD_CACHE_MAX_ENTRIES = Number(
  process.env.RENDER_CARD_CACHE_MAX_ENTRIES ?? 200
);
export const YOUTUBE_LATEST_CACHE_TTL_MS = Number(
  process.env.YOUTUBE_LATEST_CACHE_TTL_MS ?? 10 * 60 * 1000
);
export const YOUTUBE_LATEST_CACHE_MAX_ENTRIES = Number(
  process.env.YOUTUBE_LATEST_CACHE_MAX_ENTRIES ?? 50
);

export const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? "*")
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

export const MAX_BYTES = 15 * 1024 * 1024;
export const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

export function validateEnv() {
  if (!OCR_UPSTREAM_URL && !OCR_UPSTREAM.kr) {
    throw new Error("OCR_UPSTREAM_URL or OCR_UPSTREAM_KR is missing in .env");
  }

  if (!RENDER_UPSTREAM) {
    throw new Error("RENDER_UPSTREAM is missing in .env");
  }
}

export function hasAllowedExt(name?: string | null) {
  const n = (name ?? "").toLowerCase();
  return (
    n.endsWith(".png") ||
    n.endsWith(".jpg") ||
    n.endsWith(".jpeg") ||
    n.endsWith(".webp")
  );
}
