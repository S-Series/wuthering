<template>
  <div :class="['skeleton-item', type, animated ? 'animated' : '']" :style="style"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import "./Skeleton.css";

interface Props {
  type?: "rect" | "circle" | "text";
  width?: string;
  height?: string;
  borderRadius?: string;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "rect",
  width: "100%",
  height: "100%",
  animated: true,
});

const style = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.borderRadius || (props.type === "circle" ? "50%" : "4px"),
}));
</script>
