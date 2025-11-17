import { ref } from 'vue';
import type { Ref } from 'vue';

export interface CollectionItem {
  id?: number;
  cardId: string;
  variant: 'normal' | 'reverse' | 'holo';
  quantity: number;
  condition?: 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor';
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  prices?: Record<string, number | null>;
}

export interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  totalValue: number;
  countByCondition: Array<{ condition: string; count: number }>;
  valueByCondition: Array<{ condition: string; total_value: number }>;
}

export interface AddToCollectionPayload {
  cardId: string;
  variant: 'normal' | 'reverse' | 'holo';
  quantity?: number;
  condition?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
}

export interface UpdateCollectionPayload {
  quantity?: number;
  condition?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
  variant?: 'normal' | 'reverse' | 'holo';
}

export const useCollection = () => {
  const config = useRuntimeConfig();
  const toast = useToast();

  const collection: Ref<CollectionItem[]> = ref([]);
  const stats: Ref<CollectionStats | null> = ref(null);
  const loading = ref(false);

  /**
   * Récupère la collection de l'utilisateur
   */
  const fetchCollection = async (filters?: { condition?: string; minQuantity?: number }) => {
    loading.value = true;

    try {
      const queryParams = new URLSearchParams();

      if (filters?.condition) {
        queryParams.append('condition', filters.condition);
      }
      if (filters?.minQuantity) {
        queryParams.append('minQuantity', filters.minQuantity.toString());
      }

      const query = queryParams.toString();
      const url = `/collection${query ? `?${query}` : ''}`;

      const data = await $fetch<CollectionItem[]>(url, {
        baseURL: config.public.apiBase,
        credentials: 'include',
      });

      collection.value = data;
      return data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Erreur lors de la récupération de la collection';
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Récupère les statistiques de collection
   */
  const fetchStats = async () => {
    loading.value = true;

    try {
      const data = await $fetch<CollectionStats>('/collection/stats', {
        baseURL: config.public.apiBase,
        credentials: 'include',
      });

      stats.value = data;
      return data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Erreur lors de la récupération des statistiques';
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Ajoute une carte à la collection
   */
  const addToCollection = async (payload: AddToCollectionPayload) => {
    loading.value = true;

    try {
      const data = await $fetch<CollectionItem>('/collection', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        body: payload,
      });

      // Mise à jour de la collection locale
      const existingIndex = collection.value.findIndex(
        item => item.cardId === data.cardId && item.variant === data.variant
      );
      if (existingIndex >= 0) {
        collection.value[existingIndex] = data;
      } else {
        collection.value.push(data);
      }

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Carte ajoutée à la collection',
        life: 3000,
      });

      return data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || "Erreur lors de l'ajout à la collection";
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Met à jour une carte de la collection
   */
  const updateCollectionItem = async (cardId: string, payload: UpdateCollectionPayload) => {
    loading.value = true;

    try {
      const data = await $fetch<CollectionItem>(`/collection/${cardId}`, {
        baseURL: config.public.apiBase,
        method: 'PATCH',
        credentials: 'include',
        body: payload,
      });

      // Mise à jour de la collection locale
      const index = collection.value.findIndex(item => item.cardId === cardId);
      if (index >= 0) {
        collection.value[index] = data;
      }

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Collection mise à jour',
        life: 3000,
      });

      return data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Erreur lors de la mise à jour';
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Supprime une carte de la collection
   */
  const removeFromCollection = async (cardId: string) => {
    loading.value = true;

    try {
      await $fetch(`/collection/${cardId}`, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        credentials: 'include',
      });

      // Mise à jour de la collection locale
      collection.value = collection.value.filter(item => item.cardId !== cardId);

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Carte retirée de la collection',
        life: 3000,
      });

      return true;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Erreur lors de la suppression';
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Vérifie si une carte est dans la collection
   */
  const isInCollection = (cardId: string, variant?: 'normal' | 'reverse' | 'holo'): boolean => {
    if (variant) {
      return collection.value.some(item => item.cardId === cardId && item.variant === variant);
    }
    return collection.value.some(item => item.cardId === cardId);
  };

  /**
   * Récupère une carte spécifique de la collection
   */
  const getCollectionItem = (
    cardId: string,
    variant?: 'normal' | 'reverse' | 'holo'
  ): CollectionItem | undefined => {
    if (variant) {
      return collection.value.find(item => item.cardId === cardId && item.variant === variant);
    }
    return collection.value.find(item => item.cardId === cardId);
  };

  return {
    collection,
    stats,
    loading,
    fetchCollection,
    fetchStats,
    addToCollection,
    updateCollectionItem,
    removeFromCollection,
    isInCollection,
    getCollectionItem,
  };
};
