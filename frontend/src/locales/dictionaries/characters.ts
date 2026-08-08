import type { LocaleSchema } from "@/locales/locale.schema";
import type { LangType } from "@/stores/appStore";

export const characters = {
  kr: {
    search: "공명자 이름 검색",
    sortScore: "세팅 점수순",
    sortRelease: "출시순",
    configured: "세팅 있음",
    filterWeapon: "무기",
    filterElement: "속성",
    noResults: "검색 결과가 없습니다.",
  },
  en: {
    search: "Search Resonators",
    sortScore: "Setting Score",
    sortRelease: "Release Order",
    configured: "Configured",
    filterWeapon: "Weapon",
    filterElement: "Element",
    noResults: "No resonators found.",
  },
  jp: {
    search: "共鳴者名を検索",
    sortScore: "設定スコア順",
    sortRelease: "実装順",
    configured: "設定あり",
    filterWeapon: "武器",
    filterElement: "属性",
    noResults: "該当する共鳴者がいません。",
  },
  zh: {
    search: "搜索共鸣者名称",
    sortScore: "配装评分",
    sortRelease: "上线顺序",
    configured: "已有配装",
    filterWeapon: "武器",
    filterElement: "属性",
    noResults: "未找到共鸣者。",
  },
} satisfies Record<LangType, LocaleSchema["characters"]>;
