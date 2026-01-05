import type { CharacterRank } from "@/types/character.type";

export function calcRank(score: number): CharacterRank {
  if (score == 0) return "Empty";
  if (score >= 350) return "SSS";
  if (score >= 300) return "SS";
  if (score >= 250) return "S";
  if (score >= 200) return "A";
  return "B";
}
