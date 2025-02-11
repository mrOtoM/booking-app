<template>
  <div class="h-screen bg-background-primary">
    <div v-if="userProfile">
      <nav-bar :displayName="userProfile.displayName" />
      <div class="flex justify-center">
        <div class="w-[700px]">
          <app-card title="Kalendár">
            <template v-slot:custom-content>
              <app-calendar v-model:show="isModalOpen" @selected-date="handleDateSelectionUser" />
            </template>
          </app-card>
          <user-list-of-trainings-view v-if="userStore.user" :user="userStore.user" />
        </div>
      </div>
    </div>
  </div>

  <app-modal v-if="isModalOpen" v-model:show="isModalOpen">
    <div v-if="selectedDay" class="flex min-w-64 flex-col items-center">
      <p>Prihlasit sa na trening {{ formatDate(selectedDay.id, DateFormatType.DOT_DMY) }} ?</p>
      <div class="mt-4 flex gap-2">
        <button
          @click.prevent="registerToTraining"
          class="w-24 rounded-md bg-emerald-500 py-2 text-white hover:bg-emerald-600"
        >
          Potvrdiť
        </button>
        <button @click.prevent="isModalOpen = false" class="w-24 rounded-md bg-gray-100 py-2 hover:bg-gray-200">
          Zrušiť
        </button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

import useData from '@/composables/useData';
import useUser from '@/composables/useUser';
import NavBar from '@/components/NavBar.vue';
import AppCalendar from '@/components/AppCalendar.vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import UserListOfTrainingsView from './UserListOfTrainingsView.vue';
import { useUserStore } from '@/stores/useUserStore';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { formatDate, DateFormatType } from '@/utils/helpers';
import type { DayTraining } from '@/types/CalendarTypes';

const { userAuth, userProfile } = useUser();
const userStore = useUserStore();
const calendarStore = useCalendarStore();
const { updateRegisterTrainingWithBatch } = useData();

const isModalOpen = ref(false);
const selectedDay = ref<DayTraining>();

const registerToTraining = async () => {
  if (userProfile.value && selectedDay.value) {
    const monthYear = formatDate(selectedDay.value.id, DateFormatType.UNDERSCORE_MY);

    const trainingDataToParticipants = {
      participantId: userAuth.value?.uid,
      displayName: userProfile.value.displayName,
      date: new Date(),
    };

    const trainingDataToProfile = {
      name: selectedDay.value?.trainingDetails.name,
      time: selectedDay.value?.trainingDetails.time,
      type: selectedDay.value?.trainingDetails.type,
    };

    if (userAuth.value) {
      try {
        await updateRegisterTrainingWithBatch(
          monthYear,
          selectedDay.value.id,
          trainingDataToParticipants,
          userAuth.value.uid,
          trainingDataToProfile,
        );
      } catch (error) {
        console.error('Chyba pri pridávaní tréningu:', error);
      } finally {
        isModalOpen.value = false;
      }
    }
  }
};

const handleDateSelectionUser = (day: string) => {
  const formatedDate = formatDate(day, DateFormatType.UNDERSCORE_DMY);
  selectedDay.value = calendarStore.getTrainingForDay(formatedDate);

  isModalOpen.value = true;
};

onMounted(() => {
  if (userAuth.value) {
    userStore.fetchUser(userAuth.value?.uid);
  }
});

onBeforeUnmount(() => {
  userStore.clearSubscription();
});
</script>
