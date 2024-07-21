import { defineStore } from "pinia";
import type { UserLoginInterface, User } from "~/types/user";

export const useAuthStore = defineStore(
  "auth-store",
  () => {
    const user = ref<User | null>(null);
    const authenticated = ref(false);
    const loading = ref(false);

    const login = async ({ email, password }: UserLoginInterface) => {
      const { data, pending }: any = await useFetch(
        "http://127.0.0.1:8000/login",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: {
            email,
            password,
          },
        }
      );
      loading.value = pending;

      if (data.value) {
        user.value = data?.value;
        authenticated.value = true;
      }
    };

    const register = async ({ firstName, lastName, email, password }: User) => {
      const { data, pending, error }: any = await useFetch(
        "http://127.0.0.1:8000/register",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: {
            firstName,
            lastName,
            email,
            password,
          },
          onResponseError({ request, response }) {
            const errorMessageRaw = response._data;

            // Formater le message d'erreur pour l'affichage
            const formattedErrorMessage = errorMessageRaw
              .split("\n")[1] // Sélectionne la ligne contenant le message d'erreur
              .trim() // Enlève les espaces inutiles au début et à la fin
              .replace(/\s\(code\s[0-9a-f-]+\)$/i, ""); // Enlève la partie "(code xxxxx)" à la fin

            console.log("error", formattedErrorMessage);
            alert(formattedErrorMessage);
          },
        }
      );
      loading.value = pending;

      if (data.value) {
        user.value = data?.value;
        authenticated.value = true;
      }
    };

    const logout = async () => {
      const { data }: any = await useFetch(
        "http://127.0.0.1:8000/logout",
        {
          method: "get",
        }
      );
      clearUser();
    };

    const clearUser = () => {
      user.value = null;
      authenticated.value = false;
    };

    return {
      user,
      authenticated,
      loading,
      login,
      register,
      logout,
      clearUser,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
