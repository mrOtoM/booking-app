<template>
  <div class="nav-bar text-gray-700">
    <div class="w-[700px] flex justify-between items-center pl-4 pr-4">
      <span> Ahoj {{ displayName }}</span>
      <app-dropdown-button :items="dropdownActions" :rounded="true">
        <template #label><icon-user /></template>
      </app-dropdown-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useLogout from '@/composables/useLogout';
import AppDropdownButton from '@/components/AppDropdownButton.vue';
import IconUser from './icons/IconUser.vue';

const props = defineProps<{
  displayName: string;
}>();

const { logout } = useLogout();

const dropdownActions = ref([
  {
    label: 'Nastavenia',
    command: () => {
      console.log('Nastavenia');
    },
  },
  {
    label: 'Odhlasit sa',
    command: () => {
      handleLogout();
    },
  },
]);

const handleLogout = async () => {
  await logout();
};
</script>

<style scoped>
.nav-bar {
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 4rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
