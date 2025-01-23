<template>
  <div class="h-full w-full">
    <div class="flex gap-x-2 mb-2">
      <button
        @click="switchView('list')"
        class="basis-1/2"
        :class="currentView === 'list' ? 'active-button' : 'passive-button'"
      >
        Tréningy
      </button>
      <button
        @click="switchView('detail')"
        class="basis-1/2"
        :class="currentView === 'detail' ? 'active-button' : 'passive-button'"
      >
        Detail
      </button>
    </div>
    <div>
      <AdminTrainingListView v-if="currentView === 'list'" :month-trainings-data="monthTrainingsData" />
      <AdminTrainingDetailView v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AdminTrainingListView from './AdminTrainingListView.vue';
import AdminTrainingDetailView from './AdminTrainingDetailView.vue';

import { SpecialDayInfo } from '@/types/CalendarTypes';

const props = defineProps<{
  monthTrainingsData: SpecialDayInfo;
}>();

const currentView = ref('list');

const switchView = (view: string) => {
  currentView.value = view;
};
</script>

<style lang="css" scoped>
.active-button {
  @apply py-2 w-24 text-white rounded-md bg-emerald-500 hover:bg-emerald-600;
}

.passive-button {
  @apply py-2 w-24 rounded-md bg-gray-100 hover:bg-gray-200;
}
</style>
