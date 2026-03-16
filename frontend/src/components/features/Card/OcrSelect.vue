<template>
  <div class="ocr-select-body">
    <div class="select-item-slot">
      <span class="item-slot-title"> Reorder Echoes </span>
      <div class="item-slot-container">
        <EchoDragSelect :num="selectIdx" @click="(id: number) => emit('update:selectIdx', id)" />
      </div>
    </div>

    <div class="select-item-slot">
      <span class="item-slot-title"> Edit Selected </span>
      <div class="item-slot-container">
        <EchoSelect :index="selectIdx" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EchoSelect from './EchoSelect.vue';
import EchoDragSelect from './EchoDragSelect.vue';
import './OcrSelect.css';

defineProps<{
  selectIdx: number;
}>();

const emit = defineEmits<{
  'update:selectIdx': [id: number];
}>();
</script>
