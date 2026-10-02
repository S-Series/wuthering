export type AnalyticsMetrics = { pageviews: number; visitors: number };
export type DevAnalyticsData = {
  days: number;
  firstDay: string;
  lastDay: string;
  availableDays: number;
  lastCollectedAt: string | null;
  total: AnalyticsMetrics;
  daily: Array<AnalyticsMetrics & { date: string }>;
  pages: Array<AnalyticsMetrics & { path: string }>;
  countries: Array<AnalyticsMetrics & { country: string }>;
};

export class DevAnalyticsError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchDevAnalytics(days: number, signal?: AbortSignal): Promise<DevAnalyticsData> {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;
  if (!gatewayUrl) throw new DevAnalyticsError("VITE_GATEWAY_URL 설정이 필요합니다.", 503);

  const url = new URL(`${gatewayUrl.replace(/\/$/, "")}/api/dev/analytics`);
  url.searchParams.set("days", String(days));
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const messages: Record<number, string> = {
      503: "저장된 통계를 읽을 수 없습니다. 서버의 DB 설정을 확인해 주세요.",
    };
    throw new DevAnalyticsError(messages[response.status] ?? "통계를 불러오지 못했습니다.", response.status);
  }
  return (await response.json()) as DevAnalyticsData;
}
