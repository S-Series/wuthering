import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Character from "./pages/Character";
import { ProfileProvider } from "./hooks/useProfile";

function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/character" element={<Character />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
