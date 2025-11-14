import { ref, readonly } from 'vue';

interface PriceByLanguage {
  marketPrice?: number;
  lowPrice?: number;
  highPrice?: number;
  averagePrice?: number;
}

interface ApiPriceResponse {
  cardId: string;
  fr?: PriceByLanguage;
  en?: PriceByLanguage;
  jp?: PriceByLanguage;
  lastUpdated?: string;
  source?: string;
}

export interface PriceData {
  fr?: PriceByLanguage;
  en?: PriceByLanguage;
  jp?: PriceByLanguage;
  lastUpdated?: string;
}

export const usePriceService = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Récupération des prix depuis l'API backend
  const fetchCardPrices = async (cardId: string): Promise<PriceData> => {
    loading.value = true;
    error.value = null;

    try {
      const { $api } = useNuxtApp();
      const data = await $api<ApiPriceResponse>(`/cards/${cardId}/prices`);

      return {
        fr: data.fr,
        en: data.en,
        jp: data.jp,
        lastUpdated: data.lastUpdated,
      };
    } catch (err) {
      console.error('Erreur lors de la récupération des prix:', err);
      error.value = 'Erreur lors de la récupération des prix';
      // Fallback vers estimation
      return getEstimatedPrice('Common');
    } finally {
      loading.value = false;
    }
  };

  // Mise à jour des prix pour plusieurs cartes
  const fetchMultipleCardPrices = async (cardIds: string[]): Promise<Record<string, PriceData>> => {
    const results: Record<string, PriceData> = {};

    for (const cardId of cardIds) {
      try {
        results[cardId] = await fetchCardPrices(cardId);
      } catch (err) {
        console.error(`Erreur pour ${cardId}:`, err);
        results[cardId] = {};
      }
    }

    return results;
  };

  // Prix estimé basé sur la rareté
  const getEstimatedPrice = (rarity: string): PriceData => {
    const baseEstimates: Record<string, PriceByLanguage> = {
      Common: { marketPrice: 1.5, lowPrice: 0.5, highPrice: 3.0, averagePrice: 1.25 },
      Uncommon: { marketPrice: 4.0, lowPrice: 1.5, highPrice: 8.0, averagePrice: 3.5 },
      Rare: { marketPrice: 8.0, lowPrice: 3.0, highPrice: 15.0, averagePrice: 7.0 },
      'Rare Holo': { marketPrice: 15.0, lowPrice: 5.0, highPrice: 30.0, averagePrice: 12.5 },
      'Ultra Rare': { marketPrice: 25.0, lowPrice: 10.0, highPrice: 50.0, averagePrice: 20.0 },
      'Secret Rare': { marketPrice: 50.0, lowPrice: 20.0, highPrice: 150.0, averagePrice: 45.0 },
      '1st Edition': { marketPrice: 100.0, lowPrice: 50.0, highPrice: 300.0, averagePrice: 90.0 },
    };

    const estimate = baseEstimates[rarity] || {
      marketPrice: 2.0,
      lowPrice: 1.0,
      highPrice: 5.0,
      averagePrice: 2.0,
    };

    return {
      fr: estimate,
      en: estimate,
      jp: estimate,
    };
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchCardPrices,
    fetchMultipleCardPrices,
    getEstimatedPrice,
  };
};
