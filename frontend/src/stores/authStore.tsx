import { create } from "zustand";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
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
import { downloadCharacterCloudData } from "@/api/characterCloudSync.api";
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

const AUTH_USER_CACHE_KEY = "wuthering.auth.user";
const AUTH_GAME_PROFILE_CACHE_KEY = "wuthering.auth.gameProfile";

let authUnsubscribe: (() => void) | null = null;
let authHydrationSeq = 0;

function createFallbackUserProfile(firebaseUser: FirebaseUser): UserProfile {
  const provider = firebaseUser.providerData[0];
  const email = firebaseUser.email ?? provider?.email ?? null;
  const nickname =
    firebaseUser.displayName ??
    provider?.displayName ??
    email?.split("@")[0] ??
    "Guest";

  return {
    uid: firebaseUser.uid,
    supabaseUid: null,
    email,
    nickname,
    imageUrl: firebaseUser.photoURL ?? provider?.photoURL ?? null,
    role: null,
    status: "inactive",
    membershipLevel: 0,
    membershipExpiresAt: null,
    membershipNickname: null,
    isMember: false,
    createdAt: Date.now(),
  };
}

async function hydrateFirebaseUser(firebaseUser: FirebaseUser) {
  const [userResult, gameProfileResult] = await Promise.allSettled([
    syncGatewayUser(firebaseUser),
    getGameProfile(firebaseUser.uid),
  ]);

  if (userResult.status === "rejected") {
    console.warn("[auth] gateway user sync failed", userResult.reason);
  }

  if (gameProfileResult.status === "rejected") {
    console.warn("[auth] game profile load failed", gameProfileResult.reason);
  }

  return {
    user:
      userResult.status === "fulfilled"
        ? userResult.value
        : createFallbackUserProfile(firebaseUser),
    gameProfile:
      gameProfileResult.status === "fulfilled"
        ? gameProfileResult.value
        : null,
  };
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clearAuthCache() {
  localStorage.removeItem(AUTH_USER_CACHE_KEY);
  localStorage.removeItem(AUTH_GAME_PROFILE_CACHE_KEY);
}

function writeAuthCache(user: UserProfile, gameProfile: GameProfile | null) {
  writeCache(AUTH_USER_CACHE_KEY, user);

  if (gameProfile) {
    writeCache(AUTH_GAME_PROFILE_CACHE_KEY, gameProfile);
  } else {
    localStorage.removeItem(AUTH_GAME_PROFILE_CACHE_KEY);
  }
}

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
  user: readCache<UserProfile>(AUTH_USER_CACHE_KEY),
  gameProfile: readCache<GameProfile>(AUTH_GAME_PROFILE_CACHE_KEY),
  cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA,
  isLoading: true,

  setUser: (user) => {
    if (!user) {
      clearAuthCache();
      set({ user });
      return;
    }

    writeAuthCache(user, get().gameProfile);
    set({ user });
  },

  refreshCloudCharacterData: async (options) => {
    const force = options?.force ?? false;
    const characterId = options?.characterId;
    const { user, cloudCharacterData } = get();

    if (!user) {
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
    if (authUnsubscribe) return;

    set({ isLoading: true });

    authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const seq = ++authHydrationSeq;

      if (!firebaseUser) {
        clearAuthCache();

        set({
          user: null,
          gameProfile: null,
          cloudCharacterData: EMPTY_CLOUD_CHARACTER_DATA,
          isLoading: false,
        });
        return;
      }

      const current = get();
      const isSameHydratedUser =
        current.user?.uid === firebaseUser.uid &&
        current.gameProfile?.uid === firebaseUser.uid;

      if (isSameHydratedUser) {
        set({ isLoading: false });

        if (current.cloudCharacterData.fetchedForUid !== firebaseUser.uid) {
          void get().refreshCloudCharacterData();
        }
        return;
      }

      try {
        const { user, gameProfile } = await hydrateFirebaseUser(firebaseUser);

        if (seq !== authHydrationSeq) return;

        set({
          user,
          gameProfile,
          isLoading: false,
        });
        writeAuthCache(user, gameProfile);

        void get().refreshCloudCharacterData();
      } catch (error) {
        if (seq !== authHydrationSeq) return;

        console.error(error);
        clearAuthCache();
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

    const user = get().user;
    if (user) writeAuthCache(user, gameProfile);
  },

  signupAction: async (email, password, nickname) => {
    const startedAt = Date.now();

    try {
      set({ isLoading: true });
      await signup(email, password, nickname);

      await logClientEvent({
        feature: "auth",
        eventName: "auth_signup",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "email" },
      });
    } catch (error) {
      set({ isLoading: false });

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
      set({ isLoading: true });
      await login(email, password);

      await logClientEvent({
        feature: "auth",
        eventName: "auth_login",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "email" },
      });
    } catch (error) {
      set({ isLoading: false });

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
      set({ isLoading: true });
      await loginWithGoogle();

      await logClientEvent({
        feature: "auth",
        eventName: "auth_login",
        result: "success",
        durationMs: Date.now() - startedAt,
        meta: { method: "google" },
      });
    } catch (error) {
      set({ isLoading: false });

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
      set({ isLoading: true });
      clearAuthCache();

      await logClientEvent({
        feature: "auth",
        eventName: "auth_logout",
        result: "success",
        durationMs: Date.now() - startedAt,
      });

      await logout();
    } catch (error) {
      set({ isLoading: false });

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

    const updatedUser = get().user;
    if (updatedUser) writeAuthCache(updatedUser, get().gameProfile);
  },

  saveGameProfileAction: async (next: GameProfile) => {
    const uid = get().user?.uid;
    if (!uid) return;

    const gameProfile = await saveGameProfile(uid, next);
    set({ gameProfile });

    const user = get().user;
    if (user) writeAuthCache(user, gameProfile);
  },
}));
