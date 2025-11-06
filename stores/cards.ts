import { defineStore } from 'pinia';
import type { UseApiResponse } from '~/types/api';
import type { Card, CardFilters } from '~/types/card';

export const useCardsStore = defineStore('cards-store', () => {
  // State
  const cards = ref<Card[]>([]);
  const selectedCard = ref<Card | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Filters
  const filters = ref<CardFilters>({
    search: '',
    set: undefined,
    type: undefined,
    rarity: undefined,
    page: 1,
    limit: 20,
  });

  // Actions
  const fetchCards = async (newFilters?: CardFilters) => {
    loading.value = true;
    error.value = null;

    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }

    try {
      const { data, error: fetchError } = (await useAPI('cards', {
        method: 'GET',
        params: filters.value,
        default: () => ({ data: [], pagination: {} }),
      })) as UseApiResponse<{
        data: Card[];
        pagination: {
          currentPage?: number;
          totalPages?: number;
          totalItems?: number;
          itemsPerPage?: number;
        };
      }>;

      if (fetchError.value) {
        error.value = fetchError.value.data?.message || 'Erreur lors du chargement des cartes';
        return;
      }

      if (data.value) {
        cards.value = data.value.data || [];
        pagination.value = {
          currentPage: data.value.pagination?.currentPage || 1,
          totalPages: data.value.pagination?.totalPages || 1,
          totalItems: data.value.pagination?.totalItems || 0,
          itemsPerPage: data.value.pagination?.itemsPerPage || 20,
        };
      }
    } catch (err) {
      console.error('Fetch cards error:', err);
      error.value = 'Une erreur est survenue';
    } finally {
      loading.value = false;
    }
  };

  const fetchCardById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = (await useAPI(`cards/${id}`, {
        method: 'GET',
        default: () => null,
      })) as UseApiResponse<Card>;

      if (fetchError.value) {
        error.value = fetchError.value.data?.message || 'Erreur lors du chargement de la carte';
        return null;
      }

      if (data.value) {
        selectedCard.value = data.value;
        return data.value;
      }
    } catch (err) {
      console.error('Fetch card error:', err);
      error.value = 'Une erreur est survenue';
    } finally {
      loading.value = false;
    }

    return null;
  };

  const setFilters = (newFilters: CardFilters) => {
    filters.value = { ...filters.value, ...newFilters, page: 1 };
    fetchCards();
  };

  const clearFilters = () => {
    filters.value = {
      search: '',
      set: undefined,
      type: undefined,
      rarity: undefined,
      page: 1,
      limit: 20,
    };
    fetchCards();
  };

  const nextPage = () => {
    if (pagination.value.currentPage < pagination.value.totalPages) {
      filters.value.page = pagination.value.currentPage + 1;
      fetchCards();
    }
  };

  const previousPage = () => {
    if (pagination.value.currentPage > 1) {
      filters.value.page = pagination.value.currentPage - 1;
      fetchCards();
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      filters.value.page = page;
      fetchCards();
    }
  };

  return {
    // State
    cards,
    selectedCard,
    loading,
    error,
    pagination,
    filters,

    // Actions
    fetchCards,
    fetchCardById,
    setFilters,
    clearFilters,
    nextPage,
    previousPage,
    goToPage,
  };
});
