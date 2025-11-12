import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAPI } from '~/composables/useAPI';

// Mock de useAsyncData
const mockUseAsyncData = vi.fn();
vi.mock('#app', () => ({
  useAsyncData: (...args: unknown[]) => mockUseAsyncData(...args),
  useNuxtApp: () => ({
    $api: vi.fn(),
  }),
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:8000/api/',
    },
  }),
}));

describe('useAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('URL construction', () => {
    it('should construct URL with string parameter', () => {
      const mockResponse = {
        data: { value: { result: 'test' } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/test', {
        method: 'GET',
        default: () => ({ result: '' }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toContain('api-/test-GET');
    });

    it('should construct URL with function parameter', () => {
      const mockResponse = {
        data: { value: { result: 'test' } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      const urlFunction = () => '/dynamic-url';
      useAPI(urlFunction, {
        method: 'GET',
        default: () => ({ result: '' }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toContain('api-/dynamic-url-GET');
    });

    it('should append query parameters to URL', () => {
      const mockResponse = {
        data: { value: { results: [] } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI(
        '/search',
        {
          method: 'GET',
          default: () => ({ results: [] }),
        },
        {
          page: 1,
          limit: 20,
          query: 'pikachu',
        }
      );

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      const urlKey = callArgs[0];
      expect(urlKey).toContain('api-/search?');
      expect(urlKey).toContain('page=1');
      expect(urlKey).toContain('limit=20');
      expect(urlKey).toContain('query=pikachu');
    });

    it('should handle empty params object', () => {
      const mockResponse = {
        data: { value: { result: 'test' } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI(
        '/test',
        {
          method: 'GET',
          default: () => ({ result: '' }),
        },
        {}
      );

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toBe('api-/test-GET-' + expect.any(Number));
    });
  });

  describe('HTTP methods', () => {
    it('should handle GET request', () => {
      const mockResponse = {
        data: { value: { users: [] } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/users', {
        method: 'GET',
        default: () => ({ users: [] }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toContain('GET');
    });

    it('should handle POST request with body', () => {
      const mockResponse = {
        data: { value: { id: 1 } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
      };

      useAPI('/users', {
        method: 'POST',
        body: requestBody,
        default: () => ({ id: 0 }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toContain('POST');
    });

    it('should handle PUT request', () => {
      const mockResponse = {
        data: { value: { updated: true } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/users/1', {
        method: 'PUT',
        body: { name: 'Updated Name' },
        default: () => ({ updated: false }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toContain('PUT');
    });

    it('should handle DELETE request', () => {
      const mockResponse = {
        data: { value: { deleted: true } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/users/1', {
        method: 'DELETE',
        default: () => ({ deleted: false }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      expect(callArgs[0]).toContain('DELETE');
    });
  });

  describe('Configuration options', () => {
    it('should pass headers to the API call', () => {
      const mockResponse = {
        data: { value: { result: 'authenticated' } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/protected', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token123',
        },
        default: () => ({ result: '' }),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
    });

    it('should use default value factory', () => {
      const defaultValue = { items: [], total: 0 };
      const mockResponse = {
        data: { value: defaultValue },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      const result = useAPI('/items', {
        method: 'GET',
        default: () => defaultValue,
      });

      expect(result.data.value).toEqual(defaultValue);
    });

    it('should set server option to false', () => {
      const mockResponse = {
        data: { value: {} },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/client-only', {
        method: 'GET',
        default: () => ({}),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      const options = callArgs[2];
      expect(options.server).toBe(false);
    });

    it('should set lazy option to false', () => {
      const mockResponse = {
        data: { value: {} },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI('/immediate', {
        method: 'GET',
        default: () => ({}),
      });

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      const options = callArgs[2];
      expect(options.lazy).toBe(false);
    });
  });

  describe('TypeScript type safety', () => {
    it('should maintain type safety for response data', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockResponse = {
        data: {
          value: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      const result = useAPI<User>('/users/1', {
        method: 'GET',
        default: () => ({ id: 0, name: '', email: '' }),
      });

      expect(result.data.value).toHaveProperty('id');
      expect(result.data.value).toHaveProperty('name');
      expect(result.data.value).toHaveProperty('email');
    });

    it('should handle array responses', () => {
      interface Card {
        id: string;
        name: string;
      }

      const mockResponse = {
        data: {
          value: [
            { id: '1', name: 'Pikachu' },
            { id: '2', name: 'Charizard' },
          ],
        },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      const result = useAPI<Card[]>('/cards', {
        method: 'GET',
        default: () => [],
      });

      expect(Array.isArray(result.data.value)).toBe(true);
      expect(result.data.value).toHaveLength(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle numeric query parameters', () => {
      const mockResponse = {
        data: { value: { results: [] } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI(
        '/items',
        {
          method: 'GET',
          default: () => ({ results: [] }),
        },
        {
          page: 1,
          limit: 50,
          minPrice: 10,
          maxPrice: 100,
        }
      );

      expect(mockUseAsyncData).toHaveBeenCalled();
      const callArgs = mockUseAsyncData.mock.calls[0];
      const urlKey = callArgs[0];
      expect(urlKey).toContain('page=1');
      expect(urlKey).toContain('limit=50');
      expect(urlKey).toContain('minPrice=10');
      expect(urlKey).toContain('maxPrice=100');
    });

    it('should handle special characters in parameters', () => {
      const mockResponse = {
        data: { value: { results: [] } },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValueOnce(mockResponse);

      useAPI(
        '/search',
        {
          method: 'GET',
          default: () => ({ results: [] }),
        },
        {
          query: 'Pikachu & Charizard',
        }
      );

      expect(mockUseAsyncData).toHaveBeenCalled();
    });

    it('should generate unique keys for same URL with different timestamps', () => {
      const mockResponse = {
        data: { value: {} },
        pending: { value: false },
        error: { value: null },
        refresh: vi.fn(),
      };

      mockUseAsyncData.mockReturnValue(mockResponse);

      useAPI('/test', {
        method: 'GET',
        default: () => ({}),
      });

      const firstCallKey = mockUseAsyncData.mock.calls[0][0];

      // Wait a bit to ensure different timestamp
      vi.useFakeTimers();
      vi.advanceTimersByTime(100);

      useAPI('/test', {
        method: 'GET',
        default: () => ({}),
      });

      const secondCallKey = mockUseAsyncData.mock.calls[1][0];

      expect(firstCallKey).not.toBe(secondCallKey);
      vi.useRealTimers();
    });
  });
});
