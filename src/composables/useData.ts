import { collection, onSnapshot, doc, deleteDoc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

import { db } from '@/firebase/config';

const useData = () => {
  const registerToTrainingField = async (trainingMonth: string, trainingId: string, trainingData: any) => {
    const docRef = doc(db, 'trainings', trainingMonth, 'monthlyTrainings', trainingId);

    await updateDoc(docRef, { participants: arrayUnion(trainingData) });
  };

  const createTrainingCollection = async (trainingName: string, trainingData: any) => {
    const colRef = doc(collection(db, 'trainings', '1_2025', trainingName));

    await setDoc(colRef, { ...trainingData });
  };

  const createTrainingDocument = async (trainingMonth: string, trainingId: string, trainingData: any) => {
    const docRef = doc(db, 'trainings', trainingMonth, 'monthlyTrainings', trainingId);

    await setDoc(docRef, trainingData, { merge: true });
  };

  const deleteTrainingDocument = async (docId: string) => {
    const trainingDocRef = doc(db, 'trainings', '1_2025', 'trening1', docId);
    try {
      await deleteDoc(trainingDocRef);
    } catch (error) {
      console.error('Problém s odstranenim treningu:', error);
      throw error;
    }
  };

  const getTrainingTypesDocument = async () => {
    const docRef = doc(db, 'training-info', 'training-types');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data;
    } else {
      console.error('Ziadny dokument!');
      return {};
    }
  };

  const getMonthlyTrainingsCollection = (
    month: string,
    callback: (docs: any[]) => void,
    errorCallback: (error: any) => void
  ) => {
    const colRef = collection(db, 'trainings', month, 'monthlyTrainings');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        callback(documents);
      },
      (err) => {
        errorCallback(err);
      }
    );

    return unsubscribe;
  };

  return {
    deleteTrainingDocument,
    createTrainingCollection,
    getTrainingTypesDocument,
    createTrainingDocument,
    getMonthlyTrainingsCollection,
    registerToTrainingField,
  };
};

export default useData;
