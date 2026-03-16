<template>
  <div ref="DragRef" class="stat-drag-select">
    <div class="stat-drag-list">
      <draggable
        v-model="items"
        item-key="id"
        handle=".drag-handle"
        animation="150"
      >
        <template #item="{ element, index }">
          <OcrDragSelectItem
            :item="element"
            :index="index"
            :options="[STAT_OPTION_BASE, getStatOptionValues(element.statId)]"
            @update:statId="(id) => updateItemStatId(element.id, id)"
            @update:statValue="(val) => updateItemStatValue(element.id, val)"
          />
        </template>
      </draggable>
    </div>
  </div>
  <button class="ocr-drag-select-apply-button" @click="applyChanges">
    <span> Apply to Slot {{ selectIdx + 1 }} </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import draggable from 'vuedraggable';
import { useAppStore, type LangType } from '@/stores/appStore';
import { useCharacterStore } from '@/stores/characterDataStore';
import { FixedStats, type StatId } from '@/datas/stats';
import { getStatOptionBase } from './EchoSelect.helper';
import type { SelectOptionStatOriginal, SelectOpt } from './EchoSelect.type';
import { createEmptyEchoRuntime } from '@/runtime/echo.runtime';
import { patchEchoAt } from '@/runtime/characterData.helpers';
import OcrDragSelectItem from './OcrDragSelectItem.vue';
import './EchoDragSelect.css';
import './OcrSelectDrag.override.css';

const props = defineProps<{
  datas: {
    stats: [StatId, number][] | null;
  };
  selectIdx: number;
}>();

const appStore = useAppStore();
const charStore = useCharacterStore();

const items = ref<any[]>([]);
const DragRef = ref<HTMLDivElement | null>(null);
const height = ref(0);

// Initialize items from data
function initItems(data: [StatId, number][] | null, lang: LangType) {
  if (!data) return [];
  const sliced = data.slice(2); // Skip cost/echoName if present in first 2 slots
  return sliced.map((item, index) => ({
    id: index,
    statId: item[0],
    statValue: item[1],
    statName: FixedStats[item[0] as keyof typeof FixedStats]?.[lang] ?? null,
  }));
}

watch(() => props.datas, (newDatas) => {
  items.value = initItems(newDatas?.stats, appStore.lang);
}, { immediate: true, deep: true });

const STAT_OPTION_BASE = computed<SelectOptionStatOriginal[]>(() =>
  getStatOptionBase(appStore.lang).filter(
    (opt) => opt.subValue.length !== 0
  )
);

function getStatOptionValues(statId: StatId): SelectOpt[] {
  if (!statId || statId === 'dummy') return [];
  const stat = FixedStats[statId as keyof typeof FixedStats];
  if (!stat) return [];
  return stat.ValueSub.map((val) => ({
    value: val,
    label: String(val),
  }));
}

function updateItemStatId(itemId: number, newId: StatId) {
  const item = items.value.find(i => i.id === itemId);
  if (item) {
    item.statId = newId;
    item.statName = FixedStats[newId as keyof typeof FixedStats]?.[appStore.lang] ?? null;
    // Reset value if not in new stat's options? 
    // Usually keep if possible or pick first.
  }
}

function updateItemStatValue(itemId: number, newVal: number) {
  const item = items.value.find(i => i.id === itemId);
  if (item) {
    item.statValue = newVal;
  }
}

function applyChanges() {
  const echo = createEmptyEchoRuntime(4); // Default to cost 4, but maybe we should preserve existing or use detected cost
  // In the React code, it seems to use createEmptyEchoRuntime(4)
  // But let's try to populate subOptions from items
  items.value.forEach((item, index) => {
    if (index < 5 && echo.subOptions[index]) {
      echo.subOptions[index].statId = item.statId;
      echo.subOptions[index].statValue = item.statValue;
    }
  });

  charStore.patchCharacterData(patchEchoAt(charStore.characterData, props.selectIdx as any, echo));
}

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  if (DragRef.value) {
    resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      height.value = entries[0].contentRect.height;
    });
    resizeObserver.observe(DragRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>
