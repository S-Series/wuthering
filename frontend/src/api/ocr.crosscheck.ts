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
  rawStatId: string | null;
  rawConfidence: number | null;
  selectedStatId: string | null;
  selectedSource: "backend" | "backend_raw" | "browser" | "both" | null;
  backendConfidence: number | null;
  browserConfidence: number | null;
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

function confidence(region: OcrRegionResult | undefined, browser: boolean): number | null {
  if (!region?.success) return null;
  if (browser) return Number.isFinite(region.confidence) && region.confidence! >= 0 && region.confidence! <= 100
    ? region.confidence! / 100 : null;
  // Prefer label tokens: numerical recognition is not the stat-kind signal.
  const tokens = region.tokens?.filter(token => normalizeLabel(token.text)
    && Number.isFinite(token.confidence) && token.confidence >= 0 && token.confidence <= 1) ?? [];
  return tokens.length ? tokens.reduce((sum, token) => sum + token.confidence, 0) / tokens.length : null;
}

function selectStat(candidates: { id: string | null; source: "backend" | "backend_raw" | "browser"; confidence: number | null }[]) {
  const valid = candidates.filter(candidate => candidate.id !== null);
  if (valid.length && valid.every(candidate => candidate.id === valid[0].id)) {
    return { selectedStatId: valid[0].id, selectedSource: valid.length > 1 ? "both" as const : valid[0].source };
  }
  if (valid.length && valid.every(candidate => candidate.confidence !== null)) {
    valid.sort((a, b) => b.confidence! - a.confidence!);
    const best = valid[0];
    if (!valid.some(candidate => candidate.confidence === best.confidence && candidate.id !== best.id)) {
      return { selectedStatId: best.id, selectedSource: best.source };
    }
  }
  return { selectedStatId: null, selectedSource: null };
}

export function crosscheckOcrRegions(backend: OcrRegionResult[], browser: OcrRegionResult[]): OcrCrosscheck[] {
  return OCR_REGION_IDS.map(id => {
    const serverRegion = backend.find(region => region.id === id);
    const clientRegion = browser.find(region => region.id === id);
    const server = content(serverRegion);
    const client = content(clientRegion);
    const isStat = id !== "name" && id !== "cost";
    const backendStatId = isStat ? statKind(server, id) : null;
    const browserStatId = isStat ? statKind(client, id) : null;
    const backendConfidence = confidence(serverRegion, false);
    const browserConfidence = confidence(clientRegion, true);
    const rawStatId = isStat ? statKind(content(serverRegion?.raw ?? undefined), id) : null;
    const rawConfidence = confidence(serverRegion?.raw ?? undefined, false);
    const selection = { ...selectStat([
      { id: backendStatId, source: "backend", confidence: backendConfidence },
      { id: rawStatId, source: "backend_raw", confidence: rawConfidence },
      { id: browserStatId, source: "browser", confidence: browserConfidence },
    ]), backendConfidence, browserConfidence, rawStatId, rawConfidence };
    if (!server || !client) return { id, status: server || client ? "partial" : "missing", textAgreement: null, valueAgreement: null, backendStatId, browserStatId, ...selection };
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
    return { id, status, textAgreement, valueAgreement, backendStatId, browserStatId, ...selection };
  });
}
