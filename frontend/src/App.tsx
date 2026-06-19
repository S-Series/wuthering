import { Routes, Route } from "react-router-dom";
import Layout from "./components/_Layout/Layout";
import Home from "@/pages/Home";
import Card from "@/pages/Card/index";
import Characters from "@/pages/Characters";
import Profile from "./pages/Profile";

import DragDebugPage from "./pages/Debug";
import OcrServerWatcher from "@/components/features/OcrServerWatcher";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <OcrServerWatcher />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/card" element={<Card />} />
          <Route path="/card/:characterId" element={<Card />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/debug" element={<DragDebugPage />} />
        </Route>
      </Routes>
    </>
  );
}
