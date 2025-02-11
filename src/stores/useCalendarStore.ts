import { defineStore } from 'pinia';

import useData from '@/composables/useData';
import type { DayTraining } from '@/types/CalendarTypes';
import type { CalendarState } from '@/types/CalendarTypes';

const { getMonthlyTrainingsCollection } = useData();

export const useCalendarStore = defineStore('calendarStore', {
  state: (): CalendarState => ({
    selectedDateAdmin: null,
    monthlyTrainings: [],
    unsubscribeMonthlyTrainings: null,
  }),

  actions: {
    setSelectedDateAdmin(date: string) {
      this.selectedDateAdmin = date;
    },

    setMonthData(data: DayTraining[]) {
      this.monthlyTrainings = data;
    },

    async fetchMonthlyTrainings(monthString: string) {
      this.clearSubscription();

      this.unsubscribeMonthlyTrainings = getMonthlyTrainingsCollection(
        monthString,
        (docs) => {
          const finalData: DayTraining[] = docs.map((doc: any) => ({
            id: doc.id,
            trainingDetails: {
              name: doc.name,
              time: doc.time,
              type: doc.type,
            },
          }));

          this.monthlyTrainings = finalData;
        },
        (err) => {
          console.error('Chyba pri získavaní tréningov:', err);
        },
      );
    },

    clearSubscription() {
      if (this.unsubscribeMonthlyTrainings) {
        this.unsubscribeMonthlyTrainings();
        this.unsubscribeMonthlyTrainings = null;
      }
    },
  },

  getters: {
    getTrainingForDay: (state) => {
      return (day: string): DayTraining | undefined => {
        return state.monthlyTrainings.find((training) => training.id === day);
      };
    },
  },
});
