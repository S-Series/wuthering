import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import pLimit from "p-limit";
import "dotenv/config";

const YOUTUBE_PLAYLISTS = {
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

async function main() {
  const app = Fastify({ logger: true });

  const OCR_CONCURRENCY = Number(process.env.OCR_CONCURRENCY ?? 2);
  const limitOcr = pLimit(OCR_CONCURRENCY);

  const PORT = Number(process.env.PORT ?? 8080);
  const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? "*")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const allowedLangs = ["kr", "en", "jp", "zh"] as const;
  type Lang = (typeof allowedLangs)[number];
  function normalizeLang(raw: string | undefined): Lang {
    return (allowedLangs as readonly string[]).includes(raw ?? "")
      ? (raw as Lang)
      : "kr";
  }

  const allowedTypes = [
    "officialTrailer",
    "characterTrailer",
    "characterIntro",
  ] as const;
  type YtType = (typeof allowedTypes)[number];
  function normalizeType(raw: unknown): YtType {
    const v = typeof raw === "string" ? raw : "";
    return (allowedTypes as readonly string[]).includes(v)
      ? (v as YtType)
      : "officialTrailer";
  }

  const OCR_UPSTREAM = {
    kr: (process.env.OCR_UPSTREAM_KR ?? "").trim(),
    en: (process.env.OCR_UPSTREAM_EN ?? "").trim(),
    jp: (process.env.OCR_UPSTREAM_JP ?? "").trim(),
    zh: (process.env.OCR_UPSTREAM_ZH ?? "").trim(),
  } as const;

  if (!OCR_UPSTREAM.kr) {
    throw new Error("OCR_UPSTREAM_KR is missing in .env");
  }

  const MAX_BYTES = 15 * 1024 * 1024; // 15mb
  const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

  function hasAllowedExt(name?: string | null) {
    const n = (name ?? "").toLowerCase();
    return (
      n.endsWith(".png") ||
      n.endsWith(".jpg") ||
      n.endsWith(".jpeg") ||
      n.endsWith(".webp")
    );
  }

  await app.register(multipart, {
    limits: {
      files: 1,
      fileSize: 50 * 1024 * 1024,
    },
  });

  await app.register(rateLimit, {
    global: true,

    max: 30, // 1분에 30회
    timeWindow: "1 minute",

    keyGenerator: (req) => {
      const xfwd = req.headers["x-forwarded-for"];
      if (typeof xfwd === "string" && xfwd.length > 0)
        return xfwd.split(",")[0].trim();
      return req.ip;
    },
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (CORS_ORIGINS.includes("*")) return cb(null, true);
      cb(null, CORS_ORIGINS.includes(origin));
    },
    credentials: true,
  });

  app.get("/health", async () => ({ ok: true, upstream: OCR_UPSTREAM }));

  app.post("/api/ocr", async (req, reply) => {
    //#region Part
    const part = await req.file();
    if (!part) return reply.code(400).send({ error: "file missing" });
    if (!part.mimetype || !ALLOWED_MIME.has(part.mimetype)) {
      return reply
        .code(415)
        .send({ error: "unsupported file type", mimetype: part.mimetype });
    }
    if (!hasAllowedExt(part.filename)) {
      return reply
        .code(415)
        .send({ error: "unsupported file extension", filename: part.filename });
    }
    //#endregion

    //#region Buffer
    const buf = await part.toBuffer();
    if (buf.length === 0) {
      return reply.code(400).send({ error: "empty file" });
    }
    if (buf.length > MAX_BYTES) {
      return reply
        .code(413)
        .send({ error: "file too large", size: buf.length });
    }
    //#endregion

    //#region Lang
    const langRaw =
      (part.fields?.lang && "value" in part.fields.lang
        ? String(part.fields.lang.value)
        : undefined) ?? "unknown";
    const langValue = normalizeLang(langRaw);

    console.log("OCR lang:", langValue);
    console.log("OCR file:", part.filename, part.mimetype, buf.length);

    const form = new FormData();
    form.set(
      "file",
      new File([new Uint8Array(buf)], part.filename ?? "upload.png", {
        type: part.mimetype ?? "application/octet-stream",
      })
    );
    form.set("lang", langValue);
    //#endregion

    //#region UpStream
    const upstreamUrl = new URL(
      "/ocr",
      OCR_UPSTREAM[langValue] ?? OCR_UPSTREAM["kr"]
    ).toString();

    const controller = new AbortController();
    const timeoutMs = 60_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let upstreamRes: Response;
    try {
      upstreamRes = await limitOcr(() =>
        fetch(upstreamUrl, {
          method: "POST",
          body: form,
          signal: controller.signal,
        })
      );
    } catch (e: any) {
      const msg =
        e?.name === "AbortError" ? "upstream timeout" : "upstream fetch failed";
      return reply
        .code(504)
        .send({ error: msg, detail: String(e?.message ?? e) });
    } finally {
      clearTimeout(timeoutId);
    }

    const text = await upstreamRes.text();
    const contentType = upstreamRes.headers.get("content-type") ?? "";
    //#endregion

    if (!upstreamRes.ok) {
      return reply.code(502).send({
        error: "upstream error",
        upstreamStatus: upstreamRes.status,
        upstreamBody: text.slice(0, 2000),
      });
    }

    if (contentType.includes("application/json")) {
      try {
        return reply
          .header("content-type", "application/json; charset=utf-8")
          .send(JSON.parse(text));
      } catch {
        // JSON 파싱 실패하면 raw 반환
      }
    }

    return reply.send(text);
  });

  app.get("/api/youtube/latest", async (req, reply) => {
    const q = req.query as { lang?: string; type?: string };

    const lang = normalizeLang(q.lang);
    const type = normalizeType(q.type);

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return reply.code(500).send({ error: "YOUTUBE_API_KEY missing" });
    }

    const playlistId = YOUTUBE_PLAYLISTS[lang][type];
    if (!playlistId) {
      return reply.code(500).send({ error: "playlistId missing", lang, type });
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "1");
    url.searchParams.set("key", apiKey);

    let ytRes: Response;
    let text = "";
    try {
      ytRes = await fetch(url.toString());
      text = await ytRes.text();
    } catch (e: any) {
      return reply.code(502).send({ error: "youtube fetch failed" });
    }

    if (!ytRes.ok) {
      return reply.code(502).send({
        error: "youtube api error",
        status: ytRes.status,
        body: text.slice(0, 400), // 너무 길면 로그만 지저분
        lang,
        type,
      });
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e: any) {
      return reply.code(502).send({ error: "youtube invalid json" });
    }

    const item = data?.items?.[0]?.snippet;
    if (!item) {
      return reply.send(null);
    }

    return reply.send({
      videoId: item.resourceId?.videoId ?? "",
      title: item.title ?? "",
      thumbnail:
        item.thumbnails?.high?.url ??
        item.thumbnails?.medium?.url ??
        item.thumbnails?.default?.url ??
        "",
      publishedAt: item.publishedAt ?? "",
    });
  });

  await app.listen({ port: PORT, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
