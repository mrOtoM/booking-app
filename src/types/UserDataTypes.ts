export interface UserData {
  id: string;
  date: string;
  registerTrainings: Record<
    string,
    {
      trainingDate: string;
      trainingName: string;
      trainingTime: string;
    }
  >;
  role: string;
  email: string;
}
