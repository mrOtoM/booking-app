import { defineStore } from 'pinia';

import useData from '@/composables/useData';
import { DayTraining } from '@/types/CalendarTypes';
import type { UserData } from '@/types/UserDataTypes';

const { getUserTrainingData } = useData();

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as UserData | null,
    unsubscribeUser: null as (() => void) | null,
  }),

  actions: {
    setUser(data: UserData) {
      this.user = data;
    },

    async fetchUser(userId: string) {
      this.clearSubscription();

      this.unsubscribeUser = getUserTrainingData(
        userId,
        (doc) => {
          const finalData = {
            id: doc.id,
            email: doc.email,
            fullName: doc.displayName,
            role: doc.role,
            registeredTrainings: doc.registeredTrainings
              ? Object.entries(doc.registeredTrainings as DayTraining).map(([key, item]) => ({
                  id: key,
                  trainingDetails: {
                    name: item.name,
                    time: item.time,
                    type: item.type,
                  },
                }))
              : [],
          };

          this.user = finalData;
        },
        (error) => {
          console.error('Chyba pri čítaní user dát:', error);
        },
      );
    },

    clearSubscription() {
      if (this.unsubscribeUser) {
        this.unsubscribeUser();
        this.unsubscribeUser = null;
      }
    },
  },
});
