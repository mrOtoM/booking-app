<template>
  <div class="flex min-h-16 w-full items-center justify-center bg-white text-gray-700 shadow-md">
    <div class="flex w-[700px] items-center justify-between pl-4 pr-4">
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
