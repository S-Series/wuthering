import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import pLimit from "p-limit";

import {
  ALLOWED_MIME,
  CORS_ORIGINS,
  MAX_BYTES,
  OCR_CONCURRENCY,
  OCR_UPSTREAM,
  PORT,
  RENDER_UPSTREAM,
  YOUTUBE_PLAYLISTS,
  hasAllowedExt,
  normalizeLang,
  normalizeType,
  validateEnv,
} from "./config/env.js";
import { getClientKey } from "./utils/clientKey.js";
import { registerRenderRoutes } from "./routes/render.js";

async function main() {
  validateEnv();

  const app = Fastify({ logger: true });
  const limitOcr = pLimit(OCR_CONCURRENCY);

  await app.register(multipart, {
    limits: {
      files: 1,
      fileSize: 50 * 1024 * 1024,
    },
  });

  await app.register(rateLimit, {
    global: true,
    max: 30,
    timeWindow: "1 minute",
    keyGenerator: (req) => getClientKey(req),
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (CORS_ORIGINS.includes("*")) return cb(null, true);
      cb(null, CORS_ORIGINS.includes(origin));
    },
    credentials: true,
  });

  app.get("/health", async () => ({ ok: true, upstream: "ocr server is ready" }));

  app.get("/health/ocr", async (_req, reply) => {
    const results = await Promise.all(
      Object.entries(OCR_UPSTREAM).map(async ([lang, baseUrl]) => {
        if (!baseUrl) {
          return {
            lang,
            ok: false,
            upstream: baseUrl,
            error: "upstream url is missing",
          };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const upstreamUrl = new URL("/health", baseUrl).toString();

          const res = await fetch(upstreamUrl, {
            method: "GET",
            signal: controller.signal,
          });

          return {
            lang,
            ok: res.ok,
            status: res.status,
            upstream: upstreamUrl,
          };
        } catch (e) {
          return {
            lang,
            ok: false,
            upstream: baseUrl,
            error: "upstream fetch failed",
            detail: e instanceof Error ? e.message : String(e),
          };
        } finally {
          clearTimeout(timeoutId);
        }
      })
    );

    const allOk = results.every((item) => item.ok);

    return reply.code(allOk ? 200 : 502).send({
      ok: allOk,
      results,
    });
  });

  app.get("/health/render", async (_req, reply) => {
    try {
      const res = await fetch(
        new URL("/render/test", RENDER_UPSTREAM).toString(),
        { method: "GET" }
      );

      return {
        ok: res.ok,
        status: res.status,
        upstream: RENDER_UPSTREAM,
      };
    } catch (e) {
      return reply.code(502).send({
        ok: false,
        upstream: RENDER_UPSTREAM,
        error: "upstream fetch failed",
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  });

  app.post("/api/ocr", async (req, reply) => {
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

    const buf = await part.toBuffer();
    if (buf.length === 0) {
      return reply.code(400).send({ error: "empty file" });
    }

    if (buf.length > MAX_BYTES) {
      return reply.code(413).send({ error: "file too large", size: buf.length });
    }

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

    const upstreamUrl = new URL(
      "/ocr",
      OCR_UPSTREAM[langValue] ?? OCR_UPSTREAM.kr
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
        // JSON 파싱 실패 시 raw 반환
      }
    }

    return reply.send(text);
  });

  await registerRenderRoutes(app);

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
    } catch {
      return reply.code(502).send({ error: "youtube fetch failed" });
    }

    if (!ytRes.ok) {
      return reply.code(502).send({
        error: "youtube api error",
        status: ytRes.status,
        body: text.slice(0, 400),
        lang,
        type,
      });
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
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