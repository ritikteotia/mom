// ─── API Response TypeScript Interfaces ─────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Helper to create a successful response */
export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

/** Helper to create an error response */
export function errorResponse(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}
