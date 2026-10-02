import type { FastifyBaseLogger } from "fastify";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

type Metrics = { pageviews: number; visitors: number };
type Breakdown = Metrics & { name: string };
type VercelRow = Metrics & { requestPath?: string; country?: string };
type VercelResult<T> = { data: T };
type DailyRow = {
  day: string;
  period_start: string;
  period_end: string;
  pageviews: number;
  visitors: number;
  pages: Breakdown[];
  countries: Breakdown[];
  collected_at: string;
};

const DAY_MS = 86_400_000;
const KST_DAY_START_OFFSET_MS = 4 * 60 * 60 * 1000;
const SETTLE_MS = 10 * 60 * 1000;
const BACKFILL_DAYS = 30;
const RETRY_DELAYS = [0, 1_000, 3_000];
let syncInProgress: Promise<void> | null = null;

export function shiftDay(day: string, amount: number) {
  return new Date(Date.parse(`${day}T00:00:00.000Z`) + amount * DAY_MS)
    .toISOString().slice(0, 10);
}

export function latestCompletedDay(now = new Date()) {
  const businessDay = new Date(now.getTime() - SETTLE_MS + KST_DAY_START_OFFSET_MS)
    .toISOString().slice(0, 10);
  return shiftDay(businessDay, -1);
}

export function dayInterval(day: string) {
  const startMs = Date.parse(`${day}T00:00:00.000Z`) - KST_DAY_START_OFFSET_MS;
  return {
    start: new Date(startMs).toISOString(),
    end: new Date(startMs + DAY_MS).toISOString(),
    // Vercel's `until` parameter includes its boundary.
    queryEnd: new Date(startMs + DAY_MS - 1).toISOString(),
  };
}

function readMetrics(value: unknown): Metrics {
  if (!value || typeof value !== "object") throw new Error("Invalid Vercel metrics");
  const row = value as Partial<Metrics>;
  if (!Number.isFinite(row.pageviews) || !Number.isFinite(row.visitors)) {
    throw new Error("Invalid Vercel metrics");
  }
  return { pageviews: Number(row.pageviews), visitors: Number(row.visitors) };
}

async function queryVercel<T>(
  endpoint: "count" | "aggregate",
  params: Record<string, string>,
  token: string,
  projectId: string,
  teamId?: string,
): Promise<T> {
  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/visits/${endpoint}`);
  url.searchParams.set("projectId", projectId);
  if (teamId) url.searchParams.set("teamId", teamId);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  for (const [attempt, delay] of RETRY_DELAYS.entries()) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) return (await response.json()) as T;
      if (response.status !== 429 && response.status !== 503 || attempt === RETRY_DELAYS.length - 1) {
        throw new Error(`Vercel Analytics returned ${response.status}`);
      }
    } catch (error) {
      if (attempt === RETRY_DELAYS.length - 1 ||
        error instanceof Error && error.message.startsWith("Vercel Analytics returned")) throw error;
    }
  }
  throw new Error("Vercel Analytics request failed");
}

function breakdown(value: unknown, field: "requestPath" | "country"): Breakdown[] {
  if (!Array.isArray(value)) throw new Error("Invalid Vercel breakdown");
  return value.map((item: VercelRow) => ({
    name: typeof item[field] === "string" ? item[field] : "",
    ...readMetrics(item),
  }));
}

export async function collectAnalyticsDay(day: string) {
  const token = process.env.VERCEL_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  if (!token || !projectId) throw new Error("Vercel Analytics is not configured");

  const interval = dayInterval(day);
  const range = { since: interval.start, until: interval.queryEnd };
  const [count, pages, countries] = await Promise.all([
    queryVercel<VercelResult<Metrics>>("count", range, token, projectId, teamId),
    queryVercel<VercelResult<VercelRow[]>>("aggregate", { ...range, by: "requestPath", limit: "100" }, token, projectId, teamId),
    queryVercel<VercelResult<VercelRow[]>>("aggregate", { ...range, by: "country", limit: "100" }, token, projectId, teamId),
  ]);
  const total = readMetrics(count.data);
  const { error } = await supabaseAdmin.from("dev_analytics_daily").upsert({
    day,
    period_start: interval.start,
    period_end: interval.end,
    ...total,
    pages: breakdown(pages.data, "requestPath"),
    countries: breakdown(countries.data, "country"),
    collected_at: new Date().toISOString(),
  }, { onConflict: "day" });
  if (error) throw new Error(`Failed to save analytics for ${day}: ${error.message}`);
}

function mergeBreakdowns(rows: DailyRow[], field: "pages" | "countries") {
  const totals = new Map<string, Metrics>();
  for (const row of rows) {
    for (const item of row[field] ?? []) {
      const current = totals.get(item.name) ?? { pageviews: 0, visitors: 0 };
      totals.set(item.name, {
        pageviews: current.pageviews + item.pageviews,
        visitors: current.visitors + item.visitors,
      });
    }
  }
  return [...totals].map(([name, total]) => ({ name, ...total }))
    .sort((a, b) => b.pageviews - a.pageviews).slice(0, 10);
}

export async function readStoredAnalytics(days: number) {
  const lastDay = latestCompletedDay();
  const firstDay = shiftDay(lastDay, 1 - days);
  const { data, error } = await supabaseAdmin.from("dev_analytics_daily")
    .select("day,period_start,period_end,pageviews,visitors,pages,countries,collected_at")
    .gte("day", firstDay).lte("day", lastDay).order("day", { ascending: true });
  if (error) throw new Error(`Failed to read analytics: ${error.message}`);
  const rows = (data ?? []) as DailyRow[];
  return {
    days,
    firstDay,
    lastDay,
    availableDays: rows.length,
    lastCollectedAt: rows.reduce<string | null>((latest, row) =>
      !latest || row.collected_at > latest ? row.collected_at : latest, null),
    total: rows.reduce<Metrics>((sum, row) => ({
      pageviews: sum.pageviews + Number(row.pageviews),
      visitors: sum.visitors + Number(row.visitors),
    }), { pageviews: 0, visitors: 0 }),
    daily: rows.map((row) => ({ date: row.day, pageviews: Number(row.pageviews), visitors: Number(row.visitors) })),
    pages: mergeBreakdowns(rows, "pages").map(({ name, ...total }) => ({ path: name, ...total })),
    countries: mergeBreakdowns(rows, "countries").map(({ name, ...total }) => ({ country: name, ...total })),
  };
}

async function syncDailyAnalytics(log: FastifyBaseLogger, refreshRecent: boolean) {
  if (syncInProgress) return syncInProgress;
  syncInProgress = (async () => {
    if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
      log.warn("Vercel Analytics collector is not configured");
      return;
    }
    const latest = latestCompletedDay();
    const earliest = shiftDay(latest, 1 - BACKFILL_DAYS);
    const { data, error } = await supabaseAdmin.from("dev_analytics_daily")
      .select("day").gte("day", earliest).lte("day", latest);
    if (error) throw new Error(`Failed to find stored analytics: ${error.message}`);
    const stored = new Set((data ?? []).map((row) => row.day as string));
    for (let offset = BACKFILL_DAYS - 1; offset >= 0; offset--) {
      const day = shiftDay(latest, -offset);
      if (stored.has(day) && !(refreshRecent && offset <= 1)) continue;
      try {
        await collectAnalyticsDay(day);
        log.info({ day }, "Vercel Analytics day stored");
      } catch (err) {
        log.error({ err, day }, "Vercel Analytics day collection failed");
      }
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  })().finally(() => { syncInProgress = null; });
  return syncInProgress;
}

export function msUntilNextCollection(now = Date.now()) {
  const kstMidnight = Math.floor((now + 9 * 60 * 60 * 1000) / DAY_MS) * DAY_MS - 9 * 60 * 60 * 1000;
  let next = kstMidnight + 5 * 60 * 60 * 1000 + SETTLE_MS;
  if (next <= now) next += DAY_MS;
  return next - now;
}

export function startDevAnalyticsCollector(log: FastifyBaseLogger) {
  void syncDailyAnalytics(log, false).catch((err) => log.error({ err }, "Analytics bootstrap failed"));
  const scheduleNext = () => {
    setTimeout(() => {
      scheduleNext();
      void syncDailyAnalytics(log, true).catch((err) => log.error({ err }, "Analytics scheduled sync failed"));
    }, msUntilNextCollection());
  };
  scheduleNext();
}
