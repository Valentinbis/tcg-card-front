export interface UserStats {
  totalCards: number;
  totalOwnedCards: number;
  completionPercentage: number;
  totalValue: number;
  favoriteType: string;
  joinDate: string;
}

export interface SetStats {
  id: string;
  name: string;
  series: string;
  total: number;
  owned: number;
  percentage: number;
  printedTotal: number;
  releaseDate: string;
}

export interface CollectionStats {
  sets: SetStats[];
}

export interface UserSettings {
  cardsPerPage: number;
  defaultView: 'grid' | 'list';
  defaultLanguage: string;
  showCardNumbers: boolean;
  showPrices: boolean;
  emailNotifications: boolean;
  newCardAlerts: boolean;
  priceDropAlerts: boolean;
  weeklyReport: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  showCollection: boolean;
  showWishlist: boolean;
}

export interface UserCard {
  id?: number;
  userId: number;
  cardId: string;
  languages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistItem {
  id: number;
  cardId: string;
  cardName?: string;
  cardImage?: string;
  variant: 'normal' | 'reverse' | 'holo';
  priority: number;
  notes?: string;
  maxPrice?: number;
  createdAt: string;
  updatedAt: string;
  prices?: Record<string, number | null>;
}

export interface WishlistStats {
  total: number;
  byPriority: Record<number, number>;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UseApiResponse<T> {
  data: Ref<T | null>;
  pending: Ref<boolean>;
  error: Ref<Error | null>;
  refresh: () => Promise<void>;
}
