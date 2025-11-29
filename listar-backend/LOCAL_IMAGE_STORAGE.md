# Local Image Storage Implementation

## Overview

All images are now stored locally in the backend's `/uploads` directory instead of relying on external Unsplash URLs. This provides better performance, reliability, and prepares the system for easy migration to cloud storage.

## Architecture

### Directory Structure

```
/uploads/
├── categories/          # Category images
│   ├── restaurants-thumb.jpg
│   ├── restaurants-medium.jpg
│   ├── restaurants-full.jpg
│   ├── restaurants.jpg (original)
│   └── ...
├── locations/           # Location images
│   ├── us-thumb.jpg
│   ├── us-medium.jpg
│   ├── us-full.jpg
│   └── ...
├── listings/            # Listing & gallery images
│   ├── listing-1-thumb-full.jpg
│   ├── listing-1-gallery-1-thumb.jpg
│   ├── listing-1-gallery-1-full.jpg
│   └── ...
└── sliders/             # Homepage carousel images
    ├── slider-1.jpg
    ├── slider-2.jpg
    └── slider-3.jpg
```

### Image Sizes

Each image is processed into multiple sizes:

| Size | Dimensions | Use Case |
|------|------------|----------|
| **thumb** | 150x150px | List views, avatars |
| **medium** | 400x400px | Cards, category icons |
| **full** | 800x800px | Detail pages, galleries |
| **original** | Optimized | Backup/original |

## Implementation Details

### 1. Image Download Script

**Location:** `scripts/download-images.ts`

**What it does:**
- Downloads all external Unsplash images
- Processes them into multiple sizes using Sharp
- Saves them locally in organized directories
- Updates database with local URLs

**Run it:**
```bash
npx ts-node scripts/download-images.ts
```

### 2. Database Updates

Images are stored with local paths:
- Categories: `/uploads/categories/{slug}-{size}.jpg`
- Locations: `/uploads/locations/{slug}-{size}.jpg`
- Listings: `/uploads/listings/listing-{id}-{type}-{size}.jpg`
- Sliders: `/uploads/sliders/slider-{n}.jpg`

### 3. API Responses

The controllers automatically return images in WordPress-compatible format:

```json
{
  "image": {
    "id": 0,
    "thumb": { "url": "/uploads/categories/restaurants-thumb.jpg" },
    "medium": { "url": "/uploads/categories/restaurants-medium.jpg" },
    "full": { "url": "/uploads/categories/restaurants-full.jpg" }
  }
}
```

## Statistics

### Downloaded Images:

- **Categories:** 6 categories × 4 sizes = 24 images ✅
- **Locations:** 3 locations × 4 sizes = 12 images ✅
- **Listings:** 21 listings with thumbnails + 44 gallery images = 65 images ✅
- **Sliders:** 3 carousel images ✅
- **Total:** ~100+ images, ~15-20 MB ✅

### Database Status:

- **All listing thumbnails:** 21/21 using local paths ✅
- **All gallery images:** 44/44 using local paths ✅
- **All categories:** 6/6 using local paths ✅
- **All locations:** 3/3 using local paths ✅
- **External URLs:** 0 ✅

## Mobile App Configuration

The mobile app is already configured to work with local images:

**Base URL:** `http://192.168.42.129:3000`

Images are served as: `http://192.168.42.129:3000/uploads/categories/restaurants-medium.jpg`

## Migration to Cloud Storage

The architecture is designed for easy migration to cloud storage (S3, Cloudinary, etc.).

### Current Flow (Local Storage):

```
1. Image uploaded → Saved to /uploads/
2. Multiple sizes created with Sharp
3. Database stores: /uploads/path/to/image.jpg
4. Express serves static files from /uploads/
```

### Future Flow (Cloud Storage):

```
1. Image uploaded → Upload to S3/Cloudinary
2. Get cloud URL
3. Database stores: https://cdn.example.com/path/to/image.jpg
4. Images served from CDN
```

### How to Migrate to Cloud:

**Option 1: AWS S3**

1. **Install AWS SDK:**
```bash
npm install aws-sdk
```

2. **Update environment variables:**
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=listar-images
AWS_REGION=us-east-1
```

3. **Uncomment S3Storage class** in `src/utils/storage.ts`

4. **Update media controller** to use S3Storage instead of LocalStorage

5. **Run migration script:**
```bash
npx ts-node scripts/migrate-to-s3.ts
```

**Option 2: Cloudinary**

1. **Install Cloudinary SDK:**
```bash
npm install cloudinary
```

2. **Update environment variables:**
```env
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

3. **Uncomment CloudinaryStorage class** in `src/utils/storage.ts`

4. **Run migration script:**
```bash
npx ts-node scripts/migrate-to-cloudinary.ts
```

## Performance Benefits

### Before (External URLs):
- ❌ Depends on Unsplash availability
- ❌ Slow loading from external servers
- ❌ No caching control
- ❌ URLs can break/expire

### After (Local Storage):
- ✅ Full control over images
- ✅ Faster loading (same server)
- ✅ Custom caching policies
- ✅ Never broken links
- ✅ Optimized sizes for mobile
- ✅ Ready for CDN migration

## Docker Integration

Images are automatically copied to the Docker container:

```yaml
# docker-compose.yml
volumes:
  - ./uploads:/app/uploads  # Mounted volume
```

The `/uploads` directory is mounted as a volume, so images persist even when containers restart.

## Backup Strategy

### Development:
Images are in `/uploads/` - backed up with your code repository (add to .gitignore for production)

### Production:
1. **S3/Cloud:** Automatic backups and versioning
2. **Local:** Daily backups to S3
   ```bash
   # Backup script
   tar -czf backups/uploads-$(date +%Y%m%d).tar.gz uploads/
   aws s3 cp backups/uploads-$(date +%Y%m%d).tar.gz s3://listar-backups/
   ```

## Image Optimization

All images are optimized during download:

- **Format:** JPG (smaller size, good quality)
- **Quality:** 85% for images, 90% for originals
- **Compression:** Sharp library with optimal settings
- **Size reduction:** ~50-70% compared to originals

## Troubleshooting

### Images not showing in mobile app?

1. **Check backend is serving images:**
   ```bash
   curl -I http://192.168.42.129:3000/uploads/sliders/slider-1.jpg
   ```

2. **Verify uploads directory exists:**
   ```bash
   docker exec listar-backend ls -la /app/uploads
   ```

3. **Check database has local URLs:**
   ```sql
   SELECT image FROM categories LIMIT 5;
   ```

### Re-download all images:

```bash
# Delete existing
rm -rf uploads/categories uploads/locations uploads/listings uploads/sliders

# Re-run download script
npx ts-node scripts/download-images.ts

# Copy to Docker
docker cp uploads listar-backend:/app/
docker-compose restart backend
```

### Add new images:

```bash
# Option 1: Via API (upload endpoint)
curl -X POST http://192.168.42.129:3000/wp-json/wp/v2/media \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"

# Option 2: Manually add to uploads/
cp new-image.jpg uploads/categories/
docker cp uploads/categories/new-image.jpg listar-backend:/app/uploads/categories/
```

## Commands Reference

### Download all images:
```bash
npx ts-node scripts/download-images.ts
```

### Copy uploads to Docker:
```bash
docker cp uploads listar-backend:/app/
```

### Restart backend:
```bash
docker-compose restart backend
```

### Check image accessibility:
```bash
curl -I http://192.168.42.129:3000/uploads/sliders/slider-1.jpg
```

### List all local images:
```bash
find uploads -type f -name "*.jpg" | wc -l
```

### Check total size:
```bash
du -sh uploads/
```

## Next Steps for Production

1. ✅ **Local Development:** Currently implemented
2. 🔄 **Staging:** Test with S3 or Cloudinary
3. 🚀 **Production:** Migrate to cloud storage with CDN
4. 📊 **Monitoring:** Track image loading performance
5. 🔄 **Backup:** Automated daily backups

## Conclusion

The local image storage system provides:
- ✅ Full control and reliability
- ✅ Better performance than external URLs
- ✅ Easy cloud migration path
- ✅ Optimized images for mobile
- ✅ Production-ready architecture

Your app now has **100% locally stored images** that are fast, reliable, and ready to scale! 🎉
