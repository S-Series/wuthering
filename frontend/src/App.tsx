import { Routes, Route, Navigate } from "react-router-dom";
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
import OcrCropTest from "@/pages/OcrCropTest";
import Dev from "@/pages/Dev";
import DevAnalystic from "@/pages/DevAnalystic";
import SiteTooltipLayer from "@/components/common/SiteTooltipLayer";
import { AboutPage, GuidePage, InformationPage, ScoringPage } from "@/pages/InformationPages";
import Privacy from "@/components/features/Profile/Privacy";
import Terms from "@/components/features/Profile/Terms";

export default function App() {
  return (
    <>
      <OcrServerWatcher />
      <SiteTooltipLayer />
      <Routes>
        <Route path="/test" element={<Navigate to="/dev/ocr" replace />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/guide/scoring" element={<ScoringPage />} />
          <Route path="/privacy" element={<InformationPage title="개인정보처리방침"><Privacy /></InformationPage>} />
          <Route path="/terms" element={<InformationPage title="이용약관"><Terms /></InformationPage>} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/card" element={<Card />} />
          <Route path="/card/:characterId" element={<Card />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/write" element={<BoardEditor />} />
          <Route path="/board/:postId/edit" element={<BoardEditor />} />
          <Route path="/board/:postId" element={<BoardDetail />} />

          <Route path="/debug" element={<DragDebugPage />} />
          <Route path="/dev" element={<Dev />}>
            <Route path="test" element={<Navigate to="/dev/ocr" replace />} />
            <Route path="ocr" element={<OcrCropTest />} />
            <Route path="analystic" element={<DevAnalystic />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
