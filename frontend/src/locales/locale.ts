import type { LangType } from "@/stores/appStore";

import { kr } from "@/locales/kr";
import { en } from "@/locales/en";
import { jp } from "@/locales/jp";
import { zh } from "@/locales/zh";

export const dict = { kr, en, jp, zh} as const;

export function locale(lang: LangType) {
    return dict[lang];
}