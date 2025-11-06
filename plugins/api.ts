import { useAuthStore } from '~/stores/auth';
import { useToastStore } from '~/stores/toast';
import { useLoadingStore } from '~/stores/loading';
import type { FetchContext } from 'ofetch';

export default defineNuxtPlugin((nuxtApp) => {
  const { user } = storeToRefs(useAuthStore());
  const { clearUser, refreshToken } = useAuthStore();
  
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

  const processQueue = (error: any = null) => {
    failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    failedQueue = [];
  };

  const api = $fetch.create({
    baseURL: 'http://localhost:8000/api/',
    
    onRequest({ request, options }) {
      // Ajouter le token d'authentification
      if (user.value?.apiToken) {
        options.headers = options.headers || {};
        (options.headers as any).Authorization = `Bearer ${user.value?.apiToken}`;
      }

      // Logger les requêtes en dev
      if (import.meta.dev) {
        console.log('[API Request]', request, options);
      }
    },

    async onResponse({ response }) {
      // Logger les réponses en dev
      if (import.meta.dev) {
        console.log('[API Response]', response.status, response._data);
      }
    },

    async onResponseError(ctx: FetchContext) {
      const { response, request } = ctx;
      const toastStore = useToastStore();
      
      if (!response) {
        toastStore.error('Erreur réseau', 'Impossible de contacter le serveur');
        return;
      }

      const status = response.status;
      const errorData = response._data;

      // Gestion du refresh token pour les 401
      if (status === 401 && !request.toString().includes('token/refresh')) {
        if (isRefreshing) {
          // Mettre en file d'attente les requêtes pendant le refresh
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }

        isRefreshing = true;

        try {
          const refreshed = await refreshToken();
          
          if (refreshed) {
            processQueue();
            isRefreshing = false;
            // La requête sera retentée automatiquement
          } else {
            processQueue(new Error('Token refresh failed'));
            isRefreshing = false;
            clearUser();
            toastStore.error('Session expirée', 'Veuillez vous reconnecter');
            await navigateTo('/auth/login');
          }
        } catch (error) {
          processQueue(error);
          isRefreshing = false;
          clearUser();
          toastStore.error('Session expirée', 'Veuillez vous reconnecter');
          await navigateTo('/auth/login');
        }
        return;
      }

      // Token complètement expiré
      if (status === 401 && request.toString().includes('token/refresh')) {
        clearUser();
        toastStore.error('Session expirée', 'Veuillez vous reconnecter');
        await navigateTo('/auth/login');
        return;
      }

      // Gestion des autres erreurs HTTP
      switch (status) {
        case 400:
          toastStore.error('Requête invalide', errorData?.message || 'Données incorrectes');
          break;

        case 403:
          toastStore.error('Accès refusé', 'Vous n\'avez pas les permissions nécessaires');
          break;

        case 404:
          toastStore.error('Non trouvé', errorData?.message || 'Ressource introuvable');
          break;

        case 422:
          // Erreurs de validation
          const validationErrors = errorData?.errors || {};
          const firstError = Object.values(validationErrors)[0];
          toastStore.error(
            'Erreur de validation',
            Array.isArray(firstError) ? firstError[0] : 'Données invalides'
          );
          break;

        case 429:
          const retryAfter = errorData?.retryAfter || 60;
          toastStore.warn(
            'Trop de requêtes',
            `Veuillez réessayer dans ${retryAfter} secondes`
          );
          break;

        case 500:
          toastStore.error(
            'Erreur serveur',
            'Une erreur est survenue, veuillez réessayer plus tard'
          );
          break;

        case 503:
          toastStore.error(
            'Service indisponible',
            'Le serveur est temporairement indisponible'
          );
          break;

        default:
          toastStore.error(
            'Erreur',
            errorData?.message || 'Une erreur inattendue est survenue'
          );
      }

      // Logger l'erreur en dev
      if (import.meta.dev) {
        console.error('[API Error]', status, errorData);
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
  