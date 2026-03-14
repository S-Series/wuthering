import { useState } from "react";
import { type UserProfile } from "@/firebase/auth";

import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";

import "./Profile.css"

export default function Profile() {
  const { lang } = useAppStore();
  const {signupAction, loginAction, loginWithGoogleAction, logoutAction} = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <div id="page-slot">
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
          onChange={(e) => setPassword(e.target.value)}/>

        <button className="login-button normal"
          disabled={true}
          onClick={() => { if (!email || !password) return; loginAction(email, password) }}>
          <img src="/default.webp"/>
          <span className={`${lang}-font`}>일반 계정으로 로그인</span>
        </button>

        <button className="login-button google"
          disabled={false}
          onClick={() => loginWithGoogleAction()}>
          <img src="/google.png"/>
          <span className={`${lang}-font`}>Google 계정으로 로그인</span>
        </button>

        <button className="login-button signup"
          disabled={true}
          onClick={() => {}}>
          <img src="/default.webp"/>
          <span className={`${lang}-font`}>회원가입</span>
        </button>
      </div>
    </div>
  )
}