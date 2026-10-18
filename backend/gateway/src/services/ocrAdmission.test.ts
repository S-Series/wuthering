import assert from "node:assert/strict";
import Fastify from "fastify";
import pLimit from "p-limit";
import { OcrAdmission } from "./ocrAdmission.js";

const app = Fastify();
const admission = new OcrAdmission(2);
const worker = pLimit(1);
let starts = 0;
let release!: () => void;
let gate = new Promise<void>(resolve => { release = resolve; });
const handler = admission.wrap(async (_req, reply, signal) => {
  return worker(async () => {
    signal.throwIfAborted();
    starts++;
    await gate;
    return reply.send({ ok: true });
  });
});
app.post("/single", handler);
app.post("/batch", handler);
try {
  const first = app.inject({ method: "POST", url: "/single" });
  const queued = app.inject({ method: "POST", url: "/batch" });
  await new Promise(resolve => setImmediate(resolve));
  const overflow = await app.inject({ method: "POST", url: "/single" });
  assert.equal(overflow.statusCode, 503);
  assert.equal(overflow.headers["retry-after"], "5");
  assert.equal(starts, 1, "queued work shares the same worker limit");
  release();
  assert.equal((await first).statusCode, 200);
  assert.equal((await queued).statusCode, 200);
  assert.equal(starts, 2);
  gate = Promise.resolve();
  assert.equal((await app.inject({ method: "POST", url: "/single" })).statusCode, 200);

  const timeout = new OcrAdmission(1, 5);
  const timed = Fastify();
  timed.post("/timeout", timeout.wrap(async (_req, reply, signal) => {
    await new Promise<void>(resolve => {
      signal.addEventListener("abort", () => resolve(), { once: true });
      // Keep the test process alive while the production timer is unref'ed.
      const keepAlive = setTimeout(resolve, 1000);
      signal.addEventListener("abort", () => clearTimeout(keepAlive), { once: true });
    });
    return reply.code(signal.aborted ? 504 : 200).send();
  }));
  assert.equal((await timed.inject({ method: "POST", url: "/timeout" })).statusCode, 504);
  assert.equal((await timed.inject({ method: "POST", url: "/timeout" })).statusCode, 504, "timeout releases capacity");
  await timed.close();
  console.log("PASS: shared OCR admission, worker limit, overload response, timeout and slot release");
} finally {
  release();
  await app.close();
}
