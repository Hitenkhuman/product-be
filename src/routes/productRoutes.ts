import { Router } from 'express';
import ProductController from '@/controllers/ProductController';
import authMiddleware from '@/middlewares/auth';

const router = Router();


// Routes
router.post('/', authMiddleware, ProductController.createProduct);

router.get('/', authMiddleware, ProductController.getAllProducts);

export default router; 