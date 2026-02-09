import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/stores/appStore";
import { StyleProvider } from "@/stores/styleStore";
import { PopupProvider } from "@/contexts/PopupContext";
import "./index.css";

import { bindUserStoreToSaveStore } from "@/stores/bindStores";
import { useSaveStore } from "@/stores/saveStore";
import { useUserStore } from "@/stores/userStore";
import { characterStat } from "@/datas/characterStats";
import type { CharacterId } from "@/datas/characterStats";

bindUserStoreToSaveStore();

const FALLBACK_ID = "rover_spectro" as CharacterId;

const pickBootCharacterId = (): CharacterId => {
  const raw = localStorage.getItem("selectedCharacterId");
  if (raw && raw in characterStat) return raw as CharacterId;
  return FALLBACK_ID;
};

useSaveStore.persist.onFinishHydration(() => {
  useUserStore.getState().setSelectedCharacter(pickBootCharacterId());
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <StyleProvider>
          <PopupProvider>
            <App />
          </PopupProvider>
        </StyleProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
