import { useState } from "react";
import "./App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { useFirebase } from "../hooks/useFirebase";
import "./LoginSection.css";

function LoginSection() {
  const {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    resendVerificationEmail,
  } = useFirebase();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = () => {
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return false;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validatePassword()) return;

    setLoading(true);
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  // 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validatePassword()) return;

    setLoading(true);
    const result = await signup(email, password, displayName || "사용자");

    if (result.success) {
      setMessage("회원가입 완료! 프로필에서 이메일 인증을 진행해주세요.");
      // 입력값 초기화
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDisplayName("");
      setIsSignUp(false);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Google 로그인
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const result = await loginWithGoogle();

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  // 이메일 인증 발송
  const handleSendVerification = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    const result = await resendVerificationEmail();

    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // 페이지 새로고침 (인증 상태 업데이트)
  const handleRefreshVerification = async () => {
    if (currentUser) {
      await currentUser.reload();
      window.location.reload();
    }
  };

  return (
    <div className="app-wrapper">
      <div className="viewport">
        <div className="main-content">
          <div className="userinfo-container">
            {currentUser ? (
              // 로그인된 상태 - 프로필
              <div className="user-profile">
                <h2>프로필</h2>
                <div className="profile-card">
                  <div className="profile-avatar">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {currentUser.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <h3>{currentUser.displayName || "사용자"}</h3>
                    <p className="email">{currentUser.email}</p>
                    <p className="user-id">UID: {currentUser.uid}</p>

                    {/* 이메일 인증 상태 */}
                    <div className="email-verification-section">
                      {currentUser.emailVerified ? (
                        <div className="verified-badge">
                          ✅ 이메일 인증 완료
                        </div>
                      ) : (
                        <div className="unverified-section">
                          <div className="unverified-badge">
                            ❌ 이메일 미인증
                          </div>
                          <p className="verification-info">
                            이메일 인증을 완료하면 모든 기능을 사용할 수
                            있습니다.
                          </p>

                          {message && (
                            <p className="success-message">{message}</p>
                          )}
                          {error && <p className="error-message">{error}</p>}

                          <button
                            onClick={handleSendVerification}
                            className="verification-btn"
                            disabled={loading}>
                            {loading ? "발송 중..." : "인증 메일 발송"}
                          </button>

                          <button
                            onClick={handleRefreshVerification}
                            className="secondary-btn"
                            style={{ marginTop: "10px" }}>
                            인증 완료 후 새로고침
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button onClick={logout} className="logout-btn">
                  로그아웃
                </button>
              </div>
            ) : (
              // 로그인/회원가입 폼
              <div className="login-box">
                <h2>{isSignUp ? "회원가입" : "로그인"}</h2>

                <form onSubmit={isSignUp ? handleSignup : handleLogin}>
                  {isSignUp && (
                    <div className="input-group">
                      <label>닉네임 (선택)</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="사용할 닉네임"
                      />
                    </div>
                  )}

                  <div className="input-group">
                    <label>이메일</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>비밀번호</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6자 이상 입력"
                      required
                    />
                  </div>

                  {isSignUp && (
                    <div className="input-group">
                      <label>비밀번호 확인</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호 재입력"
                        required
                      />
                    </div>
                  )}

                  {error && <p className="error-message">{error}</p>}
                  {message && <p className="success-message">{message}</p>}

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}>
                    {loading ? "처리 중..." : isSignUp ? "회원가입" : "로그인"}
                  </button>
                </form>

                <div className="divider">또는</div>

                <button
                  onClick={handleGoogleLogin}
                  className="google-btn"
                  disabled={loading}>
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                  />
                  Google로 로그인
                </button>

                <p className="toggle-text">
                  {isSignUp ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}
                  <span
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                      setMessage("");
                    }}>
                    {isSignUp ? " 로그인" : " 회원가입"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSection;
