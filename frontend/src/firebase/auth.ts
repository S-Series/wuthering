import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserProfile = {
  uid: string;
  email: string | null;
  nickname: string;
  imageUrl: string | null;
  createdAt: number;
};

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
  const credential = await signInWithPopup(auth, provider);

  const user = credential.user;
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  console.log(user, credential, userDocRef, userDocSnap);

  if (userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  }

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email ?? "",
    nickname: user.displayName ?? "Google User",
    imageUrl: user.photoURL ?? null,
    createdAt: Date.now(),
  };

  await setDoc(userDocRef, userProfile);

  return userProfile;
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
    imageUrl: typeof data.photoURL === "string" ? data.photoURL : null,
    createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
  };
}