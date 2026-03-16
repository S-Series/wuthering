<template>
  <Teleport to="body">
    <div
      v-if="overlayOpen"
      class="overlay-backdrop"
      role="dialog"
      aria-modal="true"
      @mousedown="onBackdropClick"
    >
      <div
        class="overlay-panel"
        :style="{
          width: overlayOptions.width ?? undefined,
          height: overlayOptions.height ?? undefined,
          aspectRatio: overlayOptions.ratio ?? undefined,
        }"
      >
        <div
          v-if="overlayOptions.title || overlayOptions.showCloseButton"
          class="overlay-header"
        >
          <span :class="`overlay-header-text ${appStore.lang}-font`">{{ overlayOptions.title }}</span>
          <button
            v-if="overlayOptions.showCloseButton"
            class="overlay-close-btn"
            @click="closeOverlay"
          />
        </div>
        <div class="overlay-body">
          <component :is="overlayComponent" v-bind="overlayProps" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useOverlay, overlayOpen, overlayComponent, overlayProps, overlayOptions } from "@/composables/useOverlay";
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();
const { closeOverlay } = useOverlay();

function onBackdropClick(e: MouseEvent) {
  if (!overlayOptions.value.closeOnBackdrop) return;
  if (e.target === e.currentTarget) closeOverlay();
}
</script>
