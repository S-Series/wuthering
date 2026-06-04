import { createHash } from "node:crypto";
import { supabaseAdmin } from "./supabaseAdmin.js";

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

export async function logEvent(input: LogEventInput) {
  const { data, error } = await supabaseAdmin
    .from("event_logs")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) {
    console.error("[logEvent failed]", error.message);
    return null;
  }

  return data;
}

export function safeLogEvent(input: LogEventInput, reporter?: LogErrorReporter) {
  void logEvent(input).catch((error: unknown) => {
    if (reporter) {
      reporter.warn({ error, eventName: input.eventName }, "log write failed");
      return;
    }

    console.warn("[logEvent failed]", error);
  });
}
