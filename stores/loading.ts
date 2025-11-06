import { defineStore } from 'pinia';

export interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingStore = defineStore('loading-store', () => {
  const loadingStates = ref<LoadingState>({
    global: false,
    login: false,
    register: false,
    cards: false,
    collection: false,
  });

  const setLoading = (key: string, value: boolean) => {
    loadingStates.value[key] = value;
  };

  const isLoading = (key: string): boolean => {
    return loadingStates.value[key] || false;
  };

  const startLoading = (key: string) => {
    setLoading(key, true);
  };

  const stopLoading = (key: string) => {
    setLoading(key, false);
  };

  const isAnyLoading = (): boolean => {
    return Object.values(loadingStates.value).some(v => v === true);
  };

  return {
    loadingStates,
    setLoading,
    isLoading,
    startLoading,
    stopLoading,
    isAnyLoading,
  };
});
