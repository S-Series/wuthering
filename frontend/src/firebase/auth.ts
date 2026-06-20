import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signup(
  email: string,
  password: string,
  nickname: string,
): Promise<void> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: nickname });
  await credential.user.reload();
}

export async function login(
  email: string,
  password: string
): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  await signInWithPopup(auth, provider);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
