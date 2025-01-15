<template>
  <div class="container">
    <div class="mt-20">
      <div class="button-container">
        <button :class="{ active: !isRegister }" @click="isRegister = false">Prihlásiť sa</button>
        <button :class="{ active: isRegister }" @click="isRegister = true">Registrovať sa</button>
      </div>
    </div>

    <div class="inputs">
      <div v-if="isRegister">
        <input type="name" placeholder="Meno a priezvisko" v-model="displayName" />
      </div>
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Heslo" v-model="password" />
    </div>

    <div v-if="isRegister ? registerError : loginError" class="text-red-500 mt-2">
      {{ isRegister ? registerError : loginError }}
    </div>

    <div class="mt-8 actionBtn">
      <button @click="isRegister ? handleRegister() : handleLogin()">
        {{ isRegister ? 'Registrovať sa' : 'Prihlásiť sa' }}
      </button>
    </div>

    <div v-if="!isRegister">
      <button @click="handleLogout">Odhlásiť sa</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useRegister from '@/composables/useRegister';
import useLogout from '@/composables/useLogout';
import useLogin from '@/composables/useLogin';

const { error: registerError, register } = useRegister();
const { logout } = useLogout();
const { error: loginError, login } = useLogin();

const isRegister = ref(false);
const email = ref('');
const password = ref('');
const displayName = ref('');

const handleRegister = async () => {
  await register(email.value, password.value, displayName.value);
};

const handleLogout = async () => {
  await logout();
};

const handleLogin = async () => {
  await login(email.value, password.value);
};
</script>

<style scoped>
.container {
  @apply w-[460px] h-[560px] bg-gray-50 flex flex-col justify-start items-center;
}

.button-container {
  @apply flex justify-center bg-white rounded-full;
}

.button-container button {
  @apply h-16 w-36 rounded-full text-lg font-semibold text-gray-600;
}

.button-container .active {
  background-image: linear-gradient(to right, #ff4e50 0%, #f9d423 100%);
}

.button-container button:not(.active) {
  @apply bg-white;
}

.inputs {
  @apply flex flex-col gap-5 mt-5  w-[240px];
}

.inputs input::placeholder {
  @apply text-gray-400 font-semibold;
}

.inputs input {
  @apply pb-2 pt-2 bg-gray-50 text-xl text-gray-400 border-b-2 border-t-0 border-l-0 border-r-0 border-solid border-gray-400;
}

.actionBtn {
  @apply flex justify-center mt-12;
}

.actionBtn button {
  @apply h-14 w-80 rounded-full text-lg font-semibold text-gray-600;
  background-image: linear-gradient(to right, #fa3437 0%, #f9d423 100%);
}

.actionBtn button:hover {
  @apply opacity-80;
}
</style>
