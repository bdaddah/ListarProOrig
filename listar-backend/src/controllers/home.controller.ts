import { Request, Response } from 'express';
import prisma from '../utils/db';
import { asyncHandler } from '../middlewares/error.middleware';

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

// Helper function to get translated name
const getTranslatedName = (item: any, lang: string): string => {
  if (item.translations && typeof item.translations === 'object') {
    return item.translations[lang] || item.translations['en'] || item.name;
  }
  return item.name;
};

// Helper function to extract language from Accept-Language header
const getLanguageFromRequest = (req: Request): string => {
  const acceptLanguage = req.headers['accept-language'] || 'en';
  const lang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  return lang;
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

// Get home page data
export const getHome = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const lang = getLanguageFromRequest(req);

  const categories = await prisma.category.findMany({
    where: { type: 'category', parentId: null },
    take: 8,
    orderBy: { order: 'asc' },
  });

  const locations = await prisma.category.findMany({
    where: { type: 'location', parentId: null },
    take: 8,
    orderBy: { order: 'asc' },
  });

  const recentPosts = await prisma.listing.findMany({
    where: { status: 'publish' },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { galleries: { take: 1 } },
  });

  const sliderImages = recentPosts
    .map((p) =>
      p.thumbnail || p.galleries[0]?.full
        ? toAbsoluteUrl(baseUrl, p.thumbnail || p.galleries[0]?.full || '')
        : '',
    )
    .filter((url) => !!url);

  const sliderFallback = [
    toAbsoluteUrl(baseUrl, '/uploads/listings/listing-1-gallery-1-full.jpg'),
    toAbsoluteUrl(baseUrl, '/uploads/listings/listing-2-gallery-1-full.jpg'),
  ];

  res.json({
    success: true,
    data: {
      sliders: sliderImages.length > 0 ? sliderImages : sliderFallback,
      categories: categories.map((c) => ({
        term_id: c.id,
        name: getTranslatedName(c, lang),
        icon: c.icon,
        color: c.color,
        image: c.image ? {
          id: 0,
          thumb: { url: toAbsoluteUrl(baseUrl, c.image) },
          medium: { url: toAbsoluteUrl(baseUrl, c.image) },
          full: { url: toAbsoluteUrl(baseUrl, c.image) },
        } : null,
      })),
      locations: locations.map((l) => ({
        term_id: l.id,
        name: getTranslatedName(l, lang),
        image: l.image ? {
          id: 0,
          thumb: { url: toAbsoluteUrl(baseUrl, l.image) },
          medium: { url: toAbsoluteUrl(baseUrl, l.image) },
          full: { url: toAbsoluteUrl(baseUrl, l.image) },
        } : null,
      })),
      recent_posts: recentPosts.map((p) => ({
        ID: p.id,
        post_title: p.title,
        image: buildImageResponse(
          baseUrl,
          p.thumbnail || p.galleries[0]?.full || '',
          p.thumbnail || p.galleries[0]?.thumb || '',
          p.id,
        ),
        rating_avg: p.ratingAvg,
      })),
    },
  });
});

// Get home widgets
export const getHomeWidget = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const widgets = await prisma.widget.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' },
  });

  const sliderListings = await prisma.listing.findMany({
    where: { status: 'publish' },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      galleries: {
        take: 1,
        orderBy: { order: 'asc' },
      },
    },
  });

  const sliderImages = sliderListings
    .map((listing) =>
      listing.thumbnail || listing.galleries[0]?.full
        ? toAbsoluteUrl(baseUrl, listing.thumbnail || listing.galleries[0]?.full || '')
        : '',
    )
    .filter((url) => !!url);

  const headerData =
    sliderImages.length > 0
      ? sliderImages
      : [
          toAbsoluteUrl(baseUrl, '/uploads/listings/listing-1-gallery-1-full.jpg'),
          toAbsoluteUrl(baseUrl, '/uploads/listings/listing-2-gallery-1-full.jpg'),
        ];

  res.json({
    success: true,
    data: {
      header: {
        type: 'slider',
        data: headerData,
      },
      options: [],
      widgets: widgets.map((w) => ({
        type: w.type,
        title: w.title,
        data: w.data,
      })),
    },
  });
});
