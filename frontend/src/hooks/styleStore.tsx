import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface StyleStore {

}

const AppContext = createContext<StyleStore | null>(null);

export function StyleProvider({ children }: { children: ReactNode }) {

    const value: StyleStore = {
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
