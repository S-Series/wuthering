import cvUrl from "@techstark/opencv-js/dist/opencv.js?url";
import { FixedStats, type StatId } from "@/datas/stats";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import type { CropMetadata } from "./ocr.preprocess";
import type { OcrRegionResult } from "./ocr.batch";

export type ImageMatch = { id: string; score: number };
export type LocalMatches = { rows: { index: number; match: ImageMatch | null }[]; harmony: ImageMatch | null };
export const harmonyName = (id: string) => Object.hasOwn(harmony, id) ? harmony[id as HarmonyId].kr : id;
export const statName = (id: string) => Object.hasOwn(FixedStats, id) ? FixedStats[id as StatId].kr : id;

export function matchOcrImages(file: File, metadata: CropMetadata, lang: string, signal: AbortSignal): Promise<LocalMatches> {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const base = new URL(import.meta.env.BASE_URL, location.href);
    const worker = new Worker(new URL("ocr/match.worker.js", base));
    const cleanup = () => { worker.terminate(); clearTimeout(timer); signal.removeEventListener("abort", abort); };
    const abort = () => { cleanup(); reject(new DOMException("Aborted", "AbortError")); };
    const timer = window.setTimeout(() => { cleanup(); reject(new Error("이미지 비교 시간이 초과되었습니다.")); }, 45_000);
    signal.addEventListener("abort", abort, { once: true });
    worker.onerror = () => { cleanup(); reject(new Error("이미지 비교기를 실행하지 못했습니다.")); };
    worker.onmessage = (event: MessageEvent<LocalMatches & { error?: string }>) => {
      cleanup();
      if (event.data.error) reject(new Error(event.data.error));
      else resolve(event.data);
    };
    const stats = lang === "kr" ? Object.keys(FixedStats).filter(id => !id.endsWith("Pct") && !["dummy", "typeBns"].includes(id)) : [];
    worker.postMessage({ file, metadata, cvUrl: new URL(cvUrl, location.href).href,
      stats: stats.map(id => ({ id, url: new URL(`ocr/kr/${id}.png`, base).href })),
      harmonies: Object.keys(harmony).map(id => ({ id, url: new URL(`ico/harmony/${id}.png`, base).href })),
    });
  });
}

export function resolveMatchedStat(match: ImageMatch | null, ocr: OcrRegionResult | undefined, index: number) {
  if (!match || !ocr?.success) return null;
  const numbers = ocr.texts.flatMap(text => [...text.normalize("NFKC").matchAll(/\d+(?:[.,]\d+)?\s*%?/g)].map(item => item[0].replace(/\s/g, "")));
  if (numbers.length !== 1) return null;
  const raw = numbers[0], percent = raw.endsWith("%");
  const id = ["hp", "atk", "def"].includes(match.id) && percent ? `${match.id}Pct` : match.id;
  if (!Object.hasOwn(FixedStats, id)) return null;
  const stat = FixedStats[id as StatId], value = Number(raw.replace("%", "").replace(",", "."));
  const allowed: readonly number[] = index >= 2 ? stat.ValueSub : stat.ValueMain;
  const candidates = [value];
  if (percent && !/[.,]/.test(raw)) candidates.push(value / 10);
  const valid = candidates.filter(candidate => candidate > 0 && allowed.some(n => Math.abs(candidate-n) < 0.001));
  if (index < 2 && ["atk", "hp", "def"].includes(id) && !percent && value > 0) return { id, value, corrected: false };
  if (valid.length !== 1) return null;
  return { id, value: valid[0], corrected: valid[0] !== value };
}
