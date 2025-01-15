import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';

import { auth } from '@/firebase/config';

const error = ref('');
const isLoading = ref(false);

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    error.value = '';
    isLoading.value = true;

    try {
      await signOut(auth);

      isLoading.value = false;
      router.push('/');
    } catch (err) {
      error.value = (err as Error).message;
      isLoading.value = false;
    }
  };

  return { error, isLoading, logout };
};

export default useLogout;
