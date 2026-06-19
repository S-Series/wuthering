import { search as fuzzySearch } from "fast-fuzzy";

import type { OcrApiResponse } from "@/api/ocr.api";
import { FixedStats, type StatId } from "@/datas/stats";
import type { LangType } from "@/stores/appStore";
import { ECHO_CANDIDATES, echoDict, type EchoData, type EchoId } from "@/datas/echos";
import type { Cost } from "@/components/features/Card/EchoSelect.type";

const RETOUCH_LIST:Record<LangType, [RegExp, string][]> = {
  kr: [
    [/라어용|라어움|라어요|라어워|라어운|라o운|라워|라어음|늘어워/g, "방어력"],
    [/H위프|H위lI프|H위표|피혜|피해프|H위l표|H위표|H위I프/g, "피해"],
    [/룡푸음운/g, "공명 효율"],
    [/음운|옮운/g, "공명"],
    [/룡우/g, "효율"],
    [/ㄱ릉|균릉|눈운공릉|눈운릉/g, "일반"],
    [/유우|음우/g, "해방"],
    [/H위l프룸콩/g, "인멸피해"],
  ],
  jp: [

  ],
  en: [

  ],
  zh: [

  ],
};

export function ocrImageBase64ToDataUrl(b64?: string) {
  if (!b64) return null;
  return `data:image/jpeg;base64,${b64}`;
}

export function normalizeOcrTexts(res: OcrApiResponse): string[] {
  return Array.isArray(res.texts) ? res.texts : [];
}

export function retouchOcrTexts(texts: string[], lang: LangType) {
  console.log(texts);

  const rules = RETOUCH_LIST[lang] ?? []

  const retouched = texts.map((item) => {
    let s = (item ?? "").toString();
    for (const [pattern, replacement] of rules) {
      s = s.replace(pattern, replacement);
    }
    s = s.trim();
    return s;
  }).filter((item) => !item.includes("+") && !item.includes("25"));

  const indexes: number[] = [0];
  for(let i = 0; i < retouched.length; i++) {
    const current = retouched[i];
    if (current.toLowerCase().includes("cost")) indexes.push(i);
    if (/^[-+]?\d+(\.\d+)?%?$/.test(current)) indexes.push(i + 1);
  }
  indexes.push(retouched.length);

  const joined = [];
  for (let i = 0; i < indexes.length; i++) {
    joined.push(retouched.slice(indexes[i], indexes[i + 1]));
  }

  console.log(joined);

  return joined;
}

export function textsToStats(texts: string[][], lang: LangType):{
  echoId: EchoId | null,
  echoName: string | null,
  cost: number,
  echoStats: [StatId, number][]
} {
  const data = texts;
  const filtered = data.filter((item) => (item.length > 0));
  const merged = filtered.map((item) => {
    const head = item.slice(0,-1).join("");
    const tail = item[item.length - 1];
    return [head, tail];
  })
  console.log(data);
  console.log(filtered);
  console.log(merged);
  const startIdx:number = merged.findIndex((item) => item[0].toLowerCase().includes("cost"))
  if (startIdx === -1)
    return {
      echoId: null,
      echoName: null,
      cost: 1,
      echoStats: [
        [FixedStats.dummy.id, 0 ],
        [FixedStats.dummy.id, 0 ],
        [FixedStats.dummy.id, 0 ],
        [FixedStats.dummy.id, 0 ],
        [FixedStats.dummy.id, 0 ],
        [FixedStats.dummy.id, 0 ],
      ],
    };

  const head = merged.slice(0, startIdx).flat();
  const body = merged[startIdx];
  const temp = merged.slice(startIdx + 1, merged.length);

  const candidates: { id: StatId; text: string }[] = Object.values(
    FixedStats
  ).map((item) => ({
    id: item.id,
    text: item[lang],
  }));

  const textToId = new Map(candidates.map((c) => [c.text, c.id]));
  const candidateTexts = candidates.map((c) => c.text);
  
  const tail: [StatId, string][] = [];
  for (const [label, value] of temp) {
    const bestText = fuzzySearch(label, candidateTexts)[0];
    const statId = textToId.get(bestText) ?? FixedStats.dummy.id;

    if (statId === FixedStats.dummy.id) continue;
    tail.push([statId, value]);
  }
  const echoCandidates = ECHO_CANDIDATES[lang];
  const bestEcho = fuzzySearch(
    head.join(""),
    echoCandidates.map((c) => c.text)
  );
  console.log("E: ", bestEcho);
  console.log("B: ", body)
  console.log("T: ", tail)

  const tempCost = (/\d/.test(body[0])
      ? Number(body[0].replace(/\D/g, ""))
      : Number(body.join("").replace(/\D/g, "")));

  const safeCost: Cost = (() => {
    switch (tempCost){
      case 4: return 4;
      case 3: return 3;
      case 2: return 1;
      case 1: return 1;
      default: {
        if (bestEcho.length === 0) return 4;

        const echoId = ECHO_CANDIDATES[lang].find(item => item.text === bestEcho[0])?.echoId ?? null
        if (!echoId) return 4;

        if (Object.entries(echoDict.Cost4).some(([id, _]) => id === echoId)) return 4;
        if (Object.entries(echoDict.Cost3).some(([id, _]) => id === echoId)) return 3;
        if (Object.entries(echoDict.Cost1).some(([id, _]) => id === echoId)) return 1;
        return 4;
      }
    }
  })()

  return {
    echoId: bestEcho.length < 1 ? null : echoCandidates.find((c) => c.text === bestEcho[0])?.echoId as EchoId,
    echoName: bestEcho.length < 1 ? null : bestEcho[0],
    cost: safeCost,
    echoStats: tail.map(([statId, valueText]): [StatId, number] => [
      (() => {
        if (valueText.includes("%")) {
          if (
            ["atk", "hp", "def"].some((keyword) => 
              statId.toString().toLocaleLowerCase().includes(keyword)
            )
          ) {
            switch(statId) {
              case FixedStats.hp.id: return FixedStats.hpPct.id;
              case FixedStats.atk.id: return FixedStats.atkPct.id;
              case FixedStats.def.id: return FixedStats.defPct.id;
            }
          }
        }
        return statId;
      })(),
      valueText.includes("%")
        ? Number(valueText.replace(/\D/g, "")) / 10
        : Number(valueText.replace(/\D/g, "")),
    ]),
  };
}

export type OcrHealthItem = {
  lang: string;
  ok: boolean;
  status?: number;
  upstream: string;
  error?: string;
  detail?: string;
};

export type OcrHealthResponse = {
  ok: boolean;
  results: OcrHealthItem[];
};

export async function checkOcrHealth(): Promise<OcrHealthResponse> {
  const response = await fetch(`${import.meta.env.VITE_GATEWAY_URL}/health/ocr`);

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 200)}`);
  }

  const data = JSON.parse(text) as OcrHealthResponse;

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status} / ${text}`);
  }

  return data;
}

export async function checkOcrHealthByLang(targetLang: string) {
  const data = await checkOcrHealth();
  return data.results.find((item) => item.lang === targetLang) ?? null;
}

export type OcrWakeResponse = {
  ok: boolean;
  lang: string;
  status?: number;
  upstream?: string;
  error?: string;
  detail?: string;
  result?: unknown;
};

export async function wakeOcrByLang(
  targetLang: string,
  opts?: { timeoutMs?: number },
): Promise<OcrWakeResponse> {
  const controller = new AbortController();
  const timeoutMs = opts?.timeoutMs ?? 180_000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const url = new URL(`${import.meta.env.VITE_GATEWAY_URL}/api/ocr/wake`);

  url.searchParams.set("lang", targetLang);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();

    if (!contentType.includes("application/json")) {
      throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 200)}`);
    }

    const data = JSON.parse(text) as OcrWakeResponse;

    if (!response.ok) {
      throw new Error(`OCR wake failed: ${response.status} / ${text}`);
    }

    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
