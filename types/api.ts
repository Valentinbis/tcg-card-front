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
  userId: number;
  cardId: number;
  languages?: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
