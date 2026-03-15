import { useEffect, useMemo, useState } from "react";
import { type UserProfile } from "@/firebase/auth";

import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";

import "./Profile.css"
import { saveGameProfile } from "@/firebase/user";

export default function Profile() {
  const { lang } = useAppStore();
  const { user, gameProfile, isLoading, signupAction, loginAction, loginWithGoogleAction, logoutAction } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div id="page-slot">
      {user ? (
        <div className="profile-field">
          <img className="main-stand-image" src={userImageUrl[2]} />
          <div className="container">
            <div className="user-info">
              <div className="profile-image-wrap">
                <img className="profile-image" src={userImageUrl[0]} />
              </div>

              <div className="profile-image-wrap">
                <img className="profile-image" src={userImageUrl[1]} />
              </div>

              <div className="text-box">
                <span className="num-font">{`Lv.${gameProfile?.gameLevel ?? 1}`}  <em>{`${user.nickname}`}</em></span>
                <span className="num-font">{`${gameProfile?.server ?? "unknown"} / Uid.`} <em>{`${gameProfile?.gameUid ?? "- - - - - - -"}`}</em></span>
                <span className="num-font">Joined. <em>{`${new Date(user.createdAt).toISOString().slice(0, 10)}`}</em> ~</span>
                <span className="num-font">Membership. 
                  {"  "}{<img src="./default.webp"/>}{"  "}
                  (~<em>{`${new Date(user.createdAt).toISOString().slice(0, 10)}`})</em>
                </span>
              </div>
              <div className="button-box">
                <button>정보수정</button>
                <button onClick={() => logoutAction()}>로그아웃</button>
              </div>
            </div>

            <div className="game-info">
              
            </div>
          </div>
        </div>
      ) : (
        <div className="login-field">
          <span>Login</span>

          <input className="input-field id"
            disabled={true}
            type="email"
            placeholder="example@domain.com"
            onChange={(e) => setEmail(e.target.value)} />

          <input className="input-field password"
            disabled={true}
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)} />

          <button className="login-button normal"
            disabled={true}
            onClick={() => { if (!email || !password) return; loginAction(email, password) }}>
            <img src="/default.webp" />
            <span className={`${lang}-font`}>일반 계정으로 로그인</span>
          </button>

          <button className="login-button google"
            disabled={false}
            onClick={() => loginWithGoogleAction()}>
            <img src="/google.png" />
            <span className={`${lang}-font`}>Google 계정으로 로그인</span>
          </button>

          <button className="login-button signup"
            disabled={true}
            onClick={() => { }}>
            <img src="/default.webp" />
            <span className={`${lang}-font`}>회원가입</span>
          </button>
        </div>
      )}
    </div>
  )
}