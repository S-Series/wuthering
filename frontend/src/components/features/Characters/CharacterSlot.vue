<template>
  <a v-if="isGrid" :class="`character-slot ${prop.isElite ? 'elite' : ''}`" :href="`/card?character=${id}`">
    <div class="character-image-slot">
      <img :class="`character-image ${prop.rank}`" alt="character image"
        :src="`/character/${id.includes('rover') ? 'rover' : id}/stand.png`" />
      <div :class="`card-bg ${prop.rank === 'Empty' ? 'empty' : prop.element}`" />
      <div class="overlay" />
      <img v-if="prop.rank !== 'Empty'" alt="rank icon" class="rank-icon" :src="`/ico/rank/${prop.rank}.png`" />
    </div>
    <div class="character-info-slot">
      <span :class="`name ${appStore.lang}-font`">{{ capitalize(prop[appStore.lang] || prop.en) }}</span>
      <img alt="" class="bigger" :src="`/ico/element/${prop.element}.png`" />
    </div>
  </a>

  <div v-else class="character-slot">
    <div class="character-image-slot">
      <img alt="character image" class="character-image"
        :src="`/character/${id.includes('rover') ? 'rover' : id}/stand.png`" />
      <div class="rank-slot">
        <img alt="rank icon" class="rank-icon" :src="`/ico/rank/${prop.rank}.png`" />
      </div>
    </div>
    <div class="character-info-slot">
      <span class="name">{{ capitalize(prop[appStore.lang]) }}</span>
      <img alt="" class="bigger" :src="`/ico/element/${prop.element}.png`" />
      <img alt="" :src="`/ico/weapon_type/${prop.weapon}.webp`" />
      <img alt="" :src="`/ico/stats/${prop.type}Bns.webp`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import type { Character } from "@/datas/characters";
import type { CharacterRank } from "@/types/character.type";
import "./CharacterSlot.css";

defineProps<{
  id: string;
  prop: Character & { score: number; rank: CharacterRank };
  isGrid: boolean;
}>();

const appStore = useAppStore();

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}
</script>
