import { Response } from 'express';
import { HTTP_STATUS } from './constants';
import { 
  ApiResponse, 
  PaginationInfo, 
  HttpStatusCode,
  PaginatedResponse,
  ErrorResponse 
} from '@/types/response.types';

// Re-export for backward compatibility
export type BaseResponse<T = any> = ApiResponse<T>;

// Success response options
export interface SuccessResponseOptions<T = any> {
  message?: string;
  data?: T;
  pagination?: PaginationInfo;
  statusCode?: HttpStatusCode;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}

// Error response options
export interface ErrorResponseOptions {
  message?: string;
  errors?: any;
  statusCode?: HttpStatusCode;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}

// Response Handler Class
class ResponseHandler {
  /**
   * Send a successful response
   */
  static success<T = any>(
    res: Response,
    options: SuccessResponseOptions<T> = {}
  ): Response<BaseResponse<T>> {
    const {
      message = 'Operation completed successfully',
      data,
      pagination,
      statusCode = HTTP_STATUS.OK,
      headers = {},
      metadata = {}
    } = options;

    // Set custom headers
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Set CORS headers for API responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const response: ApiResponse<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(pagination && { pagination }),
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T = any>(
    res: Response,
    data?: T,
    message: string = 'Resource created successfully',
    headers: Record<string, string> = {}
  ): Response<BaseResponse<T>> {
    return this.success(res, {
      data,
      message,
      statusCode: HTTP_STATUS.CREATED,
      headers
    });
  }

  /**
   * Send a paginated response
   */
  static paginated<T = any>(
    res: Response,
    data: T[],
    pagination: PaginationInfo,
    message: string = 'Data retrieved successfully',
    headers: Record<string, string> = {}
  ): Response<PaginatedResponse<T>> {
    return this.success(res, {
      data,
      pagination,
      message,
      headers
    });
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    options: ErrorResponseOptions = {}
  ): Response<BaseResponse> {
    const {
      message = 'An error occurred',
      errors,
      statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers = {},
      metadata = {}
    } = options;

    // Set custom headers
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Set CORS headers for API responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const response: ErrorResponse = {
      success: false,
      message,
      ...(errors && { errors }),
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a bad request error (400)
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    errors?: any,
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      errors,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers
    });
  }

  /**
   * Send an unauthorized error (401)
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access',
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      headers
    });
  }

  /**
   * Send a forbidden error (403)
   */
  static forbidden(
    res: Response,
    message: string = 'Access forbidden',
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      statusCode: HTTP_STATUS.FORBIDDEN,
      headers
    });
  }

  /**
   * Send a not found error (404)
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found',
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      statusCode: HTTP_STATUS.NOT_FOUND,
      headers
    });
  }

  /**
   * Send a conflict error (409)
   */
  static conflict(
    res: Response,
    message: string = 'Resource conflict',
    errors?: any,
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      errors,
      statusCode: HTTP_STATUS.CONFLICT,
      headers
    });
  }

  /**
   * Send a validation error (422)
   */
  static validationError(
    res: Response,
    message: string = 'Validation failed',
    errors?: any,
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      errors,
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      headers
    });
  }

  /**
   * Send an internal server error (500)
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error',
    errors?: any,
    headers: Record<string, string> = {}
  ): Response<BaseResponse> {
    return this.error(res, {
      message,
      errors,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers
    });
  }

  /**
   * Send a no content response (204)
   */
  static noContent(
    res: Response,
    headers: Record<string, string> = {}
  ): Response {
    // Set custom headers
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default ResponseHandler;
