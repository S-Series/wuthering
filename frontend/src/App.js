import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./pages/Profile";
import Character from "./pages/Character";
import User from "./pages/Userinfo";

import { ProfileProvider } from "./hooks/useProfile";
import { ApiProvider } from "./hooks/useApi";
import { FirebaseProvider } from "./hooks/useFirebase";
import { UserDataProvider } from "./hooks/useUserData";
import { DataHolder } from "./hooks/useDataHolder";

function App() {
  return (
    <ApiProvider>
      <FirebaseProvider>
        <UserDataProvider>
          <BrowserRouter>
            <ProfileProvider>
              <DataHolder>
                <Routes>
                  <Route path="/" element={<Profile />} />
                  <Route path="/character" element={<Character />} />
                  <Route path="/user-info" element={<User />} />
                </Routes>
              </DataHolder>
            </ProfileProvider>
          </BrowserRouter>
        </UserDataProvider>
      </FirebaseProvider>
    </ApiProvider>
  );
}
export default App;
