<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="changeMonth(-1)">‹</button>
      <span>{{ monthName }} {{ year }}</span>
      <button @click="changeMonth(1)">›</button>
    </div>

    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">
        {{ day }}
      </div>

      <div
        v-for="day in days"
        :key="day.id"
        class="calendar-day"
        :class="{ 'current-day': isToday(day.date), 'special-day': isSpecialDay(day.date) }"
        @click="selectDate(day.date)"
      >
        <span>{{ day.day }}</span>

        <div v-if="isSpecialDay(day.date)" class="info-box">
          <div
            v-for="(box, index) in getSpecialDayInfo(day.date)"
            :key="index"
            class="info-message"
            :class="`info-message--${getBoxClass(box.trainingType)}`"
          >
            <p>{{ box.name }}</p>
            <p>{{ box.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';

import useData from '@/composables/useData';
import { SpecialDayInfo } from '@/types/CalendarTypes';

const { getMonthlyTrainingsCollection } = useData();

const props = defineProps<{
  show: boolean;
  month: string;
}>();

const emit = defineEmits<{
  (e: 'selected-date', date: Date): void;
  (e: 'update:show', show: boolean): void;
  (e: 'update:month', newMonth: string): void;
}>();

const today = dayjs();
const year = ref(today.year());
const month = ref(today.month());
const selectedDate = ref(today);
const daysOfWeek = ['Po', 'Ut', 'St', 'Štv', 'Pi', 'So', 'Ne'];
const specialDays = ref<Record<string, SpecialDayInfo[]>>({});
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

const isToday = (date: Date) => dayjs(date).isSame(today, 'day');

const isSpecialDay = (date: Date) => {
  const dayNum = dayjs(date).format('DD');
  return !!specialDays.value[dayNum];
};

const getSpecialDayInfo = (date: Date): SpecialDayInfo[] => {
  const dayNum = dayjs(date).format('DD');
  return specialDays.value[dayNum] || [];
};

const selectDate = (date: Date) => {
  selectedDate.value = dayjs(date);
  emit('selected-date', selectedDate.value.toDate());
};

const getMonthlyTrainings = (monthString: string) => {
  getMonthlyTrainingsCollection(
    monthString,
    (docs) => {
      const tempSpecialDays: Record<string, SpecialDayInfo[]> = {};

      docs.forEach((doc: any) => {
        const dayId = doc.id;
        if (!tempSpecialDays[dayId]) {
          tempSpecialDays[dayId] = [];
        }
        tempSpecialDays[dayId].push({
          name: doc.name,
          time: doc.time,
          trainingType: doc.trainingType,
        });
      });

      specialDays.value = tempSpecialDays;
    },
    (err) => {
      console.error('Chyba pri získavaní tréningov:', err);
    }
  );
};

const changeMonth = (direction: number) => {
  if ((month.value === 11 && direction === 1) || (month.value === 0 && direction === -1)) {
    month.value = direction === 1 ? 0 : 11;
    year.value += direction;
  } else {
    month.value += direction;
  }

  const monthString = `${month.value + 1}_${year.value}`;
  emit('update:month', monthString);
  getMonthlyTrainings(monthString);
};

const getBoxClass = (type: string): string => {
  switch (type) {
    case 'UNDEFINED':
      return 'green';
    case 'TABATA':
      return 'cyan';
    case 'CIRCLE':
      return 'yellow';
    case 'UNDEFINED_2':
      return 'red';
    case 'UNDEFINED_3':
      return 'purple';
    case 'STRENGTH':
      return 'blue';
    default:
      return 'info-message';
  }
};

onMounted(() => {
  const initialMonthString = `${month.value + 1}_${year.value}`;
  getMonthlyTrainings(initialMonthString);
  emit('update:month', initialMonthString);
});
</script>

<style scoped>
.calendar {
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
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

.current-day {
  background-color: #efefef;
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

.info-message--green {
  background: linear-gradient(to top, #d4edda, #c3e6cb);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.info-message--cyan {
  background: linear-gradient(to top, #d1ecf1, #bee5eb);
  color: #0c5460;
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
