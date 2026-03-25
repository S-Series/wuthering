import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

type Props = {
  setAction: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ setAction }: Props) {
  const { loginAction, loginWithGoogleAction } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.trim() !== "" && password.trim() !== "";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    loginAction(email, password);
  };

  return (
    <div className="profile-page">
      <section className="profile-info">
        <div className="profile-info-inner">
          <p className="profile-info-eyebrow">Welcome Back</p>

          <h1 className="profile-info-title">
            {`다시 오신 걸 환영합니다\n`}<em>WuWa DEV</em> 입니다
          </h1>

          <p className="profile-info-desc">
            로그인하면 저장된 데이터를 불러오고, OCR 및 이미지 생성 기록을
            관리할 수 있습니다.
          </p>

          <ul className="profile-info-list">
            <li>유저 데이터 불러오기</li>
            <li>OCR / 이미지 생성 기록 관리</li>
            <li>멤버십 기능 확장 대비</li>
          </ul>
        </div>
      </section>

      <section className="profile-panel">
        <form className="profile-card" onSubmit={onSubmit}>
          <div className="profile-card-header">
            <h2>로그인</h2>
            <p>이메일 또는 Google 계정으로 로그인할 수 있습니다.</p>
          </div>

          <div className="profile-field">
            <label htmlFor="login-email">이메일</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="profile-submit"
            type="submit"
            disabled={!isValid}
          >
            로그인
          </button>

          <div className="profile-card-footer">
            <span>또는</span>
          </div>

          <button
            type="button"
            className="profile-submit google"
            onClick={() => loginWithGoogleAction()}
          >
            Google 계정으로 로그인
          </button>

          <div className="profile-card-footer" style={{ marginTop: 18 }}>
            <span>아직 계정이 없나요?</span>
            <button
              type="button"
              className="profile-text-button"
              onClick={() => setAction(true)}
            >
              회원가입
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}