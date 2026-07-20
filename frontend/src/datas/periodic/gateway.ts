import type { PeriodicContent } from "./types";

export const gatewayContent: PeriodicContent = {
  id: "gateway",
  className: "gateway",
  name: {
    kr: "주간 활약도",
    en: "Weekly Activity",
    jp: "週間活躍度",
    zh: "每周活跃度",
  },
  seasonSource: {
    type: "weekly",
    seasonZeroStart: "2026-06-01",
  },
};
