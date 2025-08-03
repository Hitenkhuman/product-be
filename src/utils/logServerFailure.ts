import { FailureLog, IFailureLog } from '@/models/FailureLog';
import { ErrorType, OriginType } from '@/types/schemaHelper';

export interface LogServerFailureOptions {
  message: string;
  error?: Error | any;
  path: string;
  type?: ErrorType;
  userInfo?: Record<string, any>;
  metadata?: Record<string, any>;
  origin?: OriginType;
}

/**
 * Logs server failures to the database
 * @param options - Configuration options for logging the failure
 * @returns Promise<IFailureLog | null> - Returns the created log entry or null if logging fails
 */
export const logServerFailure = async (options: LogServerFailureOptions): Promise<IFailureLog | null> => {
  try {
    const {
      message,
      error,
      path,
      type = ErrorType.NORMAL,
      userInfo = {},
      metadata = {},
      origin = OriginType.BACKEND
    } = options;

    // Extract trace information from error
    let trace: any = '';
    if (error) {
      if (error instanceof Error) {
        trace = {
          name: error.name,
          message: error.message,
          stack: error.stack
        };
      } else if (typeof error === 'string') {
        trace = error;
      } else {
        trace = JSON.stringify(error, null, 2);
      }
    } else {
      trace = 'No error object provided';
    }

    // Create failure log entry
    const failureLogData = {
      message,
      origin,
      trace,
      path,
      type,
      userInfo,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    };

    const failureLog = new FailureLog(failureLogData);
    const savedLog = await failureLog.save();
    
    return savedLog;
  } catch (logError) {
    // If logging fails, we don't want to throw an error that could disrupt the main application flow
    // Instead, log to console as a fallback
    console.error('Failed to log server failure to database:', {
      originalError: options.error,
      logError: logError,
      path: options.path,
      message: options.message
    });
    
    return null;
  }
};

/**
 * Convenience function for logging critical errors
 */
export const logCriticalFailure = async (options: Omit<LogServerFailureOptions, 'type'>): Promise<IFailureLog | null> => {
  return logServerFailure({ ...options, type: ErrorType.CRITICAL });
};

/**
 * Convenience function for logging warning-level errors
 */
export const logWarningFailure = async (options: Omit<LogServerFailureOptions, 'type'>): Promise<IFailureLog | null> => {
  return logServerFailure({ ...options, type: ErrorType.WARNING });
};

/**
 * Convenience function for logging info-level errors
 */
export const logInfoFailure = async (options: Omit<LogServerFailureOptions, 'type'>): Promise<IFailureLog | null> => {
  return logServerFailure({ ...options, type: ErrorType.INFO });
};

export default logServerFailure;
