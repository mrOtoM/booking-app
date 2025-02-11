<template>
  <div class="h-screen bg-background-primary">
    <div v-if="userProfile">
      <nav-bar :displayName="userProfile.displayName" />
      <div class="flex justify-center">
        <div class="w-[700px]">
          <app-card title="Kalendár">
            <template v-slot:custom-content>
              <app-calendar v-model:show="isModalOpen" @selected-date="handleDateSelectionAdmin" />
            </template>
          </app-card>
          <app-card>
            <template v-slot:custom-content>
              <admin-training-view />
            </template>
          </app-card>
        </div>
      </div>
    </div>
    <div v-else>Žiadne data</div>
  </div>

  <app-modal v-if="isModalOpen" v-model:show="isModalOpen">
    <div class="flex min-w-64 flex-col items-center">
      <h2>Pridať tréning</h2>
      <div class="mt-6 flex w-full">
        <select
          v-model="selectedTraining"
          name="training"
          class="w-full rounded border bg-white p-2 ring-1 ring-emerald-500 focus:border-transparent"
        >
          <option v-for="training in trainingTypes" :key="training.value" :value="training">
            {{ training.name }}
          </option>
        </select>
      </div>
      <div class="mb-4 mt-4 flex w-full">
        <div class="mb-4 flex w-full gap-2">
          <select
            v-model="selectedHour"
            class="basis-1/2 rounded border bg-white p-2 ring-1 ring-emerald-500 focus:border-transparent"
          >
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          <select
            v-model="selectedMinute"
            class="basis-1/2 rounded border bg-white p-2 ring-1 ring-emerald-500 focus:border-transparent"
          >
            <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <app-button type="primary" @click.prevent="createTraining">Potvrdiť</app-button>
        <app-button type="secondary" @click.prevent="isModalOpen = false">Zrušiť</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import useUser from '@/composables/useUser';
import useData from '@/composables/useData';
import NavBar from '@/components/NavBar.vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import AppCalendar from '@/components/AppCalendar.vue';
import AdminTrainingView from '@/views/admin/AdminTrainingView.vue';
import AppButton from '@/components/AppButton.vue';
import { formatDate, DateFormatType } from '@/utils/helpers';

const { userProfile } = useUser();
const { getTrainingTypesDocument, createTrainingDocument } = useData();

const isModalOpen = ref(false);
const selectedDate = ref<string>();
const selectedTraining = ref();
const trainingTypes = ref();
const selectedHour = ref('18');
const selectedMinute = ref('30');

const hours = Array.from({ length: 17 }, (_, i) => (i + 6).toString().padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

const getTrainingTypes = async () => {
  try {
    const response = await getTrainingTypesDocument();
    trainingTypes.value = response.arrTypes;
  } catch (err) {
    console.error(err);
  }
};

const createTraining = async () => {
  const trainingData = {
    name: selectedTraining.value.name,
    time: `${selectedHour.value}:${selectedMinute.value}`,
    type: selectedTraining.value.value,
    participants: [],
  };

  if (selectedDate.value) {
    const monthYear = formatDate(selectedDate.value, DateFormatType.UNDERSCORE_MY);
    const dayMonthYear = formatDate(selectedDate.value, DateFormatType.UNDERSCORE_DMY);
    try {
      await createTrainingDocument(monthYear, dayMonthYear, trainingData);
    } catch (err) {
      console.error(err);
    } finally {
      isModalOpen.value = false;
    }
  }
};

const handleDateSelectionAdmin = (date: string) => {
  selectedDate.value = date;
  isModalOpen.value = true;
};

onMounted(async () => {
  await getTrainingTypes();

  if (trainingTypes.value && trainingTypes.value.length > 0) {
    selectedTraining.value = trainingTypes.value[0];
  }
});
</script>
