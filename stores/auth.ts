
import { defineStore } from 'pinia';
import type { UserPayloadInterface } from '~/types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
    token: null as string | null,
  }),
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      const { data, pending }: any = await useFetch('http://127.0.0.1:8000/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
          email,
          password,
        },
      });
      this.loading = pending;

      if (data.value) {
        this.authenticated = true;
        this.token = data?.value?.apiToken;
      }
    },
    logUserOut() {
      this.authenticated = false;
      this.token = null;
    },
  },
});
