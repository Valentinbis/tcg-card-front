<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const { authenticateUser } = useAuthStore();

const { authenticated } = storeToRefs(useAuthStore());

const user = ref({
  email: "",
  password: "",
});

// const login = async () => {
//   const { data } = await useAsyncData("login", () =>
//     $fetch("http://127.0.0.1:8000/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(user.value),
//     })
//   );
// };

const login = async () => {
  await authenticateUser(user.value);
  // redirect to homepage if user is authenticated
  if (authenticated) {
    router.push('/app/dashboard');
  }
}
</script>

<template>
  <div class="p-fluid">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="p-field">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="user.email"
          placeholder="Entrer votre email"
        />
      </div>
      <div class="p-field">
        <label for="password">Mot de passe</label>
        <Password
          id="password"
          v-model="user.password"
          placeholder="Entrer votre mot de passe"
          
        />
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
