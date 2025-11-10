<script setup lang="ts">
// Redirection automatique vers la page d'accueil de l'application
definePageMeta({
  layout: false,
});

// Redirection côté serveur
await navigateTo('/app/home', { replace: true });
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
      <p class="text-gray-300">Chargement...</p>
    </div>
  </div>
</template>
