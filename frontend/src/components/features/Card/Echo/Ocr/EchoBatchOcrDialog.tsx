import { useEffect, useRef, useState } from "react";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import { useAppStore, type LangType } from "@/stores/appStore";
import { locale } from "@/locales/locale";
import EchoOcrResultEditor from "./EchoOcrResultEditor";
import type { EchoOcrResult } from "./EchoOcrPanel";
import { recognizeEchoImage } from "./echoOcr.helpers";
import "./EchoBatchOcrDialog.css";

type Outcome = { result: EchoOcrResult | null; error: string | null };
type Props = { files: File[]; first: Outcome; startIndex: number; requestLang: LangType };

export default function EchoBatchOcrDialog({ files, first, startIndex, requestLang }: Props) {
  const { lang } = useAppStore();
  const text = locale(lang).ocr;
  const { closeElevatedOverlay } = useElevatedOverlay();
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(() => files.map((_, i) => i === 0 ? first : null));
  const [index, setIndex] = useState(0);
  const [slot, setSlot] = useState(startIndex);
  const [retrying, setRetrying] = useState(false);
  const retryRef = useRef<AbortController | null>(null);
  const [preview, setPreview] = useState("");
  const current = outcomes[index];

  useEffect(() => {
    const controller = new AbortController();
    // The first request completed inline; this dialog owns the remaining queue.
    const run = async () => {
      for (let i = 1; i < files.length; i += 1) {
        let outcome: Outcome;
        try {
          const result = await recognizeEchoImage(files[i], requestLang, controller.signal);
          outcome = { result, error: null };
        } catch (error) {
          if (controller.signal.aborted) return;
          outcome = { result: null, error: error instanceof Error ? error.message : "OCR failed" };
        }
        if (controller.signal.aborted) return;
        setOutcomes(previous => previous.map((item, j) => j === i ? outcome : item));
      }
    };
    void run();
    return () => { controller.abort(); retryRef.current?.abort(); };
  }, [files, requestLang]);

  useEffect(() => {
    const url = URL.createObjectURL(files[index]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [files, index]);

  const next = () => {
    if (index === files.length - 1) { closeElevatedOverlay(); return; }
    setIndex(i => i + 1);
    setSlot(i => i < 9 ? i + 1 : -1);
  };
  const retry = async () => {
    if (retryRef.current) return;
    const controller = new AbortController();
    retryRef.current = controller;
    setRetrying(true);
    try {
      const result = await recognizeEchoImage(files[index], requestLang, controller.signal);
      if (!controller.signal.aborted) setOutcomes(previous => previous.map((item, i) => i === index ? { result, error: null } : item));
    } catch (error) {
      if (!controller.signal.aborted) setOutcomes(previous => previous.map((item, i) => i === index ? { result: null, error: error instanceof Error ? error.message : "OCR failed" } : item));
    } finally {
      retryRef.current = null;
      if (!controller.signal.aborted) setRetrying(false);
    }
  };

  return <div className="echo-batch-review">
    <header className="echo-batch-review__toolbar">
      <span aria-live="polite">{index + 1} / {files.length} · {text.batchProgress} {outcomes.filter(Boolean).length} / {files.length}</span>
      <label>Slot <select aria-label="Slot" value={slot} onChange={event => setSlot(Number(event.target.value))}>
        <option value={-1} disabled>{text.batchChooseSlot}</option>
        {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{i + 1}</option>)}
      </select></label>
      <button type="button" disabled={retrying} onClick={next}>{text.batchSkip}</button>
      <button type="button" onClick={closeElevatedOverlay}>{text.batchFinish}</button>
    </header>
    <p className="echo-batch-review__filename">{files[index].name}</p>
    {current?.result && slot >= 0 ? <EchoOcrResultEditor key={index} selectIdx={slot} resetAction={next}
      datas={{ cost: current.result.cost as 1 | 3 | 4, echoId: current.result.echoId, stats: current.result.echoStats, setId: current.result.setId }}
      inputSlot={<img className="echo-batch-review__image" src={preview} alt={files[index].name} />} />
      : <div className="echo-batch-review__waiting">
        <img className="echo-batch-review__image" src={preview} alt={files[index].name} />
        <div role={current?.error ? "alert" : "status"}>{current?.error ?? (current?.result ? text.batchChooseSlot : text.loading)}</div>
        {current?.error && <button type="button" disabled={retrying || outcomes.some(item => item === null)} onClick={() => void retry()}>{retrying ? text.loading : text.batchRetry}</button>}
      </div>}
  </div>;
}
