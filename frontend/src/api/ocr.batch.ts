import { auth } from "@/firebase/firebase";
import type { CropMetadata } from "./ocr.preprocess";

export const OCR_REGION_IDS = ["name", "cost", "main_1", "main_2", "sub_1", "sub_2", "sub_3", "sub_4", "sub_5"] as const;
export type OcrRegionId = typeof OCR_REGION_IDS[number];
export type OcrRegionResult = { id: OcrRegionId; success: boolean; texts: string[]; error?: string };

export async function requestOcrBatch(file: File, metadata: CropMetadata, lang: string, signal: AbortSignal): Promise<OcrRegionResult[]> {
  const gateway = import.meta.env.VITE_GATEWAY_URL;
  if (!gateway) throw new Error("OCR 서버 주소가 설정되지 않았습니다.");
  if (metadata.bands.length !== 9 || metadata.bands.some((band, i) => band.index !== i - 2)) {
    throw new Error("9개 영역으로 자른 이미지가 필요합니다.");
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.throwIfAborted();
  signal.addEventListener("abort", abort, { once: true });
  const timer = window.setTimeout(abort, 190_000);
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(file);
    const form = new FormData();
    form.append("lang", lang);
    for (const [i, band] of metadata.bands.entries()) {
      controller.signal.throwIfAborted();
      const canvas = new OffscreenCanvas(metadata.width - 32, band.bottom - band.top);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("이미지 분할에 실패했습니다.");
      context.drawImage(bitmap, 16, band.top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      form.append("files", await canvas.convertToBlob({ type: "image/png" }), `${OCR_REGION_IDS[i]}.png`);
    }
    bitmap.close();
    bitmap = undefined;
    const token = await auth?.currentUser?.getIdToken();
    const response = await fetch(`${gateway.replace(/\/$/, "")}/api/ocr/batch`, {
      method: "POST", body: form, signal: controller.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok) throw new Error(`OCR 서버 오류 (${response.status})`);
    const data = await response.json() as { success?: boolean; regions?: OcrRegionResult[]; error?: string };
    if (!data.success || !Array.isArray(data.regions) || data.regions.length !== 9) throw new Error(data.error || "OCR 응답 형식이 올바르지 않습니다.");
    return OCR_REGION_IDS.map(id => {
      const matches = data.regions!.filter(region => region.id === id);
      if (matches.length !== 1 || typeof matches[0].success !== "boolean" || !Array.isArray(matches[0].texts) || !matches[0].texts.every(text => typeof text === "string")) {
        throw new Error("OCR 응답의 영역 정보가 올바르지 않습니다.");
      }
      return matches[0];
    });
  } catch (error) {
    if (controller.signal.aborted && !signal.aborted) throw new Error("OCR 요청 시간이 초과되었습니다.");
    throw error;
  } finally {
    bitmap?.close();
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}
