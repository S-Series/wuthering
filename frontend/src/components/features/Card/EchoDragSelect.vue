<template>
  <div class="echo-drag-select">
    <div class="echo-drag-list">
      <draggable
        v-model="items"
        item-key="id"
        handle=".echo-drag-item"
        animation="150"
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <div
            :class="[
              'echo-drag-item',
              index === 0 ? 'main' : '',
              num === element.id ? 'activated' : '',
              index < 5 ? 'selected' : '',
              element.echoName === null ? 'disable' : '',
            ].filter(Boolean).join(' ')"
            @click="handleClick(element.id)"
          >
            <div class="hover-motion">
              <img class="echo-img"
                :src="`/ico/echos/${element.src[0]}`"
                @error="(e) => { (e.currentTarget as HTMLImageElement).src = '/default.webp' }"
              />
              <span class="echo-drag-label">{{ element.echoName }}</span>
              <img class="score-img" :src="`/ico/rank/${element.src[1]}`" />
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { useCharacterStore } from "@/stores/characterDataStore";
import { useAppStore, type LangType } from "@/stores/appStore";
import { ECHO_CANDIDATES } from "@/datas/echos";
import { setEchoDataIndexes } from "@/runtime/characterData.helpers";
import { getEquipmentRank } from "@/types/character.type";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import "./EchoDragSelect.css";

type EchoIndexTuple = [number, number, number, number, number, number, number, number, number, number];

defineProps<{ num: number }>();
const emit = defineEmits<{ click: [id: number] }>();

const charStore = useCharacterStore();
const appStore = useAppStore();

type DragItem = {
  id: number;
  echoName: string | null;
  src: [string, string];
};

function buildItems(
  echoData: EchoRuntime[] | null,
  echoDataIndex: number[],
  lang: LangType
): DragItem[] {
  const names = ECHO_CANDIDATES[lang];
  const base = Array.from({ length: 10 }, (_, i): DragItem => ({
    id: i,
    echoName: names.find((n) => n.echoId === echoData?.[i]?.echoId)?.text ?? null,
    src: [
      `${echoData?.[i]?.echoId ?? ""}.webp`,
      `${getEquipmentRank(charStore.equipmentScore?.[i][1] ?? 0)}.png`,
    ],
  }));
  return echoDataIndex.map((id) => base.find((v) => v.id === id)!);
}

const items = ref<DragItem[]>(
  buildItems(charStore.characterData.echoData, charStore.characterData.echoDataIndex, appStore.lang)
);

watch(
  [
    () => charStore.characterData.echoData,
    () => charStore.characterData.echoDataIndex,
    () => appStore.lang,
    () => charStore.equipmentScore,
  ],
  () => {
    items.value = buildItems(
      charStore.characterData.echoData,
      charStore.characterData.echoDataIndex,
      appStore.lang
    );
  },
  { deep: true }
);

function onDragEnd() {
  const nextIndexes = items.value.map((item) => item.id);
  if (nextIndexes.length !== 10) return;
  charStore.patchCharacterData(
    setEchoDataIndexes(charStore.characterData, nextIndexes as EchoIndexTuple)
  );
}

function handleClick(id: number) {
  emit("click", id);
}
</script>
