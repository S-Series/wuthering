import { createHash } from "node:crypto";
import { supabaseAdmin } from "./supabaseAdmin.js";
import { EventBuffer } from "../services/eventBuffer.js";

type LogResult = "success" | "fail";

type LogEventInput = {
  service: string;
  feature: string;
  eventName: string;
  result: LogResult;
  message?: string | null;
  statusCode?: number | null;
  durationMs?: number | null;
  userId?: string | null;
  ip?: string | null;
  meta?: Record<string, unknown>;
};

type LogErrorReporter = {
  warn: (...args: unknown[]) => void;
};

const LOG_SECRET =
  process.env.LOG_SECRET ?? process.env.SUPABASE_LOG_SECRET ?? "dev-log-secret";

function hashIp(ip: string | null | undefined) {
  if (!ip) return null;

  return createHash("sha256")
    .update(`${ip}:${LOG_SECRET}`)
    .digest("hex");
}

function toLogRow(input: LogEventInput) {
  return {
    service: input.service,
    feature: input.feature,
    event_name: input.eventName,
    result: input.result,
    message: input.message ?? null,
    status_code: input.statusCode ?? null,
    duration_ms: input.durationMs ?? null,
    user_id: input.userId ?? null,
    ip_hash: hashIp(input.ip),
    meta: input.meta ?? {},
  };
}

const events = new EventBuffer<ReturnType<typeof toLogRow>>(async batch => {
  const { error } = await supabaseAdmin.from("event_logs").insert(batch)
    .abortSignal(AbortSignal.timeout(5000));
  if (error) throw error;
}, (message, count) => console.warn(`[logEvent] ${message}`, { count }));

export function flushEventLogs() { return events.flush(); }

export function safeLogEvent(input: LogEventInput, _reporter?: LogErrorReporter) {
  events.enqueue(toLogRow(input));
}
