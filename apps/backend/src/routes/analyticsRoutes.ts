import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticate, authorize(['ADMIN', 'TRAINER']), getDashboardStats);

export default router;
