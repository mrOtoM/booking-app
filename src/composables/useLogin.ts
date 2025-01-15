import { ref } from 'vue';

import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const error = ref('');
const isLoading = ref(false);

const useLogin = () => {
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      if (!response) {
        throw new Error('Problém s prihlásením používateľa');
      }
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      isLoading.value = false;
    }
  };

  return { error, isLoading, login };
};

export default useLogin;
