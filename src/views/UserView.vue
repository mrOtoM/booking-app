<template>
  <div class="bg-slate-100 h-screen">
    <div v-if="isUserProfileLoading">Loading....</div>
    <div v-else-if="userProfile">
      <nav-bar :displayName="userProfile.displayName" />
      <div class="flex justify-center">
        <div class="user-content">
          <app-card title="Kalendar">
            <template v-slot:custom-content>
              <app-calendar :show="isModalOpen" v-model:month="trainingMonth" @selected-date="handleDateSelection" />
            </template>
          </app-card>
          <app-card title="Zoznam prihlasenych treningov"> </app-card>
        </div>
      </div>
    </div>
  </div>

  <app-modal v-if="isModalOpen" v-model:show="isModalOpen">
    <div class="flex flex-col items-center min-w-64">
      <p>Prihlasit sa na trening {{ formattedDay }} ?</p>
      <div class="flex gap-2 mt-4">
        <button
          @click.prevent="registerToTraining"
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
import dayjs from 'dayjs';

import useData from '@/composables/useData';
import useUser from '@/composables/useUser';
import NavBar from '@/components/NavBar.vue';
import AppCalendar from '@/components/AppCalendar.vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';

const { userAuth, userProfile, isUserProfileLoading } = useUser();

const isModalOpen = ref(false);
const trainingMonth = ref('');
const selectedDate = ref<Date>();
const formattedDay = computed(() => {
  return dayjs(selectedDate.value).format('DD.MM');
});
const trainingName = computed(() => {
  return dayjs(selectedDate.value).format('DD');
});

const { deleteTrainingDocument, registerToTrainingField } = useData();

async function submitDeleteTraining(docId: string) {
  try {
    await deleteTrainingDocument(docId);
  } catch (error) {
    console.error('Chyba pri mazání tréningu:', error);
  }
}

const registerToTraining = async () => {
  if (userProfile.value) {
    const trainingData = {
      uid: userAuth.value?.uid,
      date: new Date(),
      displayName: userProfile.value.displayName,
    };

    try {
      await registerToTrainingField(trainingMonth.value, trainingName.value, trainingData);
    } catch (error) {
      console.error('Chyba pri pridávaní tréningu:', error);
    } finally {
      isModalOpen.value = false;
    }
  }
};

const handleDateSelection = (date: Date) => {
  isModalOpen.value = true;
  selectedDate.value = date;
};
</script>

<style scoped>
.user-content {
  @apply w-[800px]  mt-4;
}
</style>
