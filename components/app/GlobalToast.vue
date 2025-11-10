<script setup lang="ts">
// Le Toast PrimeVue est géré directement dans le layout ou app.vue
// Ce composant ne sert plus qu'à afficher le Toast PrimeVue
</script>

<template>
  <!-- Toast PrimeVue avec position et animations -->
  <Toast position="top-right" :life="5000" />
</template>

<style scoped>
/* Les animations du Toast sont gérées par PrimeVue et animations.css */
</style>
