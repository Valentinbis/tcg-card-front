import type { UseFetchOptions } from 'nuxt/app'
import { useNuxtApp } from '#imports';

export function useAPI<T>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> },
  params?: Record<string, string | number>,
) {
  const apiUrl = typeof url === 'function' ? url() : url;

  // Construire l'URL avec les paramètres fournis
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
  }
  const finalUrl = `${apiUrl}?${queryParams.toString()}`;

  return useFetch(finalUrl, {
    ...options,
    $fetch: useNuxtApp().$api,
  })
}