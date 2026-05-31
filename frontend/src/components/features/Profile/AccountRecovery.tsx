import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

type RecoveryMode = "id" | "password";

type Props = {
  defaultMode?: RecoveryMode;
  defaultEmail?: string;
};

export default function AccountRecovery({
  defaultMode = "password",
  defaultEmail = "",
}: Props) {
  const { resetPasswordAction } = useAuthStore();
  const [mode, setMode] = useState<RecoveryMode>(defaultMode);
  const [email, setEmail] = useState(defaultEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isValidEmail = email.trim().includes("@");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      await resetPasswordAction(email.trim());
      setStatus("success");
      setMessage("입력한 이메일로 비밀번호 재설정 메일을 보냈습니다.");
    } catch {
      setStatus("error");
      setMessage("메일 발송에 실패했습니다. 이메일 주소를 다시 확인해주세요.");
    }
  };

  return (
    <div className="profile-recovery-slot">
      <div className="profile-recovery-tabs" role="tablist" aria-label="계정 찾기">
        <button
          type="button"
          className={mode === "id" ? "active" : ""}
          onClick={() => setMode("id")}
        >
          아이디 찾기
        </button>
        <button
          type="button"
          className={mode === "password" ? "active" : ""}
          onClick={() => setMode("password")}
        >
          비밀번호 찾기
        </button>
      </div>

      {mode === "id" ? (
        <div className="profile-recovery-guide">
          <h3>가입 이메일이 로그인 아이디입니다.</h3>
          <p>
            Google로 가입했다면 Google 계정으로 로그인해주세요. 이메일을 잊었다면
            가입 시 사용했을 가능성이 있는 메일함에서 WuWa DEV 관련 메일을 확인해주세요.
          </p>
        </div>
      ) : (
        <form className="profile-recovery-form" onSubmit={onSubmit}>
          <div className="profile-field">
            <label htmlFor="recovery-email">가입 이메일</label>
            <input
              id="recovery-email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
                setMessage("");
              }}
              autoComplete="email"
            />
          </div>

          <button
            className="profile-submit"
            type="submit"
            disabled={!isValidEmail || status === "loading"}
          >
            {status === "loading" ? "메일 발송 중" : "재설정 메일 보내기"}
          </button>

          {message ? (
            <p className={`profile-recovery-message ${status}`}>{message}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
