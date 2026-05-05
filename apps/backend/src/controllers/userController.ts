import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: {
        membership: {
          include: { plan: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, weight, height, goal } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user?.userId },
      data: {
        name,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        goal,
      },
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (id === req.user?.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await prisma.attendance.deleteMany({ where: { userId: id } });
    await prisma.payment.deleteMany({ where: { membership: { userId: id } } });
    await prisma.membership.deleteMany({ where: { userId: id } });
    
    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
