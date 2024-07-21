<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { user } = storeToRefs(useAuthStore());


</script>

<template>
  Bienvenue sur votre dashboard {{ user?.lastName }} {{ user?.firstName }}!
  <div>
    <h1 class="text-orange-950">Les dernières transactions</h1>
  </div>
</template>
