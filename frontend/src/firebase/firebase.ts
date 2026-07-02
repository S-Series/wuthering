import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { GameServer } from "./user";
import type { CharacterId } from "@/datas/characterStats";

export type UserProfile = {
  uid: string;
  supabaseUid: string | null;
  email: string | null;
  nickname: string;
  imageUrl: string | null;
  role?: string | null;
  status?: string | null;
  membershipLevel?: number;
  membershipExpiresAt?: string | null;
  membershipNickname?: string | null;
  isMember?: boolean;
  createdAt: number;
};

export type GameProfile = {
  uid: string;
  server: GameServer | null;
  gameUid: string | null;
  gameLevel: number;
  characterId: CharacterId | null;
  updatedAt: number;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const REQUIRED_FIREBASE_ENV = [
  ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["VITE_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
] as const;

const missingFirebaseEnv = REQUIRED_FIREBASE_ENV
  .filter(([, value]) => typeof value !== "string" || value.trim() === "")
  .map(([key]) => key);

const firebaseServices = (() => {
  if (missingFirebaseEnv.length > 0) {
    console.warn(
      `[firebase] Missing config: ${missingFirebaseEnv.join(", ")}. Auth features are disabled.`
    );
    return null;
  }

  try {
    const app = initializeApp(firebaseConfig);

    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
    };
  } catch (error) {
    console.warn("[firebase] Failed to initialize. Auth features are disabled.", error);
    return null;
  }
})();

export const auth: Auth | null = firebaseServices?.auth ?? null;
export const db: Firestore | null = firebaseServices?.db ?? null;
export const isFirebaseEnabled = auth !== null && db !== null;

export function requireAuth() {
  if (!auth) {
    throw new Error("Firebase 인증 설정이 필요합니다.");
  }

  return auth;
}

export function requireDb() {
  if (!db) {
    throw new Error("Firebase 데이터베이스 설정이 필요합니다.");
  }

  return db;
}
