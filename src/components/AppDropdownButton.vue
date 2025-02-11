<template>
  <div class="dropdown" ref="dropdownRef">
    <button class="dropdown-button" :class="{ 'rounded-button': rounded }" @click="toggleDropdown($event)">
      <slot name="label">{{ label }}</slot>
    </button>
    <div :class="dropdownClasses">
      <ul>
        <li
          v-for="item in items"
          :key="item.value"
          :class="{ disabled: item.disabled }"
          @click="item.disabled ? null : handleClick(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, Component } from 'vue';

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    label?: string | Component;
    items: Array<{
      label: string;
      value?: string | number;
      command?: () => any;
      disabled?: boolean;
    }>;
    rounded?: boolean;
  }>(),
  {
    label: '',
    items: () => [{ label: '' }],
    rounded: false,
  },
);

const toggleDropdown = (event: Event) => {
  isOpen.value = !isOpen.value;
  event.stopPropagation();
};

const handleClick = (item: any) => {
  if (item.command) {
    item.command();
  }
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const dropdownClasses = computed(() => ({
  'dropdown-content': true,
  show: isOpen.value,
}));

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.dropdown-button {
  text-decoration: underline;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  border: none;
  cursor: pointer;
}

.rounded-button {
  border-radius: 50%;
  padding: 10px;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.rounded-button:hover {
  background-color: var(--light-blue);
}

.dropdown-content {
  display: block;
  overflow: hidden;
  position: absolute;
  background-color: var(--white);
  font-size: 14px;
  width: 150px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  left: -105px;
  right: 0;
  margin-top: 55px;
  border: 1px solid var(--light-blue);
  transition:
    transform 0.1s ease,
    visibility 0s ease;
  transform-origin: top;
  transform: scaleY(0);
  visibility: hidden;
  height: 0;
}

.dropdown-content.show {
  transform: scaleY(1);
  visibility: visible;
  height: auto;
}

.dropdown-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-content li {
  text-align: left;
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-content li:hover {
  background-color: var(--light-blue);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dropdown-content li.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.dropdown-content li.disabled:hover {
  background-color: transparent;
}
</style>
