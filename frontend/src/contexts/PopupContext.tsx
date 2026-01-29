import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import "./PopupContext.css"

type PopupContextType = {
  openPopup: (content: ReactNode) => void;
  closePopup: () => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  const openPopup = (node: ReactNode) => {
    setContent(node);
  };

  const closePopup = () => {
    setContent(null);
  };

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {content && (
        <div className="global-popup" onClick={closePopup}>
          <div
            className="global-popup-inner"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used inside PopupProvider");
  return ctx;
}
