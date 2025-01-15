import { ref } from 'vue';
import type { User } from 'firebase/auth';
import { UserProfile } from '@/types/CustomTypes';

const userAuth = ref<User | null>(null);
const userProfile = ref<UserProfile | null>(null);
const role = ref<string | null>(null);
const isUserProfileLoading = ref<boolean>(true);

const useUser = () => {
  const setUserData = (newUserAuth: User | null, newUserProfile: UserProfile | null, newRole: string | null) => {
    userAuth.value = newUserAuth;
    userProfile.value = newUserProfile;
    role.value = newRole;
    console.log('newUserAuth', newUserAuth);
    console.log('newUserProfile', newUserProfile);
    console.log('newRole', newRole);
  };

  return {
    userAuth,
    role,
    isUserProfileLoading,
    userProfile,
    setUserData,
  };
};

export default useUser;
