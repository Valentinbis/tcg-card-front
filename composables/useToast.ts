import { useToastStore } from '~/stores/toast';

/**
 * Composable pour afficher des notifications toast
 * @example
 * const { showSuccess, showError } = useToast()
 * showSuccess('Opération réussie !')
 */
export const useToast = () => {
  const toastStore = useToastStore();

  const showSuccess = (message: string, detail?: string) => {
    toastStore.success(message, detail);
  };

  const showError = (message: string, detail?: string) => {
    toastStore.error(message, detail);
  };

  const showInfo = (message: string, detail?: string) => {
    toastStore.info(message, detail);
  };

  const showWarn = (message: string, detail?: string) => {
    toastStore.warn(message, detail);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarn,
    toast: toastStore,
  };
};
