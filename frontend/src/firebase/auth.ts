import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  validatePassword,
  type PasswordValidationStatus,
} from "firebase/auth";
import { requireAuth } from "./firebase";

export async function signup(
  email: string,
  password: string,
  nickname: string,
): Promise<void> {
  const auth = requireAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: nickname });
  await credential.user.reload();
}

export async function validateNewPassword(
  password: string,
): Promise<PasswordValidationStatus> {
  const auth = requireAuth();
  return validatePassword(auth, password);
}

export async function login(
  email: string,
  password: string
): Promise<void> {
  const auth = requireAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(): Promise<void> {
  const auth = requireAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  await signInWithPopup(auth, provider);
}

export async function logout(): Promise<void> {
  const auth = requireAuth();
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  const auth = requireAuth();
  await sendPasswordResetEmail(auth, email);
}
