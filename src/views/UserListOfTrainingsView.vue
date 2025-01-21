<template>
  <app-card title="Kalendar">
    <template v-slot:custom-content>
      <div v-if="userData" class="flex flex-col gap-2 mt-4 text-sm">
        <div
          v-for="training in sortedTrainings"
          :key="training.key"
          class="flex items-center justify-between p-2 border-solid border-0 border-b-1 border-b border-gray-200"
        >
          <div class="flex gap-6">
            <div class="font-medium text-gray-700 border-b border-gray-500">
              {{ training.trainingDate }}
            </div>
            <div class="text-gray-600">
              <span class="training-info"> {{ training.trainingName }} o {{ training.trainingTime }} </span>
            </div>
          </div>

          <button
            @click.prevent="openModal(training.key, training)"
            class="text-red-500 hover:text-red-600 hover:text-red-500"
          >
            Zrušiť
          </button>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-4">Žiadne prihlásené tréningy</div>
    </template>
  </app-card>

  <app-modal v-model:show="isModalOpen">
    <div class="flex flex-col items-center min-w-64">
      <div>Naozaj sa chcete odhlasit z treningu dna {{ selectedTrainingData?.trainingDate }}</div>
      <div class="flex gap-2 mt-4">
        <button
          @click.prevent="unsubscribeFromTraining"
          class="py-2 w-24 text-white rounded-md bg-emerald-500 hover:bg-emerald-600"
        >
          Potvrdiť
        </button>
        <button @click.prevent="isModalOpen = false" class="py-2 w-24 rounded-md bg-gray-100 hover:bg-gray-200">
          Zrušiť
        </button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import useData from '@/composables/useData';
import { UserData, RegisteredTrainings } from '@/types/UserDataTypes';

const props = defineProps<{
  userData: UserData;
}>();

const { unsubscribeFromTrainingWithBatch } = useData();

const isModalOpen = ref(false);
const selectedTrainingKey = ref<string | null>(null);
const selectedTrainingData = ref<RegisteredTrainings | null>(null);

const sortedTrainings = computed(() => {
  const trainingsObject = props.userData?.registeredTrainings || {};

  const trainingsArray = Object.entries(trainingsObject).map(([key, training]) => {
    return {
      key,
      ...training,
    };
  });

  trainingsArray.sort((a, b) => {
    const [dayA, monthA, yearA] = a.trainingDate.split('.');
    const [dayB, monthB, yearB] = b.trainingDate.split('.');

    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

    return dateA.getTime() - dateB.getTime();
  });

  return trainingsArray;
});

const unsubscribeFromTraining = async () => {
  if (selectedTrainingKey.value && selectedTrainingData.value && props.userData) {
    const parts = selectedTrainingData.value.trainingDate.split('.');
    const monthYear = `${parts?.[1]}_${parts?.[2]}`;
    const YearMontDay = `${parts?.[2]}_${parts?.[1]}_${parts?.[0]}`;

    try {
      await unsubscribeFromTrainingWithBatch(monthYear, YearMontDay, props.userData.id);
    } catch (error) {
      console.error('Chyba pri odhlasovaní z tréningu:', error);
    } finally {
      isModalOpen.value = false;
      selectedTrainingKey.value = null;
      selectedTrainingData.value = null;
    }
  }
};

const openModal = (key: string, training: RegisteredTrainings) => {
  selectedTrainingKey.value = key;
  selectedTrainingData.value = training;
  isModalOpen.value = true;
};
</script>
