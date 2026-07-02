import type { HarmonyId } from "@/datas/harmonies";

export type SelectOption<T = unknown> = {
  value: T;
  label: string;
  isDisabled?: false;
}
export type SelectOriginalOption<T = unknown> = {
  value: T;
  kr: string;
  en: string;
  jp: string;
  zh: string;
  path: string;
  harmonies?: HarmonyId[]
}
export type SelectOptionWithImage<T = unknown> = {
  value: T;
  label: string;
  path: string;
  isDisabled?: false;
}

export type SelectOptionStatOriginal<T = unknown> = {
  value: T;
  label: string;
  kr: string;
  en: string;
  jp: string;
  zh: string;
  path: string;
  mainValue: number[];
  subValue: number[];
}

export type SelectOpt = { value: number; label: string };

export interface EchoSelectProps {
    index?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export type Cost = 1 | 3 | 4;
