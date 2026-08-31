import type { LocaleSchema } from "@/locales/locale.schema";
import type { LangType } from "@/stores/appStore";

export const navbar = {
  kr: {
    title: "띵조 DEV",
    characters: "캐릭터 목록",
    generator: "스펙카드 생성기",
    board: "게시판",
    login: "로그인",
    menu: "메뉴",
  },
  en: {
    title: "WuWa DEV",
    characters: "Chracter List",
    generator: "SpecCard Generator",
    board: "Community",
    login: "Log-in",
    menu: "Menu",
  },
  jp: {
    title: "WuWa ラボ",
    characters: "キャラクター一覧",
    generator: "スペックカード生成",
    board: "掲示板",
    login: "ログイン",
    menu: "メニュー",
  },
  zh: {
    title: "鸣潮 工具",
    characters: "角色列表",
    generator: "属性卡生成器",
    board: "社区",
    login: "登录",
    menu: "菜单",
  },
} satisfies Record<LangType, LocaleSchema["navbar"]>;
