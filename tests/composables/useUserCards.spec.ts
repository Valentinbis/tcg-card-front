import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUserCards } from '~/composables/useUserCards';
import type { ApiResponse, UserCard } from '~/types/api';

// Mock de PrimeVue useToast
const mockToastAdd = vi.fn();
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: mockToastAdd,
  }),
}));

// Mock de useRuntimeConfig
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:8000/api',
    },
  }),
}));

// Mock de $fetch
const mockFetch = vi.fn();
global.$fetch = mockFetch as unknown as typeof $fetch;

describe('useUserCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('addCardToCollection', () => {
    it('should add a card successfully and show success toast', async () => {
      const mockResponse: ApiResponse<UserCard> = {
        success: true,
        message: 'Carte ajoutée avec succès',
        data: {
          id: 1,
          userId: 1,
          cardId: 'base1-1',
          languages: ['fr'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { addCardToCollection } = useUserCards();
      const result = await addCardToCollection('base1-1', ['fr']);

      expect(mockFetch).toHaveBeenCalledWith('/user/cards', {
        method: 'POST',
        body: { cardId: 'base1-1', languages: ['fr'] },
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Carte ajoutée avec succès',
        life: 3000,
      });
    });

    it('should handle API error and show error toast', async () => {
      const mockError = {
        data: {
          error: 'Carte déjà dans la collection',
        },
      };

      mockFetch.mockRejectedValueOnce(mockError);

      const { addCardToCollection } = useUserCards();
      const result = await addCardToCollection('base1-1', ['fr']);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Carte déjà dans la collection',
        life: 3000,
      });
    });

    it('should handle unknown error with default message', async () => {
      const mockError = new Error('Network error');

      mockFetch.mockRejectedValueOnce(mockError);

      const { addCardToCollection } = useUserCards();
      const result = await addCardToCollection('base1-1', ['fr']);

      expect(result.success).toBe(false);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: "Impossible d'ajouter la carte",
        life: 3000,
      });
    });

    it('should add card with multiple languages', async () => {
      const mockResponse: ApiResponse<UserCard> = {
        success: true,
        message: 'Carte ajoutée',
        data: {
          id: 1,
          userId: 1,
          cardId: 'base1-1',
          languages: ['fr', 'reverse', 'jap'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { addCardToCollection } = useUserCards();
      const result = await addCardToCollection('base1-1', ['fr', 'reverse', 'jap']);

      expect(mockFetch).toHaveBeenCalledWith('/user/cards', {
        method: 'POST',
        body: { cardId: 'base1-1', languages: ['fr', 'reverse', 'jap'] },
      });

      expect(result.success).toBe(true);
      expect(result.data?.languages).toHaveLength(3);
    });
  });

  describe('removeCardFromCollection', () => {
    it('should remove a card successfully', async () => {
      const mockResponse: ApiResponse<null> = {
        success: true,
        message: 'Carte retirée avec succès',
        data: null,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { removeCardFromCollection } = useUserCards();
      const result = await removeCardFromCollection('base1-1');

      expect(mockFetch).toHaveBeenCalledWith('/user/cards/base1-1', {
        method: 'DELETE',
      });

      expect(result.success).toBe(true);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Carte retirée avec succès',
        life: 3000,
      });
    });

    it('should handle removal error', async () => {
      const mockError = {
        data: {
          error: 'Carte non trouvée',
        },
      };

      mockFetch.mockRejectedValueOnce(mockError);

      const { removeCardFromCollection } = useUserCards();
      const result = await removeCardFromCollection('invalid-id');

      expect(result.success).toBe(false);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Carte non trouvée',
        life: 3000,
      });
    });
  });

  describe('updateCardLanguages', () => {
    it('should update card languages successfully', async () => {
      const mockResponse: ApiResponse<UserCard> = {
        success: true,
        message: 'Langues mises à jour',
        data: {
          id: 1,
          userId: 1,
          cardId: 'base1-1',
          languages: ['fr', 'jap'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { updateCardLanguages } = useUserCards();
      const result = await updateCardLanguages('base1-1', ['fr', 'jap']);

      expect(mockFetch).toHaveBeenCalledWith('/user/cards/base1-1', {
        method: 'PATCH',
        body: { languages: ['fr', 'jap'] },
      });

      expect(result.success).toBe(true);
      expect(result.data?.languages).toEqual(['fr', 'jap']);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Langues mises à jour',
        life: 3000,
      });
    });

    it('should handle update error', async () => {
      const mockError = {
        data: {
          error: 'Validation échouée',
        },
      };

      mockFetch.mockRejectedValueOnce(mockError);

      const { updateCardLanguages } = useUserCards();
      const result = await updateCardLanguages('base1-1', []);

      expect(result.success).toBe(false);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Validation échouée',
        life: 3000,
      });
    });

    it('should remove all languages from a card', async () => {
      const mockResponse: ApiResponse<UserCard> = {
        success: true,
        message: 'Langues supprimées',
        data: {
          id: 1,
          userId: 1,
          cardId: 'base1-1',
          languages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { updateCardLanguages } = useUserCards();
      const result = await updateCardLanguages('base1-1', []);

      expect(result.success).toBe(true);
      expect(result.data?.languages).toEqual([]);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle sequential operations', async () => {
      // Add card
      const addResponse: ApiResponse<UserCard> = {
        success: true,
        message: 'Carte ajoutée',
        data: {
          id: 1,
          userId: 1,
          cardId: 'base1-1',
          languages: ['fr'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      // Update card
      const updateResponse: ApiResponse<UserCard> = {
        success: true,
        message: 'Langues mises à jour',
        data: {
          id: 1,
          userId: 1,
          cardId: 'base1-1',
          languages: ['fr', 'jap'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      // Remove card
      const removeResponse: ApiResponse<null> = {
        success: true,
        message: 'Carte retirée',
        data: null,
      };

      mockFetch
        .mockResolvedValueOnce(addResponse)
        .mockResolvedValueOnce(updateResponse)
        .mockResolvedValueOnce(removeResponse);

      const { addCardToCollection, updateCardLanguages, removeCardFromCollection } = useUserCards();

      // Add
      const addResult = await addCardToCollection('base1-1', ['fr']);
      expect(addResult.success).toBe(true);
      expect(mockToastAdd).toHaveBeenCalledTimes(1);

      // Update
      const updateResult = await updateCardLanguages('base1-1', ['fr', 'jap']);
      expect(updateResult.success).toBe(true);
      expect(mockToastAdd).toHaveBeenCalledTimes(2);

      // Remove
      const removeResult = await removeCardFromCollection('base1-1');
      expect(removeResult.success).toBe(true);
      expect(mockToastAdd).toHaveBeenCalledTimes(3);
    });
  });
});
