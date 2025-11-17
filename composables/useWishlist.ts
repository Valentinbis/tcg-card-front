import type { WishlistItem, WishlistStats } from '~/types/api';

export const useWishlist = () => {
  const config = useRuntimeConfig();
  const toast = useToast();

  const isLoading = ref(false);
  const wishlistItems = ref<WishlistItem[]>([]);
  const wishlistStats = ref<WishlistStats | null>(null);

  /**
   * Récupère la wishlist de l'utilisateur
   */
  const fetchWishlist = async (
    filters: {
      minPriority?: number;
      maxPrice?: number;
      orderBy?: 'priority' | 'createdAt' | 'maxPrice';
      direction?: 'ASC' | 'DESC';
    } = {}
  ) => {
    isLoading.value = true;
    try {
      const queryParams = new URLSearchParams();

      if (filters.minPriority !== undefined) {
        queryParams.append('minPriority', filters.minPriority.toString());
      }
      if (filters.maxPrice !== undefined) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.orderBy) {
        queryParams.append('orderBy', filters.orderBy);
      }
      if (filters.direction) {
        queryParams.append('direction', filters.direction);
      }

      const query = queryParams.toString();
      const url = `/user/wishlist${query ? `?${query}` : ''}`;

      const data = await $fetch<WishlistItem[]>(url, {
        baseURL: config.public.apiBase,
        credentials: 'include',
      });

      wishlistItems.value = data;
      return data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Failed to fetch wishlist';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Ajoute une carte à la wishlist
   */
  const addToWishlist = async (
    cardId: string,
    priority: number = 0,
    notes?: string,
    maxPrice?: number,
    variant: 'normal' | 'reverse' | 'holo' = 'normal'
  ) => {
    isLoading.value = true;
    try {
      const data = await $fetch<WishlistItem>('/user/wishlist', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: {
          cardId,
          priority,
          notes,
          maxPrice,
          variant,
        },
      });

      wishlistItems.value.push(data);

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Card added to wishlist',
        life: 3000,
      });

      return data;
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } };
      const errorMessage = err?.data?.error || 'Failed to add card to wishlist';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Met à jour un élément de la wishlist
   */
  const updateWishlistItem = async (
    cardId: string,
    updates: {
      priority?: number;
      notes?: string;
      maxPrice?: number;
      variant?: 'normal' | 'reverse' | 'holo';
    }
  ) => {
    isLoading.value = true;
    try {
      const data = await $fetch<WishlistItem>(`/user/wishlist/${cardId}`, {
        baseURL: config.public.apiBase,
        method: 'PATCH',
        credentials: 'include',
        body: updates,
      });

      // Met à jour l'élément dans le tableau local
      const index = wishlistItems.value.findIndex(item => item.cardId === cardId);
      if (index !== -1) {
        wishlistItems.value[index] = data;
      }

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Wishlist item updated',
        life: 3000,
      });

      return data;
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } };
      const errorMessage = err?.data?.error || 'Failed to update wishlist item';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Retire une carte de la wishlist
   */
  const removeFromWishlist = async (cardId: string) => {
    isLoading.value = true;
    try {
      await $fetch(`/user/wishlist/${cardId}`, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        credentials: 'include',
      });

      // Retire l'élément du tableau local
      wishlistItems.value = wishlistItems.value.filter(item => item.cardId !== cardId);

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Card removed from wishlist',
        life: 3000,
      });
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } };
      const errorMessage = err?.data?.error || 'Failed to remove card from wishlist';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Récupère les statistiques de la wishlist
   */
  const fetchWishlistStats = async () => {
    try {
      const data = await $fetch<WishlistStats>('/api/wishlist/stats', {
        baseURL: config.public.apiBase,
        credentials: 'include',
      });

      wishlistStats.value = data;
      return data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Failed to fetch wishlist stats';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    }
  };

  /**
   * Vérifie si une carte est dans la wishlist
   */
  const isInWishlist = computed(() => {
    return (cardId: string) => {
      return wishlistItems.value.some(item => item.cardId === cardId);
    };
  });

  /**
   * Obtient un élément de la wishlist par cardId
   */
  const getWishlistItem = computed(() => {
    return (cardId: string) => {
      return wishlistItems.value.find(item => item.cardId === cardId);
    };
  });

  return {
    // State
    isLoading: readonly(isLoading),
    wishlistItems: readonly(wishlistItems),
    wishlistStats: readonly(wishlistStats),

    // Methods
    fetchWishlist,
    addToWishlist,
    updateWishlistItem,
    removeFromWishlist,
    fetchWishlistStats,

    // Computed
    isInWishlist,
    getWishlistItem,
  };
};
