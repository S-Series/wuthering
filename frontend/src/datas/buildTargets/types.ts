import type { HarmonyId } from '../harmonies';
import type { StatId } from '../stats';
import type { WeaponId } from '../weapon';

export type TargetStatId = 'atk' | 'hp' | 'def' | 'critRate' | 'critDmg' | 'resonanceBns';
export type TargetStats = Partial<Record<TargetStatId, number>>;
export type BuildTier = 'wellBuilt' | 'nearFinal' | 'final';
export type BuildTargetVariant = {
  id: string;
  label: string;
  costs: number[];
  main4: StatId[];
  main4Exact?: StatId[];
  main3: StatId[] | null;
  main3Options?: StatId[][];
  allowed3: StatId[];
  main1: StatId | null;
  baseline: TargetStats;
  mainText: string;
  subText: string;
  mainEchoId?: string;
  weaponId?: WeaponId;
  setRules?: { id: HarmonyId; count: number }[][];
};
export type BuildTargetBaseline = {
  primary: 'atk' | 'hp' | 'def';
  weaponId: WeaponId | null;
  sourceWeapon: string;
  variants: BuildTargetVariant[];
  sets: HarmonyId[];
  setCount: number;
  setRules?: { id: HarmonyId; count: number }[][];
  setText: string;
  sourceKind: 'arca';
  sourceUrl: string;
  notes: string;
  sourcePrimary: string;
  sourceEnergy: string;
};
