import type { SeasonInfo } from "@/datas/periodic/types";

export type RemainingTime = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  text: string;
};

export const getCurrentSeason = (
  seasons: SeasonInfo[],
  now: Date = new Date()
): SeasonInfo | undefined => {
  const nowTime = now.getTime();

  return seasons.find((season) => {
    const startTime = new Date(`${season.startDate}T00:00:00`).getTime();
    const endTime = new Date(`${season.endDate}T00:00:00`).getTime();

    return startTime <= nowTime && nowTime < endTime;
  });
};

export const getRemainingTime = (
  endDate: string,
  now: Date = new Date()
): RemainingTime => {
  const endTime = new Date(`${endDate}T00:00:00`).getTime();
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
  seasons: SeasonInfo[],
  now: Date = new Date()
): RemainingTime | null => {
  const currentSeason = getCurrentSeason(seasons, now);

  if (!currentSeason) {
    return null;
  }

  return getRemainingTime(currentSeason.endDate, now);
};