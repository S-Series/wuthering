import { ref, shallowRef, type Component } from "vue";

export type OverlayOptions = {
  title?: string;
  width?: string | null;
  height?: string | null;
  ratio?: string | null;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
};

type ResolvedOptions = Required<OverlayOptions>;

const DEFAULT_OPTIONS: ResolvedOptions = {
  title: "",
  width: null,
  height: null,
  ratio: null,
  closeOnEsc: false,
  closeOnBackdrop: true,
  showCloseButton: true,
};

// Global overlay state
export const overlayOpen = ref(false);
export const overlayComponent = shallowRef<Component | null>(null);
export const overlayProps = ref<Record<string, unknown>>({});
export const overlayOptions = ref<ResolvedOptions>({ ...DEFAULT_OPTIONS });

export function useOverlay() {
  function openOverlay(component: Component, props: Record<string, unknown> = {}, options?: OverlayOptions) {
    overlayComponent.value = component;
    overlayProps.value = props;
    overlayOptions.value = { ...DEFAULT_OPTIONS, ...(options ?? {}) };
    overlayOpen.value = true;
  }

  function closeOverlay() {
    overlayOpen.value = false;
    overlayComponent.value = null;
    overlayProps.value = {};
  }

  return { openOverlay, closeOverlay, isOpen: overlayOpen };
}
