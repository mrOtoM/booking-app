<template>
  <div class="mx-auto mt-4 max-w-[690px] overflow-hidden rounded-lg border border-gray-200">
    <div class="mb-1 flex items-center justify-between bg-stone-200 p-3 font-bold">
      <button @click="prevMonth" class="h-full w-6">‹</button>
      <span class="text-stone-700">{{ monthName }} {{ year }}</span>
      <button @click="nextMonth" class="h-full w-6">›</button>
    </div>
    <div class="grid grid-cols-7 gap-[1px] p-0">
      <div v-for="day in daysOfWeek" :key="day" class="text-center font-bold text-stone-600">
        {{ day }}
      </div>
      <div
        v-for="day in days"
        :key="day.id"
        :class="[
          'h-[85px] cursor-pointer overflow-hidden border border-gray-200 bg-white p-2 text-center',
          getDayClass(day.date),
        ]"
        @click="selectDate(day)"
      >
        <span class="text-sm">{{ day.day }}</span>

        <div
          v-for="(box, index) in getSpecialDayInfo(day.date)"
          :key="index"
          :class="['rounded p-1', getTrainingBoxClass(box)]"
        >
          <h3 class="mb-1 text-[0.625rem] font-semibold leading-none">{{ box.name }}</h3>
          <h3 class="text-[0.625rem] leading-none">{{ box.time }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';

import { SpecialDayInfo } from '@/types/CalendarTypes';
import { useCalendarStore } from '@/stores/useCalendarStore';

const calendarStore = useCalendarStore();

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'selected-date', date: string): void;
}>();

const today = dayjs();
const year = ref(today.year());
const month = ref(today.month());
const selectedDate = ref();
const daysOfWeek = ['Po', 'Ut', 'St', 'Štv', 'Pi', 'So', 'Ne'];
const monthName = computed(() => dayjs().month(month.value).format('MMMM'));

const days = computed(() => {
  const startOfMonth = dayjs().year(year.value).month(month.value).startOf('month');
  const endOfMonth = dayjs().year(year.value).month(month.value).endOf('month');
  const totalDays = endOfMonth.date();

  return Array.from({ length: totalDays }, (_, index) => {
    const date = dayjs()
      .year(year.value)
      .month(month.value)
      .date(index + 1)
      .toDate();

    return {
      id: date.getTime(),
      day: index + 1,
      date,
    };
  });
});

const getDayClass = (date: Date): string => {
  const isPast = dayjs(date).isBefore(today, 'day');
  const isToday = dayjs(date).isSame(today, 'day');

  if (isPast) {
    return 'opacity-40 pointer-events-none';
  }

  if (isToday) {
    return 'bg-stone-100 ';
  }

  return '';
};

const getTrainingBoxClass = (box: SpecialDayInfo): string => {
  const styles = {
    green: 'bg-gradient-to-t from-[#d4edda] to-[#c3e6cb] text-[#155724] border border-[#c3e6cb]',
    cyan: 'bg-gradient-to-t from-[#d1ecf1] to-[#bee5eb] text-[#0e5b69] border border-[#bee5eb]',
    yellow: 'bg-gradient-to-t from-[#fff3cd] to-[#f7e5af] text-[#856404] border border-[#ffeeba]',
    red: 'bg-gradient-to-t from-[#f8d7da] to-[#f5c6cb] text-[#721c24] border border-[#f5c6cb]',
    purple: 'bg-gradient-to-t from-[#e7d4f8] to-[#d6b3f5] text-[#4b1c72] border border-[#d6b3f5]',
    blue: 'bg-gradient-to-t from-[#d1e0f8] to-[#a6c8f2] text-[#083d77] border border-[#a6c8f2]',
  };

  if (box.type === 'STRENGTH') {
    return styles.green;
  }

  if (box.type === 'CIRCLE') {
    return styles.purple;
  }

  if (box.type === 'TABATA') {
    return styles.blue;
  }

  return '';
};

const getSpecialDayInfo = (date: Date) => {
  const dayKey = dayjs(date).format('DD_MM_YYYY');
  const training = calendarStore.monthlyTrainings.find((item) => item.id === dayKey);
  return training ? [training.trainingDetails] : [];
};

const formatDate = (date: dayjs.Dayjs | Date) => {
  return dayjs(date).format('DD.MM.YYYY');
};

const selectDate = (day: { id: number; day: number; date: Date }) => {
  selectedDate.value = day.date;

  const formattedDate = formatDate(day.date);

  calendarStore.setSelectedDateAdmin(formattedDate);

  emit('selected-date', formattedDate);
};

const nextMonth = () => {
  if (month.value === 11) {
    month.value = 0;
    year.value++;
  } else {
    month.value++;
  }
  const paddedMonth = String(month.value + 1).padStart(2, '0');
  const monthString = `${paddedMonth}_${year.value}`;
  calendarStore.fetchMonthlyTrainings(monthString);
};

const prevMonth = () => {
  if (month.value === 0) {
    month.value = 11;
    year.value--;
  } else {
    month.value--;
  }
  const paddedMonth = String(month.value + 1).padStart(2, '0');
  const monthString = `${paddedMonth}_${year.value}`;
  calendarStore.fetchMonthlyTrainings(monthString);
};

onMounted(() => {
  const paddedMonth = String(month.value + 1).padStart(2, '0');
  const initialMonthString = `${paddedMonth}_${year.value}`;

  calendarStore.fetchMonthlyTrainings(initialMonthString);
});

onBeforeUnmount(() => {
  calendarStore.clearSubscription();
});
</script>
