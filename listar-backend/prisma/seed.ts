import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin',
      userLevel: 10,
      active: true,
      emailVerified: true,
    },
  });

  console.log('✓ Admin user created:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);

  const demo = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      displayName: 'Demo User',
      userLevel: 1,
      active: true,
      emailVerified: true,
    },
  });

  console.log('✓ Demo user created:', demo.email);

  // Create categories with images and multilingual support
  const categories = [
    {
      name: 'Real Estate',
      slug: 'real-estate',
      icon: 'fas fa-building',
      color: '#4A90D9',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      translations: {
        en: 'Real Estate',
        fr: 'Immobilier',
        ar: 'العقارات'
      }
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      icon: 'fas fa-laptop',
      color: '#34C759',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      translations: {
        en: 'Electronics',
        fr: 'Électronique',
        ar: 'الإلكترونيات'
      }
    },
    {
      name: 'Job Offers',
      slug: 'job-offers',
      icon: 'fas fa-briefcase',
      color: '#FF9500',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400',
      translations: {
        en: 'Job Offers',
        fr: 'Offres d\'emploi',
        ar: 'عروض العمل'
      }
    },
    {
      name: 'Services',
      slug: 'services',
      icon: 'fas fa-concierge-bell',
      color: '#AF52DE',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400',
      translations: {
        en: 'Services',
        fr: 'Services',
        ar: 'الخدمات'
      }
    },
    {
      name: 'Automobiles',
      slug: 'automobiles',
      icon: 'fas fa-car',
      color: '#FF3B30',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400',
      translations: {
        en: 'Automobiles',
        fr: 'Automobiles',
        ar: 'السيارات'
      }
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      icon: 'fas fa-tshirt',
      color: '#FF2D92',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      translations: {
        en: 'Fashion',
        fr: 'Mode',
        ar: 'الأزياء'
      }
    },
    {
      name: 'Others',
      slug: 'others',
      icon: 'fas fa-ellipsis-h',
      color: '#8E8E93',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1586953208270-767889fa9b8e?w=400',
      translations: {
        en: 'Others',
        fr: 'Autres',
        ar: 'أخرى'
      }
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✓ Categories created');

  // Create locations with images and multilingual support
  const locations = [
    {
      name: 'United States',
      slug: 'us',
      type: 'location',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400',
      translations: {
        en: 'United States',
        fr: 'États-Unis',
        ar: 'الولايات المتحدة'
      }
    },
    {
      name: 'United Kingdom',
      slug: 'uk',
      type: 'location',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
      translations: {
        en: 'United Kingdom',
        fr: 'Royaume-Uni',
        ar: 'المملكة المتحدة'
      }
    },
    {
      name: 'France',
      slug: 'fr',
      type: 'location',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      translations: {
        en: 'France',
        fr: 'France',
        ar: 'فرنسا'
      }
    },
  ];

  for (const loc of locations) {
    const country = await prisma.category.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    });

    // Add some cities
    if (loc.slug === 'us') {
      await prisma.category.upsert({
        where: { slug: 'new-york' },
        update: {},
        create: {
          name: 'New York',
          slug: 'new-york',
          type: 'location',
          parentId: country.id,
          translations: { en: 'New York', fr: 'New York', ar: 'نيويورك' },
        },
      });
      await prisma.category.upsert({
        where: { slug: 'los-angeles' },
        update: {},
        create: {
          name: 'Los Angeles',
          slug: 'los-angeles',
          type: 'location',
          parentId: country.id,
          translations: { en: 'Los Angeles', fr: 'Los Angeles', ar: 'لوس أنجلوس' },
        },
      });
    }
    if (loc.slug === 'fr') {
      await prisma.category.upsert({
        where: { slug: 'paris' },
        update: {},
        create: {
          name: 'Paris',
          slug: 'paris',
          type: 'location',
          parentId: country.id,
          translations: { en: 'Paris', fr: 'Paris', ar: 'باريس' },
        },
      });
    }
  }

  console.log('✓ Locations created');

  // Create features
  const features = [
    { name: 'WiFi', slug: 'wifi', icon: 'fas fa-wifi', type: 'feature' },
    { name: 'Parking', slug: 'parking', icon: 'fas fa-parking', type: 'feature' },
    { name: 'Pet Friendly', slug: 'pet-friendly', icon: 'fas fa-paw', type: 'feature' },
    { name: 'Wheelchair Accessible', slug: 'wheelchair', icon: 'fas fa-wheelchair', type: 'feature' },
  ];

  for (const feat of features) {
    await prisma.category.upsert({
      where: { slug: feat.slug },
      update: {},
      create: feat,
    });
  }

  console.log('✓ Features created');

  // Create sample settings
  await prisma.setting.upsert({
    where: { key: 'app_name' },
    update: {},
    create: {
      key: 'app_name',
      value: 'ListarPro',
      type: 'general',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'currency' },
    update: {},
    create: {
      key: 'currency',
      value: { code: 'USD', symbol: '$' },
      type: 'general',
    },
  });

  console.log('✓ Settings created');

  // Create sample posts
  const posts = [
    {
      title: 'Welcome to ListarPro',
      slug: 'welcome-to-listarpro',
      content: 'This is a sample blog post. You can create more posts from the admin panel.',
      excerpt: 'Welcome to our directory platform',
      status: 'publish',
    },
    {
      title: 'How to List Your Business',
      slug: 'how-to-list-business',
      content: 'Follow these simple steps to list your business on our platform...',
      excerpt: 'A guide to listing your business',
      status: 'publish',
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log('✓ Sample posts created');

  // Get category and location IDs for listings
  const realEstateCat = await prisma.category.findUnique({ where: { slug: 'real-estate' } });
  const electronicsCat = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const jobsCat = await prisma.category.findUnique({ where: { slug: 'job-offers' } });
  const servicesCat = await prisma.category.findUnique({ where: { slug: 'services' } });
  const automobilesCat = await prisma.category.findUnique({ where: { slug: 'automobiles' } });
  const fashionCat = await prisma.category.findUnique({ where: { slug: 'fashion' } });
  const othersCat = await prisma.category.findUnique({ where: { slug: 'others' } });
  const nyCity = await prisma.category.findUnique({ where: { slug: 'new-york' } });
  const laCity = await prisma.category.findUnique({ where: { slug: 'los-angeles' } });
  const parisCity = await prisma.category.findUnique({ where: { slug: 'paris' } });
  const usCountry = await prisma.category.findUnique({ where: { slug: 'us' } });
  const frCountry = await prisma.category.findUnique({ where: { slug: 'fr' } });

  // Create sample listings with diverse images from Unsplash
  const listings = [
    // Real Estate
    {
      title: 'Luxury Manhattan Penthouse',
      slug: 'luxury-manhattan-penthouse-' + Date.now(),
      content: 'Stunning 4-bedroom penthouse with panoramic city views. Modern design, private terrace, and premium amenities.',
      excerpt: 'Luxury penthouse with city views',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      address: '432 Park Avenue, New York, NY 10022',
      phone: '+1 (212) 555-0100',
      email: 'info@luxuryrealty.com',
      website: 'https://luxuryrealty.com',
      latitude: 40.7614,
      longitude: -73.9718,
      priceMin: 2500000,
      priceMax: 5000000,
      ratingAvg: 4.9,
      ratingCount: 45,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: realEstateCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', thumb: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', order: 2 },
      ],
    },
    {
      title: 'Charming Paris Apartment',
      slug: 'charming-paris-apartment-' + Date.now(),
      content: 'Beautiful 2-bedroom apartment in the heart of Le Marais. Classic Parisian architecture with modern comfort.',
      excerpt: 'Classic Parisian apartment',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      address: '15 Rue des Archives, Paris 75004',
      phone: '+33 1 42 55 0100',
      email: 'contact@parisimmo.fr',
      website: 'https://parisimmo.fr',
      latitude: 48.8566,
      longitude: 2.3522,
      priceMin: 850000,
      priceMax: 1200000,
      ratingAvg: 4.8,
      ratingCount: 32,
      userId: admin.id,
      cityId: parisCity?.id,
      countryId: frCountry?.id,
      categoryId: realEstateCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', thumb: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', order: 2 },
      ],
    },
    // Electronics
    {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max-' + Date.now(),
      content: 'Brand new iPhone 15 Pro Max 256GB. Titanium design, A17 Pro chip, advanced camera system.',
      excerpt: 'Latest iPhone model',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
      address: '767 5th Ave, New York, NY 10153',
      phone: '+1 (212) 555-0200',
      email: 'sales@techstore.com',
      website: 'https://techstore.com',
      latitude: 40.7636,
      longitude: -73.9729,
      priceMin: 1199,
      priceMax: 1499,
      ratingAvg: 4.9,
      ratingCount: 523,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: electronicsCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800', thumb: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', thumb: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', order: 2 },
      ],
    },
    {
      title: 'MacBook Pro M3',
      slug: 'macbook-pro-m3-' + Date.now(),
      content: 'MacBook Pro 16" with M3 Max chip. 36GB RAM, 1TB SSD. Perfect for professionals.',
      excerpt: 'Professional laptop',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      address: '401 N Michigan Ave, Los Angeles, CA 90028',
      phone: '+1 (310) 555-0300',
      email: 'info@applecenter.com',
      website: 'https://applecenter.com',
      latitude: 34.0522,
      longitude: -118.2437,
      priceMin: 2499,
      priceMax: 3499,
      ratingAvg: 4.8,
      ratingCount: 289,
      userId: admin.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: electronicsCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', thumb: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', thumb: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', order: 2 },
      ],
    },
    // Job Offers
    {
      title: 'Senior Software Engineer',
      slug: 'senior-software-engineer-' + Date.now(),
      content: 'Join our team as a Senior Software Engineer. Work with cutting-edge technologies, competitive salary, remote-friendly.',
      excerpt: 'Tech company hiring',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      address: '1 Infinite Loop, Cupertino, CA 95014',
      phone: '+1 (408) 555-0400',
      email: 'careers@techcorp.com',
      website: 'https://techcorp.com/careers',
      latitude: 37.3318,
      longitude: -122.0312,
      priceMin: 150000,
      priceMax: 250000,
      ratingAvg: 4.7,
      ratingCount: 156,
      userId: admin.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: jobsCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', thumb: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', order: 2 },
      ],
    },
    {
      title: 'Marketing Manager',
      slug: 'marketing-manager-' + Date.now(),
      content: 'Leading marketing agency seeking experienced Marketing Manager. Creative environment, growth opportunities.',
      excerpt: 'Marketing position',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      address: '350 5th Ave, New York, NY 10118',
      phone: '+1 (212) 555-0500',
      email: 'hr@marketingpro.com',
      website: 'https://marketingpro.com',
      latitude: 40.7484,
      longitude: -73.9857,
      priceMin: 80000,
      priceMax: 120000,
      ratingAvg: 4.5,
      ratingCount: 89,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: jobsCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', thumb: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800', thumb: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400', order: 2 },
      ],
    },
    // Services
    {
      title: 'Professional Cleaning Services',
      slug: 'professional-cleaning-' + Date.now(),
      content: 'Top-rated cleaning services for homes and offices. Eco-friendly products, trained staff, flexible scheduling.',
      excerpt: 'Home & office cleaning',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      address: '123 Service Blvd, New York, NY 10001',
      phone: '+1 (212) 555-0600',
      email: 'book@cleanpro.com',
      website: 'https://cleanpro.com',
      latitude: 40.7506,
      longitude: -73.9971,
      priceMin: 50,
      priceMax: 200,
      ratingAvg: 4.8,
      ratingCount: 412,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: servicesCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', thumb: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800', thumb: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400', order: 2 },
      ],
    },
    {
      title: 'Expert Plumbing Solutions',
      slug: 'expert-plumbing-' + Date.now(),
      content: '24/7 emergency plumbing services. Licensed plumbers, fair pricing, satisfaction guaranteed.',
      excerpt: 'Plumbing services',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      address: '456 Repair Ave, Los Angeles, CA 90028',
      phone: '+1 (310) 555-0700',
      email: 'help@plumbingpro.com',
      website: 'https://plumbingpro.com',
      latitude: 34.0928,
      longitude: -118.3287,
      priceMin: 75,
      priceMax: 500,
      ratingAvg: 4.6,
      ratingCount: 267,
      userId: demo.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: servicesCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800', thumb: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800', thumb: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400', order: 2 },
      ],
    },
    // Automobiles
    {
      title: 'BMW M5 Competition 2024',
      slug: 'bmw-m5-competition-' + Date.now(),
      content: 'Brand new BMW M5 Competition. 617 HP, all-wheel drive, premium package. Certified dealer.',
      excerpt: 'Luxury sports sedan',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      address: '789 Auto Mile, New York, NY 10019',
      phone: '+1 (212) 555-0800',
      email: 'sales@premiumauto.com',
      website: 'https://premiumauto.com',
      latitude: 40.7614,
      longitude: -73.9776,
      priceMin: 105000,
      priceMax: 120000,
      ratingAvg: 4.9,
      ratingCount: 78,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: automobilesCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', thumb: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', thumb: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', order: 2 },
      ],
    },
    {
      title: 'Tesla Model S Plaid',
      slug: 'tesla-model-s-plaid-' + Date.now(),
      content: 'Tesla Model S Plaid with full self-driving capability. 1,020 HP, 0-60 in 1.99s. Like new condition.',
      excerpt: 'Electric performance sedan',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      address: '1234 Electric Ave, Los Angeles, CA 90028',
      phone: '+1 (310) 555-0900',
      email: 'info@evmotors.com',
      website: 'https://evmotors.com',
      latitude: 34.0522,
      longitude: -118.2437,
      priceMin: 89990,
      priceMax: 109990,
      ratingAvg: 4.8,
      ratingCount: 145,
      userId: demo.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: automobilesCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800', thumb: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', thumb: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400', order: 2 },
      ],
    },
    // Fashion
    {
      title: 'Designer Handbag Collection',
      slug: 'designer-handbags-' + Date.now(),
      content: 'Authentic designer handbags from top luxury brands. Limited editions, certified authenticity.',
      excerpt: 'Luxury handbags',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
      address: '611 5th Ave, New York, NY 10022',
      phone: '+1 (212) 555-1000',
      email: 'info@luxurybags.com',
      website: 'https://luxurybags.com',
      latitude: 40.7580,
      longitude: -73.9760,
      priceMin: 500,
      priceMax: 5000,
      ratingAvg: 4.7,
      ratingCount: 234,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: fashionCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', thumb: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', thumb: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', order: 2 },
      ],
    },
    {
      title: 'Vintage Clothing Store',
      slug: 'vintage-clothing-' + Date.now(),
      content: 'Curated vintage fashion from the 60s to 90s. Unique pieces, sustainable fashion.',
      excerpt: 'Vintage fashion boutique',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      address: '78 Rue du Faubourg Saint-Honoré, Paris 75008',
      phone: '+33 1 42 55 1100',
      email: 'bonjour@vintageparis.fr',
      website: 'https://vintageparis.fr',
      latitude: 48.8714,
      longitude: 2.3089,
      priceMin: 50,
      priceMax: 500,
      ratingAvg: 4.6,
      ratingCount: 189,
      userId: demo.id,
      cityId: parisCity?.id,
      countryId: frCountry?.id,
      categoryId: fashionCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', thumb: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', thumb: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', order: 2 },
      ],
    },
    // Others
    {
      title: 'Antique Furniture Collection',
      slug: 'antique-furniture-' + Date.now(),
      content: 'Rare antique furniture pieces from 18th and 19th century. Authenticated, restored, delivered.',
      excerpt: 'Antique furniture',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      address: '234 Antique Row, New York, NY 10012',
      phone: '+1 (212) 555-1200',
      email: 'info@antiquetreasures.com',
      website: 'https://antiquetreasures.com',
      latitude: 40.7258,
      longitude: -73.9983,
      priceMin: 1000,
      priceMax: 50000,
      ratingAvg: 4.8,
      ratingCount: 67,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: othersCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', thumb: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', thumb: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400', order: 2 },
      ],
    },
    {
      title: 'Musical Instruments Shop',
      slug: 'musical-instruments-' + Date.now(),
      content: 'Wide selection of guitars, pianos, drums, and more. New and vintage instruments.',
      excerpt: 'Music store',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      address: '48 W 48th St, New York, NY 10036',
      phone: '+1 (212) 555-1300',
      email: 'info@musicworld.com',
      website: 'https://musicworld.com',
      latitude: 40.7580,
      longitude: -73.9855,
      priceMin: 100,
      priceMax: 10000,
      ratingAvg: 4.7,
      ratingCount: 312,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: othersCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', thumb: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', thumb: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', order: 2 },
      ],
    },
  ];

  for (const listingData of listings) {
    const { galleries, categoryId, ...listing } = listingData;

    const createdListing = await prisma.listing.create({
      data: {
        ...listing,
        priceMin: listing.priceMin?.toString(),
        priceMax: listing.priceMax?.toString(),
      },
    });

    // Create galleries
    if (galleries) {
      for (const gallery of galleries) {
        await prisma.gallery.create({
          data: {
            ...gallery,
            listingId: createdListing.id,
          },
        });
      }
    }

    // Link category
    if (categoryId) {
      await prisma.listingCategory.create({
        data: {
          listingId: createdListing.id,
          categoryId: categoryId,
          type: 'category',
        },
      });
    }
  }

  console.log('✓ Sample listings created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
