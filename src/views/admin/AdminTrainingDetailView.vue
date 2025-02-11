<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="trainingInfo" class="flex flex-col">
    <div class="mt-4">
      <h2 class="text-center">{{ trainingInfo.trainingDetails.name }} o {{ trainingInfo.trainingDetails.time }}</h2>
      <p>Dátum tréningu: {{ formatDate(trainingInfo.id, DateFormatType.DOT_DMY) }}</p>
      <p>Názov tréningu: {{ trainingInfo.trainingDetails.name }}</p>
      <p>Čas tréningu: {{ trainingInfo.trainingDetails.time }}</p>
    </div>
    <div class="mt-4">
      <h2 class="text-center">Prihlaseny na trening</h2>
      <div class="divide-y divide-slate-200 py-2" v-if="participants && participants.length">
        <div v-for="participant in participants" :key="participant.id" class="flex items-center justify-between py-2">
          <div class="flex">
            <div class="flex h-full items-center gap-x-2">
              <icon-person class="h-4 w-4" />
              <p>{{ participant.displayName }}</p>
            </div>
          </div>

          <button @click.prevent="removeParticipant(participant.id)" class="text-emerald-500 hover:text-emerald-500">
            Zrusit z treningu
          </button>
        </div>
      </div>
      <div v-else>Ziadny prihlaseny</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';

import useAdminData from '@/composables/useAdminData';
import IconPerson from '@/components/icons/IconPerson.vue';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { formatDate, DateFormatType } from '@/utils/helpers';

const calendarStore = useCalendarStore();

const { getDailyTrainingParticipantsForAdminCollection } = useAdminData();

const props = withDefaults(
  defineProps<{
    selectedDay?: string | null;
  }>(),
  {
    selectedDay: null,
  },
);

const trainingInfo = computed(() => {
  if (props.selectedDay) {
    return calendarStore.getTrainingForDay(props.selectedDay);
  }
  return null;
});

const unsubscribe = ref<(() => void) | undefined>();
const participants = ref([]);
const loading = ref(false);

const getDailyTrainingParticipantsForAdmin = () => {
  if (props.selectedDay) {
    const monthYear = formatDate(props.selectedDay, DateFormatType.UNDERSCORE_MY);

    unsubscribe.value = getDailyTrainingParticipantsForAdminCollection(
      monthYear,
      props.selectedDay,
      (docData) => {
        console.log('docData z kompoennty', docData);
        participants.value = docData;
      },
      (error) => {
        console.error('Chyba pri čítaní user dát:', error);
      },
    );
  }
};

const removeParticipant = (id) => {
  console.log('remove');
};

onMounted(async () => {
  loading.value = true;
  await getDailyTrainingParticipantsForAdmin();
  loading.value = false;
});
</script>
