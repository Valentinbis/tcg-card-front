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
    <Menubar :model="items">
      <template #start>
          <!-- src="/logo.png"  -->
        <img alt="logo" 
        class="mr-2">
        <span class="font-bold">CashTrack</span>
      </template>
      <template #end>
        <Button label="Se connecter" class="p-button-text mr-2" />
        <Button label="Créer un compte" class="p-button-outlined" />
        <Button icon="pi pi-sun" class="p-button-rounded p-button-success ml-2" @click="toggleTheme" />
      </template>
    </Menubar>
  </template>
  
  <style scoped>
  /* Ajoutez vos styles personnalisés ici */
  </style>