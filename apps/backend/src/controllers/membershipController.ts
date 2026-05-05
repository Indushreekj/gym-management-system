import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.membershipPlan.findMany();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const purchaseSchema = z.object({
  planId: z.string(),
});

export const purchaseMembership = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = purchaseSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const { planId } = parsedData.data;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if user already has an active membership
    const existingMembership = await prisma.membership.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'User already has an active membership' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationDays);

    // Mock payment gateway (Create payment and membership in transaction)
    const result = await prisma.$transaction(async (prisma) => {
      const membership = await prisma.membership.create({
        data: {
          userId,
          planId,
          startDate,
          endDate,
          status: 'ACTIVE',
        },
      });

      const payment = await prisma.payment.create({
        data: {
          membershipId: membership.id,
          amount: plan.price,
          status: 'SUCCESS', // Mock successful payment
          transactionId: `TXN_${Date.now()}`,
        },
      });

      return { membership, payment };
    });

    res.status(201).json({ message: 'Membership purchased successfully', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
