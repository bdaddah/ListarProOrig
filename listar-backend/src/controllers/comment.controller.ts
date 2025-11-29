import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

// Get comments/reviews
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { post_id } = req.query;

  const comments = await prisma.comment.findMany({
    where: {
      listingId: parseInt(post_id as string),
      status: 'approved',
      parentId: null,
    },
    include: {
      user: true,
      replies: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: comments.map((c) => ({
      id: c.id,
      content: c.content,
      rating: c.rating,
      created_at: c.createdAt,
      author: {
        id: c.user.id,
        name: c.user.displayName,
        image: c.user.image,
      },
      replies: c.replies.map((r) => ({
        id: r.id,
        content: r.content,
        created_at: r.createdAt,
        author: {
          id: r.user.id,
          name: r.user.displayName,
          image: r.user.image,
        },
      })),
    })),
  });
});

// Save comment/review
export const saveComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { post, content, rating } = req.body;

  const comment = await prisma.comment.create({
    data: {
      listingId: parseInt(post),
      userId: req.user.userId,
      content,
      rating: rating ? parseFloat(rating) : null,
    },
  });

  // Update listing rating
  const stats = await prisma.comment.aggregate({
    where: { listingId: parseInt(post), rating: { not: null } },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.listing.update({
    where: { id: parseInt(post) },
    data: {
      ratingAvg: stats._avg.rating || 0,
      ratingCount: stats._count.id,
    },
  });

  res.json({
    success: true,
    message: 'Review submitted successfully',
    id: comment.id,
  });
});
