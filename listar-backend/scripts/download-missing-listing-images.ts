import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import sharp from 'sharp';

dotenv.config();

const prisma = new PrismaClient();

// Image URLs from seed file
const listingImages: Record<number, { thumbnail: string; galleries: string[] }> = {
  6: {
    thumbnail: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
    ],
  },
  7: {
    thumbnail: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800',
    ],
  },
  8: {
    thumbnail: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    ],
  },
  9: {
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    ],
  },
  10: {
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    ],
  },
  11: {
    thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    ],
  },
  12: {
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    ],
  },
  13: {
    thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    ],
  },
  14: {
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
  },
  15: {
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    ],
  },
  16: {
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    ],
  },
  17: {
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    ],
  },
  18: {
    thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    ],
  },
  19: {
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    ],
  },
  20: {
    thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
  },
  21: {
    thumbnail: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
    galleries: [
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
    ],
  },
};

const IMAGE_DIR = path.join(process.cwd(), 'uploads', 'listings');

// Ensure directory exists
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        if (response.headers.location) {
          downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        }
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
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function processImage(
  sourceUrl: string,
  filename: string
): Promise<{ thumb: string; medium: string; full: string; original: string }> {
  const tempPath = path.join(IMAGE_DIR, `temp-${filename}`);

  console.log(`  Downloading: ${sourceUrl}`);
  await downloadImage(sourceUrl, tempPath);

  const sizes = {
    thumb: { width: 150, height: 150 },
    medium: { width: 400, height: 400 },
    full: { width: 800, height: 800 },
  };

  const result: any = {};

  for (const [sizeName, dimensions] of Object.entries(sizes)) {
    const sizedFilename = `${path.parse(filename).name}-${sizeName}.jpg`;
    const sizedPath = path.join(IMAGE_DIR, sizedFilename);

    await sharp(tempPath)
      .resize(dimensions.width, dimensions.height, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toFile(sizedPath);

    result[sizeName] = sizedFilename;
  }

  // Save optimized original
  const originalFilename = filename;
  const originalPath = path.join(IMAGE_DIR, originalFilename);
  await sharp(tempPath)
    .jpeg({ quality: 90 })
    .toFile(originalPath);

  result.original = originalFilename;

  fs.unlinkSync(tempPath);

  return result;
}

async function main() {
  console.log('📥 Downloading missing listing images (6-21)...\n');

  for (const [listingId, urls] of Object.entries(listingImages)) {
    const id = parseInt(listingId);
    console.log(`\nProcessing listing ${id}...`);

    // Download thumbnail
    if (urls.thumbnail) {
      try {
        const filename = `listing-${id}-thumb.jpg`;
        const sizes = await processImage(urls.thumbnail, filename);
        console.log(`  ✅ Thumbnail saved: ${sizes.full}`);
      } catch (error: any) {
        console.error(`  ❌ Failed to process thumbnail: ${error.message}`);
      }
    }

    // Download galleries
    for (let i = 0; i < urls.galleries.length; i++) {
      try {
        const filename = `listing-${id}-gallery-${i + 1}.jpg`;
        const sizes = await processImage(urls.galleries[i], filename);
        console.log(`  ✅ Gallery ${i + 1} saved: ${sizes.full}`);
      } catch (error: any) {
        console.error(`  ❌ Failed to process gallery ${i + 1}: ${error.message}`);
      }
    }
  }

  console.log('\n\n✅ All missing images downloaded!');
  console.log('📋 Next step: Copy to Docker container');
  console.log('   docker cp uploads listar-backend:/app/');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
