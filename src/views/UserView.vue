<template>
  <div class="bg-slate-100 h-screen">
    <div v-if="isUserProfileLoading">Loading....</div>
    <div v-else-if="userProfile">
      <nav-bar :displayName="userProfile.displayName" />
      <div class="flex justify-center">
        <div class="user-content">
          <app-card title="Kalendar">
            <template v-slot:custom-content>
              <app-calendar v-model:show="isModalOpen" @selected-date-user="handleDateSelectionUser" />
            </template>
          </app-card>
          <user-list-of-trainings-view v-if="userData" :user-data="userData" />
        </div>
      </div>
    </div>
  </div>

  <app-modal v-if="isModalOpen" v-model:show="isModalOpen">
    <div class="flex flex-col items-center min-w-64">
      <p>Prihlasit sa na trening {{ selectedDayInfo?.trainingDate }} ?</p>
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
import { ref, onMounted, onUnmounted } from 'vue';

import useData from '@/composables/useData';
import useUser from '@/composables/useUser';
import NavBar from '@/components/NavBar.vue';
import AppCalendar from '@/components/AppCalendar.vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import { SpecialDayInfo } from '@/types/CalendarTypes';
import UserListOfTrainingsView from './UserListOfTrainingsView.vue';

const { userAuth, userProfile, isUserProfileLoading } = useUser();
const { deleteTrainingDocument, updateRegisterTrainingWithBatch, getUserTrainingData } = useData();

const isModalOpen = ref(false);
const selectedDayInfo = ref<SpecialDayInfo>();
const userData = ref<any>(null);

async function submitDeleteTraining(docId: string) {
  try {
    await deleteTrainingDocument(docId);
  } catch (error) {
    console.error('Chyba pri mazání tréningu:', error);
  }
}

const registerToTraining = async () => {
  const parts = selectedDayInfo.value?.trainingDate?.split('.') || [];
  const monthYear = `${parts?.[1]}_${parts?.[2]}`;
  const YearMontDay = `${parts?.[2]}_${parts?.[1]}_${parts?.[0]}`;

  if (userProfile.value) {
    const trainingDataToParticipants = {
      participantId: userAuth.value?.uid,
      displayName: userProfile.value.displayName,
      date: new Date(),
    };

    const trainingDataToProfile = {
      trainingName: selectedDayInfo.value?.trainingName,
      trainingTime: selectedDayInfo.value?.trainingTime,
      trainingDate: selectedDayInfo.value?.trainingDate,
    };

    if (userAuth.value && YearMontDay) {
      try {
        await updateRegisterTrainingWithBatch(
          monthYear,
          YearMontDay,
          trainingDataToParticipants,
          userAuth.value.uid,
          trainingDataToProfile
        );
      } catch (error) {
        console.error('Chyba pri pridávaní tréningu:', error);
      } finally {
        isModalOpen.value = false;
      }
    }
  }
};

const handleDateSelectionUser = (payload: SpecialDayInfo) => {
  selectedDayInfo.value = payload;

  isModalOpen.value = true;
};

onMounted(() => {
  if (!userAuth.value?.uid) {
    return;
  }

  const unsubscribe = getUserTrainingData(
    userAuth.value.uid,
    (docData) => {
      userData.value = docData;
      console.log('userData.value', userData.value);
    },
    (error) => {
      console.error('Chyba pri čítaní user dát:', error);
    }
  );

  onUnmounted(() => {
    unsubscribe();
  });
});
</script>

<style scoped>
.user-content {
  @apply w-[800px]  mt-4;
}
</style>
