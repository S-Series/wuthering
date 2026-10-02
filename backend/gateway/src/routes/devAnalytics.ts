import type { FastifyInstance } from "fastify";

type Metrics = { pageviews: number; visitors: number };
type AggregateRow = Metrics & {
  timestamp?: string;
  requestPath?: string;
  country?: string;
};
type VercelResult<T> = { data: T };

const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_MS = 60 * 1000;
const cache = new Map<number, { expiresAt: number; data: unknown }>();
const inFlight = new Map<number, Promise<unknown>>();

function metrics(value: unknown): Metrics {
  const row = (value ?? {}) as Partial<Metrics>;
  return {
    pageviews: Number.isFinite(row.pageviews) ? Number(row.pageviews) : 0,
    visitors: Number.isFinite(row.visitors) ? Number(row.visitors) : 0,
  };
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

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Vercel API returned ${response.status}`);
  }
  return (await response.json()) as T;
}

export function registerDevAnalyticsRoutes(app: FastifyInstance) {
  app.get("/api/dev/analytics", async (req, reply) => {
    const token = process.env.VERCEL_TOKEN?.trim();
    const projectId = process.env.VERCEL_PROJECT_ID?.trim();
    const teamId = process.env.VERCEL_TEAM_ID?.trim();
    if (!token || !projectId) {
      return reply.code(503).send({ error: "Vercel Analytics is not configured" });
    }

    const query = req.query as { days?: string };
    const days = Number(query.days ?? 7);
    if (![1, 7, 30].includes(days)) {
      return reply.code(400).send({ error: "days must be 1, 7, or 30" });
    }

    const cached = cache.get(days);
    if (cached && cached.expiresAt > Date.now()) {
      return reply.header("Cache-Control", "public, max-age=30").send(cached.data);
    }

    try {
      let pending = inFlight.get(days);
      if (!pending) {
        pending = (async () => {
          const until = new Date();
          const since = new Date(until.getTime() - days * DAY_MS);
          const range = { since: since.toISOString(), until: until.toISOString() };
          const [total, daily, pages, countries] = await Promise.all([
            queryVercel<VercelResult<Metrics>>("count", range, token, projectId, teamId),
            queryVercel<VercelResult<AggregateRow[]>>("aggregate", { ...range, by: "day", limit: "31" }, token, projectId, teamId),
            queryVercel<VercelResult<AggregateRow[]>>("aggregate", { ...range, by: "requestPath", limit: "10" }, token, projectId, teamId),
            queryVercel<VercelResult<AggregateRow[]>>("aggregate", { ...range, by: "country", limit: "10" }, token, projectId, teamId),
          ]);
          const data = {
            days,
            since: range.since,
            until: range.until,
            total: metrics(total.data),
            daily: daily.data.map((row) => ({ date: row.timestamp ?? "", ...metrics(row) })),
            pages: pages.data.map((row) => ({ path: row.requestPath ?? "", ...metrics(row) })),
            countries: countries.data.map((row) => ({ country: row.country ?? "", ...metrics(row) })),
          };
          cache.set(days, { expiresAt: Date.now() + CACHE_MS, data });
          return data;
        })();
        inFlight.set(days, pending);
        void pending.finally(() => inFlight.delete(days)).catch(() => undefined);
      }
      const data = await pending;
      return reply.header("Cache-Control", "public, max-age=30").send(data);
    } catch (error) {
      req.log.error({ err: error }, "Vercel Analytics request failed");
      return reply.code(502).send({ error: "Vercel Analytics request failed" });
    }
  });
}
