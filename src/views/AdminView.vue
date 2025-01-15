<template>
  <div class="bg-slate-100 h-screen">
    <div v-if="isUserProfileLoading">Loading...</div>
    <div v-else-if="userProfile">
      <nav-bar :displayName="userProfile.displayName" />
      <div class="flex justify-center">
        <div class="admin-content">
          <app-card title="Kalendar">
            <template v-slot:custom-content>
              <app-calendar :show="isModalOpen" v-model:month="trainingMonth" @selected-date="handleDateSelection" />
            </template>
          </app-card>
          <app-card title="Zoznam prihlasenych treningov">
            <template v-slot:custom-content> loool </template>
          </app-card>
        </div>
      </div>
    </div>
    <div v-else>Ziadne data</div>
  </div>

  <app-modal v-if="isModalOpen" v-model:show="isModalOpen">
    <div class="flex flex-col items-center min-w-64">
      <h1 class="text-l">Pridať tréning</h1>
      <div class="flex mt-6 w-full">
        <select
          v-model="selectedTraining"
          name="training"
          class="w-full p-2 ring-1 rounded bg-white ring-emerald-500 border focus:border-transparent"
        >
          <option v-for="training in trainingTypes" :key="training.value" :value="training">
            {{ training.name }}
          </option>
        </select>
      </div>
      <div class="flex w-full mt-4 mb-4">
        <div class="flex w-full gap-2 mb-4">
          <select
            v-model="selectedHour"
            class="basis-1/2 p-2 ring-1 rounded bg-white ring-emerald-500 border focus:border-transparent"
          >
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          <select
            v-model="selectedMinute"
            class="basis-1/2 p-2 ring-1 rounded bg-white ring-emerald-500 border focus:border-transparent"
          >
            <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          @click.prevent="createTraining"
          class="py-2 w-24 text-white rounded-md bg-emerald-500 hover:bg-emerald-600"
        >
          Potvrdit
        </button>
        <button @click.prevent="isModalOpen = false" class="py-2 w-24 rounded-md bg-gray-100 hover:bg-gray-200">
          Zrušiť
        </button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import dayjs from 'dayjs';

import useUser from '@/composables/useUser';
import useData from '@/composables/useData';
import NavBar from '@/components/NavBar.vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import AppCalendar from '@/components/AppCalendar.vue';

const { isUserProfileLoading, userProfile } = useUser();
const { getTrainingTypesDocument, createTrainingDocument } = useData();

onMounted(async () => {
  await getTrainingTypes();

  if (trainingTypes.value && trainingTypes.value.length > 0) {
    selectedTraining.value = trainingTypes.value[0];
  }
});

const isModalOpen = ref(false);
const selectedDate = ref<Date>();
const selectedTraining = ref();
const trainingTypes = ref();
const selectedHour = ref('18');
const selectedMinute = ref('30');
const trainingMonth = ref('');
const trainingName = computed(() => {
  return dayjs(selectedDate.value).format('DD');
});

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
    trainingType: selectedTraining.value.value,
    participants: [],
  };

  try {
    await createTrainingDocument(trainingMonth.value, trainingName.value, trainingData);
  } catch (err) {
    console.error(err);
  } finally {
    isModalOpen.value = false;
  }
};

const handleDateSelection = (date: Date) => {
  isModalOpen.value = true;
  selectedDate.value = date;
};
</script>

<style scoped>
.admin-content {
  @apply w-[800px]  mt-4;
}
</style>
