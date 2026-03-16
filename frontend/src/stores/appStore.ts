import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type LangType = "kr" | "en" | "jp" | "zh";

export function isLangType(v: string | null): v is LangType {
  return v === "kr" || v === "en" || v === "jp" || v === "zh";
}

export const useAppStore = defineStore("app", () => {
  const saved = localStorage.getItem("LastLang");
  const lang = ref<LangType>(isLangType(saved) ? saved : "kr");
  const characterId = ref<string | null>(localStorage.getItem("LastCharacter"));

  watch(lang, (v) => localStorage.setItem("LastLang", v));
  watch(characterId, (v) => {
    if (v !== null) localStorage.setItem("LastCharacter", v);
    else localStorage.removeItem("LastCharacter");
  });

  function setLang(v: LangType) { lang.value = v; }
  function setCharacterId(v: string | null) { characterId.value = v; }

  return { lang, setLang, characterId, setCharacterId };
});
