import type { LocaleText } from "@/stores/appStore";

export type SeasonInfo = {
  season: number;
  startDate: string;
  endDate: string;
};

export type PeriodicContent = {
  id: string;
  className: string;
  name: LocaleText;
  seasons: SeasonInfo[];
};
