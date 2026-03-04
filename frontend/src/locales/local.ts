import ko from "@/locales/kr.json";
import en from "@/locales/en.json";
// import jp from "@/locales/jp.json";
// import zh from "@/locales/zh.json";

export const dict = { ko, en } as const;
export type Lang = keyof typeof dict;

export function local(lang: Lang, key: keyof typeof dict["ko"]) {
  return dict[lang][key] ?? String(key);
}