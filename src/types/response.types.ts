// API Response types for consistent typing across the application

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  pagination?: PaginationInfo;
  metadata?: ResponseMetadata;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit?: number;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId?: string;
  version?: string;
  environment?: string;
  [key: string]: any;
}

export interface ErrorDetails {
  field?: string;
  code?: string;
  message: string;
  value?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

// Success Response Types
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  success: true;
  data: T[];
  pagination: PaginationInfo;
}

export interface CreatedResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

// Error Response Types
export interface ErrorResponse extends ApiResponse {
  success: false;
  errors?: ErrorDetails[] | any;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
}

// HTTP Status Code Types
export type HttpStatusCode = 
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503; // Service Unavailable 