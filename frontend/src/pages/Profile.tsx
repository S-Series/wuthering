import { useMemo, useState } from "react";

import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { saveGameProfile } from "@/firebase/user";

import Login from "@/components/features/Profile/Login";
import ProfileView from "@/components/features/Profile/ProfileView";
import Signup from "@/components/features/Profile/Signup";

import "./Profile.css"

export default function Profile() {
  const { lang } = useAppStore();
  const { user, gameProfile, isLoading, signupAction, loginAction, loginWithGoogleAction, logoutAction } = useAuthStore();

  const [isSignIn, setSignIn] = useState(false);

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  const userImageUrl = useMemo(() => {
    return [
      user?.imageUrl ?? "/default.webp",
      `${BASE_URL}/character/${gameProfile?.characterId ?? "rover_spectro"}/ico.webp`,
      `${BASE_URL}/character/${gameProfile?.characterId ?? "rover_spectro"}/stand.png`,
      `./stand.png`
    ]
  }, [user?.imageUrl, gameProfile?.characterId])

  if (isLoading) return <div style={{alignSelf: "center"}}>Loading...</div>
  return (
    <div id="page-slot">{
      user
        ? <ProfileView />
        : isSignIn
          ? <Signup setAction={setSignIn} />
          : <Login setAction={setSignIn} />
    }</div>
  )
}