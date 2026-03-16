import { defineStore } from "pinia";
import { ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import {
  login,
  loginWithGoogle,
  logout,
  normalizeUserProfile,
  signup,
  type UserProfile,
} from "@/firebase/auth";
import { getGameProfile, saveGameProfile, type GameProfile } from "@/firebase/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserProfile | null>(null);
  const gameProfile = ref<GameProfile | null>(null);
  const isLoading = ref(true);

  function setUser(u: UserProfile | null) { user.value = u; }

  function initAuth() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        user.value = null;
        gameProfile.value = null;
        isLoading.value = false;
        return;
      }
      const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!userSnap.exists()) {
        user.value = null;
        gameProfile.value = null;
        isLoading.value = false;
        return;
      }
      user.value = normalizeUserProfile(userSnap.data());
      gameProfile.value = await getGameProfile(firebaseUser.uid);
      isLoading.value = false;
    });
  }

  async function refreshGameProfile() {
    const uid = user.value?.uid;
    if (!uid) return;
    gameProfile.value = await getGameProfile(uid);
  }

  async function signupAction(email: string, password: string, nickname: string) {
    const u = await signup(email, password, nickname);
    user.value = u;
    gameProfile.value = await getGameProfile(u.uid);
  }

  async function loginAction(email: string, password: string) {
    const u = await login(email, password);
    user.value = u;
    gameProfile.value = await getGameProfile(u.uid);
  }

  async function loginWithGoogleAction() {
    const u = await loginWithGoogle();
    user.value = u;
    gameProfile.value = await getGameProfile(u.uid);
  }

  async function logoutAction() {
    await logout();
    user.value = null;
    gameProfile.value = null;
  }

  async function saveGameProfileAction(next: GameProfile) {
    const uid = user.value?.uid;
    if (!uid) return;
    gameProfile.value = await saveGameProfile(uid, next);
  }

  return {
    user, gameProfile, isLoading,
    setUser, initAuth, refreshGameProfile,
    signupAction, loginAction, loginWithGoogleAction,
    logoutAction, saveGameProfileAction,
  };
});
