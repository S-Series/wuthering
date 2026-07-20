import { useEffect, useState } from "react";
import type { PeriodicSeasonSource } from "@/datas/periodic/types";
import {
  getCurrentSeasonRemainingTime,
  type RemainingTime,
} from "@/utils/seasonUtils";

export const useSeasonRemainingTime = (
  source: PeriodicSeasonSource,
): RemainingTime | null => {
  const [remainingTime, setRemainingTime] = useState<RemainingTime | null>(() =>
    getCurrentSeasonRemainingTime(source),
  );

  useEffect(() => {
    const updateRemainingTime = () => {
      setRemainingTime(getCurrentSeasonRemainingTime(source));
    };

    updateRemainingTime();

    const timerId = window.setInterval(updateRemainingTime, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [source]);

  return remainingTime;
};
