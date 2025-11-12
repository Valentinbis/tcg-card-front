import { useToast } from 'primevue/usetoast';
import type { UserCard, ApiResponse } from '~/types/api';

export function useUserCards() {
  const toast = useToast();

  /**
   * Ajoute une carte à la collection de l'utilisateur
   */
  const addCardToCollection = async (cardId: string, languages?: string[]) => {
    try {
      const response = await $fetch('/user/cards', {
        method: 'POST',
        body: {
          cardId,
          languages: languages || [],
        },
      });

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: (response as ApiResponse<UserCard>).message || 'Carte ajoutée à la collection',
        life: 3000,
      });

      return { success: true, data: (response as ApiResponse<UserCard>).data };
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: error.data?.error || "Impossible d'ajouter la carte",
        life: 3000,
      });
      return { success: false, error };
    }
  };

  /**
   * Retire une carte de la collection de l'utilisateur
   */
  const removeCardFromCollection = async (cardId: string) => {
    try {
      const response = await $fetch(`/user/cards/${cardId}`, {
        method: 'DELETE',
      });

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: (response as ApiResponse<null>).message || 'Carte retirée de la collection',
        life: 3000,
      });

      return { success: true };
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: error.data?.error || 'Impossible de retirer la carte',
        life: 3000,
      });
      return { success: false, error };
    }
  };

  /**
   * Met à jour les langues d'une carte
   */
  const updateCardLanguages = async (cardId: string, languages: string[]) => {
    try {
      const response = await $fetch(`/user/cards/${cardId}`, {
        method: 'PATCH',
        body: { languages },
      });

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: (response as ApiResponse<UserCard>).message || 'Carte modifiée',
        life: 3000,
      });

      return { success: true, data: (response as ApiResponse<UserCard>).data };
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: error.data?.error || 'Impossible de modifier la carte',
        life: 3000,
      });
      return { success: false, error };
    }
  };

  return {
    addCardToCollection,
    removeCardFromCollection,
    updateCardLanguages,
  };
}
