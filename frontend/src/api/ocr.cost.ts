import { FixedStats, type StatId } from "@/datas/stats";

type Cost = 1 | 3 | 4;
const COSTS: Cost[] = [4, 3, 1];
// Same +25 fixed options used by the character stat calculation.
const FIXED: Record<Cost, [StatId, number]> = { 4: ["atk", 150], 3: ["atk", 100], 1: ["hp", 2280] };
export type OcrCostCheck = {
  direct: Cost | null;
  main: Cost[];
  fixed: Cost[];
  selected: Cost | null;
  status: "verified" | "inferred" | "conflict" | "unresolved";
};

export function resolveEchoCost(direct: Cost | null, main: [StatId, number], fixed: [StatId, number], name: Cost | null): OcrCostCheck {
  const mainId = (["hp", "atk", "def"].includes(main[0]) ? `${main[0]}Pct` : main[0]) as StatId;
  const mainKinds = COSTS.filter((_, index) => FixedStats[mainId].ValueMain[index] > 0);
  const mainValues = mainKinds.filter(cost => Math.abs(FixedStats[mainId].ValueMain[COSTS.indexOf(cost)] - main[1]) < 0.001);
  const fixedKinds = COSTS.filter(cost => FIXED[cost][0] === fixed[0]);
  const fixedValues = fixedKinds.filter(cost => Math.abs(FIXED[cost][1] - fixed[1]) < 0.001);
  const mainCandidates = mainValues.length ? mainValues : mainKinds;
  const fixedCandidates = fixedValues.length ? fixedValues : fixedKinds;
  const allowed = COSTS.filter(cost => (!mainKinds.length || mainKinds.includes(cost))
    && (!fixedKinds.length || fixedKinds.includes(cost)));
  let selected: Cost | null = null;
  if (allowed.length === 1) {
    // Stat kinds remain valid even on echoes below +25: e.g. Crit + ATK is COST 4.
    selected = allowed[0];
  } else if (allowed.length) {
    // Each field gets one vote; multiple OCR engines reading the COST digit do
    // not outweigh two independently agreeing option rows.
    const votes = [direct, mainValues.length === 1 ? mainValues[0] : null,
      fixedValues.length === 1 ? fixedValues[0] : null];
    const ranked = allowed.map(cost => ({ cost, votes: votes.filter(value => value === cost).length }))
      .sort((a, b) => b.votes - a.votes);
    const tied = ranked.filter(item => item.votes === ranked[0].votes).map(item => item.cost);
    selected = tied.length === 1 ? tied[0]
      : name && tied.includes(name) ? name : direct && tied.includes(direct) ? direct : null;
  } else if (name && direct === name) {
    // Contradictory row identities cannot establish COST on their own.
    selected = name;
  }
  const evidence = [direct ? [direct] : [], mainCandidates, fixedCandidates].filter(items => items.length);
  const conflict = selected ? evidence.some(items => !items.includes(selected))
    : evidence.length > 1 && !COSTS.some(cost => evidence.every(items => items.includes(cost)));
  return { direct, main: mainCandidates, fixed: fixedCandidates, selected,
    status: conflict ? "conflict" : selected === null ? "unresolved"
      : evidence.length >= 2 ? "verified" : "inferred" };
}
