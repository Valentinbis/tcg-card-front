<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <AppRegisterForm />
    <p>Vous avez déjà un compte ? <nuxt-link to="/auth/login">Connectez-vous ici</nuxt-link></p>
  </div>
</template>