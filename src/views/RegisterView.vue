<template>
  <div class="inputs">
    <input type="email" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Heslo" v-model="password" />
    <input type="text" placeholder="Meno a priezvisko" v-model="displayName" />
  </div>
  <div class="registerBtn">
    <button @click="handleRegister">Registrovať sa</button>
  </div>
  <div v-if="error" class="flex justify-center mt-5 text-gray-600">
    {{ error }}
  </div>

  <div>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useRegister from '@/composables/useRegister';
import useLogout from '@/composables/useLogout';

const { error, register } = useRegister();
const { logout } = useLogout();

const email = ref('');
const password = ref('');
const displayName = ref('');

const handleRegister = async () => {
  await register(email.value, password.value, displayName.value);
};

const handleLogout = async () => {
  await logout();
};
</script>

<style scoped>
.inputs {
  @apply flex flex-col gap-5 mt-5  w-[240px];
}

.inputs input::placeholder {
  @apply text-gray-400 font-semibold;
}

.inputs input {
  @apply pb-2 pt-2 bg-gray-50 text-xl text-gray-400 border-b-2 border-t-0 border-l-0 border-r-0 border-solid border-gray-400;
}

.registerBtn {
  @apply flex justify-center mt-12;
}

.registerBtn button {
  @apply h-14 w-80 rounded-full text-lg font-semibold text-gray-600;
  background-image: linear-gradient(to right, #fa3437 0%, #f9d423 100%);
}

.registerBtn button:hover {
  @apply opacity-80;
}
</style>
