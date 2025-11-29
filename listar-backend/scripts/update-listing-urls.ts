import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating listing image URLs to local paths...\n');

  // Get all listings
  const listings = await prisma.listing.findMany({
    include: { galleries: true },
  });

  console.log(`📋 Found ${listings.length} listings to update\n`);

  for (const listing of listings) {
    console.log(`Processing: ${listing.title} (ID: ${listing.id})`);

    // Update thumbnail if it's an external URL
    if (listing.thumbnail && listing.thumbnail.startsWith('http')) {
      const newThumbnail = `/uploads/listings/listing-${listing.id}-thumb-full.jpg`;

      await prisma.listing.update({
        where: { id: listing.id },
        data: { thumbnail: newThumbnail },
      });

      console.log(`  ✅ Updated thumbnail: ${newThumbnail}`);
    }

    // Update galleries
    for (let i = 0; i < listing.galleries.length; i++) {
      const gallery = listing.galleries[i];

      if (gallery.full && gallery.full.startsWith('http')) {
        const thumbUrl = `/uploads/listings/listing-${listing.id}-gallery-${i + 1}-thumb.jpg`;
        const fullUrl = `/uploads/listings/listing-${listing.id}-gallery-${i + 1}-full.jpg`;

        await prisma.gallery.update({
          where: { id: gallery.id },
          data: {
            thumb: thumbUrl,
            full: fullUrl,
          },
        });

        console.log(`  ✅ Updated gallery ${i + 1}: ${fullUrl}`);
      }
    }
  }

  console.log('\n✨ Database update complete!');
  console.log('\n📊 Summary:');
  console.log(`  - Updated ${listings.length} listings`);
  console.log('\n🎯 Next step: Restart mobile app to see local images');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
