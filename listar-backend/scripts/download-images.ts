/**
 * Download all images from Unsplash to local storage
 * This script downloads all external images and saves them locally
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Create uploads directory structure
const IMAGE_DIRS = {
  categories: path.join(UPLOAD_DIR, 'categories'),
  locations: path.join(UPLOAD_DIR, 'locations'),
  listings: path.join(UPLOAD_DIR, 'listings'),
  sliders: path.join(UPLOAD_DIR, 'sliders'),
};

// Create all directories
Object.values(IMAGE_DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Download image from URL
 */
async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location!, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(filepath);
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Process and resize image
 */
async function processImage(
  sourceUrl: string,
  targetDir: string,
  filename: string
): Promise<{ thumb: string; medium: string; full: string; original: string }> {
  const tempPath = path.join(targetDir, `temp-${filename}`);

  // Download original
  console.log(`  📥 Downloading: ${sourceUrl}`);
  await downloadImage(sourceUrl, tempPath);

  const nameWithoutExt = path.parse(filename).name;
  const ext = '.jpg'; // Convert all to JPG for consistency

  // Generate different sizes
  const sizes = {
    thumb: { width: 150, height: 150 },
    medium: { width: 400, height: 400 },
    full: { width: 800, height: 800 },
  };

  const result: any = {};

  // Process each size
  for (const [sizeName, dimensions] of Object.entries(sizes)) {
    const sizedFilename = `${nameWithoutExt}-${sizeName}${ext}`;
    const sizedPath = path.join(targetDir, sizedFilename);

    await sharp(tempPath)
      .resize(dimensions.width, dimensions.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 85 })
      .toFile(sizedPath);

    result[sizeName] = sizedFilename;
    console.log(`    ✓ Created ${sizeName}: ${sizedFilename}`);
  }

  // Save original (optimized)
  const originalFilename = `${nameWithoutExt}${ext}`;
  const originalPath = path.join(targetDir, originalFilename);

  await sharp(tempPath)
    .jpeg({ quality: 90 })
    .toFile(originalPath);

  result.original = originalFilename;
  console.log(`    ✓ Created original: ${originalFilename}`);

  // Delete temp file
  fs.unlinkSync(tempPath);

  return result;
}

/**
 * Main function to download all images
 */
async function main() {
  console.log('🎨 Starting image download process...\n');

  // 1. Download category images
  console.log('📁 Processing category images...');
  const categories = await prisma.category.findMany({
    where: { type: 'category', image: { not: null } },
  });

  for (const category of categories) {
    if (category.image && category.image.startsWith('http')) {
      const filename = `${category.slug}.jpg`;
      const sizes = await processImage(category.image, IMAGE_DIRS.categories, filename);

      // Update database with local paths
      await prisma.category.update({
        where: { id: category.id },
        data: {
          image: `/uploads/categories/${sizes.medium}`,
        },
      });

      console.log(`  ✅ ${category.name} - Images saved locally\n`);
    }
  }

  // 2. Download location images
  console.log('\n🌍 Processing location images...');
  const locations = await prisma.category.findMany({
    where: { type: 'location', image: { not: null } },
  });

  for (const location of locations) {
    if (location.image && location.image.startsWith('http')) {
      const filename = `${location.slug}.jpg`;
      const sizes = await processImage(location.image, IMAGE_DIRS.locations, filename);

      await prisma.category.update({
        where: { id: location.id },
        data: {
          image: `/uploads/locations/${sizes.medium}`,
        },
      });

      console.log(`  ✅ ${location.name} - Images saved locally\n`);
    }
  }

  // 3. Download listing images
  console.log('\n🏢 Processing listing images...');
  const listings = await prisma.listing.findMany({
    where: { thumbnail: { not: null } },
    include: { galleries: true },
  });

  for (const listing of listings) {
    console.log(`\n  Processing: ${listing.title}`);

    // Download thumbnail
    if (listing.thumbnail && listing.thumbnail.startsWith('http')) {
      const filename = `listing-${listing.id}-thumb.jpg`;
      const sizes = await processImage(listing.thumbnail, IMAGE_DIRS.listings, filename);

      await prisma.listing.update({
        where: { id: listing.id },
        data: {
          thumbnail: `/uploads/listings/${sizes.full}`,
        },
      });
    }

    // Download gallery images
    for (let i = 0; i < listing.galleries.length; i++) {
      const gallery = listing.galleries[i];
      if (gallery.full && gallery.full.startsWith('http')) {
        const filename = `listing-${listing.id}-gallery-${i + 1}.jpg`;
        const sizes = await processImage(gallery.full, IMAGE_DIRS.listings, filename);

        await prisma.gallery.update({
          where: { id: gallery.id },
          data: {
            thumb: `/uploads/listings/${sizes.thumb}`,
            full: `/uploads/listings/${sizes.full}`,
          },
        });
      }
    }

    console.log(`  ✅ ${listing.title} - All images saved locally`);
  }

  // 4. Download slider images
  console.log('\n\n🎠 Processing slider images...');
  const sliderUrls = [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
    'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=1200',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200',
  ];

  const localSliders: string[] = [];
  for (let i = 0; i < sliderUrls.length; i++) {
    const filename = `slider-${i + 1}.jpg`;
    const tempPath = path.join(IMAGE_DIRS.sliders, filename);

    await downloadImage(sliderUrls[i], tempPath);

    // Optimize slider
    const optimizedPath = path.join(IMAGE_DIRS.sliders, `slider-${i + 1}-optimized.jpg`);
    await sharp(tempPath)
      .resize(1200, 600, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toFile(optimizedPath);

    fs.unlinkSync(tempPath);
    localSliders.push(`/uploads/sliders/slider-${i + 1}-optimized.jpg`);
    console.log(`  ✅ Slider ${i + 1} saved locally`);
  }

  console.log('\n\n✨ Image download complete!');
  console.log('\n📊 Summary:');
  console.log(`  - Categories: ${categories.length} images`);
  console.log(`  - Locations: ${locations.length} images`);
  console.log(`  - Listings: ${listings.length} items`);
  console.log(`  - Sliders: ${sliderUrls.length} images`);
  console.log('\n💾 All images stored in: /uploads/');
  console.log('   ├── categories/');
  console.log('   ├── locations/');
  console.log('   ├── listings/');
  console.log('   └── sliders/');
  console.log('\n🎯 Next steps:');
  console.log('   1. Update home controller to use local slider URLs');
  console.log('   2. Restart backend: docker-compose restart backend');
  console.log('   3. Restart mobile app to see local images');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
