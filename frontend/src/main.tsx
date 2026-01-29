import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/hooks/appStore";
import { StyleProvider } from "@/hooks/styleStore";
import { PopupProvider } from "@/contexts/PopupContext";
import "./index.css";

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
