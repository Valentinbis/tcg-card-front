import { defineStore } from 'pinia';

export interface UserCard {
  cardId: string;
  quantity: number;
  languages: string[];
}

export const useCollectionStore = defineStore('collection-store', () => {
  // State
  const userCards = ref<UserCard[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchUserCards = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useAPI<UserCard[]>('user/cards', {
        method: 'GET',
        default: () => [],
      });

      if (fetchError.value) {
        error.value = fetchError.value.data?.message || 'Erreur lors du chargement de la collection';
        return;
      }

      if (data.value) {
        userCards.value = data.value;
      }
    } catch (err: any) {
      console.error('Fetch user cards error:', err);
      error.value = 'Une erreur est survenue';
    } finally {
      loading.value = false;
    }
  };

  const addCardToCollection = async (cardId: string, quantity: number = 1, languages: string[] = ['fr']) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useAPI('user/cards', {
        method: 'POST',
        body: {
          cardId,
          quantity,
          languages,
        },
        default: () => null,
      });

      if (fetchError.value) {
        error.value = fetchError.value.data?.message || 'Erreur lors de l\'ajout de la carte';
        return false;
      }

      // Rafraîchir la collection
      await fetchUserCards();
      return true;
    } catch (err: any) {
      console.error('Add card error:', err);
      error.value = 'Une erreur est survenue';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateCardInCollection = async (cardId: string, quantity: number, languages: string[]) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useAPI(`user/cards/${cardId}`, {
        method: 'PUT',
        body: {
          quantity,
          languages,
        },
        default: () => null,
      });

      if (fetchError.value) {
        error.value = fetchError.value.data?.message || 'Erreur lors de la mise à jour';
        return false;
      }

      // Rafraîchir la collection
      await fetchUserCards();
      return true;
    } catch (err: any) {
      console.error('Update card error:', err);
      error.value = 'Une erreur est survenue';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const removeCardFromCollection = async (cardId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: fetchError } = await useAPI(`user/cards/${cardId}`, {
        method: 'DELETE',
        default: () => null,
      });

      if (fetchError.value) {
        error.value = fetchError.value.data?.message || 'Erreur lors de la suppression';
        return false;
      }

      // Rafraîchir la collection
      await fetchUserCards();
      return true;
    } catch (err: any) {
      console.error('Remove card error:', err);
      error.value = 'Une erreur est survenue';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const hasCard = (cardId: string): boolean => {
    return userCards.value.some(uc => uc.cardId === cardId);
  };

  const getCardQuantity = (cardId: string): number => {
    const userCard = userCards.value.find(uc => uc.cardId === cardId);
    return userCard?.quantity || 0;
  };

  return {
    // State
    userCards,
    loading,
    error,
    
    // Actions
    fetchUserCards,
    addCardToCollection,
    updateCardInCollection,
    removeCardFromCollection,
    
    // Getters
    hasCard,
    getCardQuantity,
  };
}, {
  persist: true,
});
