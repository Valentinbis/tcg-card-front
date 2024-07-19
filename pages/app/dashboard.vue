<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { user } = storeToRefs(useAuthStore());


</script>

<template>
  Bienvenue sur votre dashboard {{ user?.lastName }} {{ user?.firstName }}!
</template>
