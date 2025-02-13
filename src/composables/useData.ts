import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  deleteField,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

const useData = () => {
  const updateRegisterTrainingWithBatch = async (
    trainingMonth: string,
    trainingDay: string,
    trainingDataToParticipants: any,
    userId: string,
    trainingDataToProfile: any
  ) => {
    const participantsDocRef = doc(
      db,
      'trainings',
      trainingMonth,
      'monthlyTrainings',
      trainingDay,
      'participants',
      userId
    );
    const userDocRef = doc(db, 'users', userId);

    const batch = writeBatch(db);

    batch.set(participantsDocRef, trainingDataToParticipants, { merge: true });

    batch.set(
      userDocRef,
      {
        registeredTrainings: {
          [trainingDay]: {
            ...trainingDataToProfile,
          },
        },
      },
      { merge: true }
    );

    await batch.commit();
  };

  const unsubscribeFromTrainingWithBatch = async (trainingMonth: string, trainingId: string, userId: string) => {
    const participantsDocRef = doc(
      db,
      'trainings',
      trainingMonth,
      'monthlyTrainings',
      trainingId,
      'participants',
      userId
    );
    const userDocRef = doc(db, 'users', userId);

    const batch = writeBatch(db);

    batch.delete(participantsDocRef);

    batch.update(userDocRef, {
      [`registeredTrainings.${trainingId}`]: deleteField(),
    });

    await batch.commit();
  };

  const updateRegisterTrainingToParticipantField = async (
    trainingMonth: string,
    trainingId: string,
    participantData: any
  ) => {
    const docRef = doc(db, 'trainings', trainingMonth, 'monthlyTrainings', trainingId);

    await updateDoc(docRef, { [`participants.${participantData.uid}`]: { ...participantData } });
  };

  const updateRegisterTrainingToUserField = async (userId: string, trainingData: any) => {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, { registerTrainings: arrayUnion(trainingData) });
  };

  const createTrainingCollection = async (trainingName: string, trainingData: any) => {
    const colRef = doc(collection(db, 'trainings', '1_2025', trainingName));

    await setDoc(colRef, { ...trainingData });
  };

  const createTrainingDocument = async (trainingMonth: string, trainingDay: string, trainingData: any) => {
    const docRef = doc(db, 'trainings', trainingMonth, 'monthlyTrainings', trainingDay);

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

  const getUserTrainingData = (uid: string, callback: (docs: any) => void, errorCallback: (error: any) => void) => {
    const docRef = doc(db, 'users', uid);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback({ id: snapshot.id, ...data });
        } else {
          callback(null);
        }
      },
      (err) => {
        errorCallback(err);
      }
    );

    return unsubscribe;
  };

  const getDailyTrainingDataForAdminDocument = async (trainingMonth: string, trainingDay: string) => {
    const docRef = doc(db, 'trainings', trainingMonth, 'monthlyTrainings', trainingDay);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
    }
  };

  const getDailyTrainingParticipantsForAdminCollection = (
    trainingMonth: string,
    trainingDay: string,
    callback: (docs: any[]) => void,
    errorCallback: (error: any) => void
  ) => {
    const colRef = collection(db, 'trainings', trainingMonth, 'monthlyTrainings', trainingDay, 'participants');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(documents);
      },
      (error) => {
        errorCallback(error);
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
    updateRegisterTrainingToParticipantField,
    updateRegisterTrainingToUserField,
    updateRegisterTrainingWithBatch,
    getUserTrainingData,
    unsubscribeFromTrainingWithBatch,
    getDailyTrainingDataForAdminDocument,
    getDailyTrainingParticipantsForAdminCollection,
  };
};

export default useData;
