<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { authenticated, apiToken } = storeToRefs(useAuthStore());

const { data: recurrence } = await useAPI('/recurrence');

console.log(recurrence);
</script>

<template>
  coucou
  <div v-if="authenticated">
    <!-- <h1>Bienvenue {{ user.lastName }} {{ user.firstName }}!</h1> -->cc
    <button @click="logUserOut">Logout</button>
  </div>
  {{ authenticated }}
  {{ apiToken }}
</template>
