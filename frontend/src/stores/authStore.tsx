import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";

import {
  login,
  loginWithGoogle,
  logout,
  resetPassword,
  signup,
} from "@/firebase/auth";
import { getGameProfile, saveGameProfile, saveUserNickname } from "@/firebase/user";
import { logClientEvent } from "@/api/logger";
import { syncGatewayUser } from "@/api/user.api";
import {
  downloadCharacterCloudData,
  isMembershipUser,
} from "@/api/characterCloudSync.api";
import type { CharacterDataSnapshot } from "@/stores/characterDataStorage";
import type { CharacterId } from "@/datas/characterStats";

import { type UserProfile, type GameProfile } from "@/firebase/firebase"

export type CloudCharacterDataCache = {
  status: "idle" | "loading" | "success" | "error";
  data: CharacterDataSnapshot;
  updatedAt: string | null;
  fetchedForUid: string | null;
};

const EMPTY_CLOUD_CHARACTER_DATA: CloudCharacterDataCache = {
  status: "idle",
  data: {},
  updatedAt: null,
  fetchedForUid: null,
};

type AuthState = {
  user: UserProfile | null;
  gameProfile: GameProfile | null;
  cloudCharacterData: CloudCharacterDataCache;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  refreshCloudCharacterData: (options?: {
    force?: boolean;
    characterId?: CharacterId;
  }) => Promise<void>;
  setCloudCharacterDataSnapshot: (
    data: CharacterDataSnapshot,
    updatedAt: string | null,
  ) => void;
  initAuth: () => void;
  signupAction: (email: string, password: string, nickname: string) => Promise<void>;
  loginAction: (email: string, password: string) => Promise<void>;
  loginWithGoogleAction: () => Promise<void>;
  resetPasswordAction: (email: string) => Promise<void>;
  logoutAction: () => Promise<void>;
  saveUserNicknameAction: (nickname: string) => Promise<void>;
  saveGameProfileAction: (next: GameProfile) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  gameProfile: null,
  cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA,
  isLoading: true,

  setUser: (user) => set({ user }),

  refreshCloudCharacterData: async (options) => {
    const force = options?.force ?? false;
    const characterId = options?.characterId;
    const { user, cloudCharacterData } = get();

    if (!user || !isMembershipUser(user)) {
      set({ cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA });
      return;
    }

    if (
      !force &&
      cloudCharacterData.fetchedForUid === user.uid &&
      (cloudCharacterData.status === "loading" ||
        cloudCharacterData.status === "success")
    ) {
      return;
    }

    set({
      cloudCharacterData: {
        status: "loading",
        data: cloudCharacterData.fetchedForUid === user.uid
          ? cloudCharacterData.data
          : {},
        updatedAt: cloudCharacterData.fetchedForUid === user.uid
          ? cloudCharacterData.updatedAt
          : null,
        fetchedForUid: user.uid,
      },
    });

    try {
      const result = await downloadCharacterCloudData(characterId);

      if (!result.ok) {
        set({
          cloudCharacterData: {
            status: "error",
            data: {},
            updatedAt: null,
            fetchedForUid: user.uid,
          },
        });
        return;
      }

      const nextData = (() => {
        if (!characterId) return result.data;

        const merged = { ...cloudCharacterData.data };

        if (result.data[characterId]) {
          merged[characterId] = result.data[characterId];
        } else {
          delete merged[characterId];
        }

        return merged;
      })();

      set({
        cloudCharacterData: {
          status: "success",
          data: nextData,
          updatedAt: result.updatedAt,
          fetchedForUid: user.uid,
        },
      });
    } catch (error) {
      console.error(error);
      set({
        cloudCharacterData: {
          status: "error",
          data: {},
          updatedAt: null,
          fetchedForUid: user.uid,
        },
      });
    }
  },

  setCloudCharacterDataSnapshot: (data, updatedAt) => {
    const uid = get().user?.uid ?? null;

    set({
      cloudCharacterData: {
        status: "success",
        data,
        updatedAt,
        fetchedForUid: uid,
      },
    });
  },

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({
          user: null,
          gameProfile: null,
          cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA,
          isLoading: false,
        });
        return;
      }

      try {
        const user = await syncGatewayUser(firebaseUser);
        const gameProfile = await getGameProfile(firebaseUser.uid);

        set({
          user,
          gameProfile,
          isLoading: false,
        });

        void get().refreshCloudCharacterData();
      } catch (error) {
        console.error(error);
        set({
          user: null,
          gameProfile: null,
          cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA,
          isLoading: false,
        });
      }
    });
  },

  refreshGameProfile: async () => {
    const uid = get().user?.uid;
    if (!uid) return;

    const gameProfile = await getGameProfile(uid);
    set({ gameProfile });
  },

  signupAction: async (email, password, nickname) => {
    const startedAt = Date.now();

    try {
      const user = await signup(email, password, nickname);
      const gameProfile = await getGameProfile(user.uid)
      set({ user, gameProfile });
      void get().refreshCloudCharacterData();

      await logClientEvent({
        feature: "auth",
        eventName: "auth_signup",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "email" },
      });
    } catch (error) {
      await logClientEvent({
        feature: "auth",
        eventName: "auth_signup",
        result: "fail",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "signup failed",
        meta: { method: "email" },
      });

      throw error;
    }
  },

  loginAction: async (email, password) => {
    const startedAt = Date.now();

    try {
      const user = await login(email, password);
      const gameProfile = await getGameProfile(user.uid);

      set({ user, gameProfile });
      void get().refreshCloudCharacterData();

      await logClientEvent({
        feature: "auth",
        eventName: "auth_login",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "email" },
      });
    } catch (error) {
      await logClientEvent({
        feature: "auth",
        eventName: "auth_login",
        result: "fail",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "login failed",
        meta: { method: "email" },
      });

      throw error;
    }
  },

  loginWithGoogleAction: async () => {
    const startedAt = Date.now();

    try {
      const user = await loginWithGoogle();
      const gameProfile = await getGameProfile(user.uid);
      set({ user, gameProfile });
      void get().refreshCloudCharacterData();

      await logClientEvent({
        feature: "auth",
        eventName: "auth_login",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "google" },
      });
    } catch (error) {
      await logClientEvent({
        feature: "auth",
        eventName: "auth_login",
        result: "fail",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "google login failed",
        meta: { method: "google" },
      });

      throw error;
    }
  },

  resetPasswordAction: async (email) => {
    const startedAt = Date.now();

    try {
      await resetPassword(email);

      await logClientEvent({
        feature: "auth",
        eventName: "auth_password_reset",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "email" },
      });
    } catch (error) {
      await logClientEvent({
        feature: "auth",
        eventName: "auth_password_reset",
        result: "fail",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "password reset failed",
        meta: { method: "email" },
      });

      throw error;
    }
  },

  logoutAction: async () => {
    const startedAt = Date.now();

    try {
      await logClientEvent({
        feature: "auth",
        eventName: "auth_logout",
        result: "success",
        durationMs: Date.now() - startedAt,
      });

      await logout();
      set({
        user: null,
        gameProfile: null,
        cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA,
      });
    } catch (error) {
      await logClientEvent({
        feature: "auth",
        eventName: "auth_logout",
        result: "fail",
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "logout failed",
      });

      throw error;
    }
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
