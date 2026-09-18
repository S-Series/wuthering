import { fuzzy } from "fast-fuzzy";

import { ECHO_CANDIDATES, echoDict, type EchoId } from "@/datas/echos";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { FixedStats, type StatId } from "@/datas/stats";
import type { LangType } from "@/stores/appStore";
import type { OcrRegionResult } from "./ocr.batch";
import { resolveMatchedStat, type LocalMatches } from "./ocr.match";

const normalize = (text: string) => text.normalize("NFKC").replace(/[\s·.%+]/g, "").toLowerCase();
const baseStatId = (id: string) => id.replace(/Pct$/, "");

function matchEchoName(text: string, lang: LangType, cost: 1 | 3 | 4 | null) {
  const query = normalize(text.replace(/\+\s*\d+\b/g, ""));
  if (!query) return null;
  const candidates = ECHO_CANDIDATES[lang]
    .filter(candidate => !cost || Object.hasOwn(echoDict[`Cost${cost}`], candidate.echoId))
    .map(candidate => ({ ...candidate, score: fuzzy(query, normalize(candidate.text), { useSellers: false }) }))
    .sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return best && best.score >= 0.7 && best.score - (candidates[1]?.score ?? 0) >= 0.04 ? best : null;
}

function matchStatLabel(texts: string[], lang: LangType, index: number) {
  const query = normalize(texts.join(" ").replace(/[\d.,%+-]/g, ""));
  if (!query) return null;
  const candidates = Object.values(FixedStats)
    .filter(stat => stat.id !== "dummy" && !stat.id.endsWith("Pct")
      && (index < 2 ? stat.ValueMain.some(Boolean) || ["atk", "hp", "def"].includes(stat.id) : stat.ValueSub.length > 0))
    .map(stat => ({ id: stat.id, score: fuzzy(query, normalize(stat[lang]), { useSellers: false }) }))
    .sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return best && best.score >= 0.75 && best.score - (candidates[1]?.score ?? 0) >= 0.08 ? best : null;
}

export function resolveBatchOcr(regions: OcrRegionResult[], matches: LocalMatches | null, lang: LangType) {
  const nameText = regions[0]?.success ? regions[0].texts.join(" ") : "";
  const costText = regions[1]?.success ? regions[1].texts.join(" ").normalize("NFKC") : "";
  const costDigit = costText.match(/cost\s*[:·]?\s*([134])\b/i)?.[1]
    ?? costText.match(/\b([134])\b/)?.[1];
  const recognizedCost = costDigit ? Number(costDigit) as 1 | 3 | 4 : null;
  const echo = matchEchoName(nameText, lang, recognizedCost);
  const echoId: EchoId | null = echo?.echoId ?? null;
  const cost: 1 | 3 | 4 = recognizedCost
    ?? (echoId && Object.hasOwn(echoDict.Cost1, echoId) ? 1
      : echoId && Object.hasOwn(echoDict.Cost3, echoId) ? 3 : 4);
  const matchedHarmony = matches?.harmony;
  const candidateSet = matchedHarmony && Object.hasOwn(harmony, matchedHarmony.id)
    ? matchedHarmony.id as HarmonyId : null;
  const echoData = echoId ? echoDict[`Cost${cost}`][echoId as keyof typeof echoDict[`Cost${cost}`]] : null;
  const setId = candidateSet && (!echoData || (echoData.type as readonly string[]).includes(candidateSet))
    ? candidateSet : null;

  const echoStats: [StatId, number][] = Array.from({ length: 7 }, (_, index) => {
    const region = regions[index + 2];
    if (!region?.success) return ["dummy", 0];
    const imageMatch = matches?.rows.find(row => row.index === index)?.match ?? null;
    const labelMatch = matchStatLabel(region.texts, lang, index);
    if (imageMatch && labelMatch && baseStatId(imageMatch.id) !== baseStatId(labelMatch.id)) {
      return ["dummy", 0];
    }
    const candidate = imageMatch ?? labelMatch;
    const resolved = resolveMatchedStat(candidate, region, index);
    if (index === 0 && resolved && !["atk", "hp", "def"].includes(resolved.id)) {
      const costIndex = cost === 4 ? 0 : cost === 3 ? 1 : 2;
      const expected = FixedStats[resolved.id].ValueMain[costIndex];
      if (!expected || Math.abs(expected - resolved.value) >= 0.001) return ["dummy", 0];
    }
    return resolved ? [resolved.id, resolved.value] : ["dummy", 0];
  });

  return { echoId, echoName: echo?.text ?? null, cost, setId, echoStats };
}
