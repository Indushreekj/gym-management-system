import express from 'express';
import { getPlans, purchaseMembership } from '../controllers/membershipController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/purchase', authenticate, purchaseMembership);

export default router;
