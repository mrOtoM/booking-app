<template>
  <div class="flex flex-col divide-y divide-slate-200 text-sm">
    <div v-for="training in sortedTrainings" :key="training.id" class="flex items-center justify-between py-2">
      <div class="flex gap-6">
        <p class="font-semibold">
          {{ formatDate(training.id, DateFormatType.DOT_DMY) }}
        </p>
        <p>{{ training.trainingDetails.name }} o {{ training.trainingDetails.time }}</p>
      </div>

      <button @click.prevent="goToCurrentDetail(training.id)" class="text-emerald-500 hover:text-emerald-500">
        Prejsť na detail
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { DayTraining } from '@/types/CalendarTypes';
import { DateFormatType, formatDate } from '@/utils/helpers';

const props = defineProps<{
  monthlyTrainings: DayTraining[];
}>();

const emit = defineEmits<{
  (e: 'selected-date', date: string): void;
}>();

const sortedTrainings = computed(() => {
  if (!props.monthlyTrainings || props.monthlyTrainings.length === 0) {
    return [];
  }

  const trainingsArray = [...props.monthlyTrainings];

  trainingsArray.sort((a, b) => {
    const [dayA, monthA, yearA] = a.id?.split(/[-_.]/) || [];
    const [dayB, monthB, yearB] = b.id?.split(/[-_.]/) || [];

    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

    return dateA.getTime() - dateB.getTime();
  });

  return trainingsArray;
});

const goToCurrentDetail = (day: string) => {
  emit('selected-date', day);
};
</script>
