<template>
  <div class="home flex justify-center items-center">
    <login-register-view />
  </div>
</template>

<script lang="ts" setup>
import LoginRegisterView from '@/views/LoginRegisterView.vue';
</script>

<style scoped>
.home {
  background: url('../assets/img/background-blur.jpg') no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  height: 100vh;
  z-index: -1000;
}
</style>

