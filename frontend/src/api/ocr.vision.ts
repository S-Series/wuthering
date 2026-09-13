import { fuzzy } from "fast-fuzzy";
import { FixedStats, type StatId } from "@/datas/stats";
import { ECHO_CANDIDATES, echoDict, type EchoId } from "@/datas/echos";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import type { LangType } from "@/stores/appStore";

export type VisionResponse = {
  version: 1;
  header: string[];
  rows: {
    index: number;
    tokens: { text: string; confidence: number }[];
    imageMatch: { statId: string; similarity: number } | null;
  }[];
  harmony: { setId: string; similarity: number } | null;
};

const normalize = (text: string) => text.normalize("NFKC").replace(/[\s·.%+]/g, "").toLowerCase();
const aliases: Partial<Record<StatId, string[]>> = {
  critRate: ["Crit. Rate"], critDmg: ["Crit. DMG"],
  atk: ["ATK"], def: ["DEF", "라어용", "라어움", "늘어워"],
  skillBns: ["Resonance Skill DMG Bonus"],
  liberationBns: ["Resonance Liberation DMG Bonus"],
};
const baseStat = (id: string) => id.replace(/Pct$/, "");
const percentStat = (id: string, percent: boolean): string =>
  ["atk", "hp", "def"].includes(baseStat(id)) ? baseStat(id) + (percent ? "Pct" : "") : id;
const isStatId = (id: string): id is StatId => Object.hasOwn(FixedStats, id);

function parseRow(row: VisionResponse["rows"][number], lang: LangType): [StatId, number] {
  const empty: [StatId, number] = ["dummy", 0];
  const text = row.tokens.map(token => token.text).join(" ").normalize("NFKC");
  const match = text.match(/^(.*?)\s*([+-]?\d+(?:[.,]\d+)?)\s*(%)?\s*$/);
  if (!match) return empty;
  const label = normalize(match[1]);
  const value = Number(match[2].replace(",", "."));
  const percent = !!match[3];
  if (!Number.isFinite(value) || value <= 0) return empty;
  if (row.tokens.some(token => /\d/.test(token.text) && token.confidence < 0.60)) return empty;
  const candidates = Object.values(FixedStats).filter(stat => stat.id !== "dummy"
    && percentStat(stat.id, percent) === stat.id
    && (percent || ["atk", "def", "hp"].includes(stat.id)))
    .map(stat => ({
      id: stat.id,
      score: Math.max(...[stat[lang], ...(aliases[baseStat(stat.id) as StatId] ?? [])]
        .map(name => fuzzy(label, normalize(name), { useSellers: false }))),
    })).sort((a, b) => b.score - a.score);
  const best = candidates[0];
  let id: string | undefined = best && best.score >= 0.78
    && best.score - (candidates[1]?.score ?? 0) >= 0.08 ? best.id : undefined;
  const visual = row.imageMatch;
  if (visual && visual.similarity >= 0.80) {
    const visualId = percentStat(visual.statId, percent);
    if (id && id !== visualId) return empty;
    if (!id) id = visualId;
  }
  if (!id || !isStatId(id)) return empty;
  if (row.index >= 2 && !FixedStats[id].ValueSub.some(allowed => Math.abs(allowed - value) < 0.001)) return empty;
  return [id, value];
}

export function parseVisionResponse(vision: VisionResponse, lang: LangType) {
  const header = vision.header.join(" ");
  const costText = header.match(/cost\s*([134])\b/i)?.[1];
  const cost: 1 | 3 | 4 = costText === "1" ? 1 : costText === "3" ? 3 : 4;
  const name = header.split(/cost/i)[0].replace(/\+\s*\d+/g, "").trim();
  const echoes = ECHO_CANDIDATES[lang].map(candidate => ({ ...candidate,
    score: fuzzy(normalize(name), normalize(candidate.text), { useSellers: false }),
  })).sort((a, b) => b.score - a.score);
  const best = echoes[0];
  let echoId: EchoId | null = name && best?.score >= 0.82
    && best.score - (echoes[1]?.score ?? 0) >= 0.06 ? best.echoId : null;
  const costDict = echoDict[`Cost${cost}`];
  if (costText && echoId && !Object.hasOwn(costDict, echoId)) echoId = null;
  let resolvedCost = cost;
  if (!costText && echoId) {
    resolvedCost = Object.hasOwn(echoDict.Cost1, echoId) ? 1 : Object.hasOwn(echoDict.Cost3, echoId) ? 3 : 4;
  }
  const set = vision.harmony;
  let setId: HarmonyId | null = set && set.similarity >= 0.80 && Object.hasOwn(harmony, set.setId)
    ? set.setId as HarmonyId : null;
  const echo = Object.entries(echoDict[`Cost${resolvedCost}`]).find(([id]) => id === echoId)?.[1];
  if (echo && setId && !(echo.type as readonly string[]).includes(setId)) setId = null;
  const echoStats: [StatId, number][] = Array.from({ length: 7 }, (_, index) => {
    const row = vision.rows.find(item => item.index === index);
    return row ? parseRow(row, lang) : ["dummy", 0];
  });
  return { echoId, echoName: echoId ? best.text : null, cost: resolvedCost, setId, echoStats };
}
