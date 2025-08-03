import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/utils/constants';
import ResponseHandler from '@/utils/responseHandler';
import { HttpStatusCode } from '@/types/response.types';
import { logServerFailure } from '@/utils/logServerFailure';
import { ErrorType } from '@/types/schemaHelper';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const sendErrorDev = (err: AppError, res: Response, req: Request): void => {
  // Log error to database in development
  logServerFailure({
    message: err.message,
    error: err,
    path: req.originalUrl || req.url || 'unknown',
    type: err.statusCode && err.statusCode >= 500 ? ErrorType.CRITICAL : ErrorType.NORMAL,
    metadata: {
      environment: 'development',
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    }
  }).catch(logError => {
    console.error('Failed to log error to database:', logError);
  });

  ResponseHandler.error(res, {
    message: err.message,
    statusCode: (err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR) as HttpStatusCode,
    errors: {
      stack: err.stack,
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational
    },
    metadata: {
      environment: 'development'
    }
  });
  return;
};

const sendErrorProd = (err: AppError, res: Response, req: Request): void => {
  // Log all errors to database in production
  const errorType = err.statusCode && err.statusCode >= 500 ? ErrorType.CRITICAL : ErrorType.NORMAL;
  
  logServerFailure({
    message: err.message,
    error: err,
    path: req.originalUrl || req.url || 'unknown',
    type: errorType,
    metadata: {
      environment: 'production',
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      statusCode: err.statusCode,
      isOperational: err.isOperational
    }
  }).catch(logError => {
    console.error('Failed to log error to database:', logError);
  });

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    ResponseHandler.error(res, {
      message: err.message,
      statusCode: (err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR) as HttpStatusCode
    });
    return;
  } else {
    // Programming or other unknown error: don't leak error details
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', err);

    ResponseHandler.internalError(res, RESPONSE_MESSAGES.INTERNAL_ERROR);
    return;
  }
};

const handleCastErrorDB = (err: any): CustomError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new CustomError(message, HTTP_STATUS.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err: any): CustomError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new CustomError(message, HTTP_STATUS.CONFLICT);
};

const handleValidationErrorDB = (err: any): CustomError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new CustomError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res, req);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if ('code' in error && error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res, req);
  }
};

export default globalErrorHandler; 