import { useEffect, useRef, useState } from "react";
import { prepareOcrImage, type CropMetadata } from "@/api/ocr.preprocess";
import "./OcrCropTest.css";
import { requestOcrBatch, type OcrRegionResult } from "@/api/ocr.batch";
import { useAppStore } from "@/stores/appStore";
import { matchOcrImages, resolveMatchedStat, statName, harmonyName, type LocalMatches } from "@/api/ocr.match";
import { recognizeBrowserOcr, type BrowserOcrProgress, type BrowserOcrRegion } from "@/api/ocr.browser";
import { crosscheckOcrRegions } from "@/api/ocr.crosscheck";
import { OCR_REGION_IDS } from "@/api/ocr.regions";

type Result = { url: string; file: File; metadata: CropMetadata; elapsed: number };
type OcrReport = {
  source: Result; lang: string; running: boolean; cancelled: boolean; browserEnabled: boolean;
  backend: OcrRegionResult[] | null; browser: BrowserOcrRegion[];
  backendDone: boolean; browserDone: boolean;
  backendError: string | null; browserError: string | null;
  progress: BrowserOcrProgress | null;
};
const comparisonLabels = { agree: "일치", conflict: "불일치", partial: "검증 불충분", missing: "인식 결과 없음" };
const sourceLabel = (source: string | null) => source === "both" ? "복수 결과 일치" : source === "backend_raw" ? "PaddleOCR 원본 채택" : source === "backend" ? "PaddleOCR 전처리 채택" : "Tesseract 채택";
const agreementLabel = (value: boolean | null) => value === null ? "—" : value ? "일치" : "불일치";
const bandLabel = (index: number) => index === -2 ? "에코 이름 / 하모니" : index === -1
  ? "COST"
  : index < 2 ? `주옵션 ${index + 1}` : `부옵션 ${index - 1}`;

export default function OcrCropTest() {
  const { lang } = useAppStore();
  const [ocrReport, setOcrReport] = useState<OcrReport | null>(null);
  const [browserEnabled, setBrowserEnabled] = useState(true);
  const [source, setSource] = useState<{ url: string; name: string } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const report = ocrReport?.source === result && ocrReport?.lang === lang ? ocrReport : null;
  const ocrResults = report?.backend ?? null;
  const ocrBusy = report?.running ?? false;
  const comparisons = crosscheckOcrRegions(ocrResults ?? [], report?.browser ?? []);
  const [matchReport, setMatchReport] = useState<{ source: Result; lang: string; data?: LocalMatches; error?: string } | null>(null);
  const local = matchReport?.source === result && matchReport?.lang === lang ? matchReport : null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const urls = useRef<string[]>([]);

  const release = () => {
    controller.current?.abort();
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
  };
  useEffect(() => () => {
    controller.current?.abort();
    urls.current.forEach(URL.revokeObjectURL);
  }, []);
  useEffect(() => () => controller.current?.abort(), [lang]);

  useEffect(() => {
    if (!result) return;
    const current = new AbortController();
    void matchOcrImages(result.file, result.metadata, lang, current.signal).then(data => {
      if (!current.signal.aborted) setMatchReport({ source: result, lang, data });
    }).catch((cause: unknown) => {
      if (!current.signal.aborted) setMatchReport({ source: result, lang, error: cause instanceof Error ? cause.message : "이미지 비교 실패" });
    });
    return () => current.abort();
  }, [result, lang]);

  async function upload(file: File) {
    release();
    setResult(null);
    setMatchReport(null);
    setOcrReport(null);
    setSource(null);
    setError("");
    setBusy(false);
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일을 선택해주세요.");
      return;
    }
    const url = URL.createObjectURL(file);
    urls.current.push(url);
    setSource({ url, name: file.name });
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    const start = performance.now();
    try {
      const prepared = await prepareOcrImage(file, current.signal, { splitHeader: true });
      if (current.signal.aborted) return;
      const outputUrl = URL.createObjectURL(prepared.file);
      urls.current.push(outputUrl);
      const preparedResult = { url: outputUrl, file: prepared.file, metadata: prepared.metadata, elapsed: performance.now() - start };
      setResult(preparedResult);
      setBusy(false);
      void runOcr(preparedResult);
    } catch (cause) {
      if (!current.signal.aborted) setError(cause instanceof Error ? cause.message : "이미지를 처리하지 못했습니다.");
    } finally {
      if (!current.signal.aborted) setBusy(false);
    }
  }

  async function runOcr(target: Result | null = result) {
    if (!target || (target === result && ocrBusy)) return;
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setError("");
    setOcrReport({
      source: target, lang, running: true, cancelled: false, browserEnabled,
      backend: null, browser: [], backendDone: false, browserDone: !browserEnabled,
      backendError: null, browserError: null, progress: null,
    });
    const update = (patch: Partial<OcrReport>) => {
      if (!current.signal.aborted && controller.current === current) {
        setOcrReport(previous => previous ? { ...previous, ...patch } : previous);
      }
    };
    try {
      const backendTask = requestOcrBatch(target.file, target.metadata, lang, current.signal, { compareRaw: true })
        .then(regions => update({ backend: regions }))
        .catch((cause: unknown) => update({ backendError: cause instanceof Error ? cause.message : "백엔드 OCR 실패" }))
        .finally(() => update({ backendDone: true }));
      const browserTask = browserEnabled ? recognizeBrowserOcr(target.file, target.metadata, lang, current.signal, {
        onProgress: progress => update({ progress }),
        onRegion: region => {
          if (!current.signal.aborted && controller.current === current) {
            setOcrReport(previous => previous ? { ...previous, browser: [...previous.browser, region] } : previous);
          }
        },
      }).catch((cause: unknown) => update({ browserError: cause instanceof Error ? cause.message : "브라우저 OCR 실패" }))
        .finally(() => update({ browserDone: true })) : Promise.resolve();
      await Promise.all([backendTask, browserTask]);
    } finally {
      update({ running: false });
    }
  }

  return (
    <main className="ocr-crop-test kr-font">
      <header>
        <h1>OCR 교차검증</h1>
        <a href="/">홈</a>
      </header>
      <div className="crop-toolbar">
        <label htmlFor="crop-upload">이미지 업로드</label>
        <input id="crop-upload" type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }} />
        {result && <button type="button" disabled={ocrBusy} onClick={() => void runOcr()}>OCR 다시 요청</button>}
        <label className="crop-browser-toggle"><input type="checkbox" checked={browserEnabled} disabled={ocrBusy} onChange={event => setBrowserEnabled(event.target.checked)} />브라우저 OCR · Tesseract.js</label>
        {(busy || ocrBusy) && <button type="button" onClick={() => {
          controller.current?.abort();
          setBusy(false);
          setOcrReport(previous => previous ? {
            ...previous, running: false, cancelled: true, backendDone: true, browserDone: true,
            progress: previous.progress ? { ...previous.progress, stage: "취소" } : null,
          } : previous);
          setError("처리를 취소했습니다.");
        }}>취소</button>}
      </div>
      <p role="status" className="crop-status">
        {ocrBusy ? "OCR 교차검증 중…" : busy ? "COST 탐지 및 자르기 중…" : result ? `자르기 완료 · ${result.metadata.bands.length}개 영역 · ${(result.elapsed / 1000).toFixed(2)}초` : "대기 중"}
      </p>
      {report?.browserEnabled && report.progress && <div className="crop-browser-progress" role="status">
        <progress max={9} value={report.progress.completed} />
        <span>Tesseract.js · {report.progress.stage} · {report.progress.completed} / 9</span>
      </div>}
      {error && <p role="alert" className="crop-error">{error}</p>}
      {report?.backendError && <p role="alert" className="crop-error">PaddleOCR: {report.backendError}</p>}
      {report?.browserError && <p role="alert" className="crop-error">Tesseract.js: {report.browserError}</p>}
      {source && <section className="crop-source">
        <h2>원본</h2>
        <p>{source.name}</p>
        <img src={source.url} alt="업로드한 원본" />
      </section>}
      {result && <>
        <section className="crop-ocr-results" aria-label="OCR 결과값">
          <h2>OCR 통합 판정</h2>
          {report ? <>
            <div className="crop-ocr-results-scroll">
              <table>
                <thead><tr><th scope="col">영역</th><th scope="col">PaddleOCR · 전처리 전</th><th scope="col">PaddleOCR · 전처리 후</th><th scope="col">브라우저 · Tesseract.js</th><th scope="col">스탯 종류 / 문자</th><th scope="col">수치 / % (참고)</th><th scope="col">최종 판정</th></tr></thead>
                <tbody>{OCR_REGION_IDS.map((id, index) => {
                  const server = ocrResults?.find(region => region.id === id);
                  const client = report.browser.find(region => region.id === id);
                  const check = comparisons[index];
                  return <tr key={id}>
                  <th scope="row">{bandLabel(index - 2)}</th>
                  <td>{server?.raw ? server.raw.success ? server.raw.texts.join("\n") || "인식된 텍스트 없음" : server.raw.error || "인식 실패" : report.backendDone ? "원본 OCR 결과 없음" : "처리 중…"}
                    {check.rawConfidence !== null && <small>모델 신뢰도 {(check.rawConfidence * 100).toFixed(1)} / 100</small>}
                  </td>
                  <td>{server ? server.success ? server.texts.join("\n") || "인식된 텍스트 없음" : server.error || "인식 실패" : report.cancelled ? "취소" : report.backendDone ? "인식 실패" : "처리 중…"}
                    {check.backendConfidence !== null && <small>모델 신뢰도 {(check.backendConfidence * 100).toFixed(1)} / 100</small>}
                  </td>
                  <td>{!report.browserEnabled ? "비활성화" : client ? <>
                    <div>{client.success ? client.texts.join("\n") || "인식된 텍스트 없음" : client.error || "인식 실패"}</div>
                    {client.confidence !== undefined && <small>모델 신뢰도 {client.confidence.toFixed(1)} / 100</small>}
                  </> : report.cancelled ? "취소" : report.browserDone ? "인식 실패" : "처리 중…"}</td>
                  <td>{agreementLabel(check.textAgreement)}
                    {index >= 2 && <small>Paddle 원본: {check.rawStatId ? statName(check.rawStatId) : "미확정"}<br />Paddle 전처리: {check.backendStatId ? statName(check.backendStatId) : "미확정"}<br />Tesseract: {check.browserStatId ? statName(check.browserStatId) : "미확정"}</small>}
                  </td>
                  <td>{agreementLabel(check.valueAgreement)}</td>
                  <td><span className={`crop-crosscheck crop-crosscheck--${check.selectedStatId ? "agree" : check.status}`}>{index >= 2
                    ? check.selectedStatId ? statName(check.selectedStatId) : "미확정"
                    : comparisonLabels[check.status]}</span>
                    {index >= 2 && check.selectedSource && <small>{sourceLabel(check.selectedSource)}</small>}
                  </td>
                </tr>;
                })}</tbody>
              </table>
            </div>
            <details className="crop-ocr-json"><summary>OCR 영역 데이터 JSON 보기</summary><pre>{JSON.stringify({ backend: ocrResults, browser: report.browser, crosscheck: comparisons }, null, 2)}</pre></details>
          </> : <p>대기 중</p>}
        </section>
        <section aria-label="항목별 자르기 결과">
          <h2>항목별 결과</h2>
          <p className="crop-match-status">{!local ? "이미지 비교 중…" : local.error ? local.error : lang !== "kr" ? "하모니 비교 완료 · 옵션 이미지 비교는 한국어만 지원" : "이미지 비교 완료"}</p>
          {local?.data && <p className="crop-harmony">하모니: {local.data.harmony ? `${harmonyName(local.data.harmony.id)} (유사도 ${Math.round(local.data.harmony.score * 100)}%)` : "미확정"}</p>}
          <div className="crop-bands">
            {result.metadata.bands.map((band) => {
              const match = local?.data?.rows.find(row => row.index === band.index)?.match ?? null;
              const decision = comparisons[band.index + 2];
              const selectedMatch = decision.selectedStatId ? { id: decision.selectedStatId, score: 1 } : match;
              const selectedOcr = decision.selectedSource === "backend_raw" ? ocrResults?.[band.index + 2].raw ?? undefined
                : decision.selectedSource === "browser" ? report?.browser.find(region => region.id === decision.id) : ocrResults?.[band.index + 2];
              const resolved = resolveMatchedStat(selectedMatch, selectedOcr, band.index);
              const browserRegion = report?.browser.find(region => region.id === OCR_REGION_IDS[band.index + 2]);
              const serverRegion = ocrResults?.find(region => region.id === OCR_REGION_IDS[band.index + 2]);
              return <figure key={band.index} style={{ width: "100%", maxWidth: result.metadata.width }}>
              <figcaption>{bandLabel(band.index)}</figcaption>
              <div className="crop-band-image" style={{ aspectRatio: `${result.metadata.width} / ${band.bottom - band.top}` }}>
                <img src={result.url} alt={bandLabel(band.index)} style={{ transform: `translateY(-${band.top / result.metadata.height * 100}%)` }} />
              </div>
              {serverRegion && <p className="crop-ocr-text">PaddleOCR 전처리 전: {serverRegion.raw
                ? serverRegion.raw.success ? serverRegion.raw.texts.join(" · ") || "인식된 텍스트 없음" : serverRegion.raw.error || "인식 실패"
                : "원본 OCR 결과 없음"}</p>}
              {serverRegion?.processed_image_base64 && <div className="crop-server-preview">
                <p>PaddleOCR 서버 전처리 이미지</p>
                <img src={`data:image/png;base64,${serverRegion.processed_image_base64}`} alt={`${bandLabel(band.index)} 서버 전처리 결과`} />
              </div>}
              {serverRegion && !serverRegion.processed_image_base64 && <p className="crop-ocr-text">서버 전처리 이미지 없음</p>}
              {band.index >= 0 && local?.data && <p className="crop-visual-text">이미지: {match ? `${statName(match.id)} (유사도 ${Math.round(match.score * 100)}%)` : "미확정"}</p>}
              {ocrResults && <p className="crop-ocr-text">PaddleOCR 전처리 후: {ocrResults[band.index + 2].success
                ? ocrResults[band.index + 2].texts.join(" · ") || "인식된 텍스트 없음"
                : "인식 실패"}</p>}
              {report?.browserEnabled && <p className="crop-browser-text">Tesseract.js: {browserRegion
                ? browserRegion.success ? browserRegion.texts.join(" · ") || "인식된 텍스트 없음" : browserRegion.error || "인식 실패"
                : report.cancelled ? "취소" : report.browserDone ? "인식 실패" : "처리 중…"}</p>}
              {band.index >= 0 && decision.selectedStatId && <p className="crop-resolved-text">스탯 판정: {statName(decision.selectedStatId)} · {sourceLabel(decision.selectedSource)}</p>}
              {resolved && <p className="crop-resolved-text">판정: {statName(resolved.id)} {resolved.value}{!["hp", "atk", "def"].includes(resolved.id) ? "%" : ""}{resolved.corrected ? " · 소수점 보정" : ""}</p>}
            </figure>;
            })}
          </div>
        </section>
        <section className="crop-atlas">
          <h2>통합 결과</h2>
          <a href={result.url} download="echo-regions.png">PNG 다운로드</a>
          <img src={result.url} alt="통합 자르기 결과" style={{ width: result.metadata.width, maxWidth: "100%" }} />
        </section>
      </>}
    </main>
  );
}
