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
  email: string;
  nickname: string;
};

export async function signup(
  email: string,
  password: string,
  nickname: string
): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  const userProfile: UserProfile = {
    uid: credential.user.uid,
    email: credential.user.email ?? email,
    nickname,
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

  if (userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  }

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email ?? "",
    nickname: user.displayName ?? "Google User",
  };

  await setDoc(userDocRef, userProfile);

  return userProfile;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}