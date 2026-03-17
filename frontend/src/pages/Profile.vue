<template>
  <div id="page-slot">
    <div v-if="authStore.isLoading" class="profile-field loading">
      <Skeleton width="400px" height="600px" border-radius="20px" class="main-stand-skeleton" />
      <div class="container">
        <div class="user-info">
          <div class="profile-image-wrap">
            <Skeleton type="circle" width="100%" height="100%" />
          </div>
          <div class="profile-image-wrap">
            <Skeleton type="circle" width="100%" height="100%" />
          </div>
          <div class="text-box">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="250px" height="20px" />
            <Skeleton width="180px" height="18px" />
          </div>
          <div class="button-box">
            <Skeleton width="100px" height="40px" />
            <Skeleton width="100px" height="40px" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="authStore.user" class="profile-field">
      <img class="main-stand-image" :src="userImageUrl[2]" />
      <div class="container">
        <div class="user-info">
          <div class="profile-image-wrap">
            <img class="profile-image" :src="userImageUrl[0]" />
          </div>
          <div class="profile-image-wrap">
            <img class="profile-image" :src="userImageUrl[1]" />
          </div>
          <div class="text-box">
            <span class="num-font">{{ `Lv.${authStore.gameProfile?.gameLevel ?? 1}` }} <em>{{ authStore.user.nickname }}</em></span>
            <span class="num-font">{{ `${authStore.gameProfile?.server ?? 'unknown'} / Uid.` }} <em>{{ authStore.gameProfile?.gameUid ?? '- - - - - - -' }}</em></span>
            <span class="num-font">Joined. <em>{{ new Date(authStore.user.createdAt).toISOString().slice(0, 10) }}</em> ~</span>
          </div>
          <div class="button-box">
            <button>정보수정</button>
            <button @click="authStore.logoutAction()">로그아웃</button>
          </div>
        </div>
        <div class="game-info"></div>
      </div>
    </div>

    <div v-else class="login-field">
      <span>Login</span>
      <input class="input-field id" disabled type="email" placeholder="example@domain.com" v-model="email" />
      <input class="input-field password" disabled type="password" placeholder="password" v-model="password" />
      <button class="login-button normal" disabled @click="doLogin">
        <img src="/default.webp" />
        <span :class="`${appStore.lang}-font`">일반 계정으로 로그인</span>
      </button>
      <button class="login-button google" @click="authStore.loginWithGoogleAction()">
        <img src="/google.png" />
        <span :class="`${appStore.lang}-font`">Google 계정으로 로그인</span>
      </button>
      <button class="login-button signup" disabled>
        <img src="/default.webp" />
        <span :class="`${appStore.lang}-font`">회원가입</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import Skeleton from "@/components/Skeleton.vue";
import "./Profile.css";

const appStore = useAppStore();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");


const userImageUrl = computed(() => [
  authStore.user?.imageUrl ?? "/default.webp",
  `/character/${authStore.gameProfile?.characterId ?? "rover_spectro"}/ico.webp`,
  `/character/${authStore.gameProfile?.characterId ?? "rover_spectro"}/stand.png`,
]);

async function doLogin() {
  if (!email.value || !password.value) return;
  await authStore.loginAction(email.value, password.value);
}
</script>
