import type { HarmonyId } from "./harmonies";
import type { StatId } from "./stats";

export type ScoreEffectStatId = StatId | "echoSkillBns" | "coordinatedBns" | "outroBns" | "tuneBreakBoost";
export type ScoreSetEffect = {
  count: number;
  bonuses: Partial<Record<ScoreEffectStatId, number>>;
  source: string;
};
const effect = (count: number, bonuses: ScoreSetEffect["bonuses"], echoId: string): ScoreSetEffect => ({
  count, bonuses, source: `https://www.encore.moe/echo/${echoId}?lang=en`,
});

export const SCORE_SET_EFFECTS_CHECKED_AT = "2026-10-31";

// Verified against encore.moe Release Echo/FetterDetails. Full conditional activation is
// a SCORE assumption: attack-specific CR is one general CR bonus, never summed per attack type.
// These are conditional bonuses only; unconditional 2-piece bonuses are not invented.
export const scoreSetEffects = {
  Frost: effect(5, { glacioBns: 30 }, "390070075"),
  Rift: effect(5, { fusionBns: 30 }, "390070066"),
  Thunder: effect(5, { electroBns: 30 }, "390077017"),
  Gale: effect(5, { aeroBns: 30 }, "390070075"),
  Light: effect(5, { spectroBns: 30 }, "390077017"),
  Eclipse: effect(5, { havocBns: 30 }, "390077017"),
  Rejuvent: effect(5, { atkPct: 15 }, "390070066"),
  Clouds: effect(5, { atkPct: 22.5 }, "390070075"),
  Tunes: effect(5, { atkPct: 20, outroBns: 60 }, "390070066"),
  Frosty: effect(5, { glacioBns: 22.5, skillBns: 36 }, "6000072"),
  Radiance: effect(5, { critRate: 20, spectroBns: 15 }, "6000096"),
  // Veil's 480% Outro hit is an attack multiplier, not a 480% stat bonus.
  Veil: effect(5, { havocBns: 15 }, "6000068"),
  Empyrean: effect(5, { coordinatedBns: 80, atkPct: 20 }, "6000094"),
  Courage: effect(5, { atkPct: 15, typeBns: 30 }, "6000094"),
  Welkin: effect(5, { aeroBns: 30 }, "6000096"),
  Pilgrimage: effect(5, { critRate: 10, aeroBns: 30 }, "6000109"),
  Clawprint: effect(5, { fusionBns: 15, liberationBns: 20 }, "6000109"),
  Dream: effect(3, { critRate: 20, echoSkillBns: 35 }, "6000079"),
  Crown: effect(3, { atkPct: 30, critDmg: 20 }, "6000094"),
  Law: effect(3, { heavyBns: 30, echoSkillBns: 16 }, "6000096"),
  Shadow: effect(3, { critRate: 20, fusionBns: 16 }, "6000068"),
  Fate: effect(3, { atkPct: 20, liberationBns: 30 }, "6000109"),
  Leap: effect(5, { atkPct: 30 }, "6000183"),
  Halo: effect(5, { atkPct: 25 }, "6000177"),
  Revelation: effect(5, { spectroBns: 30, basicBns: 40 }, "6000178"),
  Star: effect(5, { critRate: 20, fusionBns: 20 }, "6000177"),
  Foam: effect(5, { fusionBns: 10 }, "6000178"),
  Sound: effect(5, { critRate: 20, aeroBns: 15 }, "6000178"),
  Snowfall: effect(5, { critRate: 25, glacioBns: 10 }, "6000183"),
  Memories: effect(5, { tuneBreakBoost: 20 }, "6000183"),
  Adam: effect(1, { basicBns: 35, heavyBns: 35 }, "6000201"),
  Song: effect(5, { critRate: 20, heavyBns: 35, atkPct: 25 }, "6000215"),
  Heart: effect(5, { critDmg: 20, aeroBns: 30 }, "6000205"),
  Lamp: effect(5, { critRate: 20, fusionBns: 15 }, "6000215"),
  Vigil: effect(5, { critRate: 15, electroBns: 22.5 }, "6000223"),
  Reflection: effect(5, { electroBns: 10 }, "6000205"),
  Yearning: effect(5, { atkPct: 25 }, "6000223"),
} satisfies Record<HarmonyId, ScoreSetEffect>;
