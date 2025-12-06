import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

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
const getTranslatedName = (cat: any, lang: string): string => {
  if (cat.translations && typeof cat.translations === 'object') {
    // Try exact match first, then fallback to English, then to default name
    return cat.translations[lang] || cat.translations['en'] || cat.name;
  }
  return cat.name;
};

// Helper function to extract language from Accept-Language header
const getLanguageFromRequest = (req: Request): string => {
  const acceptLanguage = req.headers['accept-language'] || 'en';
  // Parse Accept-Language header (e.g., "fr-FR,fr;q=0.9,en;q=0.8")
  const lang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  return lang;
};

const mapCategoryResponse = (baseUrl: string, cat: any, lang: string = 'en') => ({
  term_id: cat.id,
  name: getTranslatedName(cat, lang),
  slug: cat.slug,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
  type: cat.type,
  parent_id: cat.parentId,
  order: cat.order,
  image: cat.image
    ? {
        id: 0,
        thumb: { url: toAbsoluteUrl(baseUrl, cat.image) },
        medium: { url: toAbsoluteUrl(baseUrl, cat.image) },
        full: { url: toAbsoluteUrl(baseUrl, cat.image) },
      }
    : null,
  count: cat._count?.listings ?? 0,
  children: (cat.children ?? []).map((ch: any) => ({
    term_id: ch.id,
    name: getTranslatedName(ch, lang),
    slug: ch.slug,
  })),
});

const slugify = (text: string) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseParentId = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

// Get categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const lang = getLanguageFromRequest(req);
  const { category_id, parent_id } = req.query;

  const where: any = { type: 'category' };

  if (category_id) {
    where.parentId = parseInt(category_id as string);
  } else if (parent_id) {
    where.parentId = parseInt(parent_id as string);
  } else {
    where.parentId = null;
  }

  const categories = await prisma.category.findMany({
    where,
    include: {
      children: true,
      _count: {
        select: { listings: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  res.json({
    success: true,
    data: categories.map((cat) => mapCategoryResponse(baseUrl, cat, lang)),
  });
});

// Get discovery categories (featured)
export const getDiscovery = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const lang = getLanguageFromRequest(req);
  const categories = await prisma.category.findMany({
    where: {
      type: 'category',
      parentId: null,
    },
    include: {
      _count: {
        select: { listings: true },
      },
    },
    orderBy: { order: 'asc' },
    take: 10,
  });

  res.json({
    success: true,
    data: categories.map((cat) => mapCategoryResponse(baseUrl, cat, lang)),
  });
});

// Get locations
export const getLocations = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const lang = getLanguageFromRequest(req);
  const { parent_id } = req.query;

  const where: any = { type: 'location' };

  if (parent_id) {
    where.parentId = parseInt(parent_id as string);
  } else {
    where.parentId = null;
  }

  const locations = await prisma.category.findMany({
    where,
    include: {
      children: true,
      _count: {
        select: { listings: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json({
    success: true,
    data: locations.map((loc) => mapCategoryResponse(baseUrl, loc, lang)),
  });
});

// Create category
export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const {
    name,
    slug,
    type = 'category',
    parent_id,
    description,
    icon,
    color,
    image,
    order,
  } = req.body;

  if (!name) {
    throw new AppError('Name is required', 400);
  }

  let finalSlug = slug ? slugify(slug) : slugify(name);
  if (!finalSlug) {
    finalSlug = `category-${Date.now()}`;
  }

  const duplicate = await prisma.category.findUnique({ where: { slug: finalSlug } });
  if (duplicate) {
    throw new AppError('Slug already exists', 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug: finalSlug,
      type,
      parentId: parseParentId(parent_id),
      description,
      icon,
      color,
      image,
      order: order !== undefined ? parseInt(order, 10) || 0 : 0,
    },
    include: {
      children: true,
      _count: { select: { listings: true } },
    },
  });

  res.json({
    success: true,
    data: mapCategoryResponse(baseUrl, category),
  });
});

// Update category
export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const { id } = req.params;
  const {
    name,
    slug,
    type,
    parent_id,
    description,
    icon,
    color,
    image,
    order,
  } = req.body;

  const categoryId = parseInt(id, 10);
  if (Number.isNaN(categoryId)) {
    throw new AppError('Invalid category id', 400);
  }

  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) {
    throw new AppError('Category not found', 404);
  }

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (type !== undefined) data.type = type;
  if (description !== undefined) data.description = description;
  if (icon !== undefined) data.icon = icon;
  if (color !== undefined) data.color = color;
  if (image !== undefined) data.image = image;
  if (order !== undefined) {
    const parsedOrder = parseInt(order, 10);
    data.order = Number.isNaN(parsedOrder) ? existing.order : parsedOrder;
  }
  if (parent_id !== undefined) {
    data.parentId = parseParentId(parent_id);
  }
  if (slug !== undefined) {
    const finalSlug = slugify(slug);
    if (!finalSlug) {
      throw new AppError('Slug cannot be empty', 400);
    }
    const duplicate = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (duplicate && duplicate.id !== categoryId) {
      throw new AppError('Slug already exists', 400);
    }
    data.slug = finalSlug;
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data,
    include: {
      children: true,
      _count: { select: { listings: true } },
    },
  });

  res.json({
    success: true,
    data: mapCategoryResponse(baseUrl, category),
  });
});

// Delete category
export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const categoryId = parseInt(id, 10);

  if (Number.isNaN(categoryId)) {
    throw new AppError('Invalid category id', 400);
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Detach children before deleting to avoid FK constraint
  await prisma.category.updateMany({
    where: { parentId: categoryId },
    data: { parentId: null },
  });

  await prisma.category.delete({
    where: { id: categoryId },
  });

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});
