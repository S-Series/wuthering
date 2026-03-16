<template>
  <div style="padding: 24px">
    <h2>Firebase Auth Debug</h2>
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px">
      <input type="text" placeholder="닉네임" v-model="nickname" />
      <input type="email" placeholder="이메일" v-model="email" />
      <input type="password" placeholder="비밀번호" v-model="password" />
      <button @click="handleSignup">회원가입</button>
      <button @click="handleLogin">로그인</button>
      <button @click="handleGoogleLogin">Google 로그인</button>
      <button @click="handleLogout">로그아웃</button>
    </div>
    <div style="margin-top: 16px">
      <p>{{ message }}</p>
    </div>
    <div style="margin-top: 16px">
      <h3>유저 데이터</h3>
      <div v-if="user">
        <p>uid: {{ user.uid }}</p>
        <p>email: {{ user.email }}</p>
        <p>nickname: {{ user.nickname }}</p>
      </div>
      <p v-else>로그인된 유저 없음</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login, loginWithGoogle, logout, signup, type UserProfile } from "@/firebase/auth";

const email = ref("");
const password = ref("");
const nickname = ref("");
const user = ref<UserProfile | null>(null);
const message = ref("");

async function handleSignup() {
  message.value = "";
  try {
    user.value = await signup(email.value, password.value, nickname.value);
    message.value = "회원가입 성공";
  } catch (error) {
    message.value = error instanceof Error ? error.message : "회원가입 실패";
  }
}

async function handleLogin() {
  message.value = "";
  try {
    user.value = await login(email.value, password.value);
    message.value = "로그인 성공";
  } catch (error) {
    message.value = error instanceof Error ? error.message : "로그인 실패";
  }
}

async function handleGoogleLogin() {
  message.value = "";
  try {
    user.value = await loginWithGoogle();
    message.value = "Google 로그인 성공";
  } catch (error) {
    message.value = error instanceof Error ? error.message : "Google 로그인 실패";
  }
}

async function handleLogout() {
  message.value = "";
  try {
    await logout();
    user.value = null;
    message.value = "로그아웃 성공";
  } catch (error) {
    message.value = error instanceof Error ? error.message : "로그아웃 실패";
  }
}
</script>
