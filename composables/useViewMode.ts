export const useViewMode = () => {
  const viewMode = ref<'grid' | 'list' | 'compact'>('grid');

  // Charger depuis localStorage au montage
  const loadViewMode = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('viewMode');
      if (saved && ['grid', 'list', 'compact'].includes(saved)) {
        viewMode.value = saved as 'grid' | 'list' | 'compact';
      }
    }
  };

  // Sauvegarder dans localStorage
  const saveViewMode = (mode: 'grid' | 'list' | 'compact') => {
    if (import.meta.client) {
      localStorage.setItem('viewMode', mode);
    }
    viewMode.value = mode;
  };

  // Toggle entre les modes
  const setViewMode = (mode: 'grid' | 'list' | 'compact') => {
    saveViewMode(mode);
  };

  // Cycle à travers les modes
  const cycleViewMode = () => {
    const modes: ('grid' | 'list' | 'compact')[] = ['grid', 'list', 'compact'];
    const currentIndex = modes.indexOf(viewMode.value);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]!);
  };

  // Initialisation
  onMounted(() => {
    loadViewMode();
  });

  return {
    viewMode: readonly(viewMode),
    setViewMode,
    cycleViewMode,
  };
};
