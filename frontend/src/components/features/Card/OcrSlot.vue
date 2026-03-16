<template>
  <div class="ocr-comp-body">
    <div class="ocr-slot ocr">
      <div class="container">
        <div class="inner-slot top">
          <span class="en-font">{{ localeText.status }}: {{ status }}</span>

          <div
            :class="['file-slot', isFocused ? 'focused' : '']"
            ref="slotRef"
            tabindex="0"
            @click="handleSlotClick"
          >
            <input
              class="image-input"
              ref="fileInputRef"
              type="file"
              accept="image/*"
              @change="onFileChange"
            />
            <template v-if="file">
              <img :src="(fileUrl as string)" />
            </template>
            <template v-else>
              <span v-if="!isFocused" style="text-decoration: underline">
                {{ localeText.description1 }}
              </span>
              <span v-else :class="[`${appStore.lang}-font`]" style="white-space: pre; text-align: center">
                {{ localeText.description2 }}
              </span>
            </template>
          </div>

          <div style="display: flex; flex-direction: column; width: 100%; height: 20%">
            <span
              v-if="isBoaring"
              :class="[`${appStore.lang}-font`]"
              style="white-space: pre; text-align: center; font-size: min(1vw, 1rem)"
            >
              {{ localeText.description3 }}
            </span>

            <div v-if="status === 'Requested'" class="ocr-loading-slot">
              <div class="ocr-loading" />
              <span class="en-font">{{ localeText.loading }}</span>
            </div>
            <button v-else class="ocr-button" @click="runOcr" :disabled="!file">
              {{ localeText.request }}
            </button>
          </div>
        </div>

        <div class="inner-slot bottom">
          <span class="en-font">{{ localeText.result }}</span>
          <div class="text-box">
            <template v-if="debug">
              <span style="font-size: min(1vw, 0.85rem)">EchoName: {{ debug.echoName ?? 'undefined' }}</span>
              <span style="font-size: min(1vw, 0.85rem)">Cost: {{ debug.cost ?? 'undefined' }}</span>
              <span
                v-for="(item, i) in debug.echoStats"
                :key="i"
                style="font-size: min(1vw, 0.85rem)"
              >
                {{ statsToText(item) }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="inner-slot result">
          <span class="en-font">{{ localeText.result }}</span>
          <div class="file-slot">
            <img v-if="preview" :src="preview" />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; width: 90%; height: 67.5%; align-items: center; margin-top: 2.5%">
          <OcrSelectDrag :datas="{ stats: debug?.echoStats ?? null }" :selectIdx="selectIdx" />
        </div>
      </div>
    </div>

    <div class="ocr-slot echo">
      <OcrSelect v-model:selectIdx="selectIdx" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { requestOcrByUrl } from '@/api/ocr.api';
import { 
  normalizeOcrTexts, 
  ocrImageBase64ToDataUrl, 
  retouchOcrTexts, 
  textsToStats 
} from '@/api/ocr.api.helper';
import { useAppStore } from '@/stores/appStore';
import { locale } from '@/locales/locale';
import { FixedStats, type StatId } from '@/datas/stats';
import type { EchoId } from '@/datas/echos';
import OcrSelect from '@/components/features/Card/OcrSelect.vue';
import OcrSelectDrag from '@/components/features/Card/OcrSelectDrag.vue';
import './OcrSlot.css';

const appStore = useAppStore();
const localeText = computed(() => locale(appStore.lang).ocr);

const slotRef = ref<HTMLDivElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);
const status = ref<'Idle' | 'Requested' | 'Successed' | 'Failed'>('Idle');
const debug = ref<{
  echoId: EchoId | null;
  echoName: string | null;
  cost: number;
  echoStats: [StatId, number][];
} | null>(null);
const preview = ref<string | null>(null);
const isBoaring = ref(false);
const isFocused = ref(false);
const selectIdx = ref(0);

const endpointUrl = `${import.meta.env.VITE_GATEWAY_URL}/api/gateway/ocr`; // Check if original had /api/ocr or /api/gateway/ocr

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    file.value = target.files[0];
    if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
    fileUrl.value = URL.createObjectURL(file.value);
  }
}

function handleSlotClick() {
  if (isFocused.value) {
    fileInputRef.value?.click();
  } else {
    isFocused.value = true;
  }
}

async function runOcr() {
  if (!file.value) return;

  status.value = 'Requested';
  debug.value = null;
  preview.value = null;

  try {
    const data = await requestOcrByUrl(endpointUrl, file.value, appStore.lang, { timeoutMs: 60_000 });
    const texts = normalizeOcrTexts(data);
    const img = ocrImageBase64ToDataUrl(data.image_base64);

    if (img) preview.value = img;
    debug.value = textsToStats(retouchOcrTexts(texts, appStore.lang), appStore.lang);
    status.value = 'Successed';
  } catch (e) {
    status.value = 'Failed';
    console.error(e);
  }
}

function statsToText(data: [StatId, number] | null): string {
  if (!data) return 'Error';
  const head = FixedStats[data[0]][appStore.lang];
  const isPercent = ['pct', 'bns', 'crit'].some((k) =>
    FixedStats[data[0]].id.toLowerCase().includes(k)
  );
  const tail = data[1].toString() + (isPercent ? '%' : '');
  return `${head}: ${tail}`;
}

// Global listeners
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') isFocused.value = false;
}

function onMouseDown(e: MouseEvent) {
  if (!slotRef.value) return;
  if (!slotRef.value.contains(e.target as Node)) {
    isFocused.value = false;
  }
}

function onPaste(e: ClipboardEvent) {
  if (!isFocused.value) return;
  const item = Array.from(e.clipboardData?.items || []).find((it: DataTransferItem) => it.type.startsWith('image/'));
  const blob = item?.getAsFile();
  if (blob) {
    const ext = blob.type.split('/')[1] || 'png';
    const pastedFile = new File([blob], `pasted-${Date.now()}.${ext}`, { type: blob.type });
    file.value = pastedFile;
    if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
    fileUrl.value = URL.createObjectURL(file.value);
    
    if (fileInputRef.value) {
      const dt = new DataTransfer();
      dt.items.add(pastedFile);
      fileInputRef.value.files = dt.files;
    }
    e.preventDefault();
  }
}

let boaringTimer: any = null;
watch(status, (newStatus) => {
  isBoaring.value = false;
  clearTimeout(boaringTimer);
  if (newStatus === 'Requested') {
    boaringTimer = setTimeout(() => {
      isBoaring.value = true;
    }, 10000);
  }
});

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('mousedown', onMouseDown);
  window.addEventListener('paste', onPaste);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('paste', onPaste);
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
});
</script>
