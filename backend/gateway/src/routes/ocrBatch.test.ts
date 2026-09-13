import assert from "node:assert/strict";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import pLimit from "p-limit";

process.env.OCR_URL = "http://ocr.invalid";
const { registerOcrBatchRoute } = await import("./ocrBatch.js");
const app = Fastify();
await app.register(multipart, { limits: { files: 1 } });
registerOcrBatchRoute(app, pLimit(1));
const ids = ["name", "cost", "main_1", "main_2", "sub_1", "sub_2", "sub_3", "sub_4", "sub_5"];
const originalFetch = globalThis.fetch;
let forwarded = 0;
globalThis.fetch = async (url, options) => {
  assert.equal(String(url), "http://ocr.invalid/ocr/batch");
  const form = options!.body as FormData;
  assert.equal(form.get("lang"), "en");
  assert.deepEqual(form.getAll("files").map(file => (file as File).name), ids.map(id => `${id}.png`));
  forwarded++;
  return Response.json({ success: true, regions: ids.map(id => ({ id, success: true, texts: [] })) });
};
async function send(names: string[]) {
  const form = new FormData();
  for (const id of names) form.append("files", new Blob(["image"], { type: "image/png" }), `${id}.png`);
  form.set("lang", "en");
  const request = new Request("http://test", { method: "POST", body: form });
  return app.inject({ method: "POST", url: "/api/ocr/batch", headers: { "content-type": request.headers.get("content-type")! }, payload: Buffer.from(await request.arrayBuffer()) });
}
try {
  const ok = await send([...ids].reverse());
  assert.equal(ok.statusCode, 200, ok.body);
  assert.equal(ok.json().regions.length, 9);
  assert.equal((await send(ids.slice(1))).statusCode, 400);
  assert.equal((await send([...ids.slice(1), "cost"])).statusCode, 400);
  assert.equal((await send([...ids, "extra"])).statusCode, 413);
  assert.equal(forwarded, 1);
  console.log("PASS: nine-file multipart forwarding, canonical order, missing/duplicate/extra rejection");
} finally {
  globalThis.fetch = originalFetch;
  await app.close();
}
