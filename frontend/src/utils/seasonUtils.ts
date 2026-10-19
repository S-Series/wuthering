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
const getResetTime = (date: string): number => {
  const reset = parseDateOnly(date);
  reset.setHours(SEASON_RESET_HOUR);
  return reset.getTime();
};

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
    const startTime = getResetTime(season.startDate);
    const endTime = getResetTime(season.endDate);

    return startTime <= nowTime && nowTime < endTime;
  });
};

const getFallbackSeason = (
  seasons: SeasonInfo[],
  days: number | undefined,
  now: Date,
): SeasonInfo | undefined => {
  if (!days || !Number.isInteger(days) || days <= 0) return undefined;
  const latest = seasons.reduce<SeasonInfo | undefined>((last, season) =>
    !last || season.endDate > last.endDate ? season : last, undefined);
  if (!latest || now.getTime() < getResetTime(latest.endDate)) return undefined;

  const anchor = parseDateOnly(latest.endDate);
  if (Number.isNaN(anchor.getTime())) return undefined;
  const adjustedNow = new Date(now);
  adjustedNow.setHours(adjustedNow.getHours() - SEASON_RESET_HOUR);
  const elapsed = getCalendarDayNumber(adjustedNow) - getCalendarDayNumber(anchor);
  const cycle = Math.floor(elapsed / days);
  const start = addDays(anchor, cycle * days);
  return {
    season: latest.season + cycle + 1,
    startDate: formatDateOnly(start),
    endDate: formatDateOnly(addDays(start, days)),
  };
};

export const getCurrentSeason = (
  source: PeriodicSeasonSource,
  now: Date = new Date(),
): SeasonInfo | undefined => {
  if ("seasonSource" in source) {
    return getCurrentWeeklySeason(source.seasonSource.seasonZeroStart, now);
  }

  return getCurrentStaticSeason(source.seasons, now)
    ?? getFallbackSeason(source.seasons, source.fallbackDays, now);
};

export const getRemainingTime = (
  endDate: string,
  now: Date = new Date()
): RemainingTime => {
  const endTime = getResetTime(endDate);
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
