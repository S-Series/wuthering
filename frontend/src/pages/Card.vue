<template>
  <div id="card-page-slot">
    <div class="card-section left">
      <CardLeftStats 
        :selected-character-data="selectedCharacterData"
        @open-scoreboard="openScoreboard" 
      />
    </div>

    <!-- Right Selection Panel -->
    <CardRightPanel @open-ocr="openOcr" />
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useOverlay } from '@/composables/useOverlay';
import { useCharacterStore } from '@/stores/characterDataStore';

import CardLeftStats from '@/components/features/Card/CardLeftStats.vue';
import CardRightPanel from '@/components/features/Card/CardRightPanel.vue';
import OcrSlot from '@/components/features/Card/OcrSlot.vue';

import { character, type Character } from '@/datas/characters';
import '@/pages/Card.css';
import '@/pages/Card.contents.main.css';

const appStore = useAppStore();
const charStore = useCharacterStore();
const { openOverlay } = useOverlay();

const characterId = computed(() => charStore.characterId);

const selectedCharacterData = computed<Character>(() => 
  character[characterId.value] || character['rover_spectro']
);

function openOcr() {
  openOverlay(markRaw(OcrSlot));
}

function openScoreboard() {
  const SCOREBOARD_URL = "https://docs.google.com/spreadsheets/d/169EqXJatZIMqL0MPbHF6Eg9DgLFcaxjE6hG03gYZ-_U/edit?gid=1750559029#gid=1750559029";
  window.open(SCOREBOARD_URL, "_blank");
}
</script>
