# Image Management in ListarPro Backend

## Overview

The ListarPro backend uses a WordPress-compatible image management system with automatic resizing and optimization.

## Storage Locations

### WordPress Backend
```
wp-content/uploads/YYYY/MM/filename.jpg
wp-content/plugins/listar-directory-listing/assets/images/
```

### TypeScript Backend (Current)
```
/uploads/
  - {uuid}-thumb.jpg     (150x150)
  - {uuid}-medium.jpg    (300x300)
  - {uuid}-large.jpg     (800x800)
  - {uuid}-full.jpg      (1200x1200)
  - {uuid}.jpg           (original)
```

## Features

### ✅ Automatic Image Resizing
When you upload an image, the system automatically creates 4 sizes:
- **Thumbnail**: 150x150px - for lists, avatars
- **Medium**: 300x300px - for cards, previews
- **Large**: 800x800px - for detail views
- **Full**: 1200x1200px - for hero images, galleries

### ✅ Image Optimization
- **JPEG**: Quality set to 85% (good balance between quality and size)
- **PNG**: Compression level 9 (maximum compression)
- **Smart Resizing**: Images are never enlarged beyond original dimensions

### ✅ File Validation
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Max Size**: 10MB per file
- **Security**: UUID-based filenames prevent conflicts

## API Endpoints

### Upload Image
```bash
POST /wp-json/wp/v2/media
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": <binary data>
}
```

**Response:**
```json
{
  "id": 123,
  "source_url": "/uploads/abc-123-full.jpg",
  "sizes": {
    "thumbnail": {
      "url": "/uploads/abc-123-thumb.jpg",
      "width": 150,
      "height": 150
    },
    "medium": {
      "url": "/uploads/abc-123-medium.jpg",
      "width": 300,
      "height": 300
    },
    "large": {
      "url": "/uploads/abc-123-large.jpg",
      "width": 800,
      "height": 800
    },
    "full": {
      "url": "/uploads/abc-123-full.jpg",
      "width": 1200,
      "height": 1200
    }
  },
  "media_details": {
    "file": "abc-123.jpg",
    "width": 2400,
    "height": 1600,
    "filesize": 245678
  }
}
```

## Storage Options

### Option 1: Local Storage (Current Implementation) 📁

**Pros:**
- Simple setup
- No external dependencies
- Full control
- Free

**Cons:**
- No CDN
- Limited scalability
- Manual backups needed
- Storage on same server as app

**Best for:** Development, small deployments, testing

### Option 2: AWS S3 ☁️

**Pros:**
- Highly scalable
- Built-in CDN (CloudFront)
- Automatic backups
- Pay-per-use pricing

**Setup:**
```bash
npm install aws-sdk
```

```typescript
// .env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=listar-images
AWS_REGION=us-east-1
```

**Cost:** ~$0.023 per GB/month + transfer

### Option 3: Cloudinary ⚡

**Pros:**
- Automatic image optimization
- Built-in transformations
- Fast CDN
- Generous free tier

**Setup:**
```bash
npm install cloudinary
```

```typescript
// .env
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**Cost:** Free up to 25GB, then ~$0.10/GB/month

### Option 4: DigitalOcean Spaces 🌊

**Pros:**
- S3-compatible API
- Fixed pricing
- Built-in CDN
- Simple billing

**Cost:** $5/month for 250GB

## Migration Guide

### From WordPress to TypeScript Backend

1. **Export WordPress Media:**
```bash
# Copy wp-content/uploads to backend
cp -r /path/to/wordpress/wp-content/uploads /path/to/backend/uploads
```

2. **Import to Database:**
```typescript
// Create migration script
import fs from 'fs';
import path from 'path';
import prisma from './utils/db';

async function migrateWordPressImages() {
  const uploadsDir = './uploads';
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);

    await prisma.media.create({
      data: {
        filename: file,
        path: filePath,
        url: `/uploads/${file}`,
        size: stats.size,
        userId: 1, // Admin user
      },
    });
  }
}
```

### To Cloud Storage (S3/Cloudinary)

1. **Update Environment Variables:**
```bash
STORAGE_TYPE=s3  # or 'cloudinary' or 'local'
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=listar-images
```

2. **Uncomment Cloud Storage Code:**
- Edit `src/utils/storage.ts`
- Uncomment S3Storage or CloudinaryStorage class
- Update `src/controllers/media.controller.ts` to use cloud storage

3. **Migrate Existing Files:**
```typescript
import { storage } from './utils/storage';
import fs from 'fs';

async function migrateToCloud() {
  const localFiles = fs.readdirSync('./uploads');

  for (const file of localFiles) {
    const buffer = fs.readFileSync(`./uploads/${file}`);
    await storage.uploadImage(buffer, file, 'image/jpeg');
  }
}
```

## Best Practices

### 1. Use Appropriate Sizes
- **Lists/Grids**: Use `thumb` or `medium`
- **Detail Pages**: Use `large` or `full`
- **Hero/Banners**: Use `full` or `original`

### 2. Lazy Loading
```typescript
// Mobile app
<Image
  source={{ uri: item.image.thumb }}
  defaultSource={require('./placeholder.png')}
/>
```

### 3. Progressive Enhancement
```typescript
// Load thumb first, then full
const [imageUri, setImageUri] = useState(item.image.thumb);

useEffect(() => {
  Image.prefetch(item.image.full).then(() => {
    setImageUri(item.image.full);
  });
}, []);
```

### 4. Caching
- Enable browser/CDN caching
- Use image URLs with cache busting (query params)
- Set appropriate Cache-Control headers

### 5. Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf backups/uploads-$DATE.tar.gz uploads/
aws s3 cp backups/uploads-$DATE.tar.gz s3://listar-backups/
```

## Performance Tips

### 1. Use WebP Format
```typescript
// Convert to WebP for smaller file sizes
await sharp(buffer)
  .webp({ quality: 80 })
  .toFile(outputPath);
```

### 2. Implement CDN
- Use CloudFront, Cloudflare, or Fastly
- Configure CORS for cross-origin requests
- Enable gzip/brotli compression

### 3. Optimize on Upload
```typescript
// Remove EXIF data, optimize colors
await sharp(buffer)
  .rotate() // Auto-rotate based on EXIF
  .withMetadata({ orientation: undefined }) // Remove orientation
  .toFile(outputPath);
```

### 4. Rate Limiting
```typescript
// Limit uploads per user
const uploadCount = await prisma.media.count({
  where: {
    userId: req.user.userId,
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
    },
  },
});

if (uploadCount > 50) {
  throw new AppError('Upload limit exceeded', 429);
}
```

## Troubleshooting

### Images not showing in mobile app?
- Check backend URL in `app/api/restapi.ts`
- Verify `/uploads` folder is accessible
- Check file permissions: `chmod 755 uploads`

### Large file upload fails?
- Increase max file size in `.env`
- Update nginx/apache upload limits
- Check disk space: `df -h`

### Slow image processing?
- Use worker threads for processing
- Implement queue system (Bull, BullMQ)
- Process async and notify when done

## Example Usage

### Upload from Mobile App
```typescript
const uploadImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });

  const response = await Api.http.uploadMedia(formData);
  return response;
};
```

### Display in Mobile App
```typescript
<Image
  source={{ uri: listing.image.full }}
  style={{ width: 300, height: 200 }}
  resizeMode="cover"
/>
```

## Monitoring

### Track Storage Usage
```sql
-- PostgreSQL query
SELECT
  SUM(size) / 1024 / 1024 as total_mb,
  COUNT(*) as total_files
FROM media;
```

### Monitor Upload Errors
```typescript
// Log failed uploads
console.error('Upload failed:', {
  user: req.user.userId,
  filename: file.name,
  size: file.size,
  error: error.message,
});
```

## Security

### 1. Validate File Content
```typescript
import fileType from 'file-type';

const type = await fileType.fromBuffer(buffer);
if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
  throw new AppError('Invalid image file');
}
```

### 2. Scan for Malware
```typescript
// Use ClamAV or similar
import clamscan from 'clamscan';

const scanner = await new clamscan().init();
const { isInfected } = await scanner.scanFile(filepath);
if (isInfected) {
  fs.unlinkSync(filepath);
  throw new AppError('Malicious file detected');
}
```

### 3. Rate Limiting
- Implement per-user upload limits
- Use Redis for distributed rate limiting
- Block suspicious IPs

## Conclusion

The current implementation provides a solid foundation with:
- ✅ Automatic resizing
- ✅ Multiple size variants
- ✅ Image optimization
- ✅ Local storage
- ✅ Easy migration to cloud storage

For production, consider migrating to **Cloudinary** or **AWS S3** for better scalability and performance.
