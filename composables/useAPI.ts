import type { UseFetchOptions } from 'nuxt/app';
import { toValue } from 'vue';

export function useAPI<T>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T },
  params?: Record<string, string | number>
) {
  const apiUrl = typeof url === 'function' ? url() : url;

  // Construire l'URL avec les paramètres fournis
  let finalUrl = apiUrl;
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
    finalUrl = `${apiUrl}?${queryParams.toString()}`;
  }

  const { $api } = useNuxtApp();

  return useAsyncData(
    `api-${finalUrl}-${toValue(options.method) || 'GET'}-${Date.now()}`,
    () =>
      $api(finalUrl, {
        method: toValue(options.method),
        body: toValue(options.body),
        headers: toValue(options.headers) as HeadersInit | undefined,
      }),
    {
      default: options.default,
      server: false,
      lazy: false,
    }
  );
}
