import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { auth } from '@/firebase/config';
import UserView from '@/views/user/UserView.vue';
import AdminView from '@/views/admin/AdminView.vue';
import useUser from '@/composables/useUser';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { public: true },
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
  const { userAuth, role } = useUser();
  const currentUser = auth.currentUser;

  if (to.meta.public) {
    return next();
  }

  if (!currentUser) {
    return next({ name: 'login' });
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

