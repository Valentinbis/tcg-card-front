<script setup lang="ts">
// Redirection automatique vers la page publique
definePageMeta({
  layout: false,
});

// Redirection côté serveur
await navigateTo('/public', { replace: true });
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p class="text-gray-600">Redirection...</p>
    </div>
  </div>
</template>
