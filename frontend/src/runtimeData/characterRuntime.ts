export type CharacterRuntime = {
  characterResonance?: number;
  weaponId?: string;
  weaponResonance?: number;
  echoes?: unknown[];
};

export type CharacterRank = "B" | "A" | "S" | "SS" | "SSS";

export type CharacterRuntimeSummary = {
  rank: CharacterRank;
  score?: number;
};
