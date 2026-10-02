import { useEffect, useState } from "react";
import { fetchDevAnalytics, type DevAnalyticsData } from "@/api/devAnalytics.api";
import { useAuthStore } from "@/stores/authStore";
import "./DevAnalystic.css";

const number = new Intl.NumberFormat("ko-KR");

function MetricList({ rows, labelKey }: {
  rows: Array<{ pageviews: number; visitors: number } & Record<string, string | number>>;
  labelKey: string;
}) {
  if (!rows.length) return <p className="dev-analytics-empty">해당 기간에 데이터가 없습니다.</p>;
  const max = Math.max(...rows.map((row) => row.pageviews), 1);
  return <div className="dev-analytics-list">
    {rows.map((row, index) => <div className="dev-analytics-row" key={`${row[labelKey]}-${index}`}>
      <div className="dev-analytics-row-top">
        <span title={String(row[labelKey])}>{String(row[labelKey] || "알 수 없음")}</span>
        <strong>{number.format(row.pageviews)}</strong>
      </div>
      <div className="dev-analytics-track"><span style={{ width: `${row.pageviews / max * 100}%` }} /></div>
      <small>방문자 {number.format(row.visitors)}</small>
    </div>)}
  </div>;
}

export default function DevAnalystic() {
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const [days, setDays] = useState(7);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<{ key: string; data: DevAnalyticsData | null; error: string } | null>(null);
  const requestKey = `${user?.uid ?? ""}:${days}:${refresh}`;
  const activeResult = result?.key === requestKey ? result : null;
  const data = activeResult?.data ?? null;
  const error = !isLoadingAuth && !user ? "로그인이 필요합니다." : activeResult?.error ?? "";
  const loading = !isLoadingAuth && !!user && !activeResult;

  useEffect(() => {
    if (isLoadingAuth || !user) return;
    const controller = new AbortController();
    void fetchDevAnalytics(days, controller.signal, refresh > 0)
      .then((data) => { if (!controller.signal.aborted) setResult({ key: requestKey, data, error: "" }); })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, data: null, error: cause instanceof Error ? cause.message : "통계를 불러오지 못했습니다." });
        }
      });
    return () => controller.abort();
  }, [days, isLoadingAuth, refresh, requestKey, user]);

  const maxDaily = Math.max(...(data?.daily.map((row) => row.pageviews) ?? []), 1);

  return <section className="dev-analytics">
    <div className="dev-analytics-toolbar">
      <div>
        <h2>Vercel Web Analytics</h2>
        <p>프로덕션 방문 통계 · 최근 {days}일</p>
      </div>
      <div className="dev-analytics-actions">
        <select aria-label="조회 기간" value={days} onChange={(event) => setDays(Number(event.target.value))}>
          <option value={1}>최근 1일</option>
          <option value={7}>최근 7일</option>
          <option value={30}>최근 30일</option>
        </select>
        <button type="button" onClick={() => setRefresh((value) => value + 1)} disabled={loading}>새로고침</button>
      </div>
    </div>

    {(isLoadingAuth || loading) && <p className="dev-analytics-state" role="status">통계를 불러오는 중입니다...</p>}
    {error && <p className="dev-analytics-state dev-analytics-error" role="alert">{error}</p>}

    {data && !loading && <>
      <div className="dev-analytics-cards">
        <article><span>페이지 조회수</span><strong>{number.format(data.total.pageviews)}</strong></article>
        <article><span>방문자</span><strong>{number.format(data.total.visitors)}</strong></article>
        <article><span>방문당 조회수</span><strong>{data.total.visitors ? (data.total.pageviews / data.total.visitors).toFixed(2) : "0.00"}</strong></article>
      </div>
      <section className="dev-analytics-panel">
        <h3>일별 조회수</h3>
        {data.daily.length ? <div className="dev-analytics-chart">
          {data.daily.map((row) => <div className="dev-analytics-day" key={row.date} title={`${row.date.slice(0, 10)} · 조회수 ${number.format(row.pageviews)} · 방문자 ${number.format(row.visitors)}`}>
            <span>{number.format(row.pageviews)}</span>
            <div className="dev-analytics-column"><span style={{ height: `${Math.max(row.pageviews / maxDaily * 100, 2)}%` }} /></div>
            <small>{row.date.slice(5, 10)}</small>
          </div>)}
        </div> : <p className="dev-analytics-empty">해당 기간에 데이터가 없습니다.</p>}
      </section>
      <div className="dev-analytics-breakdowns">
        <section className="dev-analytics-panel"><h3>인기 페이지</h3><MetricList rows={data.pages} labelKey="path" /></section>
        <section className="dev-analytics-panel"><h3>국가</h3><MetricList rows={data.countries} labelKey="country" /></section>
      </div>
      <p className="dev-analytics-note">방문자는 Vercel의 집계 기준을 따릅니다. 기간별 조회 가능 범위는 Vercel 요금제에 따라 달라집니다.</p>
    </>}
  </section>;
}
