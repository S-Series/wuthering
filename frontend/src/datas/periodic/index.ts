import { towerContent } from "./tower";
import { wastesContent } from "./wastes";
import { gatewayContent } from "./gateway";
import { matrixContent } from "./matrix";

export const periodicContents = [
  towerContent,
  wastesContent,
  gatewayContent,
  matrixContent,
] as const;

export type {
  SeasonInfo,
  PeriodicContent,
  PeriodicSeasonSource,
} from "./types";
