import { FixedStats } from '@/datas/stats';
import type { EchoRuntime } from './echo.runtime';

const clean = (value: number) => Math.round(value * 1e8) / 1e8;
export type CritRateBudget = {
  fixed: number;
  substats: number;
  maximum: number;
  available: number;
  effective: number;
  wasted: number;
  ratio: number;
};

/** Use the same final-stat calculation as the card; only equipped substats consume this budget. */
export function getCritRateBudget(finalCritRate: number, equipped: readonly EchoRuntime[]): CritRateBudget {
  const maximum = Math.max(...FixedStats.critRate.ValueSub) * 5;
  const substats = clean(equipped.reduce((sum, echo) => sum + echo.subOptions.reduce((total, option) => total + (option.statId === 'critRate' ? Math.max(0, option.statValue) : 0), 0), 0));
  const fixed = clean(finalCritRate - substats);
  const available = clean(Math.min(maximum, Math.max(0, 100 - fixed)));
  const effective = Math.min(substats, available);
  const wasted = clean(Math.max(0, substats - effective));
  return { fixed, substats, maximum, available, effective, wasted, ratio: substats > 0 ? effective / substats : 1 };
}

type ScoreCeilingInput = {
  available: number;
  critWeight: number;
  damageWeight: number;
  otherMaxScores: number[];
  resonanceSlots: number;
  needsCrit: boolean;
};

/** Find the multiplier whose best legal five-Echo configuration scores exactly 500.
 * Crit rolls occupy real substat slots. Freed slots can use the next best distinct stat;
 * only rate above the cap loses value; paired-crit bonuses remain unchanged.
 */
export function getCritCappedScoreMultiplier(input: ScoreCeilingInput): number {
  const bestOther = [...input.otherMaxScores].sort((a,b) => b-a);
  const prefix = [0];
  for (let i=0; i<5; i++) prefix.push(prefix[i] + (bestOther[i] ?? 0));
  type State = { rateCount: number; pairs: number; damageOnly: number; raw: number };
  let states: State[] = [{ rateCount:0, pairs:0, damageOnly:0, raw:0 }];
  for (let slot=0; slot<5; slot++) {
    const capacity = slot < input.resonanceSlots ? 4 : 5;
    const next = new Map<string, State>();
    for (const state of states) for (const rate of [0,1]) for (const damage of [0,1]) {
      if (rate && (input.available <= 0 || input.critWeight <= 0)) continue;
      const candidate = {
        rateCount:state.rateCount+rate,
        pairs:state.pairs+(rate && damage ? 1 : 0),
        damageOnly:state.damageOnly+(!rate && damage ? 1 : 0),
        raw:state.raw+prefix[capacity-rate-damage]+damage*Math.max(...FixedStats.critDmg.ValueSub)*input.damageWeight,
      };
      const key = `${candidate.rateCount},${candidate.pairs},${candidate.damageOnly}`;
      if (!next.has(key) || next.get(key)!.raw < candidate.raw) next.set(key,candidate);
    }
    states = [...next.values()];
  }
  // Enumerate actual roll sums, avoiding a fictitious 1% crit roll on each Echo.
  const rollSums: number[][] = [[0]];
  for (let count=1; count<=5; count++) rollSums.push([...new Set(rollSums[count-1].flatMap(sum=>FixedStats.critRate.ValueSub.map(value=>Math.round(sum+value*10))))]);
  let multiplier = Infinity;
  for (const state of states) for (const tenths of rollSums[state.rateCount]) {
    const total = tenths/10;
    const useful = Math.min(total,input.available);
    const raw = state.raw+useful*input.critWeight;
    const bonus = !input.needsCrit ? 50 : input.available<=0 ? state.damageOnly*10 : state.pairs*10;
    if (raw>0) multiplier = Math.min(multiplier,(500-bonus)/raw);
  }
  return Number.isFinite(multiplier) ? multiplier : 0;
}
