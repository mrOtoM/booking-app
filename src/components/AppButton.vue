<template>
  <button :class="['relative flex items-center justify-center', buttonClass]" :disabled="disabled">
    <icon-loading v-if="loading" class="absolute" />
    <component v-if="leftIcon" :is="leftIcon" :class="['mr-2 h-5 w-5', loading && 'invisible']" />
    <span :class="[loading && 'invisible']">
      <slot />
    </span>
    <component v-if="rightIcon" :is="rightIcon" :class="['ml-2 h-5 w-5', loading && 'invisible']" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import IconLoading from '@/components/icons/IconLoading.vue';

const props = defineProps<{
  leftIcon?: any;
  rightIcon?: any;
  loading?: boolean;
  disabled?: boolean;
  type: 'primary' | 'secondary' | 'tertiary';
}>();

const buttonClass = computed(() => {
  const stylesMap = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
  };
  return stylesMap[props.type] || styles.primary;
});

const base =
  'inline-block text-sm tracking-wide outline-none transition-colors duration-300 disabled:cursor-not-allowed rounded disabled:pointer-events-none rounded-md disabled:bg-gray-100 disabled:text-gray-400';

const styles = {
  primary: base + ' px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white',
  secondary: base + ' px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-600',
  tertiary: 'bg-red',
};
</script>
