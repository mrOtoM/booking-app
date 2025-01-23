<template>
  <div class="calendar">
    <div class="calendar-header">
      <button class="w-4" @click="prevMonth">‹</button>
      <span>{{ monthName }} {{ year }}</span>
      <button class="w-4" @click="nextMonth">›</button>
    </div>

    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">
        {{ day }}
      </div>

      <div
        v-for="day in days"
        :key="day.id"
        class="calendar-day"
        :class="{
          'current-day': isToday(day.date),
          'special-day': isSpecialDay(day.date),
          'past-day': isOlderThanToday(day.date),
        }"
        @click="selectDate(day.date)"
      >
        <span>{{ day.day }}</span>

        <div v-if="isSpecialDay(day.date)" class="info-box">
          <div
            v-for="(box, index) in getSpecialDayInfo(day.date)"
            :key="index"
            class="info-message"
            :class="`info-message--${getBoxClass(box.trainingType, box.trainingTime, day.date)}`"
          >
            <p>{{ box.trainingName }}</p>
            <p>{{ box.trainingTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';

import useData from '@/composables/useData';
import { SpecialDayInfo } from '@/types/CalendarTypes';

const { getMonthlyTrainingsCollection } = useData();

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'selected-date-admin', date: string): void;
  (e: 'selected-month-data-admin', data: Record<string, SpecialDayInfo[]>): void;
  (e: 'selected-date-user', payload: SpecialDayInfo): void;
  (e: 'update:show', show: boolean): void;
}>();

const today = dayjs();
const year = ref(today.year());
const month = ref(today.month());
const selectedDate = ref();
const daysOfWeek = ['Po', 'Ut', 'St', 'Štv', 'Pi', 'So', 'Ne'];
const specialDays = ref<Record<string, SpecialDayInfo[]>>({});
const monthName = computed(() => dayjs().month(month.value).format('MMMM'));
let unsubscribeMonthlyTrainings: null | (() => void) = null;

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

const isToday = (date: Date) => dayjs(date).isSame(today, 'day');

const isSpecialDay = (date: Date) => {
  const dayNum = dayjs(date).format('YYYY_MM_DD');
  return !!specialDays.value[dayNum];
};

const getSpecialDayInfo = (date: Date): SpecialDayInfo[] => {
  const dayNum = dayjs(date).format('YYYY_MM_DD');
  return specialDays.value[dayNum] || [];
};

const isOlderThanToday = (date: Date) => {
  return dayjs(date).isBefore(today, 'day');
};

const formatDate = (date: dayjs.Dayjs | Date) => {
  return dayjs(date).format('DD.MM.YYYY');
};

const selectDate = (date: Date) => {
  if (isOlderThanToday(date) && isSpecialDay(date)) {
    return; // Stop the function if the date is special and older than today
  }

  selectedDate.value = date;

  const formattedDate = formatDate(date);

  const dayInfoArray = getSpecialDayInfo(date);
  const dayInfo: SpecialDayInfo = dayInfoArray[0] || {
    trainingName: '',
    trainingTime: '',
    trainingType: '',
    trainingDate: formattedDate,
  };

  emit('selected-date-admin', formattedDate);

  emit('selected-date-user', {
    ...dayInfo,
    trainingDate: formattedDate,
  });
};

const getMonthlyTrainings = (monthString: string) => {
  if (unsubscribeMonthlyTrainings) {
    unsubscribeMonthlyTrainings();
    unsubscribeMonthlyTrainings = null;
  }

  unsubscribeMonthlyTrainings = getMonthlyTrainingsCollection(
    monthString,
    (docs) => {
      const tempSpecialDays: Record<string, SpecialDayInfo[]> = {};
      console.log('tempSpecialDays', tempSpecialDays);

      docs.forEach((doc: any) => {
        const dayId = doc.id;
        if (!tempSpecialDays[dayId]) {
          tempSpecialDays[dayId] = [];
        }
        tempSpecialDays[dayId].push({
          trainingName: doc.trainingName,
          trainingTime: doc.trainingTime,
          trainingType: doc.trainingType,
        });
      });

      specialDays.value = tempSpecialDays;
      emit('selected-month-data-admin', tempSpecialDays);
    },
    (err) => {
      console.error('Chyba pri získavaní tréningov:', err);
    }
  );
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
  getMonthlyTrainings(monthString);
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
  getMonthlyTrainings(monthString);
};

const isPastTraining = (trainingTime: string, trainingDate: Date) => {
  const trainingDateTime = dayjs(trainingDate)
    .hour(parseInt(trainingTime.split(':')[0]))
    .minute(parseInt(trainingTime.split(':')[1]));
  return dayjs().isAfter(trainingDateTime);
};

const getBoxClass = (type: string, trainingTime: string, trainingDate: Date): string => {
  if (isPastTraining(trainingTime, trainingDate)) {
    return 'out';
  }

  switch (type) {
    case 'UNDEFINED':
      return 'green';
    case 'TABATA':
      return 'cyan';
    case 'UNDEFINED_3':
      return 'yellow';
    case 'UNDEFINED_2':
      return 'red';
    case 'CIRCLE':
      return 'purple';
    case 'STRENGTH':
      return 'blue';
    default:
      return 'info-message';
  }
};

onMounted(() => {
  const paddedMonth = String(month.value + 1).padStart(2, '0');
  const initialMonthString = `${paddedMonth}_${year.value}`;
  getMonthlyTrainings(initialMonthString);
});

onBeforeUnmount(() => {
  if (unsubscribeMonthlyTrainings) {
    unsubscribeMonthlyTrainings();
    unsubscribeMonthlyTrainings = null;
  }
});
</script>

<style scoped>
.calendar {
  max-width: 690px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  margin-top: 1rem;
  color: #000;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f4;
  font-weight: bold;
  margin-bottom: 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  padding: 0px;
}

.calendar-day-header {
  text-align: center;
  font-weight: bold;
  color: #555;
}

.calendar-day {
  text-align: center;
  height: 85px;
  cursor: pointer;
  border: 1px solid #ddd;
  background-color: white;
  padding: 3px;
  overflow: hidden;
}

.past-day {
  pointer-events: none;
  cursor: default;
}

.current-day {
  background-color: #ededed;
  color: white;
}

/* box styling */
.info-box {
  margin-top: 2px;
}

.info-message {
  padding: 1px;
  border-radius: 3px;
  margin-bottom: 3px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
}

.info-message--out {
  background-color: #e0e0e0;
  color: #afafaf;
  pointer-events: none;
  cursor: default;
}

.info-message--green {
  background: linear-gradient(to top, #d4edda, #c3e6cb);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.info-message--cyan {
  background: linear-gradient(to top, #d1ecf1, #bee5eb);
  color: #0e5b69;
  border: 1px solid #bee5eb;
}

.info-message--yellow {
  background: linear-gradient(to top, #fff3cd, #f7e5af);
  color: #856404;
  border: 1px solid #ffeeba;
}

.info-message--red {
  background: linear-gradient(to top, #f8d7da, #f5c6cb);
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.info-message--purple {
  background: linear-gradient(to top, #e7d4f8, #d6b3f5);
  color: #4b1c72;
  border: 1px solid #d6b3f5;
}

.info-message--blue {
  background: linear-gradient(to top, #d1e0f8, #a6c8f2);
  color: #083d77;
  border: 1px solid #a6c8f2;
}
</style>
