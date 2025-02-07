<template>
  <div class="flex h-screen items-center justify-center bg-background-primary">
    <div class="h-[32rem] w-[26rem] rounded-xl bg-white p-12 shadow-md">
      <h1 class="mb-2 text-center">New City Park</h1>
      <p class="text-center text-sm">Vitajte na stránke New City Park, prosím, prihláste sa.</p>
      <p class="mb-4 text-center text-sm">
        Nemáte účet?
        <router-link to="/register" class="font-semibold underline hover:no-underline"> Zaregistrujte sa! </router-link>
      </p>
      <div class="flex flex-col space-y-4">
        <div class="relative">
          <icon-email class="pointer-events-none absolute left-2 top-3.5 h-4 w-4 fill-slate-400" />
          <input type="email" placeholder="Email" v-model="email" class="input w-full pl-8" />
        </div>
        <div class="relative">
          <icon-lock class="pointer-events-none absolute left-2 top-3.5 h-4 w-4 fill-slate-400" />
          <input type="password" placeholder="Heslo" v-model="password" class="input w-full pl-8" />
        </div>
      </div>

      <div v-if="error" class="mt-4 text-sm text-red-500">
        {{ error }}
      </div>

      <app-button
        :loading="isLoading"
        :disabled="isLoading"
        :type="'primary'"
        class="mt-4 w-full"
        @click="handleLogin()"
        >Prihlásiť sa</app-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useLogin from '@/composables/useLogin';
import IconEmail from '@/components/icons/IconEmail.vue';
import IconLock from '@/components/icons/IconLock.vue';
import AppButton from '@/components/AppButton.vue';

const { error, login, isLoading } = useLogin();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  await login(email.value, password.value);
};
</script>
