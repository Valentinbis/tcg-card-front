import { defineStore } from 'pinia';
import type { Toast } from '~/types/toast';

export const useToastStore = defineStore('toast-store', () => {
  const toasts = ref<Toast[]>([]);

  const show = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      ...toast,
      id,
      life: toast.life || 3000,
    };

    toasts.value.push(newToast);

    // Auto-remove après life
    setTimeout(() => {
      remove(id);
    }, newToast.life);
  };

  const success = (summary: string, detail?: string, life = 3000) => {
    show({ severity: 'success', summary, detail, life });
  };

  const info = (summary: string, detail?: string, life = 3000) => {
    show({ severity: 'info', summary, detail, life });
  };

  const warn = (summary: string, detail?: string, life = 4000) => {
    show({ severity: 'warn', summary, detail, life });
  };

  const error = (summary: string, detail?: string, life = 5000) => {
    show({ severity: 'error', summary, detail, life });
  };

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  const clear = () => {
    toasts.value = [];
  };

  return {
    toasts,
    show,
    success,
    info,
    warn,
    error,
    remove,
    clear,
  };
});
