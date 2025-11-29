import { Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

// Submit claim
export const submitClaim = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { id, first_name, last_name, email, phone, memo } = req.body;

  const claim = await prisma.claim.create({
    data: {
      listingId: parseInt(id),
      userId: req.user.userId,
      firstName: first_name,
      lastName: last_name,
      email,
      phone,
      memo,
    },
  });

  res.json({
    success: true,
    message: 'Claim submitted successfully',
    data: { id: claim.id },
  });
});

// Get claims
export const getClaims = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const claims = await prisma.claim.findMany({
    where: { userId: req.user.userId },
    include: { listing: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: claims,
    pagination: { page: 1, per_page: 10, total: claims.length, total_pages: 1 },
    attr: {
      status: [{ value: 'all/all', text: 'All' }],
      sort: [{ value: 'date/desc', text: 'Newest' }],
    },
  });
});
