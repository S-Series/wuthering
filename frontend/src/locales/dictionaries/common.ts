import type { LocaleSchema } from "@/locales/locale.schema";
import type { LangType } from "@/stores/appStore";

export const common = {
  kr: {
    open: "열기",
    close: "닫기",
    select: "선택",
  },
  en: {
    open: "Open",
    close: "Close",
    select: "Select",
  },
  jp: {
    open: "開く",
    close: "閉じる",
    select: "選択",
  },
  zh: {
    open: "打开",
    close: "关闭",
    select: "选择",
  },
} satisfies Record<LangType, LocaleSchema["common"]>;
