import { auth } from "@/firebase/firebase";

export type OcrApiResponse = {
  success?: boolean;
  texts?: string[];
  full_text?: string;
  image_base64?: string;
  error?: string;
  error_type?: string;
};

export async function requestOcrByUrl(
  endpointUrl: string,
  file: File,
  lang: string,
  opts?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<OcrApiResponse> {
  const controller = new AbortController();
  const timeoutMs = opts?.timeoutMs ?? 60_000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const signal = mergeAbortSignals(opts?.signal, controller.signal);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lang", lang);

    const user = auth.currentUser;
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

    return (await res.json()) as OcrApiResponse;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function mergeAbortSignals(a?: AbortSignal, b?: AbortSignal) {
  if (!a) return b;
  if (!b) return a;

  const controller = new AbortController();
  const onAbort = () => controller.abort();

  if (a.aborted || b.aborted) {
    controller.abort();
    return controller.signal;
  }

  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });

  return controller.signal;
}
