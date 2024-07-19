import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  // options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> },
) {
  const { nuxtApp } = useNuxtApp();
  return useFetch(url, {
    // ...options,
    $fetch: useNuxtApp().$api
  })
}
