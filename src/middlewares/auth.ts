import { Request, Response, NextFunction } from 'express';
import ResponseHandler from '@/utils/responseHandler';

// Extend Express Request interface to include token
declare module 'express-serve-static-core' {
  interface Request {
    token?: string;
  }
}

/**
 * Simple authentication middleware that checks for the presence of a token
 * Expects token in Authorization header with Bearer format: "Bearer <token>"
 * or as a query parameter: ?token=<token>
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      ResponseHandler.unauthorized(res, 'Access token is required');
      return;
    }

    req.token = token;

    next();
  } catch (error) {
    ResponseHandler.unauthorized(res, 'Invalid token format');
    return;
  }
};

export default authMiddleware;
