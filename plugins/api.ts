import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const { user } = storeToRefs(useAuthStore());
  const { clearUser } = useAuthStore();

    const api = $fetch.create({
      baseURL: 'http://localhost:8000/api/',
      onRequest({ request, options }) {
        if (user.value?.apiToken) {
          options.headers = options.headers || {};
          (options.headers as any).Authorization = `Bearer ${user.value?.apiToken}`;
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          console.warn('Token invalide ou expiré, déconnexion...');
          clearUser();
          await navigateTo('/auth/login');
        }
      }
    })
  
    // Expose to useNuxtApp().$api
    return {
      provide: {
        api
      }
    }
  })
  