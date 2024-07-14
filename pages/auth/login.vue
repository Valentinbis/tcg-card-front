<script setup>
import { useAuthStore } from '~/stores/auth';

const { logUserOut } = useAuthStore();

const { authenticated, user } = storeToRefs(useAuthStore());
</script>

<template>
  <div v-if="authenticated">
    <h1>Bienvenue {{ user.lastName }} {{ user.firstName }}!</h1>
    <button @click="logUserOut">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <AppLoginForm />
  </div>
</template>