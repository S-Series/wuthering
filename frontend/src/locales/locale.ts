import type { LangType } from "@/stores/appStore";
import type { LocaleSchema } from "@/locales/locale.schema";

import {
  common,
  navbar,
  board,
  home,
  characters,
  card,
  cardDetail,
  profile,
  ocr,
} from "@/locales/dictionaries";

const createLocale = (lang: LangType): LocaleSchema => ({
  common: common[lang],
  navbar: navbar[lang],
  board: board[lang],
  home: home[lang],
  characters: characters[lang],
  card: card[lang],
  cardDetail: cardDetail[lang],
  profile: profile[lang],
  ocr: ocr[lang],
});

export const dict = {
  kr: createLocale("kr"),
  en: createLocale("en"),
  jp: createLocale("jp"),
  zh: createLocale("zh"),
} satisfies Record<LangType, LocaleSchema>;

export function locale(lang: LangType) {
  return dict[lang];
}
