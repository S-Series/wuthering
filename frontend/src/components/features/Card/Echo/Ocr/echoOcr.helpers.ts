import { requestOcrBatch } from "@/api/ocr.batch";
import { resolveBatchOcr } from "@/api/ocr.batch.resolve";
import { matchOcrImages } from "@/api/ocr.match";
import { prepareOcrImage } from "@/api/ocr.preprocess";
import { recognizeBrowserOcr } from "@/api/ocr.browser";
import { FixedStats } from "@/datas/stats";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import type { LangType } from "@/stores/appStore";

import type { EchoOcrResult } from "./EchoOcrPanel";

export async function recognizeEchoImage(
  file: File,
  lang: LangType,
  signal: AbortSignal,
): Promise<EchoOcrResult> {
  const prepared = await prepareOcrImage(file, signal, { splitHeader: true });
  signal.throwIfAborted();

  const [backend, browser, vision] = await Promise.allSettled([
    requestOcrBatch(prepared.file, prepared.metadata, lang, signal, { compareRaw: true }),
    recognizeBrowserOcr(prepared.file, prepared.metadata, lang, signal),
    matchOcrImages(prepared.file, prepared.metadata, lang, signal).catch(
      (error: unknown) => {
        if (signal.aborted) throw error;
        console.warn("OCR image comparison failed", error);
        return null;
      },
    ),
  ]);

  signal.throwIfAborted();
  const regions = backend.status === "fulfilled" ? backend.value : [];
  const browserRegions = browser.status === "fulfilled" ? browser.value : [];
  const matches = vision.status === "fulfilled" ? vision.value : null;
  for (const outcome of [backend, browser, vision]) {
    if (outcome.status === "rejected") console.warn("OCR source failed; retaining other results", outcome.reason);
  }
  const result = resolveBatchOcr(regions, matches, lang, browserRegions);
  if (!result.echoId && result.echoStats.every(([id]) => id === "dummy")) {
    console.warn("OCR texts could not be resolved", { regions, matches, lang });
    throw new Error("OCR 텍스트에서 에코와 옵션을 확정하지 못했습니다. 사이트 언어와 게임 언어가 같은지 확인해 주세요.");
  }
  return result;
}

export function echoOcrResultToRuntime(result: EchoOcrResult): EchoRuntime {
  const hasFullEchoRows = result.echoStats.length > 5;
  const subStats = hasFullEchoRows
    ? result.echoStats.slice(2, 7)
    : result.echoStats.slice(0, 5);

  return {
    echoId: result.echoId,
    setId: result.setId ?? null,
    cost: result.cost as EchoRuntime["cost"],
    mainOption: {
      statId: hasFullEchoRows
        ? result.echoStats[0]?.[0] ?? FixedStats.dummy.id
        : FixedStats.dummy.id,
      statValue: hasFullEchoRows ? result.echoStats[0]?.[1] ?? 0 : 0,
    },
    subOptions: Array.from({ length: 5 }, (_, index) => ({
      statId: subStats[index]?.[0] ?? FixedStats.dummy.id,
      statValue: subStats[index]?.[1] ?? 0,
    })) as EchoRuntime["subOptions"],
  };
}
