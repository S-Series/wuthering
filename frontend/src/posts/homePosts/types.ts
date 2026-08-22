import type { ReactNode } from "react";

import type { LangType } from "@/stores/appStore";

export type LocaleReactNode = Record<LangType, ReactNode>;

export type HomePost = {
  id: number;
  pinned?: boolean;
  type: "update" | "notice" | "event";
  date: string;
  title: LocaleReactNode;
  data: LocaleReactNode;
};
