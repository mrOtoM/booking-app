import '@/assets/css/main.css';

import { createApp } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PrimeVue from 'primevue/config';

import App from './App.vue';
import router from './router';
import useUser from './composables/useUser';
import { db } from '@/firebase/config';
import { UserProfile } from '@/types/CustomTypes';

const auth = getAuth();
const { isUserProfileLoading, setUserData } = useUser();

let app: any;

onAuthStateChanged(auth, async (firebaseUser) => {
  isUserProfileLoading.value = true;

  if (firebaseUser) {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(firebaseUser, docSnap.data() as UserProfile, docSnap.data().role ?? null);
    } else {
      setUserData(firebaseUser, null, null);
    }
  } else {
    setUserData(null, null, null);
  }

  isUserProfileLoading.value = false;

  if (!app) {
    app = createApp(App);
    app.use(router);
    app.use(PrimeVue);
    app.mount('#app');
  }
});

