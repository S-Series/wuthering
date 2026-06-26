import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import AccountRecovery from "@/components/features/Profile/AccountRecovery";

type Props = {
  setAction: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ setAction }: Props) {
  const { loginAction, loginWithGoogleAction } = useAuthStore();
  const { openElevatedOverlay } = useElevatedOverlay();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = email.trim() !== "" && password.trim() !== "" && !isSubmitting;

  const getLoginErrorMessage = (error: unknown) => {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

    if (
      code === "auth/invalid-credential" ||
      code === "auth/user-not-found" ||
      code === "auth/wrong-password"
    ) {
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    }

    if (code === "auth/invalid-email") {
      return "이메일 형식이 올바르지 않습니다.";
    }

    if (code === "auth/too-many-requests") {
      return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
    }

    if (code === "auth/popup-closed-by-user") {
      return "Google 로그인 창이 닫혔습니다.";
    }

    if (code === "auth/popup-blocked") {
      return "브라우저에서 Google 로그인 팝업이 차단되었습니다.";
    }

    if (code === "auth/cancelled-popup-request") {
      return "이미 진행 중인 Google 로그인 요청이 있습니다.";
    }

    if (code === "auth/account-exists-with-different-credential") {
      return "같은 이메일로 다른 로그인 방식의 계정이 이미 있습니다.";
    }

    if (code === "auth/unauthorized-domain") {
      return "현재 도메인이 Google 로그인 허용 도메인에 등록되어 있지 않습니다.";
    }

    return "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setMessage("");
    setIsSubmitting(true);

    try {
      await loginAction(email, password);
    } catch (error) {
      setMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage("");
    setIsSubmitting(true);

    try {
      await loginWithGoogleAction();
    } catch (error) {
      setMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page profile-login-page">
      <section className="profile-login-shell">
        <div className="profile-login-hero">
          <p className="profile-info-eyebrow">Welcome Back</p>
          <h1 className="profile-info-title">
            {`다시 오신 걸 환영합니다\n`}<em>WuWa DEV</em> 입니다
          </h1>

          <p className="profile-info-desc">
            로그인하면 저장된 데이터를 불러오고, OCR 및 이미지 생성 기록을
            관리할 수 있습니다.
          </p>
        </div>

        <section className="profile-panel profile-login-panel">
          <div className="profile-login-heading">
            <h2>로그인</h2>
            <p>이메일 또는 Google 계정으로 로그인할 수 있습니다.</p>
          </div>

          <form className="profile-card profile-login-card" onSubmit={onSubmit}>
            <div className="profile-card-body">
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
                <div className="profile-password-field">
                  <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                  <button
                  type="button"
                  className="profile-password-toggle"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "숨김" : "보기"}
                  </button>
                </div>
              </div>

              <div className="profile-find-row">
                <button
                  type="button"
                  onClick={() => openElevatedOverlay(
                    <AccountRecovery defaultMode="id" defaultEmail={email} />,
                    { title: "아이디 찾기", width: "min(92vw, 26rem)" }
                  )}
                >
                  아이디 찾기
                </button>
                <span />
                <button
                  type="button"
                  onClick={() => openElevatedOverlay(
                    <AccountRecovery defaultMode="password" defaultEmail={email} />,
                    { title: "비밀번호 찾기", width: "min(92vw, 26rem)" }
                  )}
                >
                  비밀번호 찾기
                </button>
              </div>

              <button
                className="profile-submit"
                type="submit"
                disabled={!isValid}
              >
                {isSubmitting ? "로그인 중" : "로그인"}
              </button>

              {message ? (
                <p className="profile-login-message error">{message}</p>
              ) : null}

              <div className="profile-card-footer">
                <span>또는</span>
              </div>

              <button
                type="button"
                className="profile-submit google"
                disabled={isSubmitting}
                onClick={handleGoogleLogin}
              >
                Google 계정으로 로그인
              </button>

              <div className="profile-card-footer profile-signup-link">
                <span>아직 계정이 없나요?</span>
                <button
                  type="button"
                  className="profile-text-button"
                  onClick={() => setAction(true)}
                >
                  회원가입
                </button>
              </div>
            </div>
          </form>
        </section>

        <ul className="profile-info-list profile-info-list-bottom">
          <li>유저 데이터 불러오기</li>
          <li>OCR / 이미지 생성 기록 관리</li>
          <li>멤버십 기능 확장 대비</li>
        </ul>
      </section>
    </div>
  );
}
