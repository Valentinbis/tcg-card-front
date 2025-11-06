<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useValidation } from '~/composables/useValidation';
import { useLoading } from '~/composables/useLoading';
import { useNotifications } from '~/composables/useNotifications';

const authStore = useAuthStore();
const validation = useValidation();
const { withLoading, isLoading } = useLoading();
const { showSuccess, showError } = useNotifications();

const formData = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);
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
      showSuccess('Connexion réussie', 'Vous êtes maintenant connecté');
      await navigateTo('/app/home');
    } else if (authStore.errorMessage) {
      showError('Erreur de connexion', authStore.errorMessage);
    }
  });
};
</script>

<template>
  <div class="improved-login-form max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Connexion</h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          autocomplete="email"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            validationErrors.email ? 'border-red-500' : 'border-gray-300',
          ]"
          @blur="() => validation.validateEmail(formData.email)"
        />
        <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
          {{ validationErrors.email }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :class="[
              'w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              validationErrors.password ? 'border-red-500' : 'border-gray-300',
            ]"
            @blur="() => validation.validatePassword(formData.password)"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" />
          </button>
        </div>
        <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
          {{ validationErrors.password }}
        </p>
      </div>

      <!-- Error message général -->
      <div v-if="authStore.errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-800">
          {{ authStore.errorMessage }}
        </p>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="isLoading('login')"
        :class="[
          'w-full py-2 px-4 rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isLoading('login')
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white',
        ]"
      >
        <span v-if="!isLoading('login')">Se connecter</span>
        <span v-else class="flex items-center justify-center">
          <i class="mdi mdi-loading mdi-spin mr-2" />
          Connexion...
        </span>
      </button>

      <!-- Link to register -->
      <p class="text-center text-sm text-gray-600">
        Pas encore de compte ?
        <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-700 font-medium">
          S'inscrire
        </NuxtLink>
      </p>
    </form>
  </div>
</template>
