<template>
  <div class="stat-slot-body">
    <div class="container">
      <img :src="getStatIcon(statId)" />
      <span :class="`${appStore.lang}-font`">{{ label }}</span>
      <p :class="`num-font ${isPct ? '' : 'blank'}`">
        <template v-if="isAnimated">
          <CountUp :value="statValue" :decimals="isPct ? 1 : 0" />{{ isPct ? "%" : "" }}
        </template>
        <span v-else>
          {{ isPct ? statValue.toFixed(1) + "%" : statValue }}
        </span>
      </p>
    </div>
    <em class="num-font">+{{ isPct ? plusValue.toFixed(1) + "%" : plusValue }}</em>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { FixedStats, type StatId } from "@/datas/stats";
import { getStatIcon } from "@/utils/assetHelper";
import CountUp from "@/components/common/CountUp.vue";
import "./StatSlot.css";

const props = defineProps<{ 
  statId: StatId; 
  statValue: number; 
  plusValue: number;
  isAnimated?: boolean;
}>();

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
