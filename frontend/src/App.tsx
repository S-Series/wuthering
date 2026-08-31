import { Routes, Route } from "react-router-dom";
import Layout from "./components/_Layout/Layout";
import Home from "@/pages/Home";
import Card from "@/pages/Card/index";
import Characters from "@/pages/Characters";
import Profile from "./pages/Profile";
import Board from "@/pages/Board";
import BoardDetail from "@/pages/BoardDetail";
import BoardEditor from "@/pages/BoardEditor";

import DragDebugPage from "./pages/Debug";
import OcrServerWatcher from "@/components/features/OcrServerWatcher";

export default function App() {
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
          <Route path="/board" element={<Board />} />
          <Route path="/board/write" element={<BoardEditor />} />
          <Route path="/board/:postId/edit" element={<BoardEditor />} />
          <Route path="/board/:postId" element={<BoardDetail />} />

          <Route path="/debug" element={<DragDebugPage />} />
        </Route>
      </Routes>
    </>
  );
}
