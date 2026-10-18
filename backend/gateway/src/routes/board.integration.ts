import "dotenv/config";
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import Fastify from "fastify";
import { createClient } from "redis";

if (process.env.BOARD_REDIS_INTEGRATION !== "1" || !process.env.REDIS_URL) {
  throw new Error("Set BOARD_REDIS_INTEGRATION=1 and REDIS_URL for the read-only live board test");
}
const namespace = "board-http-test:" + randomUUID();
process.env.BOARD_CACHE_NAMESPACE = namespace;
const prefix = `wuwa:{board-${createHash("sha256").update(namespace).digest("hex").slice(0, 16)}}:v1`;
const { registerBoardRoutes } = await import("./board.js");
const apps = [Fastify(), Fastify()];
const ca = process.env.REDIS_CA_CERT?.replace(/\\n/g, "\n");
const cleanup = createClient({ url: process.env.REDIS_URL, socket: {
  connectTimeout: 5000, reconnectStrategy: false,
  ...(process.env.REDIS_URL.startsWith("rediss:") ? { tls: true as const, ...(ca ? { ca } : {}) } : {}),
} });
cleanup.on("error", () => {});
try {
  for (const app of apps) await registerBoardRoutes(app);
  async function check(path: string) {
    let response = await apps[0].inject(path);
    assert.equal(response.statusCode, 200);
    for (let attempt = 0; attempt < 10; attempt++) {
      response = await apps[1].inject(path);
      assert.equal(response.statusCode, 200);
      if (response.headers["x-cache"] === "HIT" && response.headers["x-cache-store"] === "redis") return response;
      await delay(100);
    }
    throw new Error("No shared Redis hit from the second gateway");
  }
  const list = await check("/api/board/posts");
  const postId: unknown = list.json().items[0]?.id;
  if (typeof postId === "string") {
    await check("/api/board/posts/" + postId);
    await check("/api/board/posts/" + postId + "/comments");
    console.log("Live board HTTP passed: list, detail and comments shared across two gateways; no DB writes");
  } else {
    console.log("Live board HTTP passed: empty list shared across two gateways; detail/comments skipped");
  }
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : "Live board HTTP verification failed");
  process.exitCode = 1;
} finally {
  await Promise.all(apps.map(app => app.close()));
  await cleanup.connect();
  const keys: string[] = [];
  for await (const page of cleanup.scanIterator({ MATCH: prefix + ":*", COUNT: 100 })) keys.push(...page);
  if (keys.length) await cleanup.withCommandOptions({ timeout: 5000 }).unlink(keys);
  cleanup.destroy();
}
