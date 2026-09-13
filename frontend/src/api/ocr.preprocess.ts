import cvUrl from "@techstark/opencv-js/dist/opencv.js?url";

export type CropMetadata = {
  version: 1;
  width: number;
  height: number;
  bands: { index: number; top: number; bottom: number }[];
  icon: number[];
};

export async function prepareOcrImage(file: File, signal: AbortSignal, options: { splitHeader?: boolean } = {}): Promise<{ file: File; metadata: CropMetadata }> {
  signal.throwIfAborted();
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") {
    throw new Error("이 브라우저는 이미지 전처리를 지원하지 않습니다. 최신 브라우저를 이용해주세요.");
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(`${import.meta.env.BASE_URL}ocr/preprocess.worker.js`);
    const cleanup = () => {
      worker.terminate();
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
    };
    const abort = () => { cleanup(); reject(new DOMException("Aborted", "AbortError")); };
    const timer = window.setTimeout(() => {
      cleanup(); reject(new Error("이미지 전처리 시간이 초과되었습니다."));
    }, 45_000);
    signal.addEventListener("abort", abort, { once: true });
    worker.onerror = () => { cleanup(); reject(new Error("이미지 처리기를 불러오지 못했습니다.")); };
    worker.onmessage = (event: MessageEvent<{ blob?: Blob; metadata?: CropMetadata; error?: string }>) => {
      cleanup();
      if (!event.data.blob || !event.data.metadata) {
        reject(new Error(event.data.error || "이미지 전처리에 실패했습니다."));
        return;
      }
      resolve({ file: new File([event.data.blob], "echo-regions.png", { type: "image/png" }), metadata: event.data.metadata });
    };
    worker.postMessage({ file, splitHeader: options.splitHeader === true, cvUrl: new URL(cvUrl, location.href).href,
      assetBase: new URL(`${import.meta.env.BASE_URL}ocr/`, location.href).href });
  });
}
