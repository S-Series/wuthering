import { requestOcrBatch } from "@/api/ocr.batch";
import { resolveBatchOcr } from "@/api/ocr.batch.resolve";
import { matchOcrImages } from "@/api/ocr.match";
import { prepareOcrImage } from "@/api/ocr.preprocess";
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

  const [regions, matches] = await Promise.all([
    requestOcrBatch(prepared.file, prepared.metadata, lang, signal),
    matchOcrImages(prepared.file, prepared.metadata, lang, signal).catch(
      (error: unknown) => {
        if (signal.aborted) throw error;
        console.warn("OCR image comparison failed", error);
        return null;
      },
    ),
  ]);

  if (regions.every((region) => !region.success)) {
    throw new Error("모든 영역의 OCR 인식에 실패했습니다.");
  }

  return resolveBatchOcr(regions, matches, lang);
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
