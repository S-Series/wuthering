<template>
  <header>
    <Navbar />
  </header>
  <main id="main-container">
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/_Layout/Navbar.vue";
import Footer from "@/components/_Layout/Footer.vue";
import "@/components/_Layout/Layout.css";
import "@/pages/_Page.css";

const route = useRoute();

const PAGE_CLASSES = ["page-home", "page-characters", "page-card", "page-profile"];
const PATH_MAP: Record<string, string> = {
  "/": "page-home",
  "/characters": "page-characters",
  "/card": "page-card",
  "/profile": "page-profile",
};

watch(
  () => route.path,
  (path) => {
    document.body.classList.remove(...PAGE_CLASSES);
    const cls = PATH_MAP[path];
    if (cls) document.body.classList.add(cls);
  },
  { immediate: true }
);
</script>
