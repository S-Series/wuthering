import { useContext } from "react";

import { ElevatedOverlayContext } from "./ElevatedOverlayContext.shared";

export function useElevatedOverlay() {
  const context = useContext(ElevatedOverlayContext);
  if (!context) {
    throw new Error(
      "useElevatedOverlay must be used within ElevatedOverlayProvider",
    );
  }

  return context;
}
