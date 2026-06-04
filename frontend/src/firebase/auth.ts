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
import { syncGatewayUser } from "@/api/user.api";

import { type UserProfile } from "@/firebase/firebase"

export async function signup(
  email: string,
  password: string,
  nickname: string,
): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: nickname });
  await credential.user.reload();

  return syncGatewayUser(credential.user, {
    displayName: nickname,
  });
}

export async function login(
  email: string,
  password: string
): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return syncGatewayUser(credential.user);
}

export async function loginWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const googleProvider = user.providerData.find(
    (item) => item.providerId === "google.com"
  );

  return syncGatewayUser(user, {
    provider: "google",
    displayName: user.displayName ?? googleProvider?.displayName ?? "Google User",
    imageUrl: user.photoURL || googleProvider?.photoURL || null,
  });
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
