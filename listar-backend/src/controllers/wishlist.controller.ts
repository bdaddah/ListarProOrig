import { Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination';

const getBaseUrl = (req: AuthRequest): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const toAbsoluteUrl = (baseUrl: string, path: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${baseUrl}${path}`;
};

const buildImageResponse = (
  baseUrl: string,
  fullPath?: string | null,
  thumbPath?: string | null,
  id?: number,
) => {
  const fallbackPath = fullPath ?? thumbPath ?? '';
  const full = toAbsoluteUrl(baseUrl, fullPath ?? fallbackPath);
  const thumb = toAbsoluteUrl(baseUrl, thumbPath ?? fallbackPath);
  return {
    id: id ?? 0,
    full: { url: full },
    thumb: { url: thumb },
  };
};

// Get wishlist
export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { skip, take, page } = getPaginationParams(req.query);
  const baseUrl = getBaseUrl(req);

  const [wishlists, total] = await Promise.all([
    prisma.wishlist.findMany({
      where: { userId: req.user.userId },
      skip,
      take,
      include: {
        listing: {
          include: {
            galleries: { take: 1 },
            categories: {
              where: { type: 'category' },
              include: { category: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.wishlist.count({ where: { userId: req.user.userId } }),
  ]);

  const data = wishlists.map((w) => ({
    ID: w.listing.id,
    post_title: w.listing.title,
    post_excerpt: w.listing.excerpt,
    image: buildImageResponse(
      baseUrl,
      w.listing.thumbnail || w.listing.galleries[0]?.full || '',
      w.listing.galleries[0]?.thumb || w.listing.thumbnail || '',
      w.listing.id,
    ),
    category: w.listing.categories[0]
      ? {
          term_id: w.listing.categories[0].category.id,
          name: w.listing.categories[0].category.name,
        }
      : null,
    rating_avg: w.listing.ratingAvg,
    address: w.listing.address,
  }));

  const pagination = createPaginationResponse(page, take, total);

  res.json({
    success: true,
    data,
    pagination,
  });
});

// Add to wishlist
export const addWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { post_id } = req.body;

  if (!post_id) {
    throw new AppError('Listing ID is required', 400);
  }

  await prisma.wishlist.create({
    data: {
      userId: req.user.userId,
      listingId: parseInt(post_id),
    },
  });

  res.json({
    success: true,
    message: 'Added to wishlist',
  });
});

// Remove from wishlist
export const removeWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { post_id } = req.body;

  if (!post_id) {
    throw new AppError('Listing ID is required', 400);
  }

  await prisma.wishlist.deleteMany({
    where: {
      userId: req.user.userId,
      listingId: parseInt(post_id),
    },
  });

  res.json({
    success: true,
    message: 'Removed from wishlist',
  });
});

// Clear wishlist
export const clearWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  await prisma.wishlist.deleteMany({
    where: { userId: req.user.userId },
  });

  res.json({
    success: true,
    message: 'Wishlist cleared',
  });
});
