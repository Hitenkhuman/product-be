export interface CreateFailureLogDto {
    operation: string;
    errorMessage: string;
    errorCode?: string;
    stackTrace?: string;
    requestData?: any;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }