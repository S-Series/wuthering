import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { GameServer } from "./user";
import type { CharacterId } from "@/datas/characterStats";

export type UserProfile = {
  uid: string;
  email: string | null;
  nickname: string;
  imageUrl: string | null;
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);