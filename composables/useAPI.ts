// import type { UseFetchOptions } from 'nuxt/app'
import { useRouter } from 'vue-router';
import { useAuthStore } from "~/stores/auth";

export function useAPI(
  url: string | (() => string),
  // options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> },
) {
  // const { nuxtApp } = useNuxtApp();
  const router = useRouter();
  const onResponseError = async ({ response }) => {
    if (response.status === 401) {
      useAuthStore().clearUser();
      router.push('/auth/login');
    }
  };

  return useFetch(url, {
    // ...options,
    $fetch: useNuxtApp().$api,
    onResponseError,
  })
}