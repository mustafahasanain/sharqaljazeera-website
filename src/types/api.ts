export type ApiSuccessResponse<T> = {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
  readonly meta?: ResponseMeta;
};

export type ApiErrorResponse = {
  readonly success: false;
  readonly error: ApiError;
  readonly message: string;
  readonly meta?: ResponseMeta;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error codes
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT_EXCEEDED"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "BAD_REQUEST"
  | "TIMEOUT"
  | "NETWORK_ERROR";

// API error details
export type ApiError = {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly details?: ValidationError[] | Record<string, unknown>;
  readonly timestamp: string;
  readonly path?: string;
  readonly requestId?: string;
};

// Field validation error
export type ValidationError = {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly value?: unknown;
};

// Pagination info
export type PaginationMeta = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
};

export type PaginatedResponse<T> = {
  readonly items: readonly T[];
  readonly pagination: PaginationMeta;
};

export type PaginationParams = {
  readonly page?: number;
  readonly limit?: number;
  readonly offset?: number;
};

// Sorting & filtering
export type SortDirection = "asc" | "desc";

export type SortParams = {
  readonly sortBy?: string;
  readonly sortOrder?: SortDirection;
};

// Filter operators
export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "contains"
  | "startsWith"
  | "endsWith";

// Filter parameter
export type FilterParam = {
  readonly field: string;
  readonly operator: FilterOperator;
  readonly value: string | number | boolean | readonly (string | number)[];
};

// Response metadata
export type ResponseMeta = {
  readonly timestamp: string;
  readonly requestId?: string;
  readonly version?: string;
  readonly cached?: boolean;
  readonly cacheExpiry?: string;
};

// Common query parameters
export type ListQueryParams = PaginationParams &
  SortParams & {
    readonly search?: string;
    readonly filters?: readonly FilterParam[];
  };

// HTTP methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Request config
export type RequestConfig = {
  readonly method?: HttpMethod;
  readonly headers?: Record<string, string>;
  readonly params?: Record<string, string | number | boolean>;
  readonly timeout?: number;
  readonly withCredentials?: boolean;
};

// File upload types
export type FileUploadMeta = {
  readonly fileName: string;
  readonly fileSize: number;
  readonly mimeType: string;
  readonly url: string;
  readonly uploadedAt: string;
};

export type UploadResponse = {
  readonly file: FileUploadMeta;
  readonly thumbnails?: Record<string, string>;
};
