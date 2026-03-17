<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  value: number;
  duration?: number;
  decimals?: number;
}>();

const displayValue = ref('0');
const current = ref(0);

const animate = () => {
  const start = current.value;
  const end = props.value;
  const duration = props.duration || 1000;
  const decimals = props.decimals || 0;
  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out expo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    
    current.value = start + (end - start) * easeProgress;
    displayValue.value = current.value.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

onMounted(() => {
  displayValue.value = Number(0).toFixed(props.decimals || 0);
  animate();
});

watch(() => props.value, () => {
  animate();
});
</script>
