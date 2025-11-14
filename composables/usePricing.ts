import { ref } from 'vue';
import type { Card } from '~/types/card';
import type { CollectionItem, CollectionStats } from '~/types/collection';

export const usePricing = () => {
  const currency = ref('EUR');
  const currencySymbol = ref('€');

  // Formatage des prix
  const formatPrice = (price: number | undefined | null, decimals = 2): string => {
    if (price === undefined || price === null || isNaN(price)) {
      return '-';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.value,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  };

  // Calcul de la valeur actuelle d'une carte
  const getCurrentValue = (card: Card): number | undefined => {
    // Priorité : marketPrice > averagePrice > lowPrice
    return card.marketPrice ?? card.averagePrice ?? card.lowPrice;
  };

  // Calcul du profit/perte pour un item de collection
  const calculateProfitLoss = (item: CollectionItem) => {
    const currentValue = getCurrentValue(item.card);
    if (!currentValue || !item.purchasePrice) return null;

    const totalCurrentValue = currentValue * item.quantity;
    const totalPurchaseValue = item.purchasePrice * item.quantity;

    const profitLoss = totalCurrentValue - totalPurchaseValue;
    const profitLossPercentage = (profitLoss / totalPurchaseValue) * 100;

    return {
      currentValue: totalCurrentValue,
      purchaseValue: totalPurchaseValue,
      profitLoss,
      profitLossPercentage,
    };
  };

  // Calcul des statistiques de collection
  const calculateCollectionStats = (items: CollectionItem[]): CollectionStats => {
    let totalCards = 0;
    let totalValue = 0;
    let totalPurchaseValue = 0;

    const valueByCondition: Record<string, number> = {};
    const valueByRarity: Record<string, number> = {};
    const valueByType: Record<string, number> = {};

    items.forEach(item => {
      const currentValue = getCurrentValue(item.card);
      if (currentValue) {
        const itemValue = currentValue * item.quantity;
        totalValue += itemValue;
        totalCards += item.quantity;

        // Par condition
        const condition = item.condition || 'unknown';
        valueByCondition[condition] = (valueByCondition[condition] || 0) + itemValue;

        // Par rareté
        const rarity = item.card.rarity || 'unknown';
        valueByRarity[rarity] = (valueByRarity[rarity] || 0) + itemValue;

        // Par type
        const type = item.card.type || 'unknown';
        valueByType[type] = (valueByType[type] || 0) + itemValue;
      }

      // Valeur d'achat
      if (item.purchasePrice) {
        totalPurchaseValue += item.purchasePrice * item.quantity;
      }
    });

    const profitLoss = totalValue - totalPurchaseValue;
    const profitLossPercentage =
      totalPurchaseValue > 0 ? (profitLoss / totalPurchaseValue) * 100 : 0;

    return {
      totalCards,
      totalValue,
      totalPurchaseValue,
      profitLoss,
      profitLossPercentage,
      valueByCondition,
      valueByRarity,
      valueByType,
      averagePurchasePrice: totalCards > 0 ? totalPurchaseValue / totalCards : 0,
      averageCurrentValue: totalCards > 0 ? totalValue / totalCards : 0,
    };
  };

  // Couleur pour le profit/perte
  const getProfitLossColor = (percentage: number): string => {
    if (percentage > 0) return 'text-green-600 dark:text-green-400';
    if (percentage < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Badge pour le profit/perte
  const getProfitLossBadge = (percentage: number): { severity: string; icon: string } => {
    if (percentage > 10) return { severity: 'success', icon: 'pi pi-arrow-up' };
    if (percentage > 0) return { severity: 'info', icon: 'pi pi-plus' };
    if (percentage < -10) return { severity: 'danger', icon: 'pi pi-arrow-down' };
    if (percentage < 0) return { severity: 'warning', icon: 'pi pi-minus' };
    return { severity: 'secondary', icon: 'pi pi-minus' };
  };

  // Prix par rareté (estimation)
  const getEstimatedPriceByRarity = (rarity: string): { min: number; max: number } => {
    const rarityPrices: Record<string, { min: number; max: number }> = {
      Common: { min: 0.1, max: 0.5 },
      Uncommon: { min: 0.2, max: 1.0 },
      Rare: { min: 0.5, max: 3.0 },
      'Rare Holo': { min: 1.0, max: 10.0 },
      'Ultra Rare': { min: 5.0, max: 50.0 },
      'Secret Rare': { min: 10.0, max: 200.0 },
      '1st Edition': { min: 20.0, max: 500.0 },
    };

    return rarityPrices[rarity] || { min: 0.1, max: 5.0 };
  };

  return {
    currency,
    currencySymbol,
    formatPrice,
    getCurrentValue,
    calculateProfitLoss,
    calculateCollectionStats,
    getProfitLossColor,
    getProfitLossBadge,
    getEstimatedPriceByRarity,
  };
};
