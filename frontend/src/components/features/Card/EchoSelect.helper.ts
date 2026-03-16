import { FixedStats } from "@/datas/stats";
import { echoDict } from "@/datas/echos";
import type { LangType } from "@/stores/appStore";
import type { Cost, SelectOptionStatOriginal } from "@/components/features/Card/EchoSelect.type";

export const HARMONY_OPTIONS_BASE = [
  { value: "Aero", kr: "청운", en: "Aero", zh: "Aero", jp: "青天" },
  { value: "Electro", kr: "번개", en: "Electro", zh: "Electro", jp: "電撃" },
  { value: "Fusion", kr: "융합", en: "Fusion", zh: "Fusion", jp: "融合" },
  { value: "Glacio", kr: "빙결", en: "Glacio", zh: "Glacio", jp: "氷結" },
  { value: "Havoc", kr: "인멸", en: "Havoc", zh: "Havoc", jp: "滅亡" },
  { value: "Spectro", kr: "회절", en: "Spectro", zh: "Spectro", jp: "回折" },
  { value: "Sun", kr: "태양", en: "Sun", zh: "Sun", jp: "太陽" },
  { value: "Moon", kr: "달", en: "Moon", zh: "Moon", jp: "月" },
  { value: "Thunder", kr: "천뢰", en: "Thunder", zh: "Thunder", jp: "天雷" },
] as const;

export function getEchoOptionBase(lang: LangType, cost: Cost) {
  const costKey = `Cost${cost}` as keyof typeof echoDict;
  const dict = echoDict[costKey];
  return Object.entries(dict).map(([id, data]) => ({
    value: id,
    label: data[lang],
    kr: data.kr,
    en: data.en,
    zh: data.zh,
    img: `/ico/echos/${id}.webp`,
    harmonies: data.type
  }));
}

export function getStatOptionBase(lang: LangType): SelectOptionStatOriginal[] {
  return Object.values(FixedStats).map(stat => ({
    value: stat.id,
    label: stat[lang],
    kr: stat.kr,
    en: stat.en,
    zh: stat.zh,
    mainValue: stat.ValueMain,
    subValue: stat.ValueSub
  } as SelectOptionStatOriginal));
}
