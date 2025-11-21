<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import type { User } from '~/types/user';

const router = useRouter();
const { register } = useAuthStore();

const { authenticated, errorMessage } = storeToRefs(useAuthStore());

const user = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
});

const registerEvent = async () => {
  await register(user.value);
  // redirect to homepage if user is authenticated
  if (authenticated.value) {
    router.push('/app/home');
  }
};
</script>

<template>
  <div
    class="fade-in-up flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl hover-lift"
  >
    <div class="flex flex-row gap-3 pb-4">
      <div>
        <img src="" width="50" alt="Logo" />
      </div>
      <h1 class="text-3xl font-bold text-[#4B5563] my-auto">TCG Card</h1>
    </div>
    <div class="text-sm font-light text-[#6B7280] pb-8">Créer un compte sur TCG Card.</div>

    <!-- Message d'erreur avec PrimeVue -->
    <Message v-if="errorMessage" severity="error" class="mb-4">
      {{ errorMessage }}
    </Message>

    <form class="flex flex-col space-y-4" @submit.prevent="registerEvent">
      <!-- Prénom -->
      <div class="flex flex-col gap-2">
        <label for="firstName" class="text-sm font-medium text-[#111827]">Prénom</label>
        <InputText
          id="firstName"
          v-model="user.firstName"
          type="text"
          placeholder="Michel"
          autocomplete="given-name"
          fluid
          class="transition-smooth"
        />
      </div>

      <!-- Nom -->
      <div class="flex flex-col gap-2">
        <label for="lastName" class="text-sm font-medium text-[#111827]">Nom</label>
        <InputText
          id="lastName"
          v-model="user.lastName"
          type="text"
          placeholder="Durant"
          autocomplete="family-name"
          fluid
          class="transition-smooth"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm font-medium text-[#111827]">Email</label>
        <InputText
          id="email"
          v-model="user.email"
          type="email"
          placeholder="name@company.com"
          autocomplete="email"
          fluid
          class="transition-smooth"
        />
      </div>

      <!-- Mot de passe -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-sm font-medium text-[#111827]">Mot de passe</label>
        <Password
          id="password"
          v-model="user.password"
          :toggle-mask="true"
          :input-props="{ autocomplete: 'new-password' }"
          fluid
          placeholder="••••••••••"
          class="transition-smooth"
        >
          <template #header>
            <div class="font-semibold text-sm mb-4">Entrer un mot de passe</div>
          </template>
          <template #footer>
            <Divider />
            <ul class="pl-2 ml-2 my-0 leading-normal text-sm">
              <li>Au moins une minuscule</li>
              <li>Au moins une majuscule</li>
              <li>Au moins un chiffre</li>
              <li>Minimum 8 caractères</li>
            </ul>
          </template>
        </Password>
      </div>

      <!-- Bouton de soumission -->
      <Button
        type="submit"
        label="Créer un compte"
        severity="primary"
        size="large"
        fluid
        class="mt-4 transition-smooth hover-glow touch-manipulation"
      />

      <!-- Lien vers login -->
      <div class="text-sm font-light text-[#6B7280] text-center mt-4">
        Vous avez déjà un compte ?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-[#4F46E5] hover:underline transition-smooth"
        >
          Se connecter
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Touch manipulation pour les interactions tactiles */
.touch-manipulation {
  touch-action: manipulation;
}

/* Optimisations mobiles */
@media (max-width: 768px) {
  .fade-in-up {
    padding: 1rem !important;
  }

  .p-inputtext,
  .p-password input {
    font-size: 16px; /* Empêche le zoom sur iOS */
  }

  .p-button {
    min-height: 44px; /* Taille minimale pour les boutons tactiles */
  }
}
</style>
