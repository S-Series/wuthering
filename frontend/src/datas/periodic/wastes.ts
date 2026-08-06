import type { SeasonInfo, PeriodicContent } from "./types";

export const wastesSeasons: SeasonInfo[] = [
    {
    season: 20,
    startDate: "2026-08-02",
    endDate: "2026-08-30",
  },
  {
    season: 19,
    startDate: "2026-07-05",
    endDate: "2026-08-02",
  },
  {
    season: 18,
    startDate: "2026-06-08",
    endDate: "2026-07-05",
  },
  {
    season: 17,
    startDate: "2026-05-10",
    endDate: "2026-06-08",
  }
];

export const wastesContent: PeriodicContent = {
  id: "wastes",
  className: "wastes",
  name: {
    kr: "죽음의 노래와 바닷속 폐허",
    en: "Whimpering Wastes",
    jp: "死の歌が纏う海の廃墟",
    zh: "冥歌海墟",
  },
  seasons: wastesSeasons,
};
