<template>
  <div class="container">
    <div class="trainings-list">
      <div
        v-for="(training, day) in sortedTrainings"
        :key="day"
        class="flex items-center justify-between p-2 border-solid border-0 border-b-1 border-b border-gray-200"
      >
        <div class="flex gap-6">
          <div class="font-medium text-gray-700 border-b border-gray-500">
            {{ training.dayFormatted }}
          </div>
          <div class="text-gray-600">
            <span class="training-info">
              {{ training.details.trainingName }} o {{ training.details.trainingTime }}
            </span>
          </div>
        </div>

        <button @click.prevent="" class="text-emerald-500 hover:text-emerald-500">Ist na detail</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { SpecialDayInfo } from '@/types/CalendarTypes';

const props = defineProps<{
  monthTrainingsData: SpecialDayInfo;
}>();

const sortedTrainings = computed(() => {
  if (!props.monthTrainingsData) {
    return [];
  }

  const trainingsArray = Object.entries(props.monthTrainingsData).map(([key, value]) => {
    const [year, month, day] = key.split('_');
    const dateFormatted = `${day}.${month}.${year}`;
    return {
      day: key,
      dayFormatted: dateFormatted,
      details: value[0],
    };
  });

  trainingsArray.sort((a, b) => {
    const dateA = new Date(a.day.replace('_', '-').replace('_', '-'));
    const dateB = new Date(b.day.replace('_', '-').replace('_', '-'));
    return dateA.getTime() - dateB.getTime();
  });

  return trainingsArray;
});

console.log(props.monthTrainingsData);
</script>
