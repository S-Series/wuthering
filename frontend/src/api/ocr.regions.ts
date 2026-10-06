import type { CropMetadata } from "./ocr.preprocess";

export const OCR_REGION_IDS = ["name", "cost", "main_1", "main_2", "sub_1", "sub_2", "sub_3", "sub_4", "sub_5"] as const;
export type OcrRegionId = typeof OCR_REGION_IDS[number];
export type OcrRegionResult = { id: OcrRegionId; success: boolean; texts: string[]; error?: string;
  confidence?: number; tokens?: { text: string; confidence: number }[];
  processed_image_base64?: string | null; raw?: OcrRegionResult | null };
export type OcrRegionImage = { id: OcrRegionId; blob: Blob };

export async function createOcrRegionImages(file: File, metadata: CropMetadata, signal: AbortSignal): Promise<OcrRegionImage[]> {
  signal.throwIfAborted();
  if (metadata.width <= 32 || metadata.bands.length !== 9
    || metadata.bands.some((band, i) => band.index !== i - 2 || band.bottom <= band.top)) {
    throw new Error("9개 영역으로 자른 이미지가 필요합니다.");
  }
  const bitmap = await createImageBitmap(file);
  try {
    const images: OcrRegionImage[] = [];
    for (const [i, band] of metadata.bands.entries()) {
      signal.throwIfAborted();
      // OCR keeps the complete row, including its numeric value and percent sign.
      const width = metadata.width - 32;
      const height = band.bottom - band.top;
      const scale = i < 2 ? 1 : Math.min(3, Math.max(1, 64 / height));
      const padding = i < 2 ? 0 : 16;
      const scaledWidth = Math.round(width * scale), scaledHeight = Math.round(height * scale);
      const canvas = new OffscreenCanvas(scaledWidth + padding * 2, scaledHeight + padding * 2);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("이미지 분할에 실패했습니다.");
      context.fillStyle = "#14181e";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 16, band.top, width, height, padding, padding, scaledWidth, scaledHeight);
      images.push({ id: OCR_REGION_IDS[i], blob: await canvas.convertToBlob({ type: "image/png" }) });
    }
    signal.throwIfAborted();
    return images;
  } finally {
    bitmap.close();
  }
}
