<template>
  <div id="page-slot">
    <div class="page-header">
      <button :class="`header-button ${isDisplayGrid ? 'active' : ''}`" @click="isDisplayGrid = true">
        <img class="button-icon" alt="list-icon" src="/default.webp" />
      </button>
      <button :class="`header-button ${isDisplayGrid ? '' : 'active'}`" @click="isDisplayGrid = false">
        <img class="button-icon" alt="grid-icon" src="/default.webp" />
      </button>
      <div class="search-bar">
        <img alt="search-icon" src="/default.webp" />
        <input placeholder="공명자 검색" />
      </div>
    </div>
    <div class="slot-container">
      <CharacterSlot
        v-for="[key, item] in filteredCharacters"
        :key="key"
        :id="key"
        :prop="item"
        :isGrid="isDisplayGrid"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { loadSummaryStore } from "@/summaryData/storage";
import { character } from "@/datas/characters";
import type { WeaponType, ElementType } from "@/datas/characters";
import { getCharacterRank } from "@/types/character.type";
import CharacterSlot from "@/components/features/Characters/CharacterSlot.vue";
import "./Characters.css";
import "@/pages/_Page.css";
import "@/pages/Characters.css";

type OrderByOption = "version" | "version_reverse" | "score" | "score_reverse";

const orderBy = ref<OrderByOption>("version");
const weaponFilter = ref<WeaponType | null>(null);
const elementFilter = ref<ElementType | null>(null);
const isDisplayGrid = ref(true);

const summaryStore = loadSummaryStore();
const CHARACTER_LIST = Object.entries(character);

const filteredCharacters = computed(() =>
  CHARACTER_LIST
    .filter(([, item]) => !weaponFilter.value || item.weapon === weaponFilter.value)
    .filter(([, item]) => !elementFilter.value || item.element === elementFilter.value)
    .sort(([idA, a], [idB, b]) => {
      switch (orderBy.value) {
        case "version": return b.version - a.version;
        case "version_reverse": return a.version - b.version;
        case "score": return (summaryStore.data[idB]?.score ?? 0) - (summaryStore.data[idA]?.score ?? 0);
        case "score_reverse": return (summaryStore.data[idA]?.score ?? 0) - (summaryStore.data[idB]?.score ?? 0);
        default: return 0;
      }
    })
    .map(([id, item]) => {
      const score = summaryStore.data[id]?.score ?? 0;
      return [id, { ...item, score, rank: getCharacterRank(score) }] as const;
    })
);
</script>
