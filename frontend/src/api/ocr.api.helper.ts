import { search as fuzzySearch } from "fast-fuzzy";

import type { OcrApiResponse } from "@/api/ocr.api";
import { FixedStats, type StatId } from "@/datas/stats";
import type { LangType } from "@/stores/appStore";
import { ECHO_CANDIDATES, type EchoId } from "@/datas/echos";

const RETOUCH_LIST:Record<LangType, [RegExp, string][]> = {
  kr: [
    [/라어용|라어움|라어요|라어워|라어운|라o운|라워/g, "방어력"],
    [/H위프|H위lI프|H위표|피혜|피해프|H위l표/g, "피해"],
    [/룡푸음운/g, "공명 효율"],
    [/음운/g, "공명"],
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
  const rules = RETOUCH_LIST[lang] ?? []
  const retouched = texts.map((item) => {
    let s = (item ?? "").toString();
    for (const [pattern, replacement] of rules) {
      s = s.replace(pattern, replacement);
    }
    s = s.trim();
    return s;
  })

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

  console.log(textsToStats(joined, lang));
  
  return joined;
}

export function textsToStats(texts: string[][], lang: LangType):{
  echoId: EchoId | null,
  echoName: string | null,
  cost: number,
  echoStats: [StatId, number][]
} {
  const data = texts;
  const filtered = data.filter((item) => (item.length > 1));
  const merged = filtered.map((item) => {
    const head = item.slice(0,-1).join("");
    const tail = item[item.length - 1];
    return [head, tail];
  })
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
    console.log(bestText);
    const statId = textToId.get(bestText) ?? FixedStats.dummy.id;

    if (statId === FixedStats.dummy.id) continue;
    tail.push([statId, value]);
  }
  const echoCandidates = ECHO_CANDIDATES[lang];
  const bestEcho = fuzzySearch(
    head.join(""),
    echoCandidates.map((c) => c.text)
  );
  console.log(bestEcho);
  console.log(tail)

  return {
    echoId: null,
    echoName: null,
    cost: Number(body.join("").replace(/\D/g, "")) ?? 1,
    echoStats: tail.map(([statId, valueText]): [StatId, number] => [
      (() => {
        console.log("console: ", statId, valueText);
        console.log(
          statId,
          ["atk", "hp", "def"].some((keyword) => 
            statId.toString().toLocaleLowerCase().includes(keyword)
          )
        );
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
