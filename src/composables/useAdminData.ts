import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

const useAdminData = () => {
  const getDailyTrainingDataForAdminDocument = async (monthYear: string, dayMonthYear: string) => {
    const docRef = doc(db, 'trainings', monthYear, 'monthlyTrainings', dayMonthYear);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return [];
    }
  };

  const getDailyTrainingParticipantsForAdminCollection = (
    monthYear: string,
    dayMonthYear: string,
    callback: (docs: any[]) => void,
    errorCallback: (error: any) => void,
  ) => {
    const colRef = collection(db, 'trainings', monthYear, 'monthlyTrainings', dayMonthYear, 'participants');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(documents);
      },
      (error) => {
        errorCallback(error);
      },
    );

    return unsubscribe;
  };

  return {
    getDailyTrainingDataForAdminDocument,
    getDailyTrainingParticipantsForAdminCollection,
  };
};

export default useAdminData;
