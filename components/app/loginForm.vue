<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const { login } = useAuthStore();
const { authenticated, errorMessage } = storeToRefs(useAuthStore());
const toast = useToast();

const user = ref({
  email: '',
  password: '',
});

const isSubmitting = ref(false);
const errors = ref({
  email: '',
  password: '',
});

const validateEmail = (email: string): boolean => {
  if (!email) {
    errors.value.email = "L'email est requis";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.value.email = 'Email invalide';
    return false;
  }
  errors.value.email = '';
  return true;
};

const validatePassword = (password: string): boolean => {
  if (!password) {
    errors.value.password = 'Le mot de passe est requis';
    return false;
  }
  if (password.length < 6) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères';
    return false;
  }
  errors.value.password = '';
  return true;
};

const loginEvent = async () => {
  // Validation
  const emailValid = validateEmail(user.value.email);
  const passwordValid = validatePassword(user.value.password);

  if (!emailValid || !passwordValid) {
    toast.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Veuillez corriger les erreurs avant de continuer',
      life: 4000,
    });
    return;
  }

  isSubmitting.value = true;

  await login(user.value);

  if (authenticated.value) {
    toast.add({
      severity: 'success',
      summary: 'Connexion réussie',
      detail: 'Redirection en cours...',
      life: 2000,
    });
    setTimeout(() => {
      router.push('/app/home');
    }, 500);
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur de connexion',
      detail: errorMessage.value || 'Échec de la connexion',
      life: 5000,
    });
  }

  isSubmitting.value = false;
};

const handleEmailChange = () => {
  if (errors.value.email) {
    validateEmail(user.value.email);
  }
};

const handlePasswordChange = () => {
  if (errors.value.password) {
    validatePassword(user.value.password);
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
    <div class="text-sm font-light text-[#6B7280] pb-8">Se connecter à votre compte.</div>

    <form class="flex flex-col space-y-4" @submit.prevent="loginEvent">
      <!-- Email -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm font-medium text-[#111827]">Email</label>
        <InputText
          id="email"
          v-model="user.email"
          type="email"
          placeholder="name@company.com"
          autocomplete="email"
          :invalid="!!errors.email"
          fluid
          class="transition-smooth"
          @input="handleEmailChange"
        />
        <small v-if="errors.email" class="text-red-600">{{ errors.email }}</small>
      </div>

      <!-- Mot de passe -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-sm font-medium text-[#111827]">Mot de passe</label>
        <Password
          id="password"
          v-model="user.password"
          :toggle-mask="true"
          :feedback="false"
          :invalid="!!errors.password"
          autocomplete="current-password"
          placeholder="••••••••••"
          fluid
          class="transition-smooth"
          @input="handlePasswordChange"
        />
        <small v-if="errors.password" class="text-red-600">{{ errors.password }}</small>
      </div>

      <!-- Bouton de soumission -->
      <Button
        type="submit"
        :label="isSubmitting ? 'Connexion...' : 'Se connecter'"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        severity="primary"
        size="large"
        fluid
        class="mt-4 transition-smooth hover-glow touch-manipulation"
      />

      <!-- Lien vers register -->
      <div class="text-sm font-light text-[#6B7280] text-center mt-4">
        Vous n'avez pas de compte ?
        <NuxtLink
          to="/auth/register"
          class="font-medium text-[#4F46E5] hover:underline transition-smooth"
        >
          Créez-en un maintenant.
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
