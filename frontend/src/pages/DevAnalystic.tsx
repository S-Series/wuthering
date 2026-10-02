import { useEffect, useState } from "react";
import { fetchDevAnalytics, type DevAnalyticsData } from "@/api/devAnalytics.api";
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
      <small>일별 방문자 합계 {number.format(row.visitors)}</small>
    </div>)}
  </div>;
}

export default function DevAnalystic() {
  const [days, setDays] = useState(7);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<{ key: string; data: DevAnalyticsData | null; error: string } | null>(null);
  const requestKey = `${days}:${refresh}`;
  const activeResult = result?.key === requestKey ? result : null;
  const data = activeResult?.data ?? null;
  const error = activeResult?.error ?? "";
  const loading = !activeResult;

  useEffect(() => {
    const controller = new AbortController();
    void fetchDevAnalytics(days, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setResult({ key: requestKey, data, error: "" }); })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, data: null, error: cause instanceof Error ? cause.message : "통계를 불러오지 못했습니다." });
        }
      });
    return () => controller.abort();
  }, [days, requestKey]);

  const maxDaily = Math.max(...(data?.daily.map((row) => row.pageviews) ?? []), 1);

  return <section className="dev-analytics">
    <div className="dev-analytics-toolbar">
      <div>
        <h2>Vercel Web Analytics</h2>
        <p>프로덕션 방문 통계 · 한국시간 오전 5시 기준 · 최근 완료된 {days}일</p>
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

    {loading && <p className="dev-analytics-state" role="status">통계를 불러오는 중입니다...</p>}
    {error && <p className="dev-analytics-state dev-analytics-error" role="alert">{error}</p>}

    {data && !loading && <>
      {data.availableDays > 0 && data.availableDays < days && <p className="dev-analytics-state" role="status">
        {data.firstDay} ~ {data.lastDay} 중 {data.availableDays}일의 통계가 저장되었습니다. 빠진 날짜는 수집 중입니다.
      </p>}
      {data.availableDays === 0 ? <p className="dev-analytics-state">아직 저장된 통계가 없습니다. 첫 수집이 완료되면 여기에 표시됩니다.</p> : <>
      <div className="dev-analytics-cards">
        <article><span>페이지 조회수</span><strong>{number.format(data.total.pageviews)}</strong></article>
        <article><span>일별 방문자 합계</span><strong>{number.format(data.total.visitors)}</strong></article>
        <article><span>일평균 조회수</span><strong>{number.format(Math.round(data.total.pageviews / data.availableDays))}</strong></article>
      </div>
      <section className="dev-analytics-panel">
        <h3>일별 조회수</h3>
        {data.daily.length ? <div className="dev-analytics-chart">
          {data.daily.map((row) => <div className="dev-analytics-day" key={row.date} title={`${row.date} 05:00~다음 날 05:00 · 조회수 ${number.format(row.pageviews)} · 방문자 ${number.format(row.visitors)}`}>
            <span>{number.format(row.pageviews)}</span>
            <div className="dev-analytics-column"><span style={{ height: `${Math.max(row.pageviews / maxDaily * 100, 2)}%` }} /></div>
            <small>{row.date.slice(5)}</small>
          </div>)}
        </div> : <p className="dev-analytics-empty">해당 기간에 데이터가 없습니다.</p>}
      </section>
      <div className="dev-analytics-breakdowns">
        <section className="dev-analytics-panel"><h3>인기 페이지</h3><MetricList rows={data.pages} labelKey="path" /></section>
        <section className="dev-analytics-panel"><h3>국가</h3><MetricList rows={data.countries} labelKey="country" /></section>
      </div>
      <p className="dev-analytics-note">각 날짜는 한국시간 05:00~다음 날 05:00입니다. 방문자 합계는 일별 수치의 합이며 기간 전체의 고유 방문자 수가 아닙니다. 마지막 저장: {data.lastCollectedAt ? new Date(data.lastCollectedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }) : "없음"}</p>
      </>}
    </>}
  </section>;
}
