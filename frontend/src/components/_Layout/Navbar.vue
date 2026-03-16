<template>
  <div id="navbar-body">
    <div class="item-slot">
      <a href="/" class="title">
        <img class="navbar-icon title" alt="title" src="/sseries.png" />
        <p :class="`${appStore.lang}-font title`">{{ localeText.title }}</p>
      </a>
    </div>
    <div class="item-slot">
      <!-- Language Selector -->
      <div class="lang-select-wrap">
        <div class="lang-select-value" @click="isLangOpen = !isLangOpen">
          <img :src="currentLangOption.src" />
          <span :class="`${currentLangOption.value}-font`">{{ currentLangOption.text }}</span>
        </div>
        <div v-if="isLangOpen" class="lang-select-dropdown">
          <div
            v-for="opt in LANG_OPTIONS"
            :key="opt.value"
            class="lang-select-option"
            @click="selectLang(opt.value as LangType)"
          >
            <img :src="opt.src" />
            <span :class="`${opt.value}-font`">{{ opt.text }}</span>
          </div>
        </div>
      </div>

      <a href="/characters">
        <img class="navbar-icon" alt="characters" src="/ico/stats/atk.webp" />
        <p :class="`${appStore.lang}-font`">{{ localeText.characters }}</p>
      </a>
      <a href="/card">
        <img class="navbar-icon" alt="card" src="/ico/stats/critRate.webp" />
        <p :class="`${appStore.lang}-font`">{{ localeText.generator }}</p>
      </a>
      <a href="/profile">
        <img class="navbar-icon" alt="profile" :src="profileImage" />
        <p :class="`${appStore.lang}-font`">{{ profileName }}</p>
      </a>
      <button @click="isActive = !isActive">
        <img class="navbar-icon" alt="menu" src="/menu.svg" />
      </button>
    </div>
  </div>

  <div id="navbar-sidebar" :class="isActive ? 'active' : 'idle'">
    <a href="/profile">
      <img class="navbar-icon" alt="profile" :src="profileImage" />
      <p :class="`${appStore.lang}-font`">{{ profileName }}</p>
    </a>
    <a href="/characters">
      <img class="navbar-icon" alt="characters" src="/ico/stats/atk.webp" />
      <p :class="`${appStore.lang}-font`">캐릭터 목록</p>
    </a>
    <a href="/card">
      <img class="navbar-icon" alt="card" src="/ico/stats/critRate.webp" />
      <p :class="`${appStore.lang}-font`">스펙카드 생성기</p>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStore, type LangType } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { locale } from "@/locales/locale";
import "@/components/_Layout/Navbar.css";

const appStore = useAppStore();
const authStore = useAuthStore();
const isActive = ref(false);
const isLangOpen = ref(false);

const localeText = computed(() => locale(appStore.lang).navbar);

const LANG_OPTIONS = [
  { value: "kr", src: "/flag-kr.png", text: "한국어" },
  { value: "en", src: "/flag-en.png", text: "English" },
  { value: "jp", src: "/flag-jp.png", text: "日本語" },
  { value: "zh", src: "/flag-kr.png", text: "中文" },
];

const currentLangOption = computed(
  () => LANG_OPTIONS.find((o) => o.value === appStore.lang) ?? LANG_OPTIONS[0]
);

function selectLang(v: LangType) {
  appStore.setLang(v);
  isLangOpen.value = false;
}

const profileName = computed(() =>
  authStore.isLoading ? "" : authStore.user ? authStore.user.nickname : "로그인"
);
const profileImage = computed(() =>
  authStore.isLoading ? "/default.webp" : authStore.user?.imageUrl ?? "/default.webp"
);
</script>
