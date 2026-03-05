import kr from "@/locales/kr.json";
import en from "@/locales/en.json";
import type { LangType } from "@/stores/appStore";
// import jp from "@/locales/jp.json";
// import zh from "@/locales/zh.json";

export const dict = { kr, en, } as const;

export function local(lang: LangType, key: keyof typeof dict["kr"]) {
}