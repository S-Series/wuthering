import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import { type UserProfile } from "@/firebase/firebase"

export async function signup(
  email: string,
  password: string,
  nickname: string,
): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  const userProfile: UserProfile = {
    uid: credential.user.uid,
    email: credential.user.email ?? email,
    nickname,
    imageUrl: null,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "users", credential.user.uid), userProfile);

  return userProfile;
}

export async function login(
  email: string,
  password: string
): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  const userDocRef = doc(db, "users", credential.user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error("유저 문서가 존재하지 않습니다.");
  }

  return userDocSnap.data() as UserProfile;
}

export async function loginWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const additionalInfo = getAdditionalUserInfo(result);

  const googleProvider = user.providerData.find(
    (item) => item.providerId === "google.com"
  );

  const googleEmail =
    user.email ||
    googleProvider?.email ||
    (additionalInfo?.profile as { email?: string } | null)?.email ||
    "";

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  const nextProfile: UserProfile = {
    uid: user.uid,
    email: googleEmail,
    nickname: user.displayName ?? googleProvider?.displayName ?? "Google User",
    imageUrl: user.photoURL || googleProvider?.photoURL || null,
    createdAt: userDocSnap.exists()
      ? (userDocSnap.data() as UserProfile).createdAt
      : Date.now(),
  };

  await setDoc(userDocRef, nextProfile, { merge: true });
  
  return nextProfile;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function normalizeUserProfile(raw: unknown): UserProfile {
  const data =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : {};

  return {
    uid: typeof data.uid === "string" ? data.uid : "",
    email: typeof data.email === "string" ? data.email : null,
    nickname: typeof data.nickname === "string" ? data.nickname : "Unknown",
    imageUrl:
      typeof data.imageUrl === "string"
        ? data.imageUrl
        : typeof data.photoURL === "string"
        ? data.photoURL
        : null,
    createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
  };
}