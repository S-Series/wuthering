import { OCR_REGION_IDS, type OcrRegionId, type OcrRegionResult } from "./ocr.regions";
import { fuzzy } from "fast-fuzzy";
import { FixedStats } from "@/datas/stats";

export type CrosscheckStatus = "agree" | "conflict" | "partial" | "missing";
export type OcrCrosscheck = {
  id: OcrRegionId;
  status: CrosscheckStatus;
  textAgreement: boolean | null;
  valueAgreement: boolean | null;
  backendStatId: string | null;
  browserStatId: string | null;
};
const normalize = (text: string) => text.normalize("NFKC").toLowerCase().replace(/\s+/g, "").replace(/[·]/g, "");
const content = (region?: OcrRegionResult) => region?.success ? region.texts.join(" ").trim() : "";

const aliases: Record<string, string[]> = {
  atk: ["Attack", "ATK"], def: ["Defense", "DEF"],
  critRate: ["Crit. Rate"], critDmg: ["Crit. DMG"],
  resonanceBns: ["Energy Regen", "Energy Regeneration"],
  skillBns: ["Resonance Skill DMG Bonus"],
  liberationBns: ["Resonance Liberation DMG Bonus"],
  healBns: ["Healing Bonus"],
};
const normalizeLabel = (text: string) => normalize(text).replace(/[\d.,%+\-:]/g, "");

function statKind(text: string, id: OcrRegionId): string | null {
  const query = normalizeLabel(text);
  if (!query) return null;
  const candidates = Object.values(FixedStats)
    .filter(stat => stat.id !== "dummy" && !stat.id.endsWith("Pct")
      && (!id.startsWith("sub_") || stat.ValueSub.length > 0))
    .map(stat => ({
      id: stat.id,
      score: Math.max(...[stat.kr, stat.en, stat.jp, stat.zh, ...(aliases[stat.id] ?? [])]
        .filter(Boolean).map(label => fuzzy(query, normalizeLabel(label), { useSellers: false }))),
    }))
    .sort((left, right) => right.score - left.score);
  const best = candidates[0];
  return best && best.score >= 0.75 && best.score - (candidates[1]?.score ?? 0) >= 0.08 ? best.id : null;
}

function statValue(text: string) {
  const match = text.normalize("NFKC").match(/^(.*?)\s*([+-]?\d+(?:[.,]\d+)?)\s*(%)?\s*$/);
  if (!match) return null;
  const value = Number(match[2].replace(",", "."));
  return Number.isFinite(value) ? { label: normalize(match[1]), value, percent: !!match[3] } : null;
}
function costValue(text: string) {
  const normalized = text.normalize("NFKC");
  return normalized.match(/cost\s*[:·]?\s*([134])\b/i)?.[1]
    ?? normalized.match(/^\s*([134])\s*$/)?.[1] ?? null;
}

export function crosscheckOcrRegions(backend: OcrRegionResult[], browser: OcrRegionResult[]): OcrCrosscheck[] {
  return OCR_REGION_IDS.map(id => {
    const server = content(backend.find(region => region.id === id));
    const client = content(browser.find(region => region.id === id));
    const isStat = id !== "name" && id !== "cost";
    const backendStatId = isStat ? statKind(server, id) : null;
    const browserStatId = isStat ? statKind(client, id) : null;
    if (!server || !client) return { id, status: server || client ? "partial" : "missing", textAgreement: null, valueAgreement: null, backendStatId, browserStatId };
    let textAgreement: boolean | null = null;
    let valueAgreement: boolean | null = null;
    if (id === "name") {
      textAgreement = normalize(server) === normalize(client);
    } else if (id === "cost") {
      const left = costValue(server), right = costValue(client);
      if (left && right) valueAgreement = left === right;
    } else {
      if (backendStatId && browserStatId) textAgreement = backendStatId === browserStatId;
      const left = statValue(server), right = statValue(client);
      if (left && right) {
        valueAgreement = Math.abs(left.value - right.value) < 0.001 && left.percent === right.percent;
      }
    }
    // Numeric recognition is diagnostic only; stat identity drives verification.
    const comparisons = id === "cost" ? [valueAgreement] : [textAgreement];
    const status = comparisons.some(value => value === false) ? "conflict"
      : comparisons.every(value => value === true) ? "agree" : "partial";
    return { id, status, textAgreement, valueAgreement, backendStatId, browserStatId };
  });
}
