<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const { logout } = useAuthStore();
const { authenticated, user } = storeToRefs(useAuthStore());

definePageMeta({
  layout: false,
});
</script>

<template>
  <div v-if="authenticated">
    <h1>Bienvenue {{ user?.lastName }} {{ user?.firstName }}!</h1>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <h1>Veuillez vous connecter</h1>
    <AppLoginForm />
    <p>Vous n'avez pas de compte ? <nuxt-link to="/auth/register">Créez-en un maintenant.</nuxt-link></p>
  </div>
</template>