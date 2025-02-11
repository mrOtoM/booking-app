<template>
  <app-card title="Zoznam tréningov">
    <template v-slot:custom-content>
      <div v-if="user" class="flex flex-col divide-y divide-slate-200">
        <div v-for="training in sortedTrainings" :key="training.id" class="flex items-center justify-between py-2">
          <div class="flex gap-6">
            <p class="font-semibold">{{ formatDate(training.id, DateFormatType.DOT_DMY) }}</p>
            <p>{{ training.trainingDetails.name }} o {{ training.trainingDetails.time }}</p>
          </div>

          <button @click.prevent="openModal(training)" class="text-red-500 hover:text-red-600">Zrušiť</button>
        </div>
      </div>
      <p v-else class="py-4 text-center">Žiadne prihlásené tréningy</p>
    </template>
  </app-card>

  <app-modal v-model:show="isModalOpen">
    <div v-if="selectedTraining" class="flex min-w-64 flex-col items-center">
      <p>Naozaj sa chcete odhlasit z treningu dna {{ formatDate(selectedTraining?.id, DateFormatType.DOT_DMY) }}</p>
      <div class="mt-4 flex gap-2">
        <app-button type="primary" @click.prevent="unsubscribeFromTraining">Potvrdiť</app-button>
        <app-button type="secondary" @click.prevent="isModalOpen = false">Zrušiť</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import useData from '@/composables/useData';
import { UserData } from '@/types/UserDataTypes';
import AppButton from '@/components/AppButton.vue';
import { formatDate, DateFormatType } from '@/utils/helpers';
import type { DayTraining } from '@/types/CalendarTypes';

const props = defineProps<{
  user: UserData;
}>();

const { unsubscribeFromTrainingWithBatch } = useData();

const isModalOpen = ref(false);
const selectedTraining = ref<DayTraining | null>(null);

const sortedTrainings = computed(() => {
  if (!props.user.registeredTrainings || props.user.registeredTrainings.length === 0) {
    return [];
  }

  const trainingsArray = [...props.user.registeredTrainings];

  trainingsArray.sort((a, b) => {
    const [dayA, monthA, yearA] = a.id?.split(/[-_.]/) || [];
    const [dayB, monthB, yearB] = b.id?.split(/[-_.]/) || [];

    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

    return dateA.getTime() - dateB.getTime();
  });

  return trainingsArray;
});

const unsubscribeFromTraining = async () => {
  if (selectedTraining.value && props.user) {
    const monthYear = formatDate(selectedTraining.value.id, DateFormatType.UNDERSCORE_MY);
    const dayMonthYear = formatDate(selectedTraining.value.id, DateFormatType.UNDERSCORE_DMY);

    try {
      await unsubscribeFromTrainingWithBatch(monthYear, dayMonthYear, props.user.id);
    } catch (error) {
      console.error('Chyba pri odhlasovaní z tréningu:', error);
    } finally {
      isModalOpen.value = false;
      selectedTraining.value = null;
    }
  }
};

const openModal = (training: DayTraining) => {
  selectedTraining.value = training;
  isModalOpen.value = true;
};
</script>
