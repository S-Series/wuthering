import type { LocaleText } from "@/stores/appStore";

export type SeasonInfo = {
  season: number;
  startDate: string;
  endDate: string;
};

type WeeklySeasonSource = {
  type: "weekly";
  seasonZeroStart: string;
};

export type PeriodicSeasonSource =
  | {
      seasons: SeasonInfo[];
      seasonSource?: never;
    }
  | {
      seasons?: never;
      seasonSource: WeeklySeasonSource;
    };

export type PeriodicContent = PeriodicSeasonSource & {
  id: string;
  className: string;
  name: LocaleText;
};
