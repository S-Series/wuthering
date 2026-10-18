import assert from "node:assert/strict";
import Fastify from "fastify";
import admin from "firebase-admin";

process.env.SUPABASE_URL = "https://traffic-test.invalid";
process.env.SUPABASE_SECRET_KEY = "test-key";
admin.initializeApp({ projectId: "traffic-test" });
const { adminAuth } = await import("../lib/firebaseAdmin.js");
let verifications = 0;
Object.defineProperty(adminAuth, "verifyIdToken", { value: async (token: string) => {
  verifications++;
  return { uid: token, email: "test@example.invalid", email_verified: true, firebase: { sign_in_provider: "password" } };
} });
const { getRequiredSupabaseUser, getOptionalSupabaseUserId, syncSupabaseUser, getActiveSupabaseMembership } = await import("./supabaseUsers.js");
const { requireUid } = await import("../lib/requireAuth.js");
const { registerCharacterDataRoutes } = await import("../routes/characterData.js");
const userId = "11111111-1111-4111-8111-111111111111";
const membership = { user_id: userId, membership_level: 0, nickname: "Tester", started_at: null, expires_at: null };
const user = { id: userId, firebase_uid: "known", role: "user", status: "active", email: "test@example.invalid",
  email_verified: true, provider: "email", last_login_at: new Date().toISOString(), created_at: new Date().toISOString(), membership };
const snapshot: Record<string, unknown> = { rover_spectro: { level: 90 }, aemeath: { level: 80 } };
const requests: { table: string; method: string; url: URL; body: Record<string, unknown> }[] = [];
let rpcError: string | undefined;
let raceUser = false;
let raceMembership = false;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  const url = new URL(String(input));
  assert.equal(url.hostname, "traffic-test.invalid");
  const table = url.pathname.split("/").at(-1)!;
  const method = options?.method ?? "GET";
  const body = options?.body ? JSON.parse(String(options.body)) : {};
  requests.push({ table, method, url, body });
  let data: unknown;
  if (table === "users") {
    if (method === "POST" && raceUser) {
      raceUser = false;
      return Response.json({ code: "23505", message: "already provisioned" }, { status: 409 });
    }
    if (method === "GET") {
      const uid = url.searchParams.get("firebase_uid");
      data = uid === "eq.unknown" || (uid === "eq.race" && raceUser) ? [] : [{ ...user }];
    } else data = { ...user, ...body };
  } else if (table === "memberships") {
    if (method === "POST" && raceMembership) {
      raceMembership = false;
      return Response.json({ code: "23505", message: "already provisioned" }, { status: 409 });
    }
    data = raceMembership ? [] : [membership];
  } else if (table === "character_data") {
    if (method === "GET") {
      const select = url.searchParams.get("select")!;
      const key = select.startsWith("data:data->") ? select.split("->")[1].split(",")[0] : null;
      data = [{ data: key ? snapshot[key] ?? null : snapshot, updated_at: "2026-10-18T00:00:00Z" }];
    } else data = { updated_at: "2026-10-18T00:00:01Z" };
  } else if (table === "merge_character_cloud_data") {
    if (rpcError) return Response.json({ code: rpcError, message: "RPC failed" }, { status: 400 });
    assert.equal(body.target_user_id, userId);
    snapshot[String(body.target_character_id)] = body.character_payload;
    data = "2026-10-18T00:00:01Z";
  } else throw new Error("Unexpected request " + url.pathname);
  return Response.json(data);
};
const app = Fastify();
const headers = { authorization: "Bearer known" };
app.get("/probe", async req => {
  const [first, second, uid] = await Promise.all([getRequiredSupabaseUser(req), getRequiredSupabaseUser(req), requireUid(req)]);
  assert.equal(first.id, second.id);
  assert.equal(await getOptionalSupabaseUserId(req), first.id);
  return { role: first.role, uid };
});
app.get("/telemetry", async req => ({ id: await getOptionalSupabaseUserId(req) }));
await registerCharacterDataRoutes(app);
const reset = () => { requests.length = 0; verifications = 0; };
try {
  reset();
  assert.equal((await app.inject({ url: "/probe", headers })).statusCode, 200);
  assert.equal(verifications, 1);
  assert.equal(requests.length, 1, "one user lookup, no membership lookup");
  assert.doesNotMatch(requests[0].url.searchParams.get("select") ?? "", /memberships/, "ordinary authentication does not join membership data");
  user.role = "admin";
  assert.equal((await app.inject({ url: "/probe", headers })).json().role, "admin", "roles are fresh on the next request");

  reset();
  await app.inject({ url: "/telemetry", headers: { authorization: "Bearer unknown" } });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, "GET", "logging must never provision accounts");
  await app.inject({ url: "/telemetry", headers: { authorization: "Bearer unknown" } });
  assert.equal(requests.length, 1, "telemetry identifiers are cached");

  reset();
  await syncSupabaseUser({ uid: "known", email: user.email, email_verified: true, firebase: { sign_in_provider: "password" } }, { displayName: "Tester" });
  assert.equal(requests.length, 1, "unchanged login sync performs one joined read and no writes");
  user.last_login_at = new Date(0).toISOString();
  reset();
  await syncSupabaseUser({ uid: "known", email: user.email, email_verified: true, firebase: { sign_in_provider: "password" } });
  assert.equal(requests.filter(r => r.method === "PATCH").length, 1);
  raceUser = true;
  assert.equal((await app.inject({ url: "/probe", headers: { authorization: "Bearer race" } })).statusCode, 200);
  raceMembership = true;
  assert.equal((await getActiveSupabaseMembership(userId)).user_id, userId);

  reset();
  const selected = await app.inject({ url: "/api/character-data?characterId=rover_spectro", headers });
  assert.equal(selected.statusCode, 200, selected.body);
  assert.deepEqual(selected.json().data, { rover_spectro: { level: 90 } });
  assert.equal(requests.find(r => r.table === "character_data")?.url.searchParams.get("select"), "data:data->rover_spectro,updated_at");
  const etag = String(selected.headers.etag);
  const unchanged = await app.inject({ url: "/api/character-data?characterId=rover_spectro", headers: { ...headers, "if-none-match": etag } });
  assert.equal(unchanged.statusCode, 304);
  assert.equal(unchanged.body, "");
  assert.equal(unchanged.headers["cache-control"], "private, no-cache");
  const full = await app.inject({ url: "/api/character-data", headers: { ...headers, "if-none-match": etag } });
  assert.equal(full.statusCode, 200, "ETags are scoped to the requested representation");
  assert.equal((await app.inject({ url: "/api/character-data?characterId=bad(id)", headers })).statusCode, 400);
  assert.equal((await app.inject("/api/character-data")).statusCode, 401, "conditional reads still require authentication");

  reset();
  const saved = await app.inject({ method: "PUT", url: "/api/character-data", headers, payload: { characterId: "rover_spectro", data: { level: 99 } } });
  assert.equal(saved.statusCode, 200, saved.body);
  assert.equal(requests.filter(r => r.table === "character_data").length, 0, "single-character save never fetches or rewrites the full snapshot");
  assert.equal(requests.filter(r => r.table === "merge_character_cloud_data").length, 1);
  assert.deepEqual(snapshot.aemeath, { level: 80 });
  rpcError = "22001";
  assert.equal((await app.inject({ method: "PUT", url: "/api/character-data", headers, payload: { characterId: "aemeath", data: {} } })).statusCode, 413);
  rpcError = "PGRST202";
  assert.equal((await app.inject({ method: "PUT", url: "/api/character-data", headers, payload: { characterId: "aemeath", data: {} } })).statusCode, 500, "missing migration must not fall back to unsafe read-modify-write");
  rpcError = undefined;
  assert.equal((await app.inject({ method: "PUT", url: "/api/character-data", headers, payload: { data: { test: "x".repeat(1100000) } } })).statusCode, 200, "payloads within the documented 2 MiB limit pass the JSON parser");
  assert.equal((await app.inject({ method: "PUT", url: "/api/character-data", headers, payload: { data: { test: "x".repeat(2100000) } } })).statusCode, 413);
  console.log("PASS: request auth coalescing, fresh roles, telemetry isolation, login writes, provisioning races, projected/conditional reads and atomic sync routing");
} finally {
  globalThis.fetch = originalFetch;
  await app.close();
  await admin.app().delete();
}
