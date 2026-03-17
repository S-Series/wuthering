<template>
  <RouterView />
  <OverlayPanel />
  <Toast />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import OverlayPanel from "@/components/OverlayPanel.vue";
import Toast from "@/components/common/Toast.vue";

const authStore = useAuthStore();
onMounted(() => authStore.initAuth());
</script>
