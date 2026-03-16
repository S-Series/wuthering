<template>
  <article :class="`home-post-card ${post.pinned ? 'pinned' : ''}`">
    <h3 :class="`home-post-title ${lang}-font`">{{ post.title[lang] }}</h3>
    <p :class="`home-post-body ${lang}-font`">{{ post.data[lang] }}</p>
    <time class="home-post-date">{{ formatDate(post.date) }}</time>
  </article>
</template>

<script setup lang="ts">
import type { HomePost } from "@/posts/homePosts";
import type { LangType } from "@/stores/appStore";
import "./HomePostCard.css";

defineProps<{ post: HomePost; lang: LangType }>();

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
</script>
