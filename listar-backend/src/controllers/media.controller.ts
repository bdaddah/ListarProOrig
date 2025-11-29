import { Response } from 'express';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Image size configurations (similar to WordPress)
const IMAGE_SIZES = {
  thumb: { width: 150, height: 150 },
  medium: { width: 300, height: 300 },
  large: { width: 800, height: 800 },
  full: { width: 1200, height: 1200 },
};

/**
 * Process and resize image to multiple sizes
 */
async function processImage(
  originalPath: string,
  filename: string,
  uploadDir: string
): Promise<{ [key: string]: { url: string; width: number; height: number } }> {
  const sizes: any = {};
  const nameWithoutExt = path.parse(filename).name;
  const ext = path.parse(filename).ext;

  // Get original image metadata
  const metadata = await sharp(originalPath).metadata();

  // Process each size
  for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
    const sizedFilename = `${nameWithoutExt}-${sizeName}${ext}`;
    const sizedPath = path.join(uploadDir, sizedFilename);

    const resized = await sharp(originalPath)
      .resize(dimensions.width, dimensions.height, {
        fit: 'cover',
        position: 'center',
      })
      .toFile(sizedPath);

    sizes[sizeName] = {
      url: `/uploads/${sizedFilename}`,
      width: resized.width,
      height: resized.height,
    };
  }

  // Also save the full/original size info
  sizes.original = {
    url: `/uploads/${filename}`,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };

  return sizes;
}

// Upload media
export const uploadMedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  if (!req.files || !req.files.file) {
    throw new AppError('No file uploaded', 400);
  }

  const file: any = req.files.file;
  const uploadDir = process.env.UPLOAD_DIR || './uploads';

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new AppError('Invalid file type. Only images are allowed.', 400);
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new AppError('File too large. Maximum size is 10MB.', 400);
  }

  const filename = `${uuidv4()}${path.extname(file.name)}`;
  const filepath = path.join(uploadDir, filename);

  // Create upload directory if not exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save original file
  await file.mv(filepath);

  let sizes: any = {};
  let width = 800;
  let height = 600;

  // Process image if it's an image file
  if (file.mimetype.startsWith('image/')) {
    try {
      sizes = await processImage(filepath, filename, uploadDir);
      width = sizes.original?.width || 800;
      height = sizes.original?.height || 600;
    } catch (error) {
      console.error('Error processing image:', error);
      // Use fallback values if processing fails
      sizes = {
        original: {
          url: `/uploads/${filename}`,
          width: 800,
          height: 600,
        },
        full: {
          url: `/uploads/${filename}`,
          width: 800,
          height: 600,
        },
        thumb: {
          url: `/uploads/${filename}`,
          width: 150,
          height: 150,
        },
        medium: {
          url: `/uploads/${filename}`,
          width: 300,
          height: 300,
        },
        large: {
          url: `/uploads/${filename}`,
          width: 800,
          height: 600,
        },
      };
    }
  }

  // Save to database
  const media = await prisma.media.create({
    data: {
      filename: file.name,
      path: filepath,
      url: `/uploads/${filename}`,
      mimeType: file.mimetype,
      size: file.size,
      userId: req.user.userId,
      metadata: sizes, // Store all sizes in metadata
    },
  });

  res.json({
    id: media.id,
    source_url: sizes.full?.url || sizes.original?.url || media.url,
    sizes: {
      thumbnail: sizes.thumb || { url: media.url, width: 150, height: 150 },
      medium: sizes.medium || { url: media.url, width: 300, height: 300 },
      large: sizes.large || { url: media.url, width: 800, height: 600 },
      full: sizes.full || sizes.original || { url: media.url, width: 800, height: 600 },
    },
    media_details: {
      file: filename,
      width: width || 800,
      height: height || 600,
      filesize: media.size,
      sizes,
    },
  });
});
