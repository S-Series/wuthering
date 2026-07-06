import { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";
import type { ReactNode } from "react";

// ===============================================

export type LangType = "kr" | "en" | "jp" | "zh";
export type ThemeType = "dark" | "light";
export type LocaleText = Record<LangType, string>;

const CARD_GUIDE_DISMISSED_STORAGE_KEY =
    "wuthering.cardGuide.dismissed";
const CARD_GUIDE_AUTO_OPEN_HANDLED_SESSION_KEY =
    "wuthering.cardGuide.autoOpenHandled";
const APP_THEME_STORAGE_KEY = "wuthering.theme";

export interface AppStore {
    imgVer: number;
    isAppStorageReady: boolean;
    lang: LangType;
    setLang: (v: LangType) => void;
    theme: ThemeType;
    toggleTheme: () => void;

    characterId: string | null;
    setCharacterId: (v: string | null) => void;

    cardGuideDismissed: boolean;
    cardGuideAutoOpenHandled: boolean;
    setCardGuideAutoOpenHandled: (v: boolean) => void;
    saveCardGuideDismissed: (v: boolean) => void;
}

// ===============================================

export function isLangType(v: string | null): v is LangType {
  return v === "kr" || v === "en" || v === "jp" || v === "zh";
}

function isThemeType(v: string | null): v is ThemeType {
  return v === "dark" || v === "light";
}

// ===============================================

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {

    const imgVer = 1;
    const [isAppStorageReady, setIsAppStorageReady] = useState(false);

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
    const [characterId, setCharacterId] = useState<string | null>(() => {
        return localStorage.getItem("LastCharacter");
    });
    const [theme, setTheme] = useState<ThemeType>(() => {
        const saved = localStorage.getItem(APP_THEME_STORAGE_KEY);
        if (isThemeType(saved)) return saved;

        return "dark";
    });
    const [cardGuideDismissed, setCardGuideDismissed] = useState(false);
    const [cardGuideAutoOpenHandled, setCardGuideAutoOpenHandled] =
        useState(false);

    useEffect(() => {
        const hydrateId = window.setTimeout(() => {
            const savedCardGuideDismissed =
                localStorage.getItem(CARD_GUIDE_DISMISSED_STORAGE_KEY) === "true";
            const savedCardGuideAutoOpenHandled =
                sessionStorage.getItem(CARD_GUIDE_AUTO_OPEN_HANDLED_SESSION_KEY) === "true";
            setCardGuideDismissed(savedCardGuideDismissed);
            setCardGuideAutoOpenHandled(savedCardGuideAutoOpenHandled);
            setIsAppStorageReady(true);
        }, 0);

        return () => {
            window.clearTimeout(hydrateId);
        };
    }, [])

    useEffect(() => {
        localStorage.setItem("LastLang", lang);
    }, [lang])
    useEffect(() => {
        if (characterId !== null) {
            localStorage.setItem("LastCharacter", characterId);
        } else { localStorage.removeItem("LastCharacter"); }
    }, [characterId])

    useLayoutEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
    }, [theme]);

    const saveCardGuideDismissed = (value: boolean) => {
        setCardGuideDismissed(value);
        localStorage.setItem(CARD_GUIDE_DISMISSED_STORAGE_KEY, String(value));
    };

    const saveCardGuideAutoOpenHandled = (value: boolean) => {
        setCardGuideAutoOpenHandled(value);
        sessionStorage.setItem(
            CARD_GUIDE_AUTO_OPEN_HANDLED_SESSION_KEY,
            String(value)
        );
    };

    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const value: AppStore = {
        imgVer,
        isAppStorageReady,
        lang,
        setLang,
        theme,
        toggleTheme,
        characterId,
        setCharacterId,
        cardGuideDismissed,
        cardGuideAutoOpenHandled,
        setCardGuideAutoOpenHandled: saveCardGuideAutoOpenHandled,
        saveCardGuideDismissed,
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
