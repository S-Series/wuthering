import type { SeasonInfo, PeriodicContent } from "./types";

export const towerSeasons: SeasonInfo[] = [
  {
    season: 39,
    startDate: "2026-08-17",
    endDate: "2026-09-14",
  },
  {
    season: 38,
    startDate: "2026-07-20",
    endDate: "2026-08-17",
  },
  {
    season: 37,
    startDate: "2026-06-22",
    endDate: "2026-07-20",
  },
  {
    season: 36,
    startDate: "2026-05-25",
    endDate: "2026-06-22",
  }
];

export const towerContent: PeriodicContent = {
  id: "tower",
  className: "tower",
  name: {
    kr: "역경의 탑",
    en: "Tower of Adversity",
    jp: "逆境深塔",
    zh: "逆境深塔",
  },
  seasons: towerSeasons,
};
