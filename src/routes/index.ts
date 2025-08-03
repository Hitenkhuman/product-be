import { Router } from 'express';
import productRoutes from './productRoutes';
import failureLogRoutes from './failureLogRoutes';
import { API_CONFIG } from '@/utils/constants';
import ResponseHandler from '@/utils/responseHandler';

const router = Router();

// Health check route
router.get('/health', (_req, res) => {
  ResponseHandler.success(res, {
    data: {
      status: 'running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
    message: 'API is running successfully'
  });
  return;
});

// API routes
router.use(`${API_CONFIG.API_PREFIX}/products`, productRoutes);
router.use(`${API_CONFIG.API_PREFIX}/failure-logs`, failureLogRoutes);

// Catch-all route for undefined endpoints
router.all('*', (req, res) => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
  return;
});

export default router; 