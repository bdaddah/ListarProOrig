/**
 * Storage utility for handling image uploads
 * Supports both local storage and cloud storage (S3, Cloudinary)
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface ImageSize {
  url: string;
  width: number;
  height: number;
}

export interface ProcessedImage {
  thumb: ImageSize;
  medium: ImageSize;
  large: ImageSize;
  full: ImageSize;
  original: ImageSize;
}

/**
 * Local Storage Handler
 */
export class LocalStorage {
  private uploadDir: string;

  constructor(uploadDir: string = './uploads') {
    this.uploadDir = uploadDir;
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Process and save image in multiple sizes
   */
  async processImage(
    buffer: Buffer,
    filename: string
  ): Promise<ProcessedImage> {
    const sizes = {
      thumb: { width: 150, height: 150 },
      medium: { width: 300, height: 300 },
      large: { width: 800, height: 800 },
      full: { width: 1200, height: 1200 },
    };

    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const result: any = {};

    // Get original metadata
    const metadata = await sharp(buffer).metadata();

    // Save original
    const originalPath = path.join(this.uploadDir, filename);
    await sharp(buffer).toFile(originalPath);

    result.original = {
      url: `/uploads/${filename}`,
      width: metadata.width || 0,
      height: metadata.height || 0,
    };

    // Process each size
    for (const [sizeName, dimensions] of Object.entries(sizes)) {
      const sizedFilename = `${nameWithoutExt}-${sizeName}${ext}`;
      const sizedPath = path.join(this.uploadDir, sizedFilename);

      const resized = await sharp(buffer)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true, // Don't enlarge smaller images
        })
        .jpeg({ quality: 85 }) // Optimize JPEG quality
        .png({ compressionLevel: 9 }) // Optimize PNG compression
        .toFile(sizedPath);

      result[sizeName] = {
        url: `/uploads/${sizedFilename}`,
        width: resized.width,
        height: resized.height,
      };
    }

    return result as ProcessedImage;
  }

  /**
   * Delete image and all its sizes
   */
  async deleteImage(filename: string): Promise<void> {
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext;

    // Delete original
    const originalPath = path.join(this.uploadDir, filename);
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    // Delete all sizes
    const sizes = ['thumb', 'medium', 'large', 'full'];
    for (const size of sizes) {
      const sizedFilename = `${nameWithoutExt}-${size}${ext}`;
      const sizedPath = path.join(this.uploadDir, sizedFilename);
      if (fs.existsSync(sizedPath)) {
        fs.unlinkSync(sizedPath);
      }
    }
  }
}

/**
 * S3 Storage Handler (AWS S3, DigitalOcean Spaces, etc.)
 * Uncomment and configure when ready to use cloud storage
 */
/*
import AWS from 'aws-sdk';

export class S3Storage {
  private s3: AWS.S3;
  private bucket: string;
  private region: string;

  constructor(config: {
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    region: string;
  }) {
    this.bucket = config.bucket;
    this.region = config.region;

    this.s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    });
  }

  async uploadImage(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async deleteImage(filename: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: filename,
    };

    await this.s3.deleteObject(params).promise();
  }
}
*/

/**
 * Cloudinary Storage Handler
 * Uncomment and configure when ready to use Cloudinary
 */
/*
import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryStorage {
  constructor(config: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  }) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
  }

  async uploadImage(buffer: Buffer, filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'listar',
          public_id: filename,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
*/

// Export the storage instance based on environment
export const storage = new LocalStorage(process.env.UPLOAD_DIR || './uploads');
