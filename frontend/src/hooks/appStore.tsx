import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// ===============================================

export type LangType = "kr" | "en" | "jp" | "zh";

export interface AppStore {
    lang: LangType;
    setLang: (v: LangType) => void;

    characterId: string | null;
    setCharacterId: (v: string | null) => void;
}

// ===============================================

export function isLangType(v: string | null): v is LangType {
  return v === "kr" || v === "en" || v === "jp" || v === "zh";
}

// ===============================================

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<LangType>(() => {
        const saved = localStorage.getItem("LastLang");
        if (
            saved === "kr" ||
            saved === "en" ||
            saved === "jp" ||
            saved === "zh"
        ) {
            return saved;
        }
        return "kr";
    });
    const [characterId, setCharacterId] = useState<string | null>(null);

    useEffect(() => {
        //$ lang
        const lastLang = localStorage.getItem("LastLang");
        if (isLangType(lastLang)) { setLang(lastLang); }
        //$ character
        const lastCharacter = localStorage.getItem("LastCharacter");
        if (lastCharacter !== null) {
            setCharacterId(lastCharacter);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("LastLang", lang);
    }, [lang])
    useEffect(() => {
        if (characterId !== null) {
            localStorage.setItem("LastCharacter", characterId);
        } else { localStorage.removeItem("LastCharacter"); }
    }, [characterId])

    const value: AppStore = {
        lang,
        setLang,
        characterId,
        setCharacterId,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ===============================================

export function useAppStore() {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppStore must be used inside <AppProvider>");
    }
    return ctx;
}
