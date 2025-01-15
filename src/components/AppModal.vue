<template>
  <div>
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['update:show']);

const close = () => {
  emit('update:show', false);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  z-index: 99;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  cursor: default;
}
</style>
