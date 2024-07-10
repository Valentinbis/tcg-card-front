<script setup>
const user = ref({
  email: '',
  password: ''
});

const login = async () => {
  console.log('Login credentials:', user.value);
  await setUserSession(event, {
  user: {
    // ... user data
  },
  loggedInAt: new Date()
  // Any extra fields
})
  // Ajoutez ici votre logique de connexion
}
</script>

<template>
    <div class="p-fluid">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="p-field">
            <label for="email">Email</label>
            <InputText id="email" v-model="user.email" placeholder="Entrer votre email" />
        </div>
        <div class="p-field">
          <label for="password">Mot de passe</label>
          <Password id="password" v-model="user.password" placeholder="Entre votre mot de passe" toggleMask />
        </div>
        <Button type="submit" class="button-login" label="Se connecter" />
      </form>
    </div>
  </template>
  
  <style scoped>
.button-login {
  margin-top: 20px; /* Ajustez la valeur de la marge supérieure selon vos besoins */
}
</style>