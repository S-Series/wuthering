import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

import {
  login,
  loginWithGoogle,
  logout,
  normalizeUserProfile,
  signup,
} from "@/firebase/auth";
import { getGameProfile, saveGameProfile, saveUserNickname } from "@/firebase/user";

import { type UserProfile, type GameProfile } from "@/firebase/firebase"

type AuthState = {
  user: UserProfile | null;
  gameProfile: GameProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  initAuth: () => void;
  signupAction: (email: string, password: string, nickname: string) => Promise<void>;
  loginAction: (email: string, password: string) => Promise<void>;
  loginWithGoogleAction: () => Promise<void>;
  logoutAction: () => Promise<void>;
  saveUserNicknameAction: (nickname: string) => Promise<void>;
  saveGameProfileAction: (next: GameProfile) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  gameProfile: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, gameProfile: null, isLoading: false });
        return;
      }

      const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userSnap.exists()) {
        set({ user: null, gameProfile: null, isLoading: false });
        return;
      }

      const user : UserProfile = normalizeUserProfile(userSnap.data());
      const gameProfile = await getGameProfile(firebaseUser.uid);

      set({
        user: user,
        gameProfile: gameProfile,
        isLoading: false,
      });
    });
  },

  refreshGameProfile: async () => {
    const uid = get().user?.uid;
    if (!uid) return;

    const gameProfile = await getGameProfile(uid);
    set({ gameProfile });
  },

  signupAction: async (email, password, nickname) => {
    const user = await signup(email, password, nickname);
    const gameProfile = await getGameProfile(user.uid)
    set({ user, gameProfile });
  },

  loginAction: async (email, password) => {
    const user = await login(email, password);
    const gameProfile = await getGameProfile(user.uid);

    set({ user, gameProfile });
  },

  loginWithGoogleAction: async () => {
    const user = await loginWithGoogle();
    const gameProfile = await getGameProfile(user.uid);
    set({ user, gameProfile });
  },

  logoutAction: async () => {
    await logout();
    set({ user: null, gameProfile: null });
  },

  saveUserNicknameAction: async (nickname: string) => {
    const user = get().user;
    if (!user) throw new Error("로그인이 필요합니다.");

    await saveUserNickname(user.uid, nickname);

    set((state) => ({
      user: state.user ? { ...state.user, nickname } : state.user,
    }));
  },

  saveGameProfileAction: async (next: GameProfile) => {
    const uid = get().user?.uid;
    if (!uid) return;

    const gameProfile = await saveGameProfile(uid, next);
    set({ gameProfile });
  },
}));