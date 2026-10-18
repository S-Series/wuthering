import assert from "node:assert/strict";
import Fastify from "fastify";
import admin from "firebase-admin";

// All DB/auth traffic is stubbed; these tests never use local credentials.
delete process.env.REDIS_URL;
process.env.SUPABASE_URL = "https://board-test.invalid";
process.env.SUPABASE_SECRET_KEY = "test-key";
admin.initializeApp({ projectId: "board-test" });
const { adminAuth } = await import("../lib/firebaseAdmin.js");
Object.defineProperty(adminAuth, "verifyIdToken", { value: async () => ({ uid: "firebase-test" }) });
const { registerBoardRoutes } = await import("./board.js");
const { createBoardCache } = await import("../services/boardCache.js");

const id = "11111111-1111-4111-8111-111111111111";
const authorId = "22222222-2222-4222-8222-222222222222";
const commentId = "33333333-3333-4333-8333-333333333333";
const author = { memberships: { nickname: " Writer " } };
const post = {
  id, author_id: authorId, category: "report", title: "Original", content: "Body",
  view_count: 3, comment_count: 1, is_pinned: false, is_resolved: false,
  created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", author,
};
const comment = { id: commentId, post_id: id, author_id: authorId, content: "Comment",
  created_at: post.created_at, updated_at: post.updated_at, author };
let hidden = false;
let failNext = false;
let gate: Promise<void> | undefined;
const requests: { method: string; url: URL }[] = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  const url = new URL(String(input));
  assert.equal(url.hostname, "board-test.invalid");
  const method = options?.method ?? "GET";
  requests.push({ method, url });
  if (failNext && method === "GET") {
    failNext = false;
    return Response.json({ message: "DB failed" }, { status: 500 });
  }
  const table = url.pathname.split("/").at(-1);
  let data: unknown;
  if (table === "increment_board_post_view") {
    data = ++post.view_count;
  } else if (table === "users") {
    data = [{ id: authorId, firebase_uid: "firebase-test", role: "admin", status: "active" }];
  } else if (table === "memberships") {
    data = [{ user_id: authorId, nickname: "Writer" }];
  } else if (table === "board_posts") {
    if (method === "POST") data = { id };
    else if (method === "PATCH") {
      const body = JSON.parse(String(options?.body));
      if (body.status === "hidden") hidden = true;
      Object.assign(post, body);
      data = [{ id, is_resolved: post.is_resolved }];
    } else {
      data = hidden ? [] : [{ ...post }];
    }
  } else if (table === "board_comments") {
    if (method === "POST") { post.comment_count++; data = { id: commentId }; }
    else if (method === "PATCH") data = [{ id: commentId, author_id: authorId }];
    else data = [{ ...comment }];
  } else throw new Error("Unexpected request " + url.pathname);
  const snapshot = JSON.stringify(data);
  if (method === "GET" && gate) await gate;
  return new Response(snapshot, { status: 200, headers: {
    "content-type": "application/json", "content-range": "0-0/1",
  } });
};

const app = Fastify();
app.post("/api/users/sync", async () => ({ ok: true }));
const cache = createBoardCache(app.log);
const invalidations: string[][] = [];
await registerBoardRoutes(app, { ...cache, async invalidate(scopes) {
  invalidations.push(scopes);
  await cache.invalidate(scopes);
} });
const listUrl = "/api/board/posts";
const detailUrl = listUrl + "/" + id;
const headers = { authorization: "Bearer test" };
const readCount = () => requests.filter(r => r.method === "GET" && r.url.pathname.endsWith("board_posts")).length;
try {
  const list = await app.inject(listUrl);
  assert.equal(list.statusCode, 200, list.body);
  assert.equal(list.json().items[0].authorName, "Writer");
  assert.equal(list.json().items[0].content, undefined);
  assert.equal(list.headers["x-cache"], "MISS");
  assert.equal(list.headers["x-cache-store"], "memory");
  assert.equal(list.headers["cache-control"], "no-store");
  assert.match(String(list.headers["server-timing"]), /board_read;dur=/);
  assert.equal(requests.length, 1, "list and nickname require a single DB call");
  assert.equal((await app.inject(listUrl)).headers["x-cache"], "HIT");
  assert.equal(requests.length, 1);
  await app.inject({ method: "POST", url: "/api/users/sync" });
  assert.equal((await app.inject(listUrl)).headers["x-cache"], "HIT", "login traffic must not evict the shared public board cache");
  assert.equal((await app.inject({ method: "DELETE", url: detailUrl })).statusCode, 401);
  assert.equal((await app.inject(listUrl)).headers["x-cache"], "HIT", "failed writes preserve the cache");
  assert.deepEqual(invalidations, [], "non-board and unsuccessful writes never invalidate");
  assert.equal((await app.inject(listUrl + "?category=report")).headers["x-cache"], "MISS");
  assert.equal((await app.inject(listUrl + "?search=Original")).headers["x-cache"], "MISS");
  assert.equal((await app.inject(listUrl + "?page=2")).headers["x-cache"], "MISS");
  assert.equal((await app.inject(listUrl + "?page=9007199254740991")).statusCode, 400);

  // Block both DB calls to prove a view write and detail read start in parallel.
  let release!: () => void;
  gate = new Promise(resolve => { release = resolve; });
  const before = requests.length;
  const detailPending = app.inject(detailUrl + "?view=1");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests.length - before, 2);
  release(); gate = undefined;
  const detail = await detailPending;
  assert.equal(detail.statusCode, 200, detail.body);
  assert.equal(detail.json().viewCount, 4);
  assert.equal(detail.json().content, "Body");
  const beforeHit = readCount();
  const viewedAgain = await app.inject(detailUrl + "?view=1");
  assert.equal(viewedAgain.json().viewCount, 5);
  assert.equal(viewedAgain.headers["x-cache"], "HIT");
  assert.equal(readCount(), beforeHit, "view hits still increment without reloading the post");

  const comments = await app.inject(detailUrl + "/comments");
  assert.equal(comments.statusCode, 200, comments.body);
  assert.equal(comments.json().items[0].authorName, "Writer");
  assert.equal((await app.inject(detailUrl + "/comments")).headers["x-cache"], "HIT");
  assert.equal((await app.inject({ method: "POST", url: detailUrl + "/comments", headers, payload: { content: "New" } })).statusCode, 201);
  assert.deepEqual(invalidations.at(-1), ["lists", "post:" + id]);
  assert.equal((await app.inject(detailUrl)).headers["x-cache"], "MISS");
  assert.equal((await app.inject(listUrl)).json().items[0].commentCount, 2);
  assert.equal((await app.inject(detailUrl + "/comments")).headers["x-cache"], "MISS");

  assert.equal((await app.inject({ method: "PATCH", url: detailUrl + "/resolution", headers, payload: { isResolved: true } })).statusCode, 200);
  assert.equal((await app.inject(detailUrl)).json().isResolved, true);
  assert.equal((await app.inject({ method: "PUT", url: detailUrl, headers, payload: { category: "report", title: "Updated", content: "Body" } })).statusCode, 200);
  assert.equal((await app.inject(listUrl)).json().items[0].title, "Updated");

  assert.equal((await app.inject({ method: "POST", url: listUrl, headers, payload: { category: "general", title: "New", content: "Body" } })).statusCode, 201);
  assert.deepEqual(invalidations.at(-1), ["lists"], "new posts invalidate every list variant");
  failNext = true;
  assert.equal((await app.inject(listUrl)).statusCode, 500);
  assert.equal((await app.inject(listUrl)).statusCode, 200, "DB failures are not cached");

  // Concurrent cold reads share a single DB load.
  gate = new Promise(resolve => { release = resolve; });
  const countBefore = readCount();
  const concurrent = Array.from({ length: 5 }, () => app.inject(listUrl + "?search=concurrent"));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(readCount() - countBefore, 1);
  release(); gate = undefined;
  const responses = await Promise.all(concurrent);
  assert.equal(responses.filter(r => r.headers["x-cache"] === "COALESCED").length, 4);

  assert.equal((await app.inject({ method: "DELETE", url: detailUrl, headers })).statusCode, 204);
  assert.equal((await app.inject(detailUrl)).statusCode, 404);
  assert.equal((await app.inject(detailUrl + "/comments")).statusCode, 404, "hidden post comments are inaccessible");
  assert.equal((await app.inject(detailUrl + "/comments")).headers["x-cache"], undefined);
  assert.equal((await app.inject(listUrl)).json().items.length, 0);
  console.log("PASS: joined reads, cache keys/hits/coalescing, parallel views, write invalidation, failures and hidden posts");
} finally {
  globalThis.fetch = originalFetch;
  await app.close();
  await admin.app().delete();
}
