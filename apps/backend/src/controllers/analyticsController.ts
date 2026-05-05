import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'MEMBER' } });
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' },
    });
    const activeMemberships = await prisma.membership.count({
      where: { status: 'ACTIVE' },
    });
    
    // Recent attendances
    const recentAttendances = await prisma.attendance.findMany({
      take: 10,
      orderBy: { checkInTime: 'desc' },
      include: { user: { select: { name: true } } }
    });

    res.json({
      totalUsers,
      revenue: totalRevenue._sum.amount || 0,
      activeMemberships,
      recentAttendances,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
