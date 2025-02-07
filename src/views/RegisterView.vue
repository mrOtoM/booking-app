<template>
  <div class="flex h-screen items-center justify-center bg-background-primary">
    <div class="h-[32rem] w-[26rem] rounded-xl bg-white p-12 shadow-md">
      <h1 class="mb-2 text-center">New City Park</h1>
      <p class="text-center text-sm">Registrácia účtu. Prosím vyplnte všetky doleuvdené polia.</p>
      <p class="mb-4 text-center text-sm">
        Spať na
        <router-link to="/login" class="font-semibold underline hover:no-underline">Prihlasiť sa</router-link>
      </p>
      <div class="flex flex-col space-y-4">
        <div class="relative">
          <icon-person class="pointer-events-none absolute left-2 top-3.5 h-4 w-4 fill-slate-400" />
          <input type="text" placeholder="Meno" v-model="firstName" class="input w-full pl-8" />
        </div>
        <div class="relative">
          <icon-person-group class="pointer-events-none absolute left-2 top-3.5 h-4 w-4 fill-slate-400" />
          <input type="text" placeholder="Priezvisko" v-model="secondName" class="input w-full pl-8" />
        </div>
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
        @click="handleRegister()"
        >Registrovať sa</app-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import useRegister from '@/composables/useRegister';
import AppButton from '@/components/AppButton.vue';
import IconEmail from '@/components/icons/IconEmail.vue';
import IconLock from '@/components/icons/IconLock.vue';
import IconPerson from '@/components/icons/IconPerson.vue';
import IconPersonGroup from '@/components/icons/IconPersonGroup.vue';

const router = useRouter();

const { error, register, isLoading } = useRegister();

const secondName = ref('');
const firstName = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  const displayName = firstName.value + ' ' + secondName.value;

  await register(email.value, password.value, displayName);

  router.push('/login');
};
</script>
