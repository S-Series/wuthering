import { useEffect, useRef, useState } from "react";
import { prepareOcrImage, type CropMetadata } from "@/api/ocr.preprocess";
import "./OcrCropTest.css";
import { requestOcrBatch, type OcrRegionResult } from "@/api/ocr.batch";
import { useAppStore } from "@/stores/appStore";

type Result = { url: string; file: File; metadata: CropMetadata; elapsed: number };
const bandLabel = (index: number) => index === -2 ? "에코 이름 / 하모니" : index === -1
  ? "COST"
  : index < 2 ? `주옵션 ${index + 1}` : `부옵션 ${index - 1}`;

export default function OcrCropTest() {
  const { lang } = useAppStore();
  const [ocrResults, setOcrResults] = useState<OcrRegionResult[] | null>(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [source, setSource] = useState<{ url: string; name: string } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
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

  async function upload(file: File) {
    release();
    setResult(null);
    setOcrResults(null);
    setOcrBusy(false);
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
      setResult({ url: outputUrl, file: prepared.file, metadata: prepared.metadata, elapsed: performance.now() - start });
    } catch (cause) {
      if (!current.signal.aborted) setError(cause instanceof Error ? cause.message : "이미지를 처리하지 못했습니다.");
    } finally {
      if (!current.signal.aborted) setBusy(false);
    }
  }

  async function runOcr() {
    if (!result || ocrBusy) return;
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setError("");
    setOcrResults(null);
    setOcrBusy(true);
    try {
      const regions = await requestOcrBatch(result.file, result.metadata, lang, current.signal);
      if (!current.signal.aborted) setOcrResults(regions);
    } catch (cause) {
      if (!current.signal.aborted) setError(cause instanceof Error ? cause.message : "OCR 요청에 실패했습니다.");
    } finally {
      if (!current.signal.aborted) setOcrBusy(false);
    }
  }

  return (
    <main className="ocr-crop-test kr-font">
      <header>
        <h1>COST 자르기 테스트</h1>
        <a href="/">홈</a>
      </header>
      <div className="crop-toolbar">
        <label htmlFor="crop-upload">이미지 업로드</label>
        <input id="crop-upload" type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }} />
        {result && <button type="button" disabled={ocrBusy} onClick={() => void runOcr()}>OCR 요청</button>}
        {(busy || ocrBusy) && <button type="button" onClick={() => {
          controller.current?.abort();
          setBusy(false);
          setOcrBusy(false);
          setError("처리를 취소했습니다.");
        }}>취소</button>}
      </div>
      <p role="status" className="crop-status">
        {ocrBusy ? "9개 영역 OCR 처리 중…" : busy ? "COST 탐지 및 자르기 중…" : result ? `자르기 완료 · ${result.metadata.bands.length}개 영역 · ${(result.elapsed / 1000).toFixed(2)}초` : "대기 중"}
      </p>
      {error && <p role="alert" className="crop-error">{error}</p>}
      {source && <section className="crop-source">
        <h2>원본</h2>
        <p>{source.name}</p>
        <img src={source.url} alt="업로드한 원본" />
      </section>}
      {result && <>
        <section aria-label="항목별 자르기 결과">
          <h2>항목별 결과</h2>
          <div className="crop-bands">
            {result.metadata.bands.map((band) => <figure key={band.index} style={{ width: "100%", maxWidth: result.metadata.width }}>
              <figcaption>{bandLabel(band.index)}</figcaption>
              <div className="crop-band-image" style={{ aspectRatio: `${result.metadata.width} / ${band.bottom - band.top}` }}>
                <img src={result.url} alt={bandLabel(band.index)} style={{ transform: `translateY(-${band.top / result.metadata.height * 100}%)` }} />
              </div>
              {ocrResults && <p className="crop-ocr-text">{ocrResults[band.index + 2].success
                ? ocrResults[band.index + 2].texts.join(" · ") || "인식된 텍스트 없음"
                : "인식 실패"}</p>}
            </figure>)}
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
