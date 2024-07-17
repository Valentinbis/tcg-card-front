import { defineStore } from "pinia";
import type { UserPayloadInterface, User } from "~/types/user";

export const useAuthStore = defineStore(
  "auth-store",
  () => {
    const user = ref<User | null>(null);
    const authenticated = ref(false);
    const loading = ref(false);

    const authenticateUser = async ({
      email,
      password,
    }: UserPayloadInterface) => {
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

    const logUserOut = () => {
      user.value = null;
      authenticated.value = false;
    };

    return {
      user,
      authenticated,
      loading,
      authenticateUser,
      logUserOut,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
