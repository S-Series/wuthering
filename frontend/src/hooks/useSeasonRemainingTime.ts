import { useEffect, useState } from "react";
import type { SeasonInfo } from "@/datas/periodic/types";
import {
  getCurrentSeasonRemainingTime,
  type RemainingTime,
} from "@/utils/seasonUtils";

export const useSeasonRemainingTime = (
  seasons: SeasonInfo[]
): RemainingTime | null => {
  const [remainingTime, setRemainingTime] = useState<RemainingTime | null>(() =>
    getCurrentSeasonRemainingTime(seasons)
  );

  useEffect(() => {
    const updateRemainingTime = () => {
      setRemainingTime(getCurrentSeasonRemainingTime(seasons));
    };

    updateRemainingTime();

    const timerId = window.setInterval(updateRemainingTime, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [seasons]);

  return remainingTime;
};