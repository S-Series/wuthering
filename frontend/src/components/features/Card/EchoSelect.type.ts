import type { StatId } from "@/datas/stats";

export type Cost = 1 | 3 | 4;

export type SelectOpt = {
  value: number;
  label: string;
};

export interface SelectOptionStatOriginal {
  value: StatId;
  label: string;
  kr: string;
  en: string;
  zh: string;
  mainValue: number[];
  subValue: number[];
}
