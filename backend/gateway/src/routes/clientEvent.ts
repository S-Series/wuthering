import type { FastifyInstance } from "fastify";
import { getClientIp } from "../lib/getClientIp.js";
import { safeLogEvent } from "../lib/logEvent.js";
import { getOptionalSupabaseUserId } from "../services/supabaseUsers.js";

type ClientEventBody = {
  feature?: unknown;
  eventName?: unknown;
  result?: unknown;
  message?: unknown;
  statusCode?: unknown;
  durationMs?: unknown;
  meta?: unknown;
};

const allowedClientEvents = new Set([
  "page_view",
  "auth_login",
  "auth_logout",
  "auth_signup",
  "auth_password_reset",
  "image_download",
]);

function normalizeResult(value: unknown) {
  return value === "fail" ? "fail" : "success";
}

function normalizeString(value: unknown, fallback: string, maxLength = 80) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLength);
}

function normalizeNullableString(value: unknown, maxLength = 300) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function normalizeNullableNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.round(value));
}

function normalizeMeta(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  try {
    const json = JSON.stringify(value);
    if (json.length > 4000) {
      return { truncated: true };
    }

    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function registerClientEventRoutes(app: FastifyInstance) {
  app.post("/api/client-event", async (req, reply) => {
    const body = req.body as ClientEventBody | null;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ error: "invalid json body" });
    }

    const eventName = normalizeString(body.eventName, "");
    if (!allowedClientEvents.has(eventName)) {
      return reply.code(400).send({ error: "unsupported event name" });
    }

    const supabaseUserId = await getOptionalSupabaseUserId(req);

    safeLogEvent({
      service: "frontend",
      feature: normalizeString(body.feature, "unknown"),
      eventName,
      result: normalizeResult(body.result),
      message: normalizeNullableString(body.message),
      statusCode: normalizeNullableNumber(body.statusCode),
      durationMs: normalizeNullableNumber(body.durationMs),
      userId: supabaseUserId,
      ip: getClientIp(req),
      meta: normalizeMeta(body.meta),
    });

    return reply.code(202).send({ ok: true });
  });
}
