<template>
  <div :class="`echo-slot-body ${index < 0 ? 'select' : ''}`">
    <div class="echo-image-slot">
      <img class="echo-image" alt="echo icon"
        :src="`/ico/echos/${echoData?.echoId}.webp`"
        @error="(e) => { (e.currentTarget as HTMLImageElement).src = 'default.webp' }" />
      <img class="harmony-image" alt="harmony icon"
        :src="`/ico/harmony/${echoData?.setId}.png`"
        @error="(e) => { (e.currentTarget as HTMLImageElement).src = 'default.webp' }" />
      <div class="divider echo" />
    </div>

    <div class="stat-container main">
      <EchoStatSlot
        :stat-id="echoData?.mainOption.statId ?? 'dummy'"
        :stat-value="(echoData?.mainOption?.statValue ?? 0).toFixed(1)"
        color="#fff"
      />
      <EchoStatSlot
        :stat-id="echoData?.cost === 1 ? 'hp' : 'atk'"
        :stat-value="costAtk"
        color="#ccc"
      />
    </div>

    <div class="divider stat" />

    <div class="stat-container sub">
      <EchoStatSlot
        v-for="idx in [0, 1, 2, 3, 4]"
        :key="`echo-sub-${idx}`"
        :stat-id="echoData?.subOptions?.[idx]?.statId ?? 'dummy'"
        :stat-value="(echoData?.subOptions?.[idx]?.statValue || 0).toFixed(1)"
        :color="statColors[idx]"
      />
    </div>

    <div class="divider stat" />

    <div class="score-container">
      <img alt="rank icon" :src="`/ico/rank/${getEquipmentRank(charStore.equipmentScore?.[Math.abs(index)][1] ?? 0)}.png`" />
      <div class="slot">
        <span class="en-font">Cv.</span>
        <span class="en-font"> <em class="num-font">{{ charStore.equipmentScore[Math.abs(index)][0].toFixed(1) }}</em>pt</span>
      </div>
      <div class="slot">
        <span class="en-font">Av.</span>
        <span class="en-font"> <em class="num-font">{{ charStore.equipmentScore[Math.abs(index)][1].toFixed(1) }}</em>pt</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { useCharacterStore } from "@/stores/characterDataStore";
import { getEquipmentRank } from "@/types/character.type";
import { characterScoreSheet } from "@/datas/characterScoreSheet";
import { FixedStats, type StatId } from "@/datas/stats";
import "./EchoSlot.css";

const props = defineProps<{ index: number }>();
const charStore = useCharacterStore();

const echoData = computed(() => charStore.characterData.echoData[props.index]);

const PERCENT_KEYS = ["crit", "Pct", "Bns"];

// Inline sub-component for echo stat row
const EchoStatSlot = defineComponent({
  props: { statId: String, statValue: [Number, String], color: String },
  setup(p) {
    return () =>
      h("div", { class: "echo-stat-slot" }, [
        h("img", {
          alt: "stat icon",
          src: `/ico/stats/${p.statId}.webp`,
          onError: (e: Event) => {
            const img = e.currentTarget as HTMLImageElement;
            img.onerror = null;
            img.src = "/default.webp";
          },
        }),
        h("span", { class: "num-font", style: { color: p.color } }, [
          p.statValue === -1 ? "- - -" : p.statValue,
          PERCENT_KEYS.some((k) => (p.statId ?? "").includes(k)) ? "%" : "",
        ]),
      ]);
  },
});

function statToColor(statId?: StatId, statValue = 0, scoreValue = 0): string {
  if (!statId || !statValue || statId === "dummy" || !(scoreValue > 0)) return "#555";
  const vals = FixedStats[statId].ValueSub;
  const min = vals[0] ?? -1;
  const max = vals[vals.length - 1] ?? -1;
  if ((max as any) === -1 || (min as any) === -1) return "#555";
  const base = 255;
  const gray = scoreValue > 1 ? 0 : scoreValue > 0 ? 75 : 150;
  const ratio = 1 - ((statValue - min) / (max - statValue)) / scoreValue;
  const safe = Math.max(0, Math.min(1, ratio));
  return `rgb(${base - gray}, ${base - gray}, ${base * safe - gray * 1.1})`;
}

const statColors = computed(() => {
  const scoreMap = characterScoreSheet[charStore.characterId];
  return [0, 1, 2, 3, 4].map((idx) => {
    const sub = echoData.value?.subOptions?.[idx];
    return statToColor(sub?.statId, sub?.statValue, scoreMap?.[sub?.statId ?? ""] ?? 0);
  });
});

const costAtk = computed(() => {
  switch (echoData.value?.cost) {
    case 4: return 150;
    case 3: return 100;
    case 1: return 2280;
    default: return -1;
  }
});
</script>
