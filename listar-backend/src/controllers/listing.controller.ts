import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination';

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

const isAdminUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userLevel: true, active: true },
  });

  return !!user && user.active && user.userLevel >= 10;
};

// Get listings
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

  if (post_status) {
    if ((post_status as string).toLowerCase() !== 'all') {
      where.status = post_status;
    }
  } else if (!user_id) {
    where.status = 'publish';
  }

  if (user_id) {
    where.userId = parseInt(user_id as string);
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

// Get single listing
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

  // Increment view count
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
    status = 'pending',
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

  const listingData: any = {
    title,
    content,
    excerpt: content?.substring(0, 200),
    status,
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

  if (post_id) {
    // Update existing
    listing = await prisma.listing.update({
      where: { id: parseInt(post_id) },
      data: listingData,
    });
  } else {
    // Create new
    listingData.userId = req.user.userId;
    listingData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    listing = await prisma.listing.create({
      data: listingData,
    });
  }

  // Handle categories, features, tags
  // Handle galleries
  // ... (implementation details)

  res.json({
    success: true,
    message: 'Listing saved successfully',
    data: { id: listing.id },
  });
});

// Delete listing
export const deleteListing = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { post_id } = req.body;

  if (!post_id) {
    throw new AppError('Listing ID is required', 400);
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(post_id) },
  });

  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  const adminUser = await isAdminUser(req.user.userId);

  if (listing.userId !== req.user.userId && !adminUser) {
    throw new AppError('Unauthorized to delete this listing', 403);
  }

  await prisma.listing.delete({
    where: { id: listing.id },
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
  const allowedStatuses = ['publish', 'pending', 'draft'];
  if (!status || !allowedStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: { status },
    select: { id: true, status: true },
  });

  res.json({
    success: true,
    data: listing,
  });
});

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
