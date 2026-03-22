export type CharacterSummary = {
  characterId: string;
  score: number;
  updatedAt: number;
};

export type CharacterSummaryStore = {
  version: number;
  data: Record<string, CharacterSummary>;
};

