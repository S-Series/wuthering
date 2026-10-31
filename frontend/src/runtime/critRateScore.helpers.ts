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
  valueMultiplier: number;
  scoringValue: number;
};

/** Use the same final-stat calculation as the card; only equipped substats consume this budget. */
export function getCritRateBudget(finalCritRate: number, equipped: readonly EchoRuntime[]): CritRateBudget {
  const maximum = Math.max(...FixedStats.critRate.ValueSub) * 5;
  const substats = clean(equipped.reduce((sum, echo) => sum + echo.subOptions.reduce((total, option) => total + (option.statId === 'critRate' ? Math.max(0, option.statValue) : 0), 0), 0));
  const fixed = clean(finalCritRate - substats);
  const available = clean(Math.min(maximum, Math.max(0, 100 - fixed)));
  const effective = Math.min(substats, available);
  const wasted = clean(Math.max(0, substats - effective));
  const valueMultiplier = available > 0 ? maximum / available : 0;
  // Convert useful substat CR into its scoring value before applying any point weights.
  const scoringValue = effective * valueMultiplier;
  return { fixed, substats, maximum, available, effective, wasted, ratio: substats > 0 ? effective / substats : 1, valueMultiplier, scoringValue };
}
