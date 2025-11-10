<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useValidation } from '~/composables/useValidation';
import { useLoading } from '~/composables/useLoading';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const validation = useValidation();
const { withLoading, isLoading } = useLoading();
const toast = useToast();

const formData = reactive({
  email: '',
  password: '',
});

const validationErrors = computed(() => validation.errors.value);

const handleSubmit = async () => {
  // Clear previous errors
  validation.clearErrors();

  // Validate form
  const emailValid = validation.validateEmail(formData.email);
  const passwordValid = validation.validatePassword(formData.password);

  if (!emailValid || !passwordValid) {
    return;
  }

  // Submit with loading state
  await withLoading('login', async () => {
    await authStore.login({
      email: formData.email,
      password: formData.password,
    });

    if (authStore.authenticated) {
      toast.add({
        severity: 'success',
        summary: 'Connexion réussie',
        detail: 'Vous êtes maintenant connecté',
        life: 3000,
      });
      await navigateTo('/app/home');
    } else if (authStore.errorMessage) {
      toast.add({
        severity: 'error',
        summary: 'Erreur de connexion',
        detail: authStore.errorMessage,
        life: 5000,
      });
    }
  });
};
</script>

<template>
  <div
    class="improved-login-form max-w-md mx-auto p-6 bg-white rounded-lg shadow-md fade-in-up hover-lift"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Connexion</h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Email -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm font-medium text-gray-700"> Email </label>
        <InputText
          id="email"
          v-model="formData.email"
          type="email"
          autocomplete="email"
          :invalid="!!validationErrors.email"
          fluid
          class="transition-smooth"
          @blur="() => validation.validateEmail(formData.email)"
        />
        <small v-if="validationErrors.email" class="text-red-600">
          {{ validationErrors.email }}
        </small>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-sm font-medium text-gray-700"> Mot de passe </label>
        <Password
          id="password"
          v-model="formData.password"
          :toggle-mask="true"
          :feedback="false"
          :invalid="!!validationErrors.password"
          autocomplete="current-password"
          fluid
          class="transition-smooth"
          @blur="() => validation.validatePassword(formData.password)"
        />
        <small v-if="validationErrors.password" class="text-red-600">
          {{ validationErrors.password }}
        </small>
      </div>

      <!-- Error message général -->
      <Message v-if="authStore.errorMessage" severity="error">
        {{ authStore.errorMessage }}
      </Message>

      <!-- Submit button -->
      <Button
        type="submit"
        :label="isLoading('login') ? 'Connexion...' : 'Se connecter'"
        :loading="isLoading('login')"
        :disabled="isLoading('login')"
        severity="primary"
        size="large"
        fluid
        class="transition-smooth hover-glow"
      />

      <!-- Link to register -->
      <p class="text-center text-sm text-gray-600">
        Pas encore de compte ?
        <NuxtLink
          to="/auth/register"
          class="text-blue-600 hover:text-blue-700 font-medium transition-smooth"
        >
          S'inscrire
        </NuxtLink>
      </p>
    </form>
  </div>
</template>
