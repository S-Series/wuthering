import { fuzzy } from "fast-fuzzy";

import { ECHO_CANDIDATES, echoDict, type EchoId } from "@/datas/echos";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { FixedStats, type StatId } from "@/datas/stats";
import type { LangType } from "@/stores/appStore";
import type { OcrRegionResult } from "./ocr.batch";
import { resolveMatchedStat, type LocalMatches } from "./ocr.match";
import { confidence, costValue, crosscheckOcrRegions, statKind, voteOcrCandidates, type OcrSource } from "./ocr.crosscheck";
import { resolveEchoCost } from "./ocr.cost";

const normalize = (text: string) => text.normalize("NFKC").replace(/[\s·.%+]/g, "").toLowerCase();

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

export function resolveBatchOcr(regions: OcrRegionResult[], matches: LocalMatches | null, lang: LangType, browser: OcrRegionResult[] = []) {
  const sources = (id: OcrRegionResult["id"]): { region: OcrRegionResult; source: OcrSource; confidence: number | null }[] => {
    const backend = regions.find(region => region.id === id);
    const client = browser.find(region => region.id === id);
    const inputs: { region: OcrRegionResult | null | undefined; source: OcrSource; confidence: number | null }[] = [
      { region: backend, source: "backend" as const, confidence: confidence(backend, false) },
      { region: backend?.raw, source: "backend_raw" as const, confidence: confidence(backend?.raw ?? undefined, false) },
      { region: client, source: "browser" as const, confidence: confidence(client, true) },
    ];
    return inputs.filter((item): item is { region: OcrRegionResult; source: OcrSource; confidence: number | null } => !!item.region?.success);
  };
  const costVote = voteOcrCandidates(sources("cost").map(item => ({ ...item, id: costValue(item.region.texts.join(" ")) })));
  const recognizedCost = costVote.selectedStatId ? Number(costVote.selectedStatId) as 1 | 3 | 4 : null;
  const decisions = crosscheckOcrRegions(regions, browser, matches);
  const echoStats = Array.from({ length: 7 }, (_, index): [StatId, number] => {
    const decision = decisions[index + 2];
    if (!decision.selectedStatId) return ["dummy", 0];
    const kind = decision.selectedStatId as StatId;
    const numericCandidates = sources(decision.id).flatMap(item => {
      const label = statKind(item.region.texts.join(" "), decision.id);
      if (label && label !== kind) return [];
      let resolved = resolveMatchedStat({ id: kind, score: 1 }, item.region, index);
      if (!resolved) return [];
      if (index === 0 && ["atk", "hp", "def"].includes(resolved.id)) {
        const percentId = `${resolved.id}Pct` as StatId;
        const resolvedValue = resolved.value;
        if (FixedStats[percentId].ValueMain.some(value => value > 0 && Math.abs(value - resolvedValue) < 0.001)) {
          resolved = { ...resolved, id: percentId };
        }
      }
      return [{ ...item, id: `${resolved.id}:${resolved.value}`, resolved }];
    });
    const valueVote = voteOcrCandidates(numericCandidates);
    const resolved = numericCandidates.find(item => item.id === valueVote.selectedStatId)?.resolved;
    // Preserve a recognized kind even when no reliable numeric value was read.
    return resolved ? [resolved.id as StatId, resolved.value] : [kind, 0];
  });

  // Match the name across all COSTs first, so a bad digit cannot remove the
  // correct echo before the main and fixed option rows have been checked.
  const nameCandidates = sources("name").map(item => ({ ...item, echo: matchEchoName(item.region.texts.join(" "), lang, null) }));
  const nameVote = voteOcrCandidates(nameCandidates.map(item => ({ ...item, id: item.echo?.echoId ?? null })));
  const nameEcho = nameCandidates.find(item => item.echo?.echoId === nameVote.selectedStatId)?.echo;
  const nameCost = nameEcho ? Object.hasOwn(echoDict.Cost1, nameEcho.echoId) ? 1
    : Object.hasOwn(echoDict.Cost3, nameEcho.echoId) ? 3 : 4 : null;
  const costCheck = resolveEchoCost(recognizedCost, echoStats[0], echoStats[1], nameCost);
  // Keep the editor's required COST type, while exposing unresolved evidence in
  // diagnostics. No echo is selected from this UI default alone.
  const cost = costCheck.selected ?? 4;
  const echoCandidates = sources("name").map(item => ({ ...item,
    echo: matchEchoName(item.region.texts.join(" "), lang, costCheck.selected) }));
  const echoVote = voteOcrCandidates(echoCandidates.map(item => ({ ...item, id: item.echo?.echoId ?? null })));
  const echo = echoCandidates.find(item => item.echo?.echoId === echoVote.selectedStatId)?.echo;
  const echoId: EchoId | null = costCheck.selected ? echo?.echoId ?? null : null;
  const matchedHarmony = matches?.harmony;
  const candidateSet = matchedHarmony && Object.hasOwn(harmony, matchedHarmony.id)
    ? matchedHarmony.id as HarmonyId : null;
  const echoesForCost = echoDict[`Cost${cost}`] as Partial<Record<EchoId, { type: readonly string[] }>>;
  const echoData = echoId ? echoesForCost[echoId] : null;
  const setId = candidateSet && (!echoData || (echoData.type as readonly string[]).includes(candidateSet))
    ? candidateSet : null;
  if (costCheck.selected && echoStats[0][1] > 0) {
    const [id, value] = echoStats[0];
    const expected = FixedStats[id].ValueMain[cost === 4 ? 0 : cost === 3 ? 1 : 2];
    if (!expected || Math.abs(expected - value) >= 0.001) echoStats[0] = [id, 0];
  }
  return { echoId, echoName: echoId ? echo?.text ?? null : null, cost, setId, echoStats, costCheck };
}
