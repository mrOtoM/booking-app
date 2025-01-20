<template v-slot:custom-content>
  <div class="card">
    <h1>{{ title }}</h1>
    <div>
      <slot name="custom-content"> </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();
</script>

<style scoped>
.card {
  @apply mt-4 rounded-lg  p-4 bg-background-card;
}

h1 {
  @apply text-2xl text-text-primary;
}

p {
  @apply text-base text-text-secondary;
}
</style>
