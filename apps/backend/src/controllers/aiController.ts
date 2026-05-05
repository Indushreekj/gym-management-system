import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { weight: true, height: true, goal: true },
    });

    if (!user || !user.weight || !user.height) {
      return res.status(200).json(null);
    }

    const bmi = user.weight / ((user.height / 100) ** 2);
    let recommendation = '';

    const goal = user.goal?.toLowerCase() || '';

    if (goal === 'weight loss') {
      recommendation = bmi > 25 
        ? 'High-intensity interval training (HIIT) with a caloric deficit diet.'
        : 'Moderate cardio with strength training and balanced diet.';
    } else if (goal === 'muscle gain') {
      recommendation = 'Heavy weight lifting, progressive overload, and a high-protein surplus diet.';
    } else {
      recommendation = 'Balanced mix of cardio and strength training for overall fitness.';
    }

    res.json({
      bmi: bmi.toFixed(2),
      recommendation,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
