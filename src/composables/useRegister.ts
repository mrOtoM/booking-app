import { ref } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

import { auth } from '@/firebase/config';
import { db } from '@/firebase/config';

const error = ref('');
const isLoading = ref(false);

const useRegister = () => {
  const register = async (email: string, password: string, displayName: string) => {
    error.value = '';
    isLoading.value = true;

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      if (!response) {
        throw new Error('Problem s registráciou použivatela');
      }

      if (response.user) {
        await updateProfile(response.user, { displayName });

        await setDoc(doc(db, 'users', response.user.uid), {
          email,
          displayName,
        });

        isLoading.value = false;
      }

      isLoading.value = false;
    } catch (err) {
      error.value = (err as Error).message;
      isLoading.value = false;
    }
  };

  return { error, isLoading, register };
};

export default useRegister;
