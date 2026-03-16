<template>
  <div
    :class="[
      'stat-drag-item',
      isDragging ? 'dragging' : '',
      isSelected ? 'selected' : '',
      item.statName === null ? 'disable' : '',
    ].filter(Boolean).join(' ')"
  >
    <div class="hover-motion">
      <button
        type="button"
        class="drag-handle"
      >
        ☰
      </button>

      <div class="stat-select-wrap">
        <select 
          :value="item.statId" 
          @change="updateStatId($event)"
          class="native-select wide"
        >
          <option 
            v-for="opt in options[0]" 
            :key="opt.value" 
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div style="width: 2.5%"/>

      <div class="stat-select-wrap">
        <select 
          :value="item.statValue" 
          @change="updateStatValue($event)"
          class="native-select"
        >
          <option 
            v-for="opt in options[1]" 
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
import { computed } from 'vue';
import type { StatId } from '@/datas/stats';
import type { SelectOpt, SelectOptionStatOriginal } from './EchoSelect.type';

const props = defineProps<{
  item: {
    id: number;
    statId: StatId;
    statValue: number;
    statName: string | null;
  };
  index: number;
  options: [SelectOptionStatOriginal[], SelectOpt[]];
  isDragging?: boolean;
}>();

const emit = defineEmits<{
  'update:statId': [id: StatId];
  'update:statValue': [value: number];
}>();

const isSelected = computed(() => props.index < 5);

function updateStatId(event: Event) {
  const val = (event.target as HTMLSelectElement).value as StatId;
  emit('update:statId', val);
}

function updateStatValue(event: Event) {
  const val = parseFloat((event.target as HTMLSelectElement).value);
  emit('update:statValue', val);
}
</script>

<style scoped>
.native-select {
  width: 100%;
  background: #252525;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: min(1vw, 0.8rem);
  appearance: none;
}
.native-select.wide {
  font-size: min(0.9vw, 0.75rem);
}
.drag-handle {
  cursor: grab;
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  padding: 0 4px;
}
</style>
