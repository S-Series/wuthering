import { useState } from "react";

import { useAuthStore } from "@/stores/authStore";

import Login from "@/components/features/Profile/Login";
import ProfileView from "@/components/features/Profile/ProfileView";
import Signup from "@/components/features/Profile/Signup";

import "./Profile.css"

export default function Profile() {
  const { user, isLoading } = useAuthStore();

  const [isSignIn, setSignIn] = useState(false);

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