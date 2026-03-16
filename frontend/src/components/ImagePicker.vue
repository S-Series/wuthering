<template>
  <div
    class="image-picker-slot"
    ref="wrapperRef"
    @dblclick="inputRef?.click()"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <img
      v-if="displaySrc"
      ref="imgRef"
      :src="displaySrc"
      draggable="false"
      @load="onImageLoad"
      :style="{
        transform: `
          translate(-50%, -50%)
          translate(${x}px, ${y}px)
          scale(${imgScale * scale})
        `,
      }"
    />

    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      hidden
      @change="onFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import './ImagePicker.css';

const props = defineProps<{
  src: string | null;
  defaultSrc?: string | null;
}>();

const emit = defineEmits<{
  'update:src': [nextSrc: string | null];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);

const isDragging = ref(false);
const lastPos = ref({ x: 0, y: 0 });

const displaySrc = computed(() => props.src ?? props.defaultSrc ?? null);
const imageReady = ref(false);

const x = ref(0);
const y = ref(0);
const scale = ref(1);
const imgScale = ref(1);
const wrapperSize = ref({ w: 0, h: 0 });

const MIN_SCALE = 1;
const MAX_SCALE = 10;

function updateWrapperSize() {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  wrapperSize.value = { w: rect.width, h: rect.height };
}

function clampPosition(nextScale = scale.value) {
  if (!imgRef.value || !wrapperSize.value.w || !wrapperSize.value.h) return;

  const currentImgScale = imgScale.value * nextScale;
  const scaledW = imgRef.value.naturalWidth * currentImgScale;
  const scaledH = imgRef.value.naturalHeight * currentImgScale;

  const maxX = Math.max(0, (scaledW - wrapperSize.value.w) / 2);
  const maxY = Math.max(0, (scaledH - wrapperSize.value.h) / 2);

  x.value = Math.min(maxX, Math.max(-maxX, x.value));
  y.value = Math.min(maxY, Math.max(-maxY, y.value));
}

function clampScale(nextScale: number) {
  const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
  scale.value = clamped;
  clampPosition(clamped);
}

function handleMouseDown(e: MouseEvent) {
  isDragging.value = true;
  lastPos.value = { x: e.clientX, y: e.clientY };
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const dx = e.clientX - lastPos.value.x;
  const dy = e.clientY - lastPos.value.y;
  lastPos.value = { x: e.clientX, y: e.clientY };
  x.value += dx;
  y.value += dy;
}

function handleMouseUp() {
  isDragging.value = false;
  clampPosition();
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  const zoomSpeed = 0.001;
  clampScale(scale.value - e.deltaY * zoomSpeed);
}

function onImageLoad() {
  imageReady.value = true;
  updateWrapperSize();
  resetImage();
}

function resetImage() {
  if (!imgRef.value || !wrapperSize.value.w || !wrapperSize.value.h) return;
  const containScale = Math.max(
    wrapperSize.value.w / imgRef.value.naturalWidth,
    wrapperSize.value.h / imgRef.value.naturalHeight
  );
  imgScale.value = containScale;
  scale.value = 1;
  x.value = 0;
  y.value = 0;
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (inputRef.value) inputRef.value.value = '';
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      emit('update:src', reader.result);
    }
  };
  reader.readAsDataURL(file);
}

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  updateWrapperSize();
  if (wrapperRef.value) {
    resizeObserver = new ResizeObserver(updateWrapperSize);
    resizeObserver.observe(wrapperRef.value);
    wrapperRef.value.addEventListener('wheel', onWheel, { passive: false });
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  wrapperRef.value?.removeEventListener('wheel', onWheel);
});

watch(displaySrc, () => {
  imageReady.value = false;
  nextTick(updateWrapperSize);
});

watch([() => wrapperSize.value.w, () => wrapperSize.value.h], () => {
  if (imageReady.value) {
    clampPosition(scale.value);
  }
});
</script>
