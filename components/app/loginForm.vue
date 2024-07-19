<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const { login } = useAuthStore();

const { authenticated } = storeToRefs(useAuthStore());

const user = ref({
  email: "",
  password: "",
});

const loginEvent = async () => {
  await login(user.value);
  // redirect to homepage if user is authenticated
  if (authenticated) {
    router.push('/app/dashboard');
  }
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="loginEvent">
      <div>
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="user.email"
          placeholder="Entrer votre email"
        />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <Password
          id="password"
          v-model="user.password"
          placeholder="Entrer votre mot de passe"
          :feedback="false"
          toggleMask
        />
      </div>
      <Button type="submit" class="button-login" label="Se connecter" />
    </form>
  </div>
</template>

<style scoped>
.button-login {
  margin-top: 20px;
}
</style>
