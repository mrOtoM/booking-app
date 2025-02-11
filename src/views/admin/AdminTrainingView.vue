<template>
  <div class="h-full w-full">
    <div class="flex gap-x-2">
      <app-button type="primary" class="basis-1/2" @click="switchView('list')">Tréningy</app-button>
      <app-button type="secondary" class="basis-1/2" @click="switchView('detail')" :disabled="!selectedDay"
        >Detail</app-button
      >
    </div>
    <div>
      <admin-training-list-view
        v-if="currentView === 'list'"
        :monthly-trainings="calendarStore.monthlyTrainings"
        @selected-date="handleSelectedDay"
      />
      <admin-training-detail-view v-else-if="selectedDay" :selected-day="selectedDay" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AdminTrainingListView from './AdminTrainingListView.vue';
import AdminTrainingDetailView from './AdminTrainingDetailView.vue';
import AppButton from '@/components/AppButton.vue';
import { useCalendarStore } from '@/stores/useCalendarStore';

const calendarStore = useCalendarStore();

const currentView = ref('list');
const selectedDay = ref<string | null>(null);

const switchView = (view: string) => {
  currentView.value = view;
};

const handleSelectedDay = (id: string) => {
  selectedDay.value = id;
  currentView.value = 'detail';
};
</script>
