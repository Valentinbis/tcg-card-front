import { useAuthStore } from '~/stores/auth';
import type { FetchContext } from 'ofetch';

export default defineNuxtPlugin((nuxtApp) => {
  const { user } = storeToRefs(useAuthStore());
  const { clearUser, refreshToken } = useAuthStore();
  
  let isRefreshing = false;

    const api = $fetch.create({
      baseURL: 'http://localhost:8000/api/',
      onRequest({ request, options }) {
        if (user.value?.apiToken) {
          options.headers = options.headers || {};
          (options.headers as any).Authorization = `Bearer ${user.value?.apiToken}`;
        }
      },
      async onResponseError(ctx: FetchContext) {
        const { response, request } = ctx;
        
        if (!response) return;
        
        if (response.status === 401 && !request.toString().includes('token/refresh')) {
          if (isRefreshing) {
            // Si un refresh est déjà en cours, attendre
            await new Promise(resolve => setTimeout(resolve, 100));
            return;
          }

          isRefreshing = true;

          try {
            const refreshed = await refreshToken();
            
            if (refreshed) {
              // Token refreshé, la requête sera retentée automatiquement par le client
              isRefreshing = false;
            } else {
              isRefreshing = false;
              clearUser();
              await navigateTo('/auth/login');
            }
          } catch (error) {
            isRefreshing = false;
            clearUser();
            await navigateTo('/auth/login');
          }
        }
        
        // Si c'est une erreur 401 sur le refresh lui-même, déconnecter
        if (response.status === 401 && request.toString().includes('token/refresh')) {
          console.warn('Token complètement expiré, déconnexion...');
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
  