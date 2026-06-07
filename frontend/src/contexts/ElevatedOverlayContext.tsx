import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { useAppStore } from "@/stores/appStore";
import {
  ELEVATED_OVERLAY_DEFAULT_OPTIONS,
  ElevatedOverlayContext,
  type ElevatedOverlayApi,
  type ElevatedOverlayOptions,
  type ElevatedOverlayState,
} from "./ElevatedOverlayContext.shared";
import {
  lockDocumentScroll,
  unlockDocumentScroll,
} from "./documentScrollLock";

import "./ElevatedOverlayContext.css";

export function ElevatedOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useAppStore();
  const [state, setState] = useState<ElevatedOverlayState>({
    open: false,
    node: null,
    options: ELEVATED_OVERLAY_DEFAULT_OPTIONS,
  });

  const closeElevatedOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, open: false, node: null }));
  }, []);

  const openElevatedOverlay = useCallback(
    (node: React.ReactNode, options?: ElevatedOverlayOptions) => {
      setState({
        open: true,
        node,
        options: { ...ELEVATED_OVERLAY_DEFAULT_OPTIONS, ...(options ?? {}) },
      });
    },
    [],
  );

  useEffect(() => {
    if (!state.open) return;

    lockDocumentScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && state.options.closeOnEsc) {
        closeElevatedOverlay();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockDocumentScroll();
    };
  }, [state.open, state.options.closeOnEsc, closeElevatedOverlay]);

  const api = useMemo<ElevatedOverlayApi>(
    () => ({
      openElevatedOverlay,
      closeElevatedOverlay,
      isElevatedOverlayOpen: state.open,
    }),
    [openElevatedOverlay, closeElevatedOverlay, state.open],
  );

  return (
    <ElevatedOverlayContext.Provider value={api}>
      {children}
      {state.open
        ? createPortal(
            <div
              className="elevated-overlay-backdrop"
              role="dialog"
              aria-modal="true"
              onMouseDown={(event) => {
                if (!state.options.closeOnBackdrop) return;
                if (event.target === event.currentTarget) {
                  closeElevatedOverlay();
                }
              }}
            >
              <div
                className="elevated-overlay-panel"
                style={{
                  width: state.options.width ?? undefined,
                  height: state.options.height ?? undefined,
                  aspectRatio: state.options.ratio ?? undefined,
                }}
              >
                {(state.options.title || state.options.showCloseButton) && (
                  <div className="elevated-overlay-header">
                    <span
                      className={`elevated-overlay-header-text ${lang}-font`}
                    >
                      {state.options.title}
                    </span>

                    {state.options.showCloseButton && (
                      <button
                        type="button"
                        aria-label="close"
                        onClick={closeElevatedOverlay}
                        className="elevated-overlay-close-btn"
                      />
                    )}
                  </div>
                )}

                <div className="elevated-overlay-body">{state.node}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </ElevatedOverlayContext.Provider>
  );
}
