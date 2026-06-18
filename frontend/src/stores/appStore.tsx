import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// ===============================================

export type LangType = "kr" | "en" | "jp" | "zh";
export type LocaleText = Record<LangType, string>;

const CARD_GUIDE_DISMISSED_STORAGE_KEY =
    "wuthering.cardGuide.dismissed";
const CARD_GUIDE_AUTO_OPEN_HANDLED_SESSION_KEY =
    "wuthering.cardGuide.autoOpenHandled";

export interface AppStore {
    imgVer: number;
    isAppStorageReady: boolean;
    lang: LangType;
    setLang: (v: LangType) => void;

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

    const value: AppStore = {
        imgVer,
        isAppStorageReady,
        lang,
        setLang,
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
