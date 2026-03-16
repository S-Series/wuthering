import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";

type Props = {
  setAction: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Signup({ setAction }: Props) {
  const { lang } = useAppStore();
  const { loginAction, loginWithGoogleAction } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-field">
      <span>Login</span>

      <input className="input-field id"
        type="email"
        placeholder="example@domain.com"
        onChange={(e) => setEmail(e.target.value)} />

      <input className="input-field password"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)} />

      <button className="login-button normal"
        onClick={() => { if (!email || !password) return; loginAction(email, password) }}>
        <img src="/default.webp" />
        <span className={`${lang}-font`}>일반 계정으로 로그인</span>
      </button>

      <button className="login-button google"
        onClick={() => loginWithGoogleAction()}>
        <img src="/google.png" />
        <span className={`${lang}-font`}>Google 계정으로 로그인</span>
      </button>

      <button className="login-button signup"
        disabled={true}
        onClick={() => { setAction(true) }}>
        <img src="/default.webp" />
        <span className={`${lang}-font`}>회원가입</span>
      </button>
    </div>
  )
}
