export interface ApiError {
  statusCode?: number;
  status?: number;
  data?: {
    error?: string;
    message?: string;
    retryAfter?: number;
  };
}

export interface ApiResponse<T> {
  data: globalThis.Ref<T | null>;
  pending: globalThis.Ref<boolean>;
  error: globalThis.Ref<ApiError | null>;
  refresh: () => Promise<void>;
}
