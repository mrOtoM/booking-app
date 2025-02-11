export interface SpecialDayInfo {
  name: string;
  time: string;
  type: string;
  date?: string;
}

export interface CalendarState {
  selectedDateAdmin: string | null;
  monthlyTrainings: DayTraining[];
  unsubscribeMonthlyTrainings: null | (() => void);
}

export interface DayTraining {
  id: string;
  trainingDetails: {
    name: string;
    time: string;
    type: string;
  };
}
