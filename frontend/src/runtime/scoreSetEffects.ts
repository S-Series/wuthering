import { character } from "@/datas/characters";
import { characterMeta } from "@/datas/characters.meta";
import { characterStat } from "@/datas/characterStats";
import { harmony } from "@/datas/harmonies";
import { scoreSetEffects, type ScoreEffectStatId } from "@/datas/scoreSetEffects";
import { weaponStat } from "@/datas/weaponStats";
import type { CharacterData, CharacterStat } from "@/types/character.type";

export type ScoreSetBonus = { statId: ScoreEffectStatId; value: number; alreadyIncluded: number };
export type ScoreSetAssumption = {
  setId: keyof typeof scoreSetEffects;
  count: number;
  bonuses: ScoreSetBonus[];
  source: string;
};

/** The first recommended set is fully active for SCORE, independent of equipped sets. */
export function getScoreSetAssumption(data: CharacterData): ScoreSetAssumption {
  const setId = characterMeta[data.characterId].harmonySets[0];
  const definition = scoreSetEffects[setId];
  const equippedCount = data.echoDataIndex.slice(0, 5).filter(index => data.echoData[index].setId === setId).length;
  const included = harmony[setId].option
    .filter(option => option.count === definition.count && equippedCount >= option.count)
    .flatMap(option => [...option.options]);
  const bonuses = Object.entries(definition.bonuses).map(([statId, value]) => ({
    statId: statId as ScoreEffectStatId,
    value,
    alreadyIncluded: included.filter(option => option.statId === statId).reduce((sum, option) => sum + option.value, 0),
  }));
  return { setId, count: definition.count, bonuses, source: definition.source };
}

/** Convert the assumed bonuses into plain scoring stats without editing the displayed build. */
export function getCharacterScoringStats(data: CharacterData, actualStats: CharacterStat) {
  const stats = { ...actualStats };
  const assumption = getScoreSetAssumption(data);
  const base = characterStat[data.characterId];
  const baseAtk = base.baseAtk + weaponStat[data.weaponId ?? "dummy"].atk;
  const element = character[data.characterId].element;
  const damageStats = { basicBns: "basic", heavyBns: "heavy", skillBns: "skill", liberationBns: "liberation", healBns: "heal" } as const;
  for (const bonus of assumption.bonuses) {
    const delta = bonus.value - bonus.alreadyIncluded;
    const id = bonus.statId;
    if (id === "hpPct") stats.hp += base.baseHp * delta / 100;
    else if (id === "atkPct") stats.atk += baseAtk * delta / 100;
    else if (id === "defPct") stats.def += base.baseDef * delta / 100;
    else if (id === "typeBns") stats[element] += delta;
    else if (["aeroBns", "glacioBns", "fusionBns", "electroBns", "havocBns", "spectroBns"].includes(id)) {
      const stat = id.replace(/Bns$/, "") as typeof element;
      stats[stat] += delta;
    } else if (id in damageStats) stats[damageStats[id as keyof typeof damageStats]] += delta;
    else if (id in stats) stats[id as keyof CharacterStat] += delta;
  }
  return { stats, assumption };
}

/** Full assumed CR bonus, useful when composing an explicit SCORE baseline. */
export function getAssumedScoreCritRate(data: CharacterData): number {
  return getScoreSetAssumption(data).bonuses.find(bonus => bonus.statId === "critRate")?.value ?? 0;
}
