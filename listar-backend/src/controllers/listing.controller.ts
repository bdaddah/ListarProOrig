import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination';

// Listing status constants
export const LISTING_STATUS = {
  PENDING: 'pending',    // To be reviewed (new or modified by owner)
  PUBLISH: 'publish',    // Validated by admin (public)
  DRAFT: 'draft',        // Saved as draft by owner
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Helper function to get base URL from request
const getBaseUrl = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// Helper function to convert relative URL to absolute
const toAbsoluteUrl = (baseUrl: string, path: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path; // Already absolute
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

// Check if user is admin (by role field or legacy userLevel)
const isAdminUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, userLevel: true, active: true },
  });

  return !!user && user.active && (user.role === USER_ROLES.ADMIN || user.userLevel >= 10);
};

// Check if user is owner of the listing
const isListingOwner = async (userId: number, listingId: number) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });
  return listing?.userId === userId;
};

// Check if user can view a listing (public listings visible to all, pending/draft only to owner/admin)
const canViewListing = async (userId: number | undefined, listing: any) => {
  // Public listings are visible to everyone
  if (listing.status === LISTING_STATUS.PUBLISH) {
    return true;
  }

  // Not authenticated - can only see public listings
  if (!userId) {
    return false;
  }

  // Admin can view all listings
  const isAdmin = await isAdminUser(userId);
  if (isAdmin) {
    return true;
  }

  // Owner can view their own listings
  return listing.userId === userId;
};

// Check if user can modify (update/delete) a listing
const canModifyListing = async (userId: number, listingId: number) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });

  if (!listing) {
    return false;
  }

  // Admin can modify any listing
  const isAdmin = await isAdminUser(userId);
  if (isAdmin) {
    return true;
  }

  // Owner can modify their own listing
  return listing.userId === userId;
};

// Get listings - Public endpoint shows only published listings
// Authenticated users can see their own pending/draft listings
// Admins can see all listings with filters
export const getListings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const { skip, take, page } = getPaginationParams(req.query);
  const {
    category_id,
    location_id,
    s: search,
    orderby = 'date',
    order = 'desc',
    min_price,
    max_price,
    user_id,
    post_status,
  } = req.query;

  const where: any = {};
  const currentUserId = req.user?.userId;
  const isAdmin = currentUserId ? await isAdminUser(currentUserId) : false;

  // Handle status filtering based on user role
  if (post_status && (post_status as string).toLowerCase() !== 'all') {
    // Specific status requested
    if (post_status === LISTING_STATUS.PUBLISH) {
      // Anyone can filter by published
      where.status = LISTING_STATUS.PUBLISH;
    } else if (isAdmin) {
      // Admin can filter by any status
      where.status = post_status;
    } else if (currentUserId && user_id && parseInt(user_id as string) === currentUserId) {
      // User can filter their own listings by status
      where.status = post_status;
      where.userId = currentUserId;
    } else {
      // Non-admin trying to filter non-published listings of others - only show published
      where.status = LISTING_STATUS.PUBLISH;
    }
  } else if (user_id) {
    // Filtering by specific user
    const targetUserId = parseInt(user_id as string);
    where.userId = targetUserId;

    if (!isAdmin && currentUserId !== targetUserId) {
      // Non-admin viewing another user's listings - only show published
      where.status = LISTING_STATUS.PUBLISH;
    }
    // If admin or viewing own listings, show all statuses
  } else {
    // Default: public listing view - only show published
    where.status = LISTING_STATUS.PUBLISH;
  }

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { content: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category_id) {
    where.categories = {
      some: {
        categoryId: parseInt(category_id as string),
        type: 'category',
      },
    };
  }

  if (location_id) {
    where.OR = [
      { cityId: parseInt(location_id as string) },
      { stateId: parseInt(location_id as string) },
      { countryId: parseInt(location_id as string) },
    ];
  }

  const orderByClause: any = {};
  if (orderby === 'date') {
    orderByClause.createdAt = order;
  } else if (orderby === 'title') {
    orderByClause.title = order;
  } else if (orderby === 'rating') {
    orderByClause.ratingAvg = order;
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take,
      orderBy: orderByClause,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        categories: {
          where: { type: 'category' },
          include: { category: true },
          take: 1,
        },
        galleries: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  // Get wishlist status for all listings if user is authenticated
  let wishlistMap: Record<number, boolean> = {};
  if (req.user) {
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: req.user.userId,
        listingId: { in: listings.map(l => l.id) },
      },
      select: { listingId: true },
    });
    wishlistMap = wishlists.reduce((acc, w) => ({ ...acc, [w.listingId]: true }), {});
  }

  const data = listings.map((listing) => ({
    ID: listing.id,
    post_title: listing.title,
    post_excerpt: listing.excerpt,
    post_date: listing.createdAt.toISOString(),
    post_status: listing.status,
    image: buildImageResponse(
      baseUrl,
      listing.thumbnail || listing.galleries[0]?.full || '',
      listing.galleries[0]?.thumb || listing.thumbnail || '',
      listing.id,
    ),
    category: listing.categories[0]
      ? {
          term_id: listing.categories[0].category.id,
          name: listing.categories[0].category.name,
          slug: listing.categories[0].category.slug,
          icon: listing.categories[0].category.icon,
          color: listing.categories[0].category.color,
        }
      : null,
    author: {
      id: listing.user.id,
      name: listing.user.displayName || `${listing.user.firstName} ${listing.user.lastName}`,
      user_photo: listing.user.image,
    },
    rating_avg: listing.ratingAvg,
    rating_count: listing.ratingCount,
    address: listing.address,
    phone: listing.phone,
    price_min: listing.priceMin,
    price_max: listing.priceMax,
    booking_use: listing.bookingUse,
    booking_price_display: listing.bookingPrice,
    wishlist: wishlistMap[listing.id] || false,
    latitude: listing.latitude,
    longitude: listing.longitude,
  }));

  const pagination = createPaginationResponse(page, take, total);

  res.json({
    success: true,
    data,
    pagination,
  });
});

// Get single listing - Check visibility based on status and user role
export const getListing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const { id } = req.query;

  if (!id) {
    throw new AppError('Listing ID is required', 400);
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id as string) },
    include: {
      user: true,
      categories: {
        include: { category: true },
      },
      galleries: {
        orderBy: { order: 'asc' },
      },
      attachments: true,
    },
  });

  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  // Check if user can view this listing
  const canView = await canViewListing(req.user?.userId, listing);
  if (!canView) {
    throw new AppError('This listing is not available', 403);
  }

  // Increment view count (only for published listings viewed by non-owners)
  await prisma.listing.update({
    where: { id: listing.id },
    data: { viewCount: listing.viewCount + 1 },
  });

  // Get related listings
  const related = await prisma.listing.findMany({
    where: {
      categories: {
        some: {
          categoryId: {
            in: listing.categories.map((c) => c.categoryId),
          },
        },
      },
      id: { not: listing.id },
      status: 'publish',
    },
    take: 5,
    include: {
      galleries: { take: 1 },
    },
  });

  // Get latest from same author
  const latest = await prisma.listing.findMany({
    where: {
      userId: listing.userId,
      id: { not: listing.id },
      status: 'publish',
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      galleries: { take: 1 },
    },
  });

  const categories = listing.categories.filter((c) => c.type === 'category');
  const features = listing.categories.filter((c) => c.type === 'feature');
  const tags = listing.categories.filter((c) => c.type === 'tag');

  res.json({
    success: true,
    data: {
      ID: listing.id,
      post_title: listing.title,
      post_excerpt: listing.excerpt,
      post_date: listing.createdAt.toISOString(),
      post_status: listing.status,
      guid: listing.slug,
      image: buildImageResponse(
        baseUrl,
        listing.thumbnail || listing.galleries[0]?.full || '',
        listing.galleries[0]?.thumb || listing.thumbnail || '',
        listing.id,
      ),
      video_url: listing.videoUrl,
      author: {
        id: listing.user.id,
        name: listing.user.displayName,
        first_name: listing.user.firstName,
        last_name: listing.user.lastName,
        user_photo: listing.user.image,
        user_url: listing.user.url,
        user_level: listing.user.userLevel,
        description: listing.user.description,
      },
      category: categories[0]
        ? {
            term_id: categories[0].category.id,
            name: categories[0].category.name,
            slug: categories[0].category.slug,
            icon: categories[0].category.icon,
            color: categories[0].category.color,
          }
        : null,
      location: {
        country: listing.countryId
          ? await prisma.category.findUnique({ where: { id: listing.countryId } })
          : null,
        state: listing.stateId
          ? await prisma.category.findUnique({ where: { id: listing.stateId } })
          : null,
        city: listing.cityId
          ? await prisma.category.findUnique({ where: { id: listing.cityId } })
          : null,
      },
      address: listing.address,
      zip_code: listing.zipCode,
      phone: listing.phone,
      fax: listing.fax,
      email: listing.email,
      website: listing.website,
      latitude: listing.latitude,
      longitude: listing.longitude,
      date_establish: listing.dateEstablish,
      color: listing.color,
      icon: listing.icon,
      status: listing.status,
      price_min: listing.priceMin,
      price_max: listing.priceMax,
      booking_use: listing.bookingUse,
      booking_style: listing.bookingStyle,
      booking_price_display: listing.bookingPrice,
      claim_use: listing.claimUse,
      claim_verified: listing.claimVerified,
      rating_avg: listing.ratingAvg,
      rating_count: listing.ratingCount,
      galleries: listing.galleries.map((g) =>
        buildImageResponse(baseUrl, g.full, g.thumb, g.id),
      ),
      features: features.map((f) => ({
        term_id: f.category.id,
        name: f.category.name,
        icon: f.category.icon,
      })),
      tags: tags.map((t) => ({
        term_id: t.category.id,
        name: t.category.name,
      })),
      opening_hour: listing.openingHours || [],
      social_network: listing.socialNetwork || {},
      attachments: listing.attachments.map((a) => ({
        name: a.name,
        url: a.url,
        size: a.size,
        type: a.type,
      })),
      related: related.map((r) => ({
        ID: r.id,
        post_title: r.title,
        image: buildImageResponse(
          baseUrl,
          r.thumbnail || r.galleries[0]?.full || '',
          r.galleries[0]?.thumb || r.thumbnail || '',
          r.id,
        ),
        rating_avg: r.ratingAvg,
      })),
      lastest: latest.map((l) => ({
        ID: l.id,
        post_title: l.title,
        image: buildImageResponse(
          baseUrl,
          l.thumbnail || l.galleries[0]?.full || '',
          l.galleries[0]?.thumb || l.thumbnail || '',
          l.id,
        ),
        rating_avg: l.ratingAvg,
      })),
      wishlist: req.user
        ? await prisma.wishlist.count({
            where: { userId: req.user.userId, listingId: listing.id },
          }) > 0
        : false,
    },
  });
});

// Create/Update listing
// - New listings start with status 'pending' (to be reviewed)
// - When owner updates a published listing, it goes back to 'pending'
// - Only admin can directly set status to 'publish'
export const saveListing = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const {
    post_id,
    title,
    content,
    country,
    state,
    city,
    address,
    zip_code,
    phone,
    fax,
    email,
    website,
    color,
    icon,
    status: requestedStatus,
    date_establish,
    thumbnail,
    gallery,
    booking_price,
    price_min,
    price_max,
    longitude,
    latitude,
    tags_input,
    booking_style,
    opening_hour,
    social_network,
  } = req.body;

  const isAdmin = await isAdminUser(req.user.userId);

  const listingData: any = {
    title,
    content,
    excerpt: content?.substring(0, 200),
    address,
    zipCode: zip_code,
    phone,
    fax,
    email,
    website,
    color,
    icon,
    thumbnail,
    dateEstablish: date_establish ? new Date(date_establish) : null,
    priceMin: price_min,
    priceMax: price_max,
    bookingPrice: booking_price,
    bookingStyle: booking_style?.value || booking_style,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    openingHours: opening_hour || null,
    socialNetwork: social_network || null,
  };

  if (country) listingData.countryId = parseInt(country);
  if (state) listingData.stateId = parseInt(state);
  if (city) listingData.cityId = parseInt(city);

  let listing;
  let message = 'Listing saved successfully';

  if (post_id) {
    // Update existing listing
    const listingId = parseInt(post_id);

    // Check authorization
    const canModify = await canModifyListing(req.user.userId, listingId);
    if (!canModify) {
      throw new AppError('You are not authorized to update this listing', 403);
    }

    // Get current listing to check status
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { status: true, userId: true },
    });

    if (!existingListing) {
      throw new AppError('Listing not found', 404);
    }

    // Determine new status based on who is updating
    if (isAdmin) {
      // Admin can set any status
      listingData.status = requestedStatus || existingListing.status;
    } else {
      // Non-admin (owner) updating their listing
      // If it was published, it goes back to pending for review
      if (existingListing.status === LISTING_STATUS.PUBLISH) {
        listingData.status = LISTING_STATUS.PENDING;
        listingData.previousStatus = LISTING_STATUS.PUBLISH;
        message = 'Listing updated and submitted for review';
      } else if (requestedStatus === LISTING_STATUS.DRAFT) {
        // Owner can save as draft
        listingData.status = LISTING_STATUS.DRAFT;
      } else {
        // Keep as pending or set to pending
        listingData.status = LISTING_STATUS.PENDING;
      }
    }

    listing = await prisma.listing.update({
      where: { id: listingId },
      data: listingData,
    });
  } else {
    // Create new listing
    listingData.userId = req.user.userId;
    listingData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    // New listings start as pending (unless admin creates with specific status)
    if (isAdmin && requestedStatus) {
      listingData.status = requestedStatus;
    } else if (requestedStatus === LISTING_STATUS.DRAFT) {
      listingData.status = LISTING_STATUS.DRAFT;
    } else {
      listingData.status = LISTING_STATUS.PENDING;
      message = 'Listing created and submitted for review';
    }

    listing = await prisma.listing.create({
      data: listingData,
    });
  }

  // Handle categories, features, tags
  // Handle galleries
  // ... (implementation details)

  res.json({
    success: true,
    message,
    data: {
      id: listing.id,
      status: listing.status,
      requires_review: listing.status === LISTING_STATUS.PENDING,
    },
  });
});

// Delete listing - Only owner or admin can delete
export const deleteListing = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { post_id } = req.body;

  if (!post_id) {
    throw new AppError('Listing ID is required', 400);
  }

  const listingId = parseInt(post_id);

  // Check authorization
  const canModify = await canModifyListing(req.user.userId, listingId);
  if (!canModify) {
    throw new AppError('You are not authorized to delete this listing', 403);
  }

  await prisma.listing.delete({
    where: { id: listingId },
  });

  res.json({
    success: true,
    message: 'Listing deleted successfully',
  });
});

// Get submit form settings
export const getSubmitSettings = asyncHandler(async (req: Request, res: Response) => {
  // Return form configuration
  const categories = await prisma.category.findMany({
    where: { type: 'category', parentId: null },
    include: { children: true },
  });

  const features = await prisma.category.findMany({
    where: { type: 'feature' },
  });

  const facilities = await prisma.category.findMany({
    where: { type: 'facility' },
  });

  res.json({
    success: true,
    data: {
      categories: categories.map((c) => ({
        term_id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        color: c.color,
        children: c.children.map((ch) => ({
          term_id: ch.id,
          name: ch.name,
          slug: ch.slug,
        })),
      })),
      features: features.map((f) => ({
        term_id: f.id,
        name: f.name,
        icon: f.icon,
      })),
      facilities: facilities.map((f) => ({
        term_id: f.id,
        name: f.name,
        icon: f.icon,
      })),
      booking_styles: [
        { value: 'standard', label: 'Standard' },
        { value: 'daily', label: 'Daily' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'table', label: 'Table' },
        { value: 'slot', label: 'Slot' },
      ],
    },
  });
});

// Get tags (autocomplete)
export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const { s: search } = req.query as any;

  const tags = await prisma.category.findMany({
    where: {
      type: 'tag',
      ...(search && {
        name: { contains: search as string, mode: 'insensitive' },
      }),
    },
    take: 20,
  });

  res.json({
    success: true,
    data: tags.map((t) => ({
      term_id: t.id,
      name: t.name,
    })),
  });
});

// Admin-only: Update listing status (approve/reject moderation)
export const updateListingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const isAdmin = await isAdminUser(req.user.userId);
  if (!isAdmin) {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const listingId = parseInt(id, 10);
  if (Number.isNaN(listingId)) {
    throw new AppError('Invalid listing id', 400);
  }

  const { status } = req.body;
  const allowedStatuses = [LISTING_STATUS.PUBLISH, LISTING_STATUS.PENDING, LISTING_STATUS.DRAFT];
  if (!status || !allowedStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  // Get current listing to store previous status
  const existingListing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { status: true },
  });

  if (!existingListing) {
    throw new AppError('Listing not found', 404);
  }

  const updateData: any = {
    status,
    moderatedAt: new Date(),
    moderatedBy: req.user.userId,
  };

  // Store previous status if changing
  if (existingListing.status !== status) {
    updateData.previousStatus = existingListing.status;
  }

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: updateData,
    select: {
      id: true,
      title: true,
      status: true,
      previousStatus: true,
      moderatedAt: true,
      userId: true,
    },
  });

  const statusMessage = status === LISTING_STATUS.PUBLISH
    ? 'Listing has been approved and published'
    : status === LISTING_STATUS.PENDING
      ? 'Listing has been set to pending review'
      : 'Listing has been saved as draft';

  res.json({
    success: true,
    message: statusMessage,
    data: listing,
  });
});

// Admin-only: Delete any listing
export const adminDeleteListing = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const isAdmin = await isAdminUser(req.user.userId);
  if (!isAdmin) {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const listingId = parseInt(id, 10);
  if (Number.isNaN(listingId)) {
    throw new AppError('Invalid listing id', 400);
  }

  await prisma.listing.delete({
    where: { id: listingId },
  });

  res.json({
    success: true,
    message: 'Listing deleted successfully',
  });
});

// Admin-only: Get listings pending moderation
export const getPendingListings = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const isAdmin = await isAdminUser(req.user.userId);
  if (!isAdmin) {
    throw new AppError('Admin access required', 403);
  }

  const baseUrl = getBaseUrl(req);
  const { skip, take, page } = getPaginationParams(req.query);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where: { status: LISTING_STATUS.PENDING },
      skip,
      take,
      orderBy: { createdAt: 'asc' }, // Oldest first for moderation queue
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        categories: {
          where: { type: 'category' },
          include: { category: true },
          take: 1,
        },
        galleries: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.listing.count({ where: { status: LISTING_STATUS.PENDING } }),
  ]);

  const data = listings.map((listing) => ({
    ID: listing.id,
    post_title: listing.title,
    post_excerpt: listing.excerpt,
    post_date: listing.createdAt.toISOString(),
    post_modified: listing.updatedAt.toISOString(),
    post_status: listing.status,
    previous_status: listing.previousStatus,
    image: buildImageResponse(
      baseUrl,
      listing.thumbnail || listing.galleries[0]?.full || '',
      listing.galleries[0]?.thumb || listing.thumbnail || '',
      listing.id,
    ),
    category: listing.categories[0]
      ? {
          term_id: listing.categories[0].category.id,
          name: listing.categories[0].category.name,
          slug: listing.categories[0].category.slug,
        }
      : null,
    author: {
      id: listing.user.id,
      name: listing.user.displayName || `${listing.user.firstName} ${listing.user.lastName}`,
      email: listing.user.email,
      user_photo: listing.user.image,
    },
    address: listing.address,
  }));

  const pagination = createPaginationResponse(page, take, total);

  res.json({
    success: true,
    data,
    pagination,
    total_pending: total,
  });
});

// Get user's own listings (all statuses)
export const getMyListings = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const baseUrl = getBaseUrl(req);
  const { skip, take, page } = getPaginationParams(req.query);
  const { post_status } = req.query;

  const where: any = { userId: req.user.userId };

  if (post_status && (post_status as string).toLowerCase() !== 'all') {
    where.status = post_status;
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: {
        categories: {
          where: { type: 'category' },
          include: { category: true },
          take: 1,
        },
        galleries: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  // Count by status
  const statusCounts = await prisma.listing.groupBy({
    by: ['status'],
    where: { userId: req.user.userId },
    _count: true,
  });

  const counts = {
    pending: 0,
    publish: 0,
    draft: 0,
    total: 0,
  };

  statusCounts.forEach((s) => {
    if (s.status === LISTING_STATUS.PENDING) counts.pending = s._count;
    if (s.status === LISTING_STATUS.PUBLISH) counts.publish = s._count;
    if (s.status === LISTING_STATUS.DRAFT) counts.draft = s._count;
    counts.total += s._count;
  });

  const data = listings.map((listing) => ({
    ID: listing.id,
    post_title: listing.title,
    post_excerpt: listing.excerpt,
    post_date: listing.createdAt.toISOString(),
    post_modified: listing.updatedAt.toISOString(),
    post_status: listing.status,
    status_label: listing.status === LISTING_STATUS.PENDING
      ? 'Pending Review'
      : listing.status === LISTING_STATUS.PUBLISH
        ? 'Published'
        : 'Draft',
    image: buildImageResponse(
      baseUrl,
      listing.thumbnail || listing.galleries[0]?.full || '',
      listing.galleries[0]?.thumb || listing.thumbnail || '',
      listing.id,
    ),
    category: listing.categories[0]
      ? {
          term_id: listing.categories[0].category.id,
          name: listing.categories[0].category.name,
        }
      : null,
    address: listing.address,
    rating_avg: listing.ratingAvg,
    view_count: listing.viewCount,
  }));

  const pagination = createPaginationResponse(page, take, total);

  res.json({
    success: true,
    data,
    pagination,
    counts,
  });
});

// Get current user info including role
export const getCurrentUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      role: true,
      userLevel: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isAdmin = user.role === USER_ROLES.ADMIN || user.userLevel >= 10;

  res.json({
    success: true,
    data: {
      userId: user.id,
      role: user.role,
      isAdmin,
    },
  });
});
