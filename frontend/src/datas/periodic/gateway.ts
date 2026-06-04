import type { SeasonInfo, PeriodicContent } from "./types";

export const gatewaySeasons: SeasonInfo[] = [
  {
    season: 5,
    startDate: "2026-07-06",
    endDate: "2026-07-13",
  },
  {
    season: 4,
    startDate: "2026-06-29",
    endDate: "2026-07-06",
  },
  {
    season: 3,
    startDate: "2026-06-22",
    endDate: "2026-07-29",
  },
  {
    season: 2,
    startDate: "2026-06-15",
    endDate: "2026-07-22",
  },
  {
    season: 1,
    startDate: "2026-06-08",
    endDate: "2026-07-15",
  },
  {
    season: 0,
    startDate: "2026-06-01",
    endDate: "2026-06-08",
  }
];

export const gatewayContent: PeriodicContent = {
  id: "gateway",
  className: "gateway",
  name: {
    kr: "수많은 문의 환상",
    en: "Thousand Gateways",
    jp: "千の扉の奇想",
    zh: "千道门扉的异想",
  },
  seasons: gatewaySeasons,
};
