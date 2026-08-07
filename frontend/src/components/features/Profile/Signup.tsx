import { useState } from "react";
import type { PasswordValidationStatus } from "firebase/auth";

import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import { validateNewPassword } from "@/firebase/auth";
import { locale } from "@/locales/locale";
import type { LocaleSchema } from "@/locales/locale.schema";

import Terms from "@/components/features/Profile/Terms";
import Privacy from "@/components/features/Profile/Privacy";

type Props = {
  setAction: React.Dispatch<React.SetStateAction<boolean>>
}

type SignupLocale = LocaleSchema["profile"]["signup"];

const getErrorCode = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";

const formatLocaleText = (
  template: string,
  values: Record<string, string | number>,
) => Object.entries(values).reduce(
  (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
  template,
);

const getPasswordValidationMessage = (
  status: PasswordValidationStatus,
  text: SignupLocale["password"],
) => {
  const requirements: string[] = [];
  const options = status.passwordPolicy.customStrengthOptions;

  if (status.meetsMinPasswordLength === false) {
    requirements.push(formatLocaleText(text.minLength, {
      count: options.minPasswordLength ?? 6,
    }));
  }
  if (status.meetsMaxPasswordLength === false && options.maxPasswordLength) {
    requirements.push(formatLocaleText(text.maxLength, {
      count: options.maxPasswordLength,
    }));
  }
  if (status.containsLowercaseLetter === false) {
    requirements.push(text.lowercase);
  }
  if (status.containsUppercaseLetter === false) {
    requirements.push(text.uppercase);
  }
  if (status.containsNumericCharacter === false) {
    requirements.push(text.numeric);
  }
  if (status.containsNonAlphanumericCharacter === false) {
    requirements.push(text.special);
  }

  return requirements.length > 0
    ? formatLocaleText(text.requirements, {
      requirements: requirements.join(text.requirementSeparator),
    })
    : text.policy;
};

const getSignupErrorMessage = (
  error: unknown,
  text: SignupLocale["errors"],
) => {
  const code = getErrorCode(error);

  if (code === "auth/weak-password") {
    return text.weakPassword;
  }
  if (code === "auth/email-already-in-use") {
    return text.emailAlreadyInUse;
  }
  if (code === "auth/invalid-email") {
    return text.invalidEmail;
  }
  if (code === "auth/operation-not-allowed") {
    return text.operationNotAllowed;
  }
  if (code === "auth/network-request-failed") {
    return text.networkRequestFailed;
  }
  if (code === "auth/too-many-requests") {
    return text.tooManyRequests;
  }
  if (code === "auth/popup-closed-by-user") {
    return text.popupClosed;
  }
  if (code === "auth/popup-blocked") {
    return text.popupBlocked;
  }
  if (code === "auth/cancelled-popup-request") {
    return text.popupInProgress;
  }
  if (code === "auth/account-exists-with-different-credential") {
    return text.differentCredential;
  }
  if (code === "auth/unauthorized-domain") {
    return text.unauthorizedDomain;
  }

  return text.generic;
};

export default function Signup({ setAction }: Props) {
  const { lang } = useAppStore();
  const localeText = locale(lang).profile.signup;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    agree: false,
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setMessage("");

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { signupAction, loginWithGoogleAction } = useAuthStore();
  const { openElevatedOverlay } = useElevatedOverlay();

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
    isPasswordMatched &&
    !isSubmitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    setMessage("");
    setIsSubmitting(true);

    try {
      try {
        const validation = await validateNewPassword(form.password);

        if (!validation.isValid) {
          setMessage(getPasswordValidationMessage(validation, localeText.password));
          return;
        }
      } catch (error) {
        console.warn("[password policy validation failed]", error);
      }

      await signupAction(
        form.email.trim(),
        form.password,
        form.nickname.trim(),
      );
    } catch (error) {
      setMessage(getSignupErrorMessage(error, localeText.errors));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setMessage("");
    setIsSubmitting(true);

    try {
      await loginWithGoogleAction();
    } catch (error) {
      setMessage(getSignupErrorMessage(error, localeText.errors));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-info">
        <div className="profile-info-inner">
          <p className="profile-info-eyebrow">{localeText.eyebrow}</p>
          <h1 className="profile-info-title">
            {localeText.titleBeforeBrand}
            <em>WuWa DEV</em>
            {localeText.titleAfterBrand}
          </h1>
          <p className="profile-info-desc">
            {localeText.description}
          </p>

          <ul className="profile-info-list">
            <li>{localeText.benefits.dataStorage}</li>
            <li>{localeText.benefits.history}</li>
            <li>{localeText.benefits.membership}</li>
          </ul>
        </div>
      </section>

      <section className="profile-panel">
        <form className="profile-card" onSubmit={onSubmit}>
          <div className="profile-card-header">
            <h2>{localeText.heading}</h2>
            <p>{localeText.subheading}</p>
          </div>

          <div className="profile-card-body">
          <div className="profile-field">
            <label htmlFor="email">{localeText.fields.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={localeText.fields.emailPlaceholder}
              value={form.email}
              onChange={onChangeInput}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="nickname">{localeText.fields.nickname}</label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              placeholder={localeText.fields.nicknamePlaceholder}
              value={form.nickname}
              onChange={onChangeInput}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="password">{localeText.fields.password}</label>
            <div className="profile-password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={localeText.fields.passwordPlaceholder}
                value={form.password}
                onChange={onChangeInput}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="profile-password-toggle"
                aria-label={showPassword ? localeText.password.hide : localeText.password.show}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? localeText.password.hide : localeText.password.show}
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="passwordConfirm">{localeText.fields.passwordConfirm}</label>
            <div className="profile-password-field">
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder={localeText.fields.passwordConfirmPlaceholder}
                value={form.passwordConfirm}
                onChange={onChangeInput}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="profile-password-toggle"
                aria-label={showPasswordConfirm ? localeText.password.hide : localeText.password.show}
                onClick={() => setShowPasswordConfirm((prev) => !prev)}
              >
                {showPasswordConfirm ? localeText.password.hide : localeText.password.show}
              </button>
            </div>
            {form.passwordConfirm.length > 0 ? (
              <p
                className={[
                  "profile-field-hint",
                  isPasswordMatched ? "success" : "error",
                ].join(" ")}
              >
                {isPasswordMatched
                  ? localeText.password.matched
                  : localeText.password.mismatch}
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
              {localeText.agreement.beforeTerms}
              <em onClick={() => { openElevatedOverlay(<Terms/>) }}>
                {localeText.agreement.terms}
              </em>
              {localeText.agreement.between}
              <em onClick={() => { openElevatedOverlay(<Privacy/>) }}>
                {localeText.agreement.privacy}
              </em>
              {localeText.agreement.afterPrivacy}
            </span>
          </label>

          <button className="profile-submit" type="submit" disabled={!isValid}>
            {isSubmitting ? localeText.actions.submitting : localeText.actions.submit}
          </button>

          {message ? (
            <p
              id="signup-message"
              className="profile-login-message error"
              role="alert"
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}

          <div className="profile-card-footer">
            <span>{localeText.actions.divider}</span>
          </div>

          <button
            type="button"
            className="profile-submit google"
            disabled={isSubmitting}
            onClick={handleGoogleSignup}
          >
            {localeText.actions.googleSignup}
          </button>

          <div className="profile-card-footer">
            <span>{localeText.actions.hasAccount}</span>
            <button type="button" className="profile-text-button"
              onClick={() => {setAction(false)}}>
              {localeText.actions.login}
            </button>
          </div>
          </div>
        </form>
      </section>
    </div>
  );
}
