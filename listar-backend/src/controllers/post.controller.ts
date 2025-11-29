import { Request, Response } from 'express';
import prisma from '../utils/db';
import { asyncHandler } from '../middlewares/error.middleware';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination';

const getBaseUrl = (req: Request): string => {
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

// Get blog posts
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const { skip, take, page } = getPaginationParams(req.query);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'publish' },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count({ where: { status: 'publish' } }),
  ]);

  const data = posts.map((post) => ({
    ID: post.id,
    post_title: post.title,
    post_excerpt: post.excerpt,
    post_date: post.createdAt.toISOString(),
    image: buildImageResponse(baseUrl, post.thumbnail, post.thumbnail, post.id),
  }));

  const pagination = createPaginationResponse(page, take, total);

  res.json({
    success: true,
    data,
    pagination,
  });
});

// Get single post
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const { id } = req.query;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id as string) },
  });

  await prisma.post.update({
    where: { id: post!.id },
    data: { viewCount: post!.viewCount + 1 },
  });

  res.json({
    success: true,
    data: {
      ID: post!.id,
      post_title: post!.title,
      post_content: post!.content,
      post_excerpt: post!.excerpt,
      post_date: post!.createdAt.toISOString(),
      image: buildImageResponse(baseUrl, post!.thumbnail, post!.thumbnail, post!.id),
    },
  });
});
