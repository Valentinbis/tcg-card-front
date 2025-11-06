/**
 * Composable pour lazy load des composants
 * Utile pour les composants lourds non critiques
 */
export const useLazyComponent = () => {
  const isClient = ref(false);

  onMounted(() => {
    isClient.value = true;
  });

  return {
    isClient,
  };
};

/**
 * Composable pour charger un composant après un délai
 * Utile pour les composants non critiques (analytics, chat, etc.)
 */
export const useDelayedLoad = (delay = 1000) => {
  const shouldLoad = ref(false);

  onMounted(() => {
    setTimeout(() => {
      shouldLoad.value = true;
    }, delay);
  });

  return {
    shouldLoad,
  };
};

/**
 * Composable pour charger un composant sur interaction
 * Utile pour les modales, dropdowns, etc.
 */
export const useInteractionLoad = () => {
  const isLoaded = ref(false);

  const load = () => {
    if (!isLoaded.value) {
      isLoaded.value = true;
    }
  };

  return {
    isLoaded,
    load,
  };
};
