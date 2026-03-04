import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/stores/appStore";
import { StyleProvider } from "@/stores/styleStore";
import { CharacterProvider } from "@/stores/characterDataStore";
import { OverlayProvider } from "@/contexts/PopupContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <StyleProvider>
          <OverlayProvider>
            <CharacterProvider>
              <App />
            </CharacterProvider>
          </OverlayProvider>
        </StyleProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
