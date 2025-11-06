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
  owned_languages?: string[];
  hp?: number;
  type?: string;
  types?: string[];
  nationalPokedexNumbers?: number[];
  set?: {
    id: string;
    name: string;
    logo: string;
  };
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
  lang?: string;
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
}
