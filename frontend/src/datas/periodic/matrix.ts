import type { SeasonInfo, PeriodicContent } from "./types";

export const matrixSeasons: SeasonInfo[] = [
  {
    season: 3,
    startDate: "2026-06-15",
    endDate: "2026-07-09",
  },
  {
    season: 2,
    startDate: "2026-05-07",
    endDate: "2026-06-08",
  }
];

export const matrixContent: PeriodicContent = {
  id: "matrix",
  className: "matrix",
  name: {
    kr: "종말 매트릭스",
    en: "Endstate Matrix",
    jp: "終焉マトリクス",
    zh: "终焉矩阵",
  },
  seasons: matrixSeasons,
};
