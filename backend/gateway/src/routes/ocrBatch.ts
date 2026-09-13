import type { FastifyInstance } from "fastify";
import type { LimitFunction } from "p-limit";
import { ALLOWED_MIME, MAX_BYTES, OCR_UPSTREAM, normalizeLang } from "../config/env.js";

const IDS = ["name", "cost", "main_1", "main_2", "sub_1", "sub_2", "sub_3", "sub_4", "sub_5"];

export function registerOcrBatchRoute(app: FastifyInstance, limitOcr: LimitFunction) {
  app.post("/api/ocr/batch", async (req, reply) => {
    const files = new Map<string, { buffer: Buffer; type: string }>();
    let lang = "kr", total = 0;
    for await (const part of req.parts({ limits: { files: 9, fields: 1, parts: 10, fileSize: MAX_BYTES } })) {
      if (part.type === "field") {
        if (part.fieldname !== "lang") return reply.code(400).send({ error: "Unexpected field" });
        lang = String(part.value);
        continue;
      }
      const id = part.filename.replace(/\.png$/, "");
      if (part.fieldname !== "files" || !IDS.includes(id) || files.has(id) || !ALLOWED_MIME.has(part.mimetype)) {
        return reply.code(400).send({ error: "Invalid or duplicate OCR region" });
      }
      const buffer = await part.toBuffer();
      total += buffer.length;
      if (!buffer.length || total > MAX_BYTES) return reply.code(413).send({ error: "Invalid batch size" });
      files.set(id, { buffer, type: part.mimetype });
    }
    if (files.size !== 9) return reply.code(400).send({ error: "Expected nine OCR regions" });
    const safeLang = normalizeLang(lang);
    const form = new FormData();
    form.set("lang", safeLang);
    for (const id of IDS) {
      const file = files.get(id)!;
      form.append("files", new File([new Uint8Array(file.buffer)], `${id}.png`, { type: file.type }));
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180_000);
    try {
      return await limitOcr(async () => {
        const response = await fetch(new URL("/ocr/batch", OCR_UPSTREAM[safeLang] ?? OCR_UPSTREAM.kr), {
          method: "POST", body: form, signal: controller.signal,
        });
        const body = await response.text();
        return reply.code(response.status).type("application/json").send(body);
      });
    } catch (error) {
      req.log.error({ err: error }, "Batch OCR upstream failed");
      return reply.code(controller.signal.aborted ? 504 : 502).send({ error: "OCR upstream unavailable" });
    } finally {
      clearTimeout(timer);
    }
  });
}
