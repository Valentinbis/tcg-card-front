import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { ref, computed, watch } from 'vue';

// Rendre les auto-imports Vue disponibles globalement
(global as Record<string, unknown>).ref = ref;
(global as Record<string, unknown>).computed = computed;
(global as Record<string, unknown>).watch = watch;

// Mock des composables Nuxt globaux
(global as Record<string, unknown>).defineNuxtComponent = (options: unknown) => options;
(global as Record<string, unknown>).definePageMeta = vi.fn();
(global as Record<string, unknown>).navigateTo = vi.fn();
(global as Record<string, unknown>).useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: 'http://localhost:8000/api/',
  },
}));

// Mock de useAPI
(global as Record<string, unknown>).useAPI = vi.fn();

// Mock de storeToRefs
(global as Record<string, unknown>).storeToRefs = vi.fn(store => {
  const refs: Record<string, unknown> = {};
  for (const key in store) {
    if (typeof store[key] !== 'function') {
      refs[key] = ref(store[key]);
    }
  }
  return refs;
});

// Configuration globale de Vue Test Utils
config.global.mocks = {
  $config: {
    public: {
      apiBase: 'http://localhost:8000/api/',
    },
  },
};
