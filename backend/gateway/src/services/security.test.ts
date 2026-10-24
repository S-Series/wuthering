import assert from "node:assert/strict";
import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { getClientKey } from "../utils/clientKey.js";
import { internalHeaders } from "../lib/internalAuth.js";

delete process.env.CLIENT_IP_SOURCE;
delete process.env.OCR_INTERNAL_SECRET;
assert.throws(() => internalHeaders("ocr"));
process.env.OCR_INTERNAL_SECRET = "short";
assert.throws(() => internalHeaders("ocr"));
process.env.OCR_INTERNAL_SECRET = "ocr-test-012345678901234567890123456";
process.env.RENDER_INTERNAL_SECRET = "render-test-01234567890123456789012";
assert.notDeepEqual(internalHeaders("ocr"), internalHeaders("render"));

const app = Fastify();
await app.register(rateLimit, { max: 2, timeWindow: "1 minute", keyGenerator: getClientKey });
app.get("/", req => ({ key: getClientKey(req) }));
try {
  const send = (ip: string, headers: Record<string, string>) => app.inject({ url: "/", remoteAddress: ip, headers });
  assert.equal((await send("192.0.2.1", { "x-forwarded-for": "1.1.1.1", "x-real-ip": "8.8.8.8" })).json().key, "192.0.2.1");
  assert.equal((await send("192.0.2.1", { "x-forwarded-for": "2.2.2.2" })).statusCode, 200);
  assert.equal((await send("192.0.2.1", { "x-forwarded-for": "3.3.3.3" })).statusCode, 429);
  process.env.CLIENT_IP_SOURCE = "railway";
  assert.equal((await send("192.0.2.2", { "x-real-ip": "2001:db8::1", "x-forwarded-for": "9.9.9.9" })).json().key, "2001:db8::1");
  assert.equal((await send("192.0.2.3", { "x-real-ip": "1.1.1.1, 2.2.2.2" })).json().key, "192.0.2.3");
  assert.equal((await send("192.0.2.4", {})).json().key, "192.0.2.4");
} finally { await app.close(); }

process.env.RENDER_UPSTREAM = "https://render.invalid";
const { requestRenderUpstream } = await import("./renderUpstream.js");
const original = globalThis.fetch;
globalThis.fetch = async (_url, options) => {
  assert.equal(new Headers(options?.headers).get("x-internal-secret"), process.env.RENDER_INTERNAL_SECRET);
  assert.equal(options?.redirect, "error");
  return new Response("image", { headers: { "content-type": "image/png" } });
};
try { assert.equal((await requestRenderUpstream({})).ok, true); }
finally { globalThis.fetch = original; }
console.log("PASS: fail-closed secrets, render forwarding, XFF rotation cannot evade rate limits, explicit Railway IP mode");
