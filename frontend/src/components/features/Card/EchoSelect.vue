<template>
  <div class="echo-select-wrapper" ref="wrapRef">
    <!-- Cost Selector -->
    <div class="drop-slot large">
      <select 
        :value="selectedCost" 
        @change="updateCost($event)"
        class="native-select"
      >
        <option :value="4">Cost 4</option>
        <option :value="3">Cost 3</option>
        <option :value="1">Cost 1</option>
      </select>
    </div>

    <!-- Harmony Set Selector -->
    <div class="drop-slot large">
      <div class="custom-select-wrap">
        <select 
          :value="charStore.characterData.echoData[index].setId ?? ''" 
          @change="updateSetId($event)"
          class="native-select"
        >
          <option value="">Set ...</option>
          <option 
            v-for="opt in harmonyOptions" 
            :key="opt.value" 
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Echo ID Selector -->
    <div class="drop-slot large">
      <select 
        :value="charStore.characterData.echoData[index].echoId ?? ''" 
        @change="updateEchoId($event)"
        class="native-select"
      >
        <option value="">Echo ...</option>
        <option 
          v-for="opt in echoIdOptions" 
          :key="opt.value" 
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="divider" />

    <!-- Main Stat Selector -->
    <div class="drop-slot">
      <select 
        :value="charStore.characterData.echoData[index].mainOption.statId" 
        @change="updateMainStat($event)"
        class="native-select wide"
      >
        <option 
          v-for="opt in mainStatOptions" 
          :key="opt.value" 
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <span class="main-stat-span num-font">
        {{ charStore.characterData.echoData[index].mainOption.statValue.toFixed(1) }}%
      </span>
    </div>

    <div class="divider" />

    <!-- Sub Stat Selectors -->
    <div v-for="idx in [0, 1, 2, 3, 4]" :key="`sub-stat-${idx}`" class="drop-slot">
      <div style="width: 65%">
        <select 
          :value="charStore.characterData.echoData[index].subOptions[idx].statId" 
          @change="updateSubStatId(idx, $event)"
          class="native-select wide"
        >
          <option 
            v-for="opt in subStatOptions" 
            :key="opt.value" 
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div style="width: 35%">
        <select 
          :value="charStore.characterData.echoData[index].subOptions[idx].statValue" 
          @change="updateSubStatValue(idx, $event)"
          class="native-select"
        >
          <option 
            v-for="opt in getSubStatValues(idx)" 
            :key="opt.value" 
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useCharacterStore } from '@/stores/characterDataStore';
import { FixedStats } from '@/datas/stats';
import { echoDict } from '@/datas/echos';
import { 
  HARMONY_OPTIONS_BASE, 
  getEchoOptionBase, 
  getStatOptionBase 
} from '@/components/features/Card/EchoSelect.helper';
import { 
  setEchoId, 
  patchEchoMainOption, 
  patchEchoSubOption, 
  setEchoCost, 
  setEchoSetId 
} from '@/runtime/characterData.helpers';
import type { Cost } from '@/components/features/Card/EchoSelect.type';
import './EchoSelect.css';

const props = defineProps<{
  index?: number;
}>();

const index = computed(() => props.index ?? 0);

const appStore = useAppStore();
const charStore = useCharacterStore();

const wrapRef = ref<HTMLDivElement | null>(null);
const slotHeight = ref(16);

const selectedCost = computed<Cost>(() => 
  charStore.characterData.echoData[index.value]?.cost || 4
);

const selectedEchoData = computed(() => 
  charStore.characterData.echoData[index.value]
);

const selectedEchoDictionaryData = computed(() => {
  const costKey = `Cost${selectedCost.value}` as keyof typeof echoDict;
  const dict = echoDict[costKey];
  const found = Object.entries(dict).find(
    ([echoId]) => echoId === selectedEchoData.value?.echoId
  );
  return found ? (found[1] as any) : null;
});

const harmonyOptions = computed(() => {
  const types = (selectedEchoDictionaryData.value?.type as string[]) ?? [];
  if (types.length === 0) {
    return HARMONY_OPTIONS_BASE.map(opt => ({
      value: opt.value,
      label: opt[appStore.lang]
    }));
  }
  return HARMONY_OPTIONS_BASE
    .filter(opt => types.includes(opt.value))
    .map((opt: any) => ({
      value: opt.value,
      label: opt[appStore.lang]
    }));
});

const echoIdOptions = computed(() => {
  const base = getEchoOptionBase(appStore.lang, selectedCost.value);
  return base
    .filter(item => {
      if (!item.harmonies) return true;
      const currentSetId = charStore.characterData.echoData[index.value].setId;
      if (!currentSetId) return true;
      return item.harmonies.includes(currentSetId);
    })
    .map((opt: any) => ({
      value: opt.value,
      label: (opt as any)[appStore.lang]
    }));
});

const statOptionsBase = computed(() => 
  getStatOptionBase(appStore.lang)
);

const mainStatOptions = computed(() => {
  const cost = charStore.characterData.echoData[index.value].cost;
  return statOptionsBase.value.filter(opt => {
    if (cost === 4) return opt.mainValue[0] !== 0;
    if (cost === 3) return opt.mainValue[1] !== 0;
    if (cost === 1) return opt.mainValue[2] !== 0;
    return false;
  });
});

const subStatOptions = computed(() => 
  statOptionsBase.value.filter(opt => opt.subValue.length !== 0)
);

function getSubStatValues(idx: number) {
  const echo = charStore.characterData.echoData[index.value];
  const statId = echo.subOptions[idx].statId;
  if (!statId || statId === 'dummy') return [];
  if (!(statId in FixedStats)) return [];
  
  return FixedStats[statId as keyof typeof FixedStats].ValueSub.map(value => ({
    value,
    label: String(value)
  }));
}

// Update handlers
function updateCost(event: Event) {
  const val = parseInt((event.target as HTMLSelectElement).value) as Cost;
  charStore.patchCharacterData(setEchoCost(charStore.characterData, index.value as any, val));
}

function updateSetId(event: Event) {
  const val = (event.target as HTMLSelectElement).value || null;
  charStore.patchCharacterData(setEchoSetId(charStore.characterData, index.value as any, val as any));
}

function updateEchoId(event: Event) {
  const val = (event.target as HTMLSelectElement).value || null;
  charStore.patchCharacterData(setEchoId(charStore.characterData, index.value as any, val as any));
}

function updateMainStat(event: Event) {
  const statId = (event.target as HTMLSelectElement).value;
  if (!statId) return;
  
  const cost = charStore.characterData.echoData[index.value].cost;
  const costIndexMap: Record<number, number> = { 4: 0, 3: 1, 1: 2 };
  const idx = costIndexMap[cost];
  const stat = (FixedStats as any)[statId];
  const statValue = stat ? stat.ValueMain[idx] : 0;

  charStore.patchCharacterData(patchEchoMainOption(charStore.characterData, index.value as any, {
    statId: statId as any,
    statValue
  }));
}

function updateSubStatId(subIdx: number, event: Event) {
  const statId = (event.target as HTMLSelectElement).value;
  charStore.patchCharacterData(patchEchoSubOption(charStore.characterData, index.value as any, subIdx as any, { statId: statId as any }));
}

function updateSubStatValue(subIdx: number, event: Event) {
  const statValue = parseFloat((event.target as HTMLSelectElement).value);
  charStore.patchCharacterData(patchEchoSubOption(charStore.characterData, index.value as any, subIdx as any, { statValue }));
}

// Resize Observer logic (to mirror slotHeight logic from React)
let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  if (wrapRef.value) {
    const update = () => {
      const rect = wrapRef.value!.getBoundingClientRect();
      slotHeight.value = Math.max(1, Math.round(rect.height));
    };
    update();
    resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(wrapRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.native-select {
  width: 100%;
  background: #252525;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px;
  font-size: min(1.2vw, 0.9rem);
  appearance: none;
  cursor: pointer;
}

.native-select.wide {
  font-size: min(1.1vw, 0.8rem);
}

.native-select:focus {
  outline: none;
  border-color: #666;
}

.custom-select-wrap {
  position: relative;
  width: 100%;
}
</style>
