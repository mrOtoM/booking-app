export interface UserData {
  id: string;
  date: string;
  registeredTrainings: RegisteredTrainings[];
  role: string;
  email: string;
}

export interface RegisteredTrainings {
  trainingId: string;
  trainingDate: string;
  trainingName: string;
  trainingTime: string;
}
