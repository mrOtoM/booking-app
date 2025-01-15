import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { auth } from '@/firebase/config';
import HomeView from '@/views/HomeView.vue';
import UserView from '@/views/UserView.vue';
import AdminView from '@/views/AdminView.vue';
import useUser from '@/composables/useUser';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { userAuth, role, isUserProfileLoading } = useUser();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    if (to.name !== 'home') {
      return next({ name: 'home' });
    }
    return next();
  }

  if (isUserProfileLoading.value) {
    if (to.name !== 'home') {
      return next({ name: 'home' });
    } else {
      return next();
    }
  }

  if (role.value === 'admin') {
    if (to.name !== 'admin') {
      return next({ name: 'admin' });
    }
    return next();
  }

  if (role.value === 'user') {
    if (to.name !== 'user') {
      return next({
        name: 'user',
        params: { id: userAuth.value?.uid },
      });
    }

    if (to.params.id !== userAuth.value?.uid) {
      return next({
        name: 'user',
        params: { id: userAuth.value?.uid },
      });
    }
    return next();
  }

  return next({ name: 'home' });
});

export default router;

