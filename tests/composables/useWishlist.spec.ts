import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { readonly } from 'vue';
import { useWishlist } from '~/composables/useWishlist';
import type { WishlistItem, WishlistStats } from '~/types/api';

// Mock PrimeVue useToast
const mockToastAdd = vi.fn();

// Mock global $fetch
const mockFetch = vi.fn();
global.$fetch = mockFetch as unknown as typeof $fetch;

// Mock useRuntimeConfig
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:8000/api/',
    },
  }),
}));

// Stub global useToast function
vi.stubGlobal('useToast', () => ({
  add: mockToastAdd,
}));

// Stub global readonly function
vi.stubGlobal('readonly', readonly);

describe('useWishlist', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('fetchWishlist', () => {
    it('should fetch wishlist items successfully', async () => {
      const mockItems: WishlistItem[] = [
        {
          id: 1,
          variant: 'normal',
          cardId: 'base1-4',
          priority: 5,
          notes: 'Need this card',
          maxPrice: 50.0,
          createdAt: '2024-11-14T10:00:00Z',
          updatedAt: '2024-11-14T10:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(mockItems);

      const { fetchWishlist, wishlistItems, isLoading } = useWishlist();

      expect(isLoading.value).toBe(false);

      const result = await fetchWishlist();

      expect(mockFetch).toHaveBeenCalledWith('/user/wishlist', {
        baseURL: 'http://localhost:8000/api/',
        credentials: 'include',
      });
      expect(result).toEqual(mockItems);
      expect(wishlistItems.value).toEqual(mockItems);
      expect(isLoading.value).toBe(false);
    });

    it('should apply filters when fetching wishlist', async () => {
      const mockItems: WishlistItem[] = [];
      mockFetch.mockResolvedValueOnce(mockItems);

      const { fetchWishlist } = useWishlist();

      await fetchWishlist({
        minPriority: 3,
        maxPrice: 100,
        orderBy: 'priority',
        direction: 'DESC',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/user/wishlist?minPriority=3&maxPrice=100&orderBy=priority&direction=DESC',
        {
          baseURL: 'http://localhost:8000/api/',
          credentials: 'include',
        }
      );
    });

    it('should handle errors when fetching wishlist', async () => {
      const mockError = {
        data: { message: 'Network error' },
      };
      mockFetch.mockRejectedValueOnce(mockError);

      const { fetchWishlist } = useWishlist();

      await expect(fetchWishlist()).rejects.toEqual(mockError);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Network error',
        life: 3000,
      });
    });

    it('should use default error message when no error message provided', async () => {
      mockFetch.mockRejectedValueOnce({});

      const { fetchWishlist } = useWishlist();

      await expect(fetchWishlist()).rejects.toEqual({});

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch wishlist',
        life: 3000,
      });
    });
  });

  describe('addToWishlist', () => {
    it('should add card to wishlist successfully', async () => {
      const mockItem: WishlistItem = {
        id: 1,
        variant: 'normal',
        cardId: 'base1-4',
        priority: 5,
        notes: 'Must have',
        maxPrice: 75.5,
        createdAt: '2024-11-14T10:00:00Z',
        updatedAt: '2024-11-14T10:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(mockItem);

      const { addToWishlist, wishlistItems } = useWishlist();

      const result = await addToWishlist('base1-4', 5, 'Must have', 75.5);

      expect(mockFetch).toHaveBeenCalledWith('/user/wishlist', {
        baseURL: 'http://localhost:8000/api/',
        method: 'POST',
        credentials: 'include',
        body: {
          cardId: 'base1-4',
          priority: 5,
          notes: 'Must have',
          maxPrice: 75.5,
          variant: 'normal',
        },
      });

      expect(result).toEqual(mockItem);
      expect(wishlistItems.value).toContainEqual(mockItem);
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Card added to wishlist',
        life: 3000,
      });
    });

    it('should add card with default priority when not specified', async () => {
      const mockItem: WishlistItem = {
        id: 1,
        variant: 'normal',
        cardId: 'base1-4',
        priority: 0,
        notes: undefined,
        maxPrice: undefined,
        createdAt: '2024-11-14T10:00:00Z',
        updatedAt: '2024-11-14T10:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(mockItem);

      const { addToWishlist } = useWishlist();

      await addToWishlist('base1-4');

      expect(mockFetch).toHaveBeenCalledWith('/user/wishlist', {
        baseURL: 'http://localhost:8000/api/',
        method: 'POST',
        credentials: 'include',
        body: {
          cardId: 'base1-4',
          priority: 0,
          notes: undefined,
          maxPrice: undefined,
          variant: 'normal',
        },
      });
    });

    it('should handle error when adding to wishlist', async () => {
      const mockError = {
        data: { error: 'Card already in wishlist' },
      };
      mockFetch.mockRejectedValueOnce(mockError);

      const { addToWishlist } = useWishlist();

      await expect(addToWishlist('base1-4')).rejects.toEqual(mockError);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Card already in wishlist',
        life: 3000,
      });
    });
  });

  describe('updateWishlistItem', () => {
    it('should update wishlist item successfully', async () => {
      const initialItem: WishlistItem = {
        id: 1,
        variant: 'normal',
        cardId: 'base1-4',
        priority: 3,
        notes: 'Old notes',
        maxPrice: 50,
        createdAt: '2024-11-14T10:00:00Z',
        updatedAt: '2024-11-14T10:00:00Z',
      };

      const updatedItem: WishlistItem = {
        ...initialItem,
        priority: 5,
        notes: 'Updated notes',
        maxPrice: 75,
        updatedAt: '2024-11-14T12:00:00Z',
      };

      mockFetch.mockResolvedValueOnce([initialItem]);
      mockFetch.mockResolvedValueOnce(updatedItem);

      const { fetchWishlist, updateWishlistItem, wishlistItems } = useWishlist();

      await fetchWishlist();
      const result = await updateWishlistItem('base1-4', {
        priority: 5,
        notes: 'Updated notes',
        maxPrice: 75,
      });

      expect(mockFetch).toHaveBeenLastCalledWith('/user/wishlist/base1-4', {
        baseURL: 'http://localhost:8000/api/',
        method: 'PATCH',
        credentials: 'include',
        body: {
          priority: 5,
          notes: 'Updated notes',
          maxPrice: 75,
        },
      });

      expect(result).toEqual(updatedItem);
      expect(wishlistItems.value[0]).toEqual(updatedItem);
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Wishlist item updated',
        life: 3000,
      });
    });

    it('should handle error when updating wishlist item', async () => {
      const mockError = {
        data: { error: 'Card not found in wishlist' },
      };
      mockFetch.mockRejectedValueOnce(mockError);

      const { updateWishlistItem } = useWishlist();

      await expect(updateWishlistItem('base1-4', { priority: 5 })).rejects.toEqual(mockError);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Card not found in wishlist',
        life: 3000,
      });
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove card from wishlist successfully', async () => {
      const mockItems: WishlistItem[] = [
        {
          id: 1,
          variant: 'normal',
          cardId: 'base1-4',
          priority: 5,
          notes: undefined,
          maxPrice: undefined,
          createdAt: '2024-11-14T10:00:00Z',
          updatedAt: '2024-11-14T10:00:00Z',
        },
        {
          id: 2,
          variant: 'normal',
          cardId: 'base1-16',
          priority: 3,
          notes: undefined,
          maxPrice: undefined,
          createdAt: '2024-11-14T11:00:00Z',
          updatedAt: '2024-11-14T11:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(mockItems);
      mockFetch.mockResolvedValueOnce(undefined);

      const { fetchWishlist, removeFromWishlist, wishlistItems } = useWishlist();

      await fetchWishlist();
      expect(wishlistItems.value).toHaveLength(2);

      await removeFromWishlist('base1-4');

      expect(mockFetch).toHaveBeenLastCalledWith('/user/wishlist/base1-4', {
        baseURL: 'http://localhost:8000/api/',
        method: 'DELETE',
        credentials: 'include',
      });

      expect(wishlistItems.value).toHaveLength(1);
      expect(wishlistItems.value[0]?.cardId).toBe('base1-16');
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Card removed from wishlist',
        life: 3000,
      });
    });

    it('should handle error when removing from wishlist', async () => {
      const mockError = {
        data: { error: 'Card not found' },
      };
      mockFetch.mockRejectedValueOnce(mockError);

      const { removeFromWishlist } = useWishlist();

      await expect(removeFromWishlist('base1-4')).rejects.toEqual(mockError);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Card not found',
        life: 3000,
      });
    });
  });

  describe('fetchWishlistStats', () => {
    it('should fetch wishlist statistics successfully', async () => {
      const mockStats: WishlistStats = {
        total: 42,
        byPriority: {
          0: 10,
          1: 8,
          3: 15,
          5: 9,
        },
      };

      mockFetch.mockResolvedValueOnce(mockStats);

      const { fetchWishlistStats, wishlistStats } = useWishlist();

      const result = await fetchWishlistStats();

      expect(mockFetch).toHaveBeenCalledWith('wishlist/stats', {
        baseURL: 'http://localhost:8000/api/',
        credentials: 'include',
      });

      expect(result).toEqual(mockStats);
      expect(wishlistStats.value).toEqual(mockStats);
    });

    it('should handle error when fetching stats', async () => {
      const mockError = {
        data: { message: 'Stats not available' },
      };
      mockFetch.mockRejectedValueOnce(mockError);

      const { fetchWishlistStats } = useWishlist();

      await expect(fetchWishlistStats()).rejects.toEqual(mockError);

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Stats not available',
        life: 3000,
      });
    });
  });

  describe('computed helpers', () => {
    it('should check if card is in wishlist', async () => {
      const mockItems: WishlistItem[] = [
        {
          id: 1,
          variant: 'normal',
          cardId: 'base1-4',
          priority: 5,
          notes: undefined,
          maxPrice: undefined,
          createdAt: '2024-11-14T10:00:00Z',
          updatedAt: '2024-11-14T10:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(mockItems);

      const { fetchWishlist, isInWishlist } = useWishlist();

      await fetchWishlist();

      expect(isInWishlist.value('base1-4')).toBe(true);
      expect(isInWishlist.value('base1-16')).toBe(false);
    });

    it('should get wishlist item by cardId', async () => {
      const mockItems: WishlistItem[] = [
        {
          id: 1,
          variant: 'normal',
          cardId: 'base1-4',
          priority: 5,
          notes: 'Important',
          maxPrice: 100,
          createdAt: '2024-11-14T10:00:00Z',
          updatedAt: '2024-11-14T10:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(mockItems);

      const { fetchWishlist, getWishlistItem } = useWishlist();

      await fetchWishlist();

      const item = getWishlistItem.value('base1-4');
      expect(item).toEqual(mockItems[0]);
      expect(item?.priority).toBe(5);
      expect(item?.notes).toBe('Important');

      const nonExistent = getWishlistItem.value('base1-999');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow: fetch, add, update, remove', async () => {
      // Initial fetch
      mockFetch.mockResolvedValueOnce([]);

      const {
        fetchWishlist,
        addToWishlist,
        updateWishlistItem,
        removeFromWishlist,
        wishlistItems,
      } = useWishlist();

      await fetchWishlist();
      expect(wishlistItems.value).toHaveLength(0);

      // Add item
      const newItem: WishlistItem = {
        id: 1,
        variant: 'normal',
        cardId: 'base1-4',
        priority: 3,
        notes: 'Want this',
        maxPrice: 50,
        createdAt: '2024-11-14T10:00:00Z',
        updatedAt: '2024-11-14T10:00:00Z',
      };
      mockFetch.mockResolvedValueOnce(newItem);
      await addToWishlist('base1-4', 3, 'Want this', 50);
      expect(wishlistItems.value).toHaveLength(1);

      // Update item
      const updatedItem: WishlistItem = {
        ...newItem,
        priority: 5,
        updatedAt: '2024-11-14T11:00:00Z',
      };
      mockFetch.mockResolvedValueOnce(updatedItem);
      await updateWishlistItem('base1-4', { priority: 5 });
      expect(wishlistItems.value[0]?.priority).toBe(5);

      // Remove item
      mockFetch.mockResolvedValueOnce(undefined);
      await removeFromWishlist('base1-4');
      expect(wishlistItems.value).toHaveLength(0);

      // Verify all toasts
      expect(mockToastAdd).toHaveBeenCalledTimes(3); // add, update, remove
    });
  });
});
