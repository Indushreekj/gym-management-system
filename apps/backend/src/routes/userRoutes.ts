import express from 'express';
import { getProfile, getAllUsers, updateProfile, deleteUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/', authenticate, authorize(['ADMIN']), getAllUsers);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUser);

export default router;
