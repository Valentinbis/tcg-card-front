<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import type { User } from "~/types/user";

const router = useRouter();
const { register } = useAuthStore();

const { authenticated } = storeToRefs(useAuthStore());

const user = ref<User>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const registerEvent = async () => {
  await register(user.value);
  // redirect to homepage if user is authenticated
  if (authenticated) {
    router.push("/app/dashboard");
  }
};
</script>

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="registerEvent">
      <div>
        <label for="firstName">Prénom</label>
        <InputText
          id="firstName"
          v-model="user.firstName"
          placeholder="Entrer votre prénom"
        />
      </div>
      <div>
        <label for="lastName">Nom</label>
        <InputText
          id="lastName"
          v-model="user.lastName"
          placeholder="Entrer votre nom"
        />
      </div>
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
        <Password id="password" v-model="user.password" toggleMask>
          <template #header>
            <div class="font-semibold text-xm mb-4">Entrer un mot de passe</div>
          </template>
          <template #footer>
            <Divider />
            <ul class="pl-2 ml-2 my-0 leading-normal">
              <li>Au moins une minuscule</li>
              <li>Au moins une majuscule</li>
              <li>Au moins un chiffre</li>
              <li>Minimum 8 caractères</li>
            </ul>
          </template>
        </Password>
        <!-- placeholder="Entrer votre mot de passe"  /> -->
      </div>
      <Button type="submit" class="button-register" label="Se connecter" />
    </form>
  </div>
</template>

<style scoped>
.button-register {
  margin-top: 20px;
}
.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem; /* 14px */
}

.mb-4 {
  margin-bottom: 1rem; /* 16px */
}

.pl-2 {
  padding-left: 0.5rem; /* 8px */
}

.ml-2 {
  margin-left: 0.5rem; /* 8px */
}

.my-0 {
  margin-top: 0;
  margin-bottom: 0;
}

.leading-normal {
  line-height: 1.5;
}
</style>
