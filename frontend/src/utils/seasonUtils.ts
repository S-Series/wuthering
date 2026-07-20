import type {
  PeriodicSeasonSource,
  SeasonInfo,
} from "@/datas/periodic/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const SEASON_RESET_HOUR = 4;

export type RemainingTime = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  text: string;
};

const parseDateOnly = (date: string): Date => new Date(`${date}T00:00:00`);

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const getMonday = (date: Date): Date => {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);

  const day = monday.getDay();
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));

  return monday;
};

const getCalendarDayNumber = (date: Date): number =>
  Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);

const formatDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentWeeklySeason = (
  seasonZeroStart: string,
  now: Date,
): SeasonInfo | undefined => {
  const anchorDate = parseDateOnly(seasonZeroStart);
  if (Number.isNaN(anchorDate.getTime())) return undefined;

  // Keep Monday 00:00-03:59 in the previous week until the 04:00 reset.
  const resetAdjustedNow = new Date(
    now.getTime() - SEASON_RESET_HOUR * 60 * 60 * 1000,
  );
  const anchorMonday = getMonday(anchorDate);
  const currentMonday = getMonday(resetAdjustedNow);
  const elapsedDays =
    getCalendarDayNumber(currentMonday) - getCalendarDayNumber(anchorMonday);
  const season = Math.floor(elapsedDays / 7);

  if (season < 0) return undefined;

  const startDate = addDays(anchorMonday, season * 7);

  return {
    season,
    startDate: formatDateOnly(startDate),
    endDate: formatDateOnly(addDays(startDate, 7)),
  };
};

const getCurrentStaticSeason = (
  seasons: SeasonInfo[],
  now: Date,
): SeasonInfo | undefined => {
  const nowTime = now.getTime();

  return seasons.find((season) => {
    const startTime = new Date(`${season.startDate}T00:00:00`).getTime();
    const endTime = new Date(`${season.endDate}T00:00:00`).getTime();

    return startTime <= nowTime && nowTime < endTime;
  });
};

export const getCurrentSeason = (
  source: PeriodicSeasonSource,
  now: Date = new Date(),
): SeasonInfo | undefined => {
  if ("seasonSource" in source) {
    return getCurrentWeeklySeason(source.seasonSource.seasonZeroStart, now);
  }

  return getCurrentStaticSeason(source.seasons, now);
};

export const getRemainingTime = (
  endDate: string,
  now: Date = new Date()
): RemainingTime => {
  const endTime = new Date(`${endDate}T00:00:00`).getTime() + 4 * 60 * 60 * 1000;
  const totalMs = Math.max(endTime - now.getTime(), 0);

  const totalSeconds = Math.floor(totalMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeText = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    text: days > 0 ? `${days}일 ${timeText}` : timeText,
  };
};

export const getCurrentSeasonRemainingTime = (
  source: PeriodicSeasonSource,
  now: Date = new Date(),
): RemainingTime | null => {
  const currentSeason = getCurrentSeason(source, now);

  if (!currentSeason) {
    return null;
  }

  return getRemainingTime(currentSeason.endDate, now);
};
