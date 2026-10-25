import { buildTargetBaselines } from '@/datas/buildTargets/baselines';
import type { BuildTargetBaseline, BuildTargetVariant, BuildTier, TargetStatId, TargetStats } from '@/datas/buildTargets/types';
import { characterStat, type CharacterId } from '@/datas/characterStats';
import { ARCA_SOURCE_UPDATED_AT, ARCA_CHECKED_AT } from '@/datas/buildTargets/arca';
import type { HarmonyId } from '@/datas/harmonies';
import { FixedStats } from '@/datas/stats';
import { weaponStat } from '@/datas/weaponStats';
import { createEmptyCharacterData, type CharacterData } from '@/types/character.type';
import { createEmptyEchoRuntime } from './echo.runtime';
import { calcCharacterStatDetails } from './characterData.helpers';

export const BUILD_TARGET_CHECKED_AT = ARCA_CHECKED_AT;
export const BUILD_TARGET_SOURCE_UPDATED_AT = ARCA_SOURCE_UPDATED_AT;
export const BUILD_TIERS: BuildTier[] = ['wellBuilt', 'nearFinal', 'final'];
export const FINAL_BUILD_SUBSTAT_TARGETS = { atkPct: 35, critDmg: 75 };
const mean = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const oneDecimal = (value: number) => Math.round(value * 10) / 10;
const sorted = (values: readonly (number | string)[]) => [...values].sort().join(',');

export function getBuildTargetProfile(id: CharacterId): BuildTargetBaseline | undefined {
  return buildTargetBaselines[id];
}

/** Fixed substat budgets are site policy; source baselines remain unmodified. */
export function getTierTargets(id: CharacterId, variant: BuildTargetVariant, data?: CharacterData): Record<BuildTier, TargetStats> {
  const profile = getBuildTargetProfile(id);
  if (!profile) return { wellBuilt: {}, nearFinal: {}, final: {} };
  const base = characterStat[id];
  const weaponId = variant.weaponId ?? profile.weaponId;
  const primaryBase = profile.primary === 'atk' ? base.baseAtk + (weaponId ? weaponStat[weaponId].atk : 0) : profile.primary === 'hp' ? base.baseHp : base.baseDef;
  const primaryStep = primaryBase * mean(FixedStats[`${profile.primary}Pct`].ValueSub) / 100;
  const quantum = profile.primary === 'hp' ? 500 : 50;
  const final = { ...variant.baseline };
  const primary = final[profile.primary];
  if (primary !== undefined && profile.primary !== 'atk') final[profile.primary] = primary + Math.ceil(primaryStep * 2 / quantum) * quantum;
  // Keep the previous final rate requirement and utility-only crit floors.
  if (final.critRate !== undefined && final.critDmg !== undefined) {
    final.critRate = oneDecimal(Math.min(100, final.critRate + mean(FixedStats.critRate.ValueSub)));
  }
  const reference = createTargetReference(id, variant, data);
  const projected = getNormalizedBuildStats(reference, FINAL_BUILD_SUBSTAT_TARGETS);
  const equipped = data && matchesMainOptions(data, variant) ? equippedEchoes(data) : undefined;
  if (profile.primary === 'atk' && variant.baseline.atk !== undefined) {
    if (weaponId && (variant.main1 || equipped)) final.atk = projected.atk;
    else delete final.atk;
  }
  if (variant.baseline.critDmg !== undefined) {
    if (weaponId) final.critDmg = projected.critDmg;
    else delete final.critDmg;
  }
  const nearFinal: TargetStats = {};
  for (const stat of Object.keys(variant.baseline) as TargetStatId[]) {
    if (final[stat] !== undefined) nearFinal[stat] = oneDecimal((variant.baseline[stat]! + final[stat]!) / 2);
  }
  return { wellBuilt: { ...variant.baseline }, nearFinal, final };
}

/** Reference gear includes its main-Echo effect, without substats or set effects. Valid equipped main-stat choices may select
 * a permitted alternative, but equipment rolls, Chain and refinement cannot move the target. */
function createTargetReference(id: CharacterId, variant: BuildTargetVariant, data?: CharacterData): CharacterData {
  const profile = getBuildTargetProfile(id);
  const reference = createEmptyCharacterData(id);
  if (!profile) return reference;
  reference.weaponId = variant.weaponId ?? profile.weaponId;
  const equipped = data && matchesMainOptions(data, variant) ? equippedEchoes(data) : undefined;
  const mains3 = variant.main3 ?? variant.main3Options?.[0];
  const positions = { 1: 0, 3: 0, 4: 0 };
  variant.costs.forEach((cost, index) => {
    const echoCost = cost as 4 | 3 | 1;
    const position = positions[echoCost]++;
    const echo = createEmptyEchoRuntime(echoCost);
    if (index === 0) echo.echoId = variant.mainEchoId ?? equipped?.[0].echoId ?? null;
    const statId = equipped?.filter(item => item.cost === cost)[position].mainOption.statId ?? (cost === 4
      ? variant.main4Exact?.[position] ?? variant.main4[0]
      : cost === 3 ? mains3?.[position] ?? variant.allowed3[0] : variant.main1 ?? 'dummy');
    echo.mainOption = { statId, statValue: FixedStats[statId].ValueMain[cost === 4 ? 0 : cost === 3 ? 1 : 2] ?? 0 };
    reference.echoData[index] = echo;
  });
  return reference;
}

export function equippedEchoes(data: CharacterData) {
  return data.echoDataIndex.slice(0, 5).map(index => data.echoData[index]);
}

export function matchesMainOptions(data: CharacterData, variant: BuildTargetVariant): boolean {
  const echoes = equippedEchoes(data);
  if (echoes.length !== 5 || echoes.some(echo => !echo?.echoId || echo.mainOption.statValue <= 0)) return false;
  if (sorted(echoes.map(echo => echo.cost)) !== sorted(variant.costs)) return false;
  if (echoes[0].cost !== variant.costs[0] || (variant.mainEchoId && echoes[0].echoId !== variant.mainEchoId)) return false;
  if (echoes.filter(echo => echo.cost === 4).some(echo => !variant.main4.includes(echo.mainOption.statId))) return false;
  if (variant.main4Exact && sorted(echoes.filter(echo => echo.cost === 4).map(echo => echo.mainOption.statId)) !== sorted(variant.main4Exact)) return false;
  if (variant.main1 && echoes.filter(echo => echo.cost === 1).some(echo => echo.mainOption.statId !== variant.main1)) return false;
  const cost3 = echoes.filter(echo => echo.cost === 3).map(echo => echo.mainOption.statId);
  return variant.main3 ? sorted(cost3) === sorted(variant.main3)
    : variant.main3Options ? variant.main3Options.some(pair => sorted(pair) === sorted(cost3))
    : cost3.every(stat => variant.allowed3.includes(stat));
}

export function getSuggestedVariant(data: CharacterData): BuildTargetVariant | undefined {
  const variants = getBuildTargetProfile(data.characterId)?.variants ?? [];
  // Prefer a specific main-Echo exception over the generic build if both match.
  return variants.find(variant => variant.mainEchoId && matchesMainOptions(data, variant))
    ?? variants.find(variant => matchesMainOptions(data, variant))
    ?? variants[0];
}

export function getTargetConditions(data: CharacterData, variant: BuildTargetVariant) {
  const profile = getBuildTargetProfile(data.characterId);
  if (!profile) return { weapon: false, mainOptions: false, set: false };
  const echoes = equippedEchoes(data);
  const counts: Partial<Record<HarmonyId, number>> = {};
  for (const echo of echoes) if (echo?.setId) counts[echo.setId] = (counts[echo.setId] ?? 0) + 1;
  const rules = variant.setRules ?? profile.setRules ?? profile.sets.map(id => [{ id, count: profile.setCount }]);
  return {
    weapon: !!(variant.weaponId ?? profile.weaponId) && data.weaponId === (variant.weaponId ?? profile.weaponId),
    mainOptions: matchesMainOptions(data, variant),
    set: rules.some(rule => rule.every(({ id, count }) => (counts[id] ?? 0) >= count)),
  };
}

/** Same Echoes and weapon, including the main-Echo effect, normalized to C0/R1 without set buffs. */
export function getBuildComparisonStats(data: CharacterData): TargetStats {
  return getNormalizedBuildStats(data);
}

function getNormalizedBuildStats(data: CharacterData, extraSubstats?: { atkPct: number; critDmg: number }): TargetStats {
  const normalized: CharacterData = { ...data, constell: [0, 1] };
  const { contributions } = calcCharacterStatDetails(normalized, normalized.echoDataIndex, {});
  const stats: TargetStats = {};
  for (const source of contributions) {
    if (source.kind === 'harmony' || source.kind === 'rounding') continue;
    stats[source.statId] = (stats[source.statId] ?? 0) + source.value;
  }
  if (extraSubstats) {
    const baseAtk = characterStat[data.characterId].baseAtk + (data.weaponId ? weaponStat[data.weaponId].atk : 0);
    stats.atk = (stats.atk ?? 0) + baseAtk * extraSubstats.atkPct / 100;
    stats.critDmg = (stats.critDmg ?? 0) + extraSubstats.critDmg;
  }
  for (const id of ['atk', 'hp', 'def'] as const) stats[id] = Math.round(stats[id] ?? 0) + (id === 'def' ? 1 : -1);
  for (const id of ['critRate', 'critDmg', 'resonanceBns'] as const) stats[id] = oneDecimal(stats[id] ?? 0);
  return stats;
}

export function evaluateBuildTargets(data: CharacterData, variant: BuildTargetVariant, stats = getBuildComparisonStats(data)) {
  const targets = getTierTargets(data.characterId, variant, data);
  const conditions = getTargetConditions(data, variant);
  const conditionsMatch = Object.values(conditions).every(Boolean);
  const registered = Object.keys(targets.wellBuilt) as TargetStatId[];
  const passed = Object.fromEntries(BUILD_TIERS.map(tier => [tier, conditionsMatch && registered.length > 0 && registered.every(id => targets[tier][id] !== undefined && (stats[id] ?? 0) + 1e-6 >= targets[tier][id]!)])) as Record<BuildTier, boolean>;
  const tier = [...BUILD_TIERS].reverse().find(tier => passed[tier]) ?? null;
  return { stats, targets, conditions, conditionsMatch, passed, tier };
}
