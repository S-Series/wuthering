import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import "./PopupContext.css";
import { useAppStore } from "@/stores/appStore";
import {
  lockDocumentScroll,
  unlockDocumentScroll,
} from "./documentScrollLock";

type OverlayOptions = {
  title?: string;
  width?: string | null;
  height?: string | null;
  ratio?: string | null;
  closeOnEsc?: boolean;           // default false
  closeOnBackdrop?: boolean;      // default true
  showCloseButton?: boolean;      // default true
};

type OverlayState =
  | { open: false; node: null; options: Required<OverlayOptions> }
  | { open: true; node: React.ReactNode; options: Required<OverlayOptions> };

type OverlayApi = {
  openOverlay: (node: React.ReactNode, options?: OverlayOptions) => void;
  closeOverlay: () => void;
  isOpen: boolean;
};

const DEFAULT_OPTIONS: Required<OverlayOptions> = {
  title: "",
  width: null,
  height: null,
  ratio: null,
  closeOnEsc: false,
  closeOnBackdrop: true,
  showCloseButton: true,
};

const Ctx = createContext<OverlayApi | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {

  const { lang } = useAppStore();

  const [state, setState] = useState<OverlayState>({
    open: false,
    node: null,
    options: DEFAULT_OPTIONS,
  });

  const closeOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, open: false, node: null }));
  }, []);

  const openOverlay = useCallback((node: React.ReactNode, options?: OverlayOptions) => {
    setState({
      open: true,
      node,
      options: { ...DEFAULT_OPTIONS, ...(options ?? {}) },
    });
  }, []);

  useEffect(() => {
    if (!state.open) return;

    lockDocumentScroll();

    return () => {
      unlockDocumentScroll();
    };
  }, [state.open, state.options.closeOnEsc, closeOverlay]);

  const api = useMemo<OverlayApi>(
    () => ({
      openOverlay,
      closeOverlay,
      isOpen: state.open,
    }),
    [openOverlay, closeOverlay, state.open]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {state.open
        ? createPortal(
          <div className="overlay-backdrop"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (!state.options.closeOnBackdrop) return;
              if (e.target === e.currentTarget) closeOverlay();
            }}
          >
            <div className="overlay-panel" style={{
                width: state.options.width ?? undefined,
                height: state.options.height ?? undefined,
                aspectRatio: state.options.ratio ?? undefined,
              }}>
              {(state.options.title || state.options.showCloseButton) && (
                <div className="overlay-header">
                  <span className={`overlay-header-text ${lang}-font`}>{state.options.title}</span>

                  {state.options.showCloseButton && (
                    <button
                      type="button"
                      aria-label="close"
                      onClick={closeOverlay}
                      className="overlay-close-btn"
                    />
                  )}
                </div>
              )}

              <div className="overlay-body">
                {state.node}
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </Ctx.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOverlay must be used within OverlayProvider");
  return ctx;
}
