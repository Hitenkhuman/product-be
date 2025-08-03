import FailureLogController from '@/controllers/FailureLogController';
import authMiddleware from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();


// Routes
router.post('/', authMiddleware, FailureLogController.createFailureLog);


export default router; 