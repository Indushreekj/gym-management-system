import express from 'express';
import { checkIn, checkOut } from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/checkin', authenticate, checkIn);
router.post('/checkout', authenticate, checkOut);

export default router;
