<template>
  <div class="stat-slot-body">
    <div class="container">
      <img :src="`/ico/stats/${statId}.webp`" />
      <span :class="`${appStore.lang}-font`">{{ label }}</span>
      <p :class="`num-font ${isPct ? '' : 'blank'}`">
        {{ isPct ? statValue.toFixed(1) + "%" : statValue }}
      </p>
    </div>
    <em class="num-font">+{{ isPct ? plusValue.toFixed(1) + "%" : plusValue }}</em>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { FixedStats, type StatId } from "@/datas/stats";
import "./StatSlot.css";

const props = defineProps<{ statId: StatId; statValue: number; plusValue: number }>();
const appStore = useAppStore();

const isPct = computed(() =>
  props.statId.includes("crit") || props.statId.includes("Bns") || props.statId.includes("Pct")
);

const label = computed(() =>
  FixedStats[props.statId][appStore.lang]
    .replace("アップ", " ✢")
    .replace("加成", " ✢")
);
</script>
