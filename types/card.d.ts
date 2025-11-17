export interface Card {
  id: string | number;
  name: string;
  nameFr?: string;
  number: string;
  rarity: string;
  image?: string;
  image_path?: string;
  images?: {
    small: string;
    large?: string;
  };
  owned?: boolean;
  hp?: number;
  type?: string;
  types?: string[];
  nationalPokedexNumbers?: number[];
  supertype?: string;
  subtypes?: string[];
  level?: string;
  attacks?: Array<{
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }>;
  abilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;
  weaknesses?: Array<{
    type: string;
    value: string;
  }>;
  resistances?: Array<{
    type: string;
    value: string;
  }>;
  retreatCost?: string[];
  rules?: string[];
  artist?: string;
  set?: {
    id: string;
    name: string;
    logo: string;
    releaseDate?: string;
    printedTotal?: number;
    total?: number;
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
      germanProLow?: number;
      suggestedPrice?: number;
      reverseHoloSell?: number;
      reverseHoloLow?: number;
      reverseHoloTrend?: number;
      lowPriceExPlus?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
      reverseHoloAvg1?: number;
      reverseHoloAvg7?: number;
      reverseHoloAvg30?: number;
    };
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      normal?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        directLow?: number;
      };
      holofoil?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        directLow?: number;
      };
      reverseHolofoil?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        directLow?: number;
      };
      usd?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        directLow?: number;
      };
    };
  };
  // Prix et valeurs
  marketPrice?: number;
  lowPrice?: number;
  highPrice?: number;
  averagePrice?: number;
  lastUpdated?: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface CardParams {
  page: number;
  limit: number;
  owned?: string;
  type?: string;
  number?: string;
}

export interface CardFilters {
  search?: string;
  set?: string;
  type?: string;
  rarity?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: 'low' | 'mid' | 'high';
}
