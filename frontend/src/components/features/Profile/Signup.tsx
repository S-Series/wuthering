import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useOverlay } from "@/contexts/PopupContext";

import Terms from "@/components/features/Profile/Terms";
import Privacy from "@/components/features/Profile/Privacy";

type Props = {
  setAction: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Signup({ setAction }: Props) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    agree: false,
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { signupAction } = useAuthStore();
  const { openOverlay } = useOverlay();

  const isPasswordMatched =
    form.password.length > 0 &&
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const isValid =
    form.email.trim() !== "" &&
    form.password.trim() !== "" &&
    form.passwordConfirm.trim() !== "" &&
    form.nickname.trim() !== "" &&
    form.agree &&
    isPasswordMatched;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    await signupAction(form.email, form.password, form.nickname);
  };

  return (
    <div className="profile-page">
      <section className="profile-info">
        <div className="profile-info-inner">
          <p className="profile-info-eyebrow">Create Account</p>
          <h1 className="profile-info-title">
            {`환영합니다\n`}<em>WuWa DEV</em> 입니다
          </h1>
          <p className="profile-info-desc">
            {`계정을 만들면 다양한 편의기능을 받으실 수 있습니다.`}
          </p>

          <ul className="profile-info-list">
            <li>유저별 데이터 저장</li>
            <li>OCR / 이미지 생성 기록 관리</li>
            <li>멤버십 기능 확장 대비</li>
          </ul>
        </div>
      </section>

      <section className="profile-panel">
        <form className="profile-card" onSubmit={onSubmit}>
          <div className="profile-card-header">
            <h2>회원가입</h2>
            <p>이메일과 비밀번호로 계정을 생성합니다.</p>
          </div>

          <div className="profile-field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={onChangeInput}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임 입력"
              value={form.nickname}
              onChange={onChangeInput}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={onChangeInput}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 다시 입력"
              value={form.passwordConfirm}
              onChange={onChangeInput}
            />
            {form.passwordConfirm.length > 0 ? (
              <p
                className={[
                  "profile-field-hint",
                  isPasswordMatched ? "success" : "error",
                ].join(" ")}
              >
                {isPasswordMatched
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            ) : (<div style={{height: "16px"}}/>)}
          </div>

          <label className="profile-check">
            <input
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={onChangeInput}
            />
            <span>
              <em onClick={() => { openOverlay(<Terms/>) }}>이용약관</em>
              &nbsp;및&nbsp;
              <em onClick={() => { openOverlay(<Privacy/>) }}>개인정보 처리</em>에 동의합니다.
            </span>
          </label>

          <button className="profile-submit" type="submit" disabled={!isValid}>
            회원가입
          </button>

          <div className="profile-card-footer">
            <span>이미 계정이 있나요?</span>
            <button type="button" className="profile-text-button"
              onClick={() => {setAction(false)}}>
              로그인
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
