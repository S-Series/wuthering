import { OCR_REGION_IDS, type OcrRegionId, type OcrRegionResult } from "./ocr.regions";
import { fuzzy } from "fast-fuzzy";
import { FixedStats } from "@/datas/stats";
import type { LocalMatches } from "./ocr.match";

export type OcrSource = "backend" | "backend_raw" | "browser" | "image";
export type OcrVote = { id: string | null; source: OcrSource; confidence: number | null };

export function voteOcrCandidates(candidates: OcrVote[]) {
  const groups = new Map<string, OcrVote[]>();
  for (const candidate of candidates) {
    if (!candidate.id) continue;
    const group = groups.get(candidate.id) ?? [];
    group.push(candidate);
    groups.set(candidate.id, group);
  }
  const ranked = [...groups.entries()].map(([id, votes]) => ({ id, votes,
    confidence: Math.max(...votes.map(vote => vote.confidence ?? -1)) }))
    .sort((a, b) => b.votes.length - a.votes.length || b.confidence - a.confidence);
  const best = ranked[0];
  const tied = best ? ranked.filter(group => group.votes.length === best.votes.length) : [];
  if (!best || (tied.length > 1 && (tied.some(group => group.confidence < 0)
    || tied[1].confidence === best.confidence))) {
    return { selectedStatId: null, selectedSource: null, votes: 0, selectedConfidence: null };
  }
  const strongest = [...best.votes].sort((a, b) => (b.confidence ?? -1) - (a.confidence ?? -1))[0];
  return { selectedStatId: best.id,
    selectedSource: best.votes.length > 1 ? "both" as const : strongest.source,
    votes: best.votes.length, selectedConfidence: best.confidence >= 0 ? best.confidence : null };
}

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
  selectedSource: OcrSource | "both" | null;
  votes: number;
  selectedConfidence: number | null;
  imageStatId: string | null;
  imageConfidence: number | null;
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

export function statKind(text: string, id: OcrRegionId): string | null {
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
export function costValue(text: string) {
  const normalized = text.normalize("NFKC");
  return normalized.match(/cost\s*[:·]?\s*([134])\b/i)?.[1]
    ?? normalized.match(/^\s*([134])\s*$/)?.[1] ?? null;
}

export function confidence(region: OcrRegionResult | undefined, browser: boolean): number | null {
  if (!region?.success) return null;
  if (browser) return Number.isFinite(region.confidence) && region.confidence! >= 0 && region.confidence! <= 100
    ? region.confidence! / 100 : null;
  // Prefer label tokens: numerical recognition is not the stat-kind signal.
  const tokens = region.tokens?.filter(token => normalizeLabel(token.text)
    && Number.isFinite(token.confidence) && token.confidence >= 0 && token.confidence <= 1) ?? [];
  return tokens.length ? tokens.reduce((sum, token) => sum + token.confidence, 0) / tokens.length : null;
}

export function crosscheckOcrRegions(backend: OcrRegionResult[], browser: OcrRegionResult[], images: LocalMatches | null = null): OcrCrosscheck[] {
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
    const image = isStat ? images?.rows.find(row => OCR_REGION_IDS[row.index + 2] === id)?.match : null;
    const imageStatId = image && Object.hasOwn(FixedStats, image.id) && image.id !== "dummy"
      && Number.isFinite(image.score) && image.score >= 0 && image.score <= 1 ? image.id.replace(/Pct$/, "") : null;
    const imageConfidence = imageStatId ? image!.score : null;
    const selection = { ...voteOcrCandidates([
      { id: backendStatId, source: "backend", confidence: backendConfidence },
      { id: rawStatId, source: "backend_raw", confidence: rawConfidence },
      { id: browserStatId, source: "browser", confidence: browserConfidence },
      { id: imageStatId, source: "image", confidence: imageConfidence },
    ]), backendConfidence, browserConfidence, rawStatId, rawConfidence, imageStatId, imageConfidence };
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
