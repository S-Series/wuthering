<template>
  <div id="page-slot" class="home-page-slot">
    <div class="page-body small">
      <div class="article-slot">
        <h2 :class="`title-text ${appStore.lang}-font`">{{ localeText.title1 }}</h2>
        <div class="notice-slot">
          <HomePostCard v-for="post in sortedPosts" :key="post.id" :post="post" :lang="appStore.lang" />
        </div>
      </div>
    </div>

    <div class="page-body large">
      <div class="article-slot">
        <h2 :class="`title-text ${appStore.lang}-font`">{{ localeText.title2 }}</h2>
        <div style="display: flex; width: 100%; height: auto; justify-content: space-between;">
          <div class="article-item trailer">
            <span :class="`article-title ${appStore.lang}-font`">{{ localeText.video1 }}</span>
            <div v-if="trailer" class="article" @click="openYoutube(trailer)">
              <img :src="trailer.thumbnail" :alt="trailer.title" />
              <span :class="`${appStore.lang}-font`">{{ trailer.title }}</span>
              <span :class="`${appStore.lang}-font click`">{{ localeText.click }}</span>
            </div>
            <p v-else :class="`${appStore.lang}-font click`">loading...</p>
          </div>
          <div class="article-item combat">
            <span :class="`article-title ${appStore.lang}-font`">{{ localeText.video2 }}</span>
            <div v-if="combat" class="article" @click="openYoutube(combat)">
              <img :src="combat.thumbnail" :alt="combat.title" />
              <span :class="`${appStore.lang}-font`">{{ combat.title }}</span>
              <span :class="`${appStore.lang}-font click`">{{ localeText.click }}</span>
            </div>
            <p v-else>loading...</p>
          </div>
          <div class="article-item intro">
            <span :class="`article-title ${appStore.lang}-font`">{{ localeText.video3 }}</span>
            <div v-if="intro" class="article" @click="openYoutube(intro)">
              <img :src="intro.thumbnail" :alt="intro.title" />
              <span :class="`${appStore.lang}-font`">{{ intro.title }}</span>
              <span :class="`${appStore.lang}-font click`">{{ localeText.click }}</span>
            </div>
            <p v-else>loading...</p>
          </div>
        </div>
      </div>
      <div class="article-slot">
        <h2 :class="`title-text ${appStore.lang}-font`">{{ localeText.title3 }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useOverlay } from "@/composables/useOverlay";
import { fetchLatestYoutube, type YoutubeLatestVideo } from "@/api/youtube.api";
import { HOME_POSTS } from "@/posts/homePosts";
import HomePostCard from "@/components/features/Home/HomePostCard.vue";
import YoutubeVideoCard from "@/components/features/Home/YoutubeVideoCard.vue";
import "./Home.css";
import { locale } from "@/locales/locale";
import "@/pages/_Page.css";
import "@/pages/Home.css";

const appStore = useAppStore();
const { openOverlay } = useOverlay();

const localeText = computed(() => locale(appStore.lang).home);

const trailer = ref<YoutubeLatestVideo | null>(null);
const intro = ref<YoutubeLatestVideo | null>(null);
const combat = ref<YoutubeLatestVideo | null>(null);

let controller: AbortController | null = null;

async function fetchVideos(lang: typeof appStore.lang) {
  controller?.abort();
  controller = new AbortController();
  trailer.value = null;
  intro.value = null;
  combat.value = null;

  const [t, i, c] = await Promise.all([
    fetchLatestYoutube(lang, "officialTrailer", { signal: controller.signal }),
    fetchLatestYoutube(lang, "characterIntro", { signal: controller.signal }),
    fetchLatestYoutube(lang, "characterTrailer", { signal: controller.signal }),
  ]);

  if (controller.signal.aborted) return;
  trailer.value = t;
  intro.value = i;
  combat.value = c;
}

watch(() => appStore.lang, fetchVideos, { immediate: true });

function openYoutube(video: YoutubeLatestVideo) {
  openOverlay(YoutubeVideoCard, { video }, { title: video.title });
}

const sortedPosts = computed(() =>
  [...HOME_POSTS].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  })
);
</script>
