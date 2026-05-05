import express from 'express';
import { getRecommendations } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/recommendations', authenticate, getRecommendations);

export default router;
