<template>
  <RouterView />
  <OverlayPanel />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import OverlayPanel from "@/components/OverlayPanel.vue";

const authStore = useAuthStore();
onMounted(() => authStore.initAuth());
</script>
