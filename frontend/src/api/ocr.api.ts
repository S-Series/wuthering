import { auth } from "@/firebase/firebase";
import type { VisionResponse } from "./ocr.vision";
import type { CropMetadata } from "./ocr.preprocess";

export type OcrApiResponse = {
  success?: boolean;
  texts?: string[];
  full_text?: string;
  image_base64?: string;
  error?: string;
  error_type?: string;
  vision?: VisionResponse | null;
};

export async function requestOcrByUrl(
  endpointUrl: string,
  file: File,
  lang: string,
  opts?: { signal?: AbortSignal; timeoutMs?: number; preprocessing?: CropMetadata }
): Promise<OcrApiResponse> {
  const controller = new AbortController();
  const timeoutMs = opts?.timeoutMs ?? 60_000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const { signal, cleanup } = mergeAbortSignals(opts?.signal, controller.signal);

  try {
    const formData = new FormData();
    formData.append("lang", lang);
    if (opts?.preprocessing) formData.append("preprocessing", JSON.stringify(opts.preprocessing));
    formData.append("file", file);

    const user = auth?.currentUser ?? null;
    const idToken = user ? await user.getIdToken() : null;

    const res = await fetch(endpointUrl, {
      method: "POST",
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
      body: formData,
      signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`서버 오류: ${res.status} ${body}`);
    }

    const data = (await res.json()) as OcrApiResponse;
    if (data.success === false) throw new Error(data.error || "OCR failed");
    return data;
  } finally {
    cleanup();
    window.clearTimeout(timeoutId);
  }
}

function mergeAbortSignals(a?: AbortSignal, b?: AbortSignal) {
  if (!a) return { signal: b, cleanup: () => undefined };
  if (!b) return { signal: a, cleanup: () => undefined };

  const controller = new AbortController();
  const cleanup = () => {
    a.removeEventListener("abort", onAbort);
    b.removeEventListener("abort", onAbort);
  };
  const onAbort = () => {
    cleanup();
    controller.abort();
  };

  if (a.aborted || b.aborted) {
    controller.abort();
    return { signal: controller.signal, cleanup: () => undefined };
  }

  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });

  return { signal: controller.signal, cleanup };
}
