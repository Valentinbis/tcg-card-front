export interface UserCard {
  cardId: string;
  quantity: number;
  languages: string[];
  condition?: 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor';
  variant?: 'normal' | 'reverse' | 'holo';
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionItem extends UserCard {
  card: Card;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  prices?: Record<string, number | null>;
}

export interface CollectionStats {
  totalCards: number;
  totalValue: number;
  totalPurchaseValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  valueByCondition: Record<string, number>;
  valueByRarity: Record<string, number>;
  valueByType: Record<string, number>;
  averagePurchasePrice: number;
  averageCurrentValue: number;
}

export interface CollectionFilters {
  condition?: string;
  minQuantity?: number;
  minValue?: number;
  maxValue?: number;
  rarity?: string;
  type?: string;
  profitLoss?: 'profit' | 'loss' | 'break_even';
}
