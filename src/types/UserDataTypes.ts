import { DayTraining } from '@/types/CalendarTypes';

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  registeredTrainings: DayTraining[];
  role: string;
}
