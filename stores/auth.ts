import { defineStore } from 'pinia';
import type { UserLoginInterface, User } from '~/types/user';

export const useAuthStore = defineStore(
  'auth-store',
  () => {
    const user = ref<User | null>(null);
    const authenticated = ref(false);
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);

    const login = async ({ email, password }: UserLoginInterface) => {
      errorMessage.value = null;

      try {
        const { data, pending, error } = (await useAPI('login', {
          method: 'POST',
          body: {
            email,
            password,
          },
          default: () => null,
        })) as UseApiResponse<User>;

        loading.value = pending.value;

        if (error.value) {
          const status = error.value.statusCode || error.value.status;

          if (status === 429) {
            const retryAfter = error.value.data?.retryAfter || 60;
            errorMessage.value = `Trop de tentatives. Réessayez dans ${retryAfter} secondes.`;
          } else {
            errorMessage.value = error.value.data?.error || 'Erreur de connexion';
          }
          return;
        }

        if (data.value) {
          console.log(
            '[Auth Store] Login réussi, token:',
            data.value.apiToken?.substring(0, 20) + '...'
          );
          console.log('[Auth Store] Utilisateur:', data.value.email);
          user.value = data.value;
          authenticated.value = true;
        }
      } catch (err) {
        console.error('Login error:', err);
        errorMessage.value = 'Une erreur est survenue lors de la connexion';
      }
    };

    const register = async ({ firstName, lastName, email, password }: User) => {
      errorMessage.value = null;

      try {
        const { data, pending, error } = (await useAPI('register', {
          method: 'POST',
          body: {
            firstName,
            lastName,
            email,
            password,
          },
          default: () => null,
        })) as UseApiResponse<User>;

        loading.value = pending.value;

        if (error.value) {
          const status = error.value.statusCode || error.value.status;

          if (status === 429) {
            const retryAfter = error.value.data?.retryAfter || 60;
            errorMessage.value = `Trop de tentatives. Réessayez dans ${retryAfter} secondes.`;
          } else if (error.value.data?.message) {
            // Formater le message d'erreur pour l'affichage
            const errorMessageRaw = error.value.data.message as string;
            const errorLines = errorMessageRaw.split('\n');
            const formattedErrorMessage = (errorLines[1] || errorMessageRaw)
              .trim() // Enlève les espaces inutiles au début et à la fin
              .replace(/\s\(code\s[0-9a-f-]+\)$/i, ''); // Enlève la partie "(code xxxxx)" à la fin

            errorMessage.value = formattedErrorMessage;
            alert(formattedErrorMessage);
          } else {
            errorMessage.value = error.value.data?.error || "Erreur d'inscription";
          }
          return;
        }

        if (data.value) {
          user.value = data.value;
          authenticated.value = true;
        }
      } catch (err) {
        console.error('Register error:', err);
        errorMessage.value = "Une erreur est survenue lors de l'inscription";
      }
    };

    const logout = async () => {
      await useAPI('logout', {
        method: 'GET',
        default: () => ({}),
      });
      clearUser();
    };

    const refreshToken = async () => {
      if (!user.value?.apiToken) {
        return false;
      }

      try {
        const { data } = (await useAPI('token/refresh', {
          method: 'POST',
          default: () => null,
        })) as UseApiResponse<User>;

        if (data.value) {
          user.value = data.value;
          authenticated.value = true;
          return true;
        } else {
          clearUser();
          return false;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearUser();
        return false;
      }
    };

    const clearUser = () => {
      user.value = null;
      authenticated.value = false;
    };

    // Vérifier la validité du token au refresh/démarrage
    const verifyToken = async () => {
      if (!user.value?.apiToken) {
        console.log('[Auth Store] Pas de token, nettoyage...');
        clearUser();
        return false;
      }

      try {
        console.log('[Auth Store] Vérification du token via /me...');
        const { data, error } = (await useAPI('me', {
          method: 'GET',
          default: () => null,
        })) as UseApiResponse<User>;

        if (error.value) {
          console.error('[Auth Store] Erreur lors de la vérification du token:', error.value);
          clearUser();
          return false;
        }

        if (data.value) {
          console.log('[Auth Store] Token valide, utilisateur:', data.value.email);
          user.value = data.value;
          authenticated.value = true;
          return true;
        } else {
          console.log('[Auth Store] Pas de données utilisateur, nettoyage...');
          clearUser();
          return false;
        }
      } catch (error) {
        console.error('[Auth Store] Exception lors de la vérification du token:', error);
        clearUser();
        return false;
      }
    };

    return {
      user,
      authenticated,
      loading,
      errorMessage,
      login,
      register,
      logout,
      refreshToken,
      clearUser,
      verifyToken,
    };
  },
  {
    persist: true,
  }
);
