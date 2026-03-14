import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import {
  login,
  loginWithGoogle,
  logout,
  signup,
  type UserProfile,
} from "@/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

type AuthState = {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  initAuth: () => void;
  signupAction: (email: string, password: string, nickname: string) => Promise<void>;
  loginAction: (email: string, password: string) => Promise<void>;
  loginWithGoogleAction: () => Promise<void>;
  logoutAction: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, isLoading: false });
        return;
      }

      const snap = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!snap.exists()) {
        set({ user: null, isLoading: false });
        return;
      }

      set({
        user: snap.data() as UserProfile,
        isLoading: false,
      });
    });
  },

  signupAction: async (email, password, nickname) => {
    const user = await signup(email, password, nickname);
    set({ user });
  },

  loginAction: async (email, password) => {
    const user = await login(email, password);
    set({ user });
  },

  loginWithGoogleAction: async () => {
    const user = await loginWithGoogle();
    set({ user });
  },

  logoutAction: async () => {
    await logout();
    set({ user: null });
  },
}));