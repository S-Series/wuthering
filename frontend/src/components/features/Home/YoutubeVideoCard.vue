<template>
  <div class="youtube-card">
    <div class="youtube-meta">
      <p class="en-font">Published At. {{ video.publishedAt }}</p>
    </div>
    <button v-if="!isPlaying" type="button" class="youtube-thumb-button" @click="isPlaying = true">
      <img :src="video.thumbnail" :alt="video.title" class="youtube-thumb" />
      <span class="youtube-play">▶</span>
    </button>
    <iframe
      v-else
      class="youtube-iframe"
      :src="`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1`"
      :title="video.title"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-presentation"
      allowfullscreen
    />
    <div class="youtube-panel-control">
      <button :class="`${appStore.lang}-font`" @click="closeOverlay">{{ closeText }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useOverlay } from "@/composables/useOverlay";
import type { YoutubeLatestVideo } from "@/api/youtube.api";
import "./YoutubeVideoCard.css";

defineProps<{ video: YoutubeLatestVideo }>();

const appStore = useAppStore();
const { closeOverlay } = useOverlay();
const isPlaying = ref(false);

const closeText = computed(() => {
  switch (appStore.lang) {
    case "kr": return "닫기";
    case "en": return "Close";
    case "jp": return "閉じる";
    case "zh": return "关闭";
  }
});
</script>
