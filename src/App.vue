<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import useUser from '@/composables/useUser';

const { role, userAuth } = useUser();
const router = useRouter();

watch(
  () => role.value,
  (newVal) => {
    if (newVal === 'admin') {
      router.push('/admin');
    } else if (newVal === 'user') {
      router.push(`/user/${userAuth.value?.uid}`);
    }
  }
);
</script>

