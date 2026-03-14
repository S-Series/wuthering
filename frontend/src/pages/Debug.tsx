import { useState } from "react";
import { login, loginWithGoogle, logout, signup, type UserProfile } from "@/firebase/auth";

export default function Debug() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [user, setUser] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");

  console.log(import.meta.env.VITE_FIREBASE_API_KEY);

  const handleSignup = async () => {
    setMessage("");

    try {
      const userData = await signup(email, password, nickname);
      setUser(userData);
      setMessage("회원가입 성공");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "회원가입 실패");
    }
  };

  const handleGoogleLogin = async () => {
    setMessage("");

    try {
      const userData = await loginWithGoogle();
      setUser(userData);
      setMessage("Google 로그인 성공");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Google 로그인 실패");
    }
  };

  const handleLogin = async () => {
    setMessage("");

    try {
      const userData = await login(email, password);
      setUser(userData);
      setMessage("로그인 성공");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "로그인 실패");
    }
  };

  const handleLogout = async () => {
    setMessage("");

    try {
      await logout();
      setUser(null);
      setMessage("로그아웃 성공");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "로그아웃 실패");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Firebase Auth Debug</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "320px" }}>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>회원가입</button>
        <button onClick={handleLogin}>로그인</button>
        <button onClick={handleGoogleLogin}>Google 로그인</button>
        <button onClick={handleLogout}>로그아웃</button>
      </div>

      <div style={{ marginTop: "16px" }}>
        <p>{message}</p>
      </div>

      <div style={{ marginTop: "16px" }}>
        <h3>유저 데이터</h3>
        {user ? (
          <div>
            <p>uid: {user.uid}</p>
            <p>email: {user.email}</p>
            <p>nickname: {user.nickname}</p>
          </div>
        ) : (
          <p>로그인된 유저 없음</p>
        )}
      </div>
    </div>
  );
}