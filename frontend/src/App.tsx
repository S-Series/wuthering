import { Routes, Route } from "react-router-dom";
import Layout from "./components/_Layout/Layout";
import Home from "@/pages/Home";
import Card from "@/pages/Card";
import Characters from "@/pages/Characters";

import DragDebugPage from "./pages/Debug";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/card" element={<Card />} />
        <Route path="/debug" element={<DragDebugPage />} />
      </Route>
    </Routes>
  );
}