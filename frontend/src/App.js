import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Character from "./pages/Character";
import User from "./pages/Userinfo";

import { ProfileProvider } from "./hooks/useProfile";
import { ApiProvider } from "./hooks/useApi";
import { FirebaseProvider } from "./hooks/useFirebase";
import { UserDataProvider } from "./hooks/useUserData";

function App() {
  return (
    <ApiProvider>
      <FirebaseProvider>
        <UserDataProvider>
          <BrowserRouter>
            <ProfileProvider>
              <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/character" element={<Character />} />
                <Route path="/user-info" element={<User />} />
              </Routes>
            </ProfileProvider>
          </BrowserRouter>
        </UserDataProvider>
      </FirebaseProvider>
    </ApiProvider>
  );
}

export default App;
