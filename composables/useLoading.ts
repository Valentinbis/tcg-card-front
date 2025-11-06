import { useLoadingStore } from '~/stores/loading';

/**
 * Composable pour gérer les états de chargement
 * @example
 * const { startLoading, stopLoading, withLoading } = useLoading()
 * await withLoading('login', async () => {
 *   await loginUser()
 * })
 */
export const useLoading = () => {
  const loadingStore = useLoadingStore();

  const startLoading = (key: string) => {
    loadingStore.startLoading(key);
  };

  const stopLoading = (key: string) => {
    loadingStore.stopLoading(key);
  };

  const isLoading = (key: string) => {
    return loadingStore.isLoading(key);
  };

  /**
   * Exécute une fonction async avec gestion automatique du loading
   */
  const withLoading = async <T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    try {
      startLoading(key);
      return await fn();
    } finally {
      stopLoading(key);
    }
  };

  return {
    startLoading,
    stopLoading,
    isLoading,
    withLoading,
    loading: loadingStore,
  };
};
