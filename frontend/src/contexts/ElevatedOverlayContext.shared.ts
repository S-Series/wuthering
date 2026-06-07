import { createContext, type ReactNode } from "react";

export type ElevatedOverlayOptions = {
  title?: string;
  width?: string | null;
  height?: string | null;
  ratio?: string | null;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
};

export type ElevatedOverlayState =
  | {
      open: false;
      node: null;
      options: Required<ElevatedOverlayOptions>;
    }
  | {
      open: true;
      node: ReactNode;
      options: Required<ElevatedOverlayOptions>;
    };

export type ElevatedOverlayApi = {
  openElevatedOverlay: (
    node: ReactNode,
    options?: ElevatedOverlayOptions,
  ) => void;
  closeElevatedOverlay: () => void;
  isElevatedOverlayOpen: boolean;
};

export const ELEVATED_OVERLAY_DEFAULT_OPTIONS: Required<ElevatedOverlayOptions> =
  {
    title: "",
    width: null,
    height: null,
    ratio: null,
    closeOnEsc: true,
    closeOnBackdrop: true,
    showCloseButton: true,
  };

export const ElevatedOverlayContext =
  createContext<ElevatedOverlayApi | null>(null);
