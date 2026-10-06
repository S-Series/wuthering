import type { Worker as TesseractWorker } from "tesseract.js";
import workerUrl from "tesseract.js/dist/worker.min.js?url";
import type { LangType } from "@/stores/appStore";
import type { CropMetadata } from "./ocr.preprocess";
import { createOcrRegionImages, type OcrRegionResult } from "./ocr.regions";

export type BrowserOcrRegion = OcrRegionResult & { confidence?: number };
export type BrowserOcrProgress = { stage: string; completed: number; total: number; progress: number };
type Options = {
  onProgress?: (progress: BrowserOcrProgress) => void;
  onRegion?: (region: BrowserOcrRegion) => void;
};
const languages: Record<LangType, string> = { kr: "kor+eng", en: "eng", jp: "jpn+eng", zh: "chi_sim+eng" };

function abortable<T>(task: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
    task.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
    if (signal.aborted) abort();
  });
}

export async function recognizeBrowserOcr(
  file: File, metadata: CropMetadata, lang: LangType, signal: AbortSignal, options: Options = {},
): Promise<BrowserOcrRegion[]> {
  signal.throwIfAborted();
  const controller = new AbortController();
  let worker: TesseractWorker | undefined;
  let completed = 0;
  let terminated = false;
  const terminate = () => {
    if (worker && !terminated) {
      terminated = true;
      void worker.terminate().catch(() => {});
    }
  };
  const abort = () => { controller.abort(signal.reason); terminate(); };
  signal.addEventListener("abort", abort, { once: true });
  const timer = window.setTimeout(() => {
    controller.abort(new Error("브라우저 OCR 시간이 초과되었습니다."));
    terminate();
  }, 190_000);
  const report = (stage: string, progress = 0) => {
    if (!controller.signal.aborted) options.onProgress?.({ stage, completed, total: 9, progress });
  };
  try {
    report("모델 로딩");
    const { createWorker, PSM, OEM } = await abortable(import("tesseract.js"), controller.signal);
    const images = await createOcrRegionImages(file, metadata, controller.signal);
    const initializing = createWorker(languages[lang], OEM.LSTM_ONLY, {
      workerPath: new URL(workerUrl, location.href).href,
      logger: message => report(message.status === "recognizing text" ? "문자 인식" : "모델 로딩", message.progress),
      errorHandler: () => {},
    });
    // Initialization has no public cancellation handle; dispose a late worker too.
    void initializing.then(created => {
      worker = created;
      if (controller.signal.aborted) terminate();
    }, () => {});
    worker = await abortable(initializing, controller.signal);
    await abortable(worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE, preserve_interword_spaces: "1", user_defined_dpi: "300" }), controller.signal);
    const results: BrowserOcrRegion[] = [];
    for (const image of images) {
      controller.signal.throwIfAborted();
      report("문자 인식");
      let region: BrowserOcrRegion;
      try {
        const { data } = await abortable(worker.recognize(image.blob), controller.signal);
        region = { id: image.id, success: true, texts: data.text.split(/\r?\n/).map(text => text.trim()).filter(Boolean), confidence: data.confidence };
      } catch (error) {
        controller.signal.throwIfAborted();
        region = { id: image.id, success: false, texts: [], error: error instanceof Error ? error.message : String(error) };
      }
      completed += 1;
      results.push(region);
      options.onRegion?.(region);
      report("문자 인식", 1);
    }
    report("완료", 1);
    return results;
  } catch (error) {
    controller.signal.throwIfAborted();
    throw error instanceof Error ? error : new Error(String(error));
  } finally {
    controller.abort();
    terminate();
    signal.removeEventListener("abort", abort);
    clearTimeout(timer);
  }
}
