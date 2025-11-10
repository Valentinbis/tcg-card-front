<script setup>
const items = [
  { label: 'Fonctionnalités', to: '/fonctionnalites' },
  { label: 'Assistance', to: '/assistance' },
  { label: 'Prix', to: '/prix' },
  { label: 'Contact', to: '/contact' },
];

const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
};
</script>

<template>
  <Menubar :model="items" class="fade-in-up">
    <template #start>
      <!-- src="/logo.png" -->
      <img alt="logo" class="mr-2 hover-scale transition-smooth" />
      <span class="font-bold">TCG Card</span>
    </template>
    <template #end>
      <Button label="Se connecter" text class="transition-smooth hover-glow" />
      <Button label="Créer un compte" outlined class="transition-smooth hover-glow ml-2" />
      <Button
        icon="pi pi-sun"
        rounded
        severity="success"
        class="transition-smooth hover-scale ml-2"
        @click="toggleTheme"
      />
    </template>
  </Menubar>
</template>

<style scoped>
/* Les animations sont gérées par animations.css */
</style>
