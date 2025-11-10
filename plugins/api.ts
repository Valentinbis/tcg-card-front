import { useAuthStore } from '~/stores/auth';
import { useToastStore } from '~/stores/toast';
import type { FetchContext } from 'ofetch';

export default defineNuxtPlugin(_nuxtApp => {
  const { clearUser, refreshToken } = useAuthStore();

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null = null) => {
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

    onRequest({ options }) {
      const authStore = useAuthStore();
      const currentUser = authStore.user;

      // Ajouter le token d'authentification
      if (currentUser?.apiToken) {
        const headers = new Headers(options.headers as HeadersInit);
        headers.set('Authorization', `Bearer ${currentUser.apiToken}`);
        options.headers = headers;
      }
    },

    async onResponse() {
      // Optionnel: logger les réponses en dev si nécessaire
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
          return new Promise<void>((resolve, reject) => {
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
            const toastStore = useToastStore();
            toastStore.error('Session expirée', 'Veuillez vous reconnecter');
            await navigateTo('/auth/login');
          }
        } catch (error) {
          processQueue(error instanceof Error ? error : new Error('Unknown error'));
          isRefreshing = false;
          clearUser();
          const toastStore = useToastStore();
          toastStore.error('Session expirée', 'Veuillez vous reconnecter');
          await navigateTo('/auth/login');
        }
        return;
      }

      // Token complètement expiré
      if (status === 401 && request.toString().includes('token/refresh')) {
        clearUser();
        const toastStore = useToastStore();
        toastStore.error('Session expirée', 'Veuillez vous reconnecter');
        await navigateTo('/auth/login');
        return;
      }

      // Gestion des autres erreurs HTTP
      switch (status) {
        case 400: {
          const toastStore = useToastStore();
          toastStore.error('Requête invalide', errorData?.message || 'Données incorrectes');
          break;
        }

        case 403: {
          const toastStore = useToastStore();
          toastStore.error('Accès refusé', "Vous n'avez pas les permissions nécessaires");
          break;
        }

        case 404: {
          const toastStore = useToastStore();
          toastStore.error('Non trouvé', errorData?.message || 'Ressource introuvable');
          break;
        }

        case 422: {
          // Erreurs de validation
          const toastStore = useToastStore();
          const validationErrors = errorData?.errors || {};
          const firstError = Object.values(validationErrors)[0];
          toastStore.error(
            'Erreur de validation',
            Array.isArray(firstError) ? firstError[0] : 'Données invalides'
          );
          break;
        }

        case 429: {
          const toastStore = useToastStore();
          const retryAfter = errorData?.retryAfter || 60;
          toastStore.warn('Trop de requêtes', `Veuillez réessayer dans ${retryAfter} secondes`);
          break;
        }

        case 500: {
          const toastStore = useToastStore();
          toastStore.error(
            'Erreur serveur',
            'Une erreur est survenue, veuillez réessayer plus tard'
          );
          break;
        }

        case 503:
          toastStore.error('Service indisponible', 'Le serveur est temporairement indisponible');
          break;

        default:
          toastStore.error('Erreur', errorData?.message || 'Une erreur inattendue est survenue');
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
