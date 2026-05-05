import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { io } from '../index'; // Import socket io instance

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
      },
      include: { user: { select: { name: true } } }
    });

    // Emit real-time event to trainers and admins
    io.to('ADMIN').to('TRAINER').emit('new-attendance', {
      message: `${attendance.user.name} checked in`,
      time: attendance.checkInTime,
    });

    res.status(201).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the latest attendance record without checkOutTime
    const attendance = await prisma.attendance.findFirst({
      where: { userId, checkOutTime: null },
      orderBy: { checkInTime: 'desc' },
      include: { user: { select: { name: true } } }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No active check-in found' });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOutTime: new Date() },
    });

    // Emit real-time event
    io.to('ADMIN').to('TRAINER').emit('new-attendance', {
      message: `${attendance.user.name} checked out`,
      time: updatedAttendance.checkOutTime,
    });

    res.json({ message: 'Checked out successfully', attendance: updatedAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
