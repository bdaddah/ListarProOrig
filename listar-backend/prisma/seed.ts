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

  // Create categories with images
  const categories = [
    {
      name: 'Restaurants',
      slug: 'restaurants',
      icon: 'fas fa-utensils',
      color: '#FF6B6B',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
    },
    {
      name: 'Hotels',
      slug: 'hotels',
      icon: 'fas fa-hotel',
      color: '#4ECDC4',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    },
    {
      name: 'Shopping',
      slug: 'shopping',
      icon: 'fas fa-shopping-bag',
      color: '#FFE66D',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    },
    {
      name: 'Cafes',
      slug: 'cafes',
      icon: 'fas fa-coffee',
      color: '#95E1D3',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'
    },
    {
      name: 'Gyms',
      slug: 'gyms',
      icon: 'fas fa-dumbbell',
      color: '#F38181',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'
    },
    {
      name: 'Spas',
      slug: 'spas',
      icon: 'fas fa-spa',
      color: '#AA96DA',
      type: 'category',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400'
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

  // Create locations with images
  const locations = [
    {
      name: 'United States',
      slug: 'us',
      type: 'location',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400'
    },
    {
      name: 'United Kingdom',
      slug: 'uk',
      type: 'location',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400'
    },
    {
      name: 'Canada',
      slug: 'ca',
      type: 'location',
      image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400'
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
  const restaurantCat = await prisma.category.findUnique({ where: { slug: 'restaurants' } });
  const hotelCat = await prisma.category.findUnique({ where: { slug: 'hotels' } });
  const cafeCat = await prisma.category.findUnique({ where: { slug: 'cafes' } });
  const shoppingCat = await prisma.category.findUnique({ where: { slug: 'shopping' } });
  const gymCat = await prisma.category.findUnique({ where: { slug: 'gyms' } });
  const spaCat = await prisma.category.findUnique({ where: { slug: 'spas' } });
  const nyCity = await prisma.category.findUnique({ where: { slug: 'new-york' } });
  const laCity = await prisma.category.findUnique({ where: { slug: 'los-angeles' } });
  const usCountry = await prisma.category.findUnique({ where: { slug: 'us' } });

  // Create sample listings with diverse images from Unsplash
  const listings = [
    // More Restaurants
    {
      title: 'Sushi Paradise',
      slug: 'sushi-paradise-' + Date.now(),
      content: 'Premium sushi and Japanese cuisine. Fresh fish daily, traditional techniques, modern presentation.',
      excerpt: 'Premium Japanese sushi restaurant',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      address: '888 Madison Ave, New York, NY 10021',
      phone: '+1 (212) 555-0900',
      email: 'info@sushiparadise.com',
      website: 'https://sushiparadise.com',
      latitude: 40.7736,
      longitude: -73.9566,
      priceMin: 40,
      priceMax: 120,
      ratingAvg: 4.8,
      ratingCount: 387,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: restaurantCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', thumb: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800', thumb: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400', order: 2 },
        { full: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', thumb: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', order: 3 },
      ],
    },
    {
      title: 'The Steakhouse',
      slug: 'the-steakhouse-' + Date.now(),
      content: 'Prime cuts, aged to perfection. Classic steakhouse experience with exceptional service and wine selection.',
      excerpt: 'Premium steakhouse',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      address: '234 Park Ave, New York, NY 10167',
      phone: '+1 (212) 555-1000',
      email: 'reservations@thesteakhouse.com',
      website: 'https://thesteakhouse.com',
      latitude: 40.7549,
      longitude: -73.9732,
      priceMin: 60,
      priceMax: 180,
      ratingAvg: 4.7,
      ratingCount: 523,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: restaurantCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', thumb: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800', thumb: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', order: 2 },
      ],
    },
    {
      title: 'Green Leaf Vegetarian',
      slug: 'green-leaf-vegetarian-' + Date.now(),
      content: 'Innovative plant-based cuisine. Organic ingredients, creative dishes, sustainable practices.',
      excerpt: 'Organic vegetarian restaurant',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      address: '567 Broadway, New York, NY 10012',
      phone: '+1 (212) 555-1100',
      email: 'hello@greenleaf.com',
      website: 'https://greenleaf.com',
      latitude: 40.7241,
      longitude: -73.9967,
      priceMin: 25,
      priceMax: 60,
      ratingAvg: 4.6,
      ratingCount: 289,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: restaurantCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', thumb: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=800', thumb: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=400', order: 2 },
      ],
    },
    // More Hotels
    {
      title: 'Boutique Hotel Manhattan',
      slug: 'boutique-hotel-manhattan-' + Date.now(),
      content: 'Intimate luxury hotel in the heart of Manhattan. Designer rooms, rooftop bar, personalized service.',
      excerpt: 'Luxury boutique hotel',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      address: '777 7th Avenue, New York, NY 10019',
      phone: '+1 (212) 555-1200',
      email: 'stay@boutiquehotelmanhattan.com',
      website: 'https://boutiquehotelmanhattan.com',
      latitude: 40.7614,
      longitude: -73.9829,
      priceMin: 280,
      priceMax: 650,
      ratingAvg: 4.8,
      ratingCount: 612,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: hotelCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', thumb: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', thumb: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400', order: 2 },
        { full: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', thumb: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', order: 3 },
      ],
    },
    // More Cafes
    {
      title: 'Artisan Coffee Lab',
      slug: 'artisan-coffee-lab-' + Date.now(),
      content: 'Single-origin specialty coffee, house-roasted beans, and expert baristas. Coffee education and tastings.',
      excerpt: 'Specialty coffee roastery',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
      address: '321 Bleecker St, New York, NY 10014',
      phone: '+1 (212) 555-1300',
      email: 'info@artisancoffeelab.com',
      website: 'https://artisancoffeelab.com',
      latitude: 40.7357,
      longitude: -74.0036,
      priceMin: 4,
      priceMax: 18,
      ratingAvg: 4.9,
      ratingCount: 891,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: cafeCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800', thumb: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1559496417-e7f25c0f0c4e?w=800', thumb: 'https://images.unsplash.com/photo-1559496417-e7f25c0f0c4e?w=400', order: 2 },
      ],
    },
    {
      title: 'Book & Bean Cafe',
      slug: 'book-bean-cafe-' + Date.now(),
      content: 'Cozy bookstore cafe with carefully curated books, premium coffee, and homemade pastries. Free WiFi.',
      excerpt: 'Bookstore cafe',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800',
      address: '456 Amsterdam Ave, New York, NY 10024',
      phone: '+1 (212) 555-1400',
      email: 'hello@bookandbean.com',
      website: 'https://bookandbean.com',
      latitude: 40.7870,
      longitude: -73.9754,
      priceMin: 3,
      priceMax: 15,
      ratingAvg: 4.7,
      ratingCount: 634,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: cafeCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800', thumb: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800', thumb: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400', order: 2 },
      ],
    },
    // More Shopping
    {
      title: 'Tech Haven Store',
      slug: 'tech-haven-store-' + Date.now(),
      content: 'Latest gadgets, electronics, and tech accessories. Expert advice and hands-on demos.',
      excerpt: 'Electronics and gadgets store',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800',
      address: '890 5th Ave, New York, NY 10021',
      phone: '+1 (212) 555-1500',
      email: 'support@techhaven.com',
      website: 'https://techhaven.com',
      latitude: 40.7736,
      longitude: -73.9647,
      priceMin: 20,
      priceMax: 2000,
      ratingAvg: 4.5,
      ratingCount: 445,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: shoppingCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800', thumb: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800', thumb: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', order: 2 },
      ],
    },
    {
      title: 'Vintage Vinyl Records',
      slug: 'vintage-vinyl-records-' + Date.now(),
      content: 'Rare and collectible vinyl records. From classics to modern releases. Turntables and audio gear.',
      excerpt: 'Vintage record store',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800',
      address: '234 St Marks Pl, New York, NY 10003',
      phone: '+1 (212) 555-1600',
      email: 'info@vintagevinyl.com',
      website: 'https://vintagevinyl.com',
      latitude: 40.7282,
      longitude: -73.9851,
      priceMin: 15,
      priceMax: 500,
      ratingAvg: 4.8,
      ratingCount: 356,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: shoppingCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800', thumb: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800', thumb: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400', order: 2 },
      ],
    },
    // More Gyms
    {
      title: 'Yoga Harmony Studio',
      slug: 'yoga-harmony-studio-' + Date.now(),
      content: 'Holistic yoga studio offering Vinyasa, Hatha, and meditation classes. All levels welcome.',
      excerpt: 'Yoga and meditation studio',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      address: '678 Union Square, New York, NY 10003',
      phone: '+1 (212) 555-1700',
      email: 'namaste@yogaharmony.com',
      website: 'https://yogaharmony.com',
      latitude: 40.7359,
      longitude: -73.9911,
      priceMin: 20,
      priceMax: 150,
      ratingAvg: 4.9,
      ratingCount: 728,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: gymCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800', thumb: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400', order: 2 },
      ],
    },
    {
      title: 'CrossFit Warriors',
      slug: 'crossfit-warriors-' + Date.now(),
      content: 'High-intensity CrossFit training. Experienced coaches, supportive community, proven results.',
      excerpt: 'CrossFit training center',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      address: '999 West End Ave, New York, NY 10025',
      phone: '+1 (212) 555-1800',
      email: 'join@crossfitwarriors.com',
      website: 'https://crossfitwarriors.com',
      latitude: 40.7956,
      longitude: -73.9697,
      priceMin: 100,
      priceMax: 250,
      ratingAvg: 4.7,
      ratingCount: 412,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: gymCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800', thumb: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=400', order: 2 },
      ],
    },
    // More Spas
    {
      title: 'Zen Day Spa',
      slug: 'zen-day-spa-' + Date.now(),
      content: 'Japanese-inspired spa sanctuary. Hot stone massage, aromatherapy, and traditional treatments.',
      excerpt: 'Japanese wellness spa',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      address: '345 East 57th St, New York, NY 10022',
      phone: '+1 (212) 555-1900',
      email: 'book@zendayspa.com',
      website: 'https://zendayspa.com',
      latitude: 40.7590,
      longitude: -73.9654,
      priceMin: 80,
      priceMax: 300,
      ratingAvg: 4.8,
      ratingCount: 534,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: spaCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', thumb: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800', thumb: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400', order: 2 },
      ],
    },
    // Los Angeles Listings
    {
      title: 'Beach Yoga LA',
      slug: 'beach-yoga-la-' + Date.now(),
      content: 'Outdoor yoga classes on Venice Beach. Sunrise sessions, ocean views, community vibes.',
      excerpt: 'Beach yoga classes',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      address: '1800 Ocean Front Walk, Los Angeles, CA 90291',
      phone: '+1 (310) 555-2000',
      email: 'info@beachyogala.com',
      website: 'https://beachyogala.com',
      latitude: 33.9850,
      longitude: -118.4695,
      priceMin: 15,
      priceMax: 50,
      ratingAvg: 4.8,
      ratingCount: 678,
      userId: admin.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: gymCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800', thumb: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400', order: 2 },
      ],
    },
    {
      title: 'Hollywood Diner',
      slug: 'hollywood-diner-' + Date.now(),
      content: 'Classic American diner with movie memorabilia. Burgers, milkshakes, and all-day breakfast.',
      excerpt: 'Classic Hollywood diner',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      address: '6145 Hollywood Blvd, Los Angeles, CA 90028',
      phone: '+1 (323) 555-2100',
      email: 'info@hollywooddiner.com',
      website: 'https://hollywooddiner.com',
      latitude: 34.1016,
      longitude: -118.3295,
      priceMin: 12,
      priceMax: 35,
      ratingAvg: 4.5,
      ratingCount: 892,
      userId: demo.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: restaurantCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', thumb: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800', thumb: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', order: 2 },
      ],
    },
    // Original 8 listings below
    {
      title: 'The Grand Hotel',
      slug: 'the-grand-hotel-' + Date.now(),
      content: 'Experience luxury at its finest. Our 5-star hotel offers world-class amenities, stunning views, and impeccable service.',
      excerpt: 'Luxury 5-star hotel with stunning views',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      address: '123 Park Avenue, New York, NY 10001',
      phone: '+1 (212) 555-0100',
      email: 'info@grandhotel.com',
      website: 'https://grandhotel.com',
      latitude: 40.7589,
      longitude: -73.9851,
      priceMin: 250,
      priceMax: 800,
      ratingAvg: 4.8,
      ratingCount: 342,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: hotelCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', thumb: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', thumb: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400', order: 2 },
      ],
    },
    {
      title: 'Bella Vista Restaurant',
      slug: 'bella-vista-restaurant-' + Date.now(),
      content: 'Fine Italian dining with panoramic city views. Our chef-driven menu features fresh, seasonal ingredients.',
      excerpt: 'Authentic Italian cuisine with city views',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      address: '456 5th Avenue, New York, NY 10018',
      phone: '+1 (212) 555-0200',
      email: 'reservations@bellavista.com',
      website: 'https://bellavista.com',
      latitude: 40.7549,
      longitude: -73.9840,
      priceMin: 50,
      priceMax: 150,
      ratingAvg: 4.6,
      ratingCount: 238,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: restaurantCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', thumb: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', thumb: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', order: 2 },
      ],
    },
    {
      title: 'Sunset Cafe',
      slug: 'sunset-cafe-' + Date.now(),
      content: 'Cozy neighborhood cafe serving artisanal coffee, fresh pastries, and light bites. Perfect spot for work or relaxation.',
      excerpt: 'Artisanal coffee and fresh pastries',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      address: '789 Broadway, New York, NY 10003',
      phone: '+1 (212) 555-0300',
      email: 'hello@sunsetcafe.com',
      website: 'https://sunsetcafe.com',
      latitude: 40.7308,
      longitude: -73.9973,
      priceMin: 5,
      priceMax: 25,
      ratingAvg: 4.7,
      ratingCount: 456,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: cafeCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', thumb: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', thumb: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', order: 2 },
      ],
    },
    {
      title: 'FitZone Gym',
      slug: 'fitzone-gym-' + Date.now(),
      content: 'State-of-the-art fitness facility with top equipment, personal trainers, and group classes. Transform your body and mind.',
      excerpt: 'Premium fitness center with expert trainers',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      address: '321 West 34th Street, New York, NY 10001',
      phone: '+1 (212) 555-0400',
      email: 'join@fitzone.com',
      website: 'https://fitzone.com',
      latitude: 40.7506,
      longitude: -73.9935,
      priceMin: 50,
      priceMax: 200,
      ratingAvg: 4.5,
      ratingCount: 189,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: gymCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', thumb: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', order: 2 },
      ],
    },
    {
      title: 'Serenity Spa',
      slug: 'serenity-spa-' + Date.now(),
      content: 'Escape to tranquility. Full-service day spa offering massages, facials, body treatments, and wellness therapies.',
      excerpt: 'Luxurious spa and wellness center',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
      address: '654 Madison Avenue, New York, NY 10065',
      phone: '+1 (212) 555-0500',
      email: 'book@serenityspa.com',
      website: 'https://serenityspa.com',
      latitude: 40.7614,
      longitude: -73.9776,
      priceMin: 100,
      priceMax: 350,
      ratingAvg: 4.9,
      ratingCount: 567,
      userId: admin.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: spaCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800', thumb: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800', thumb: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=400', order: 2 },
      ],
    },
    {
      title: 'Urban Boutique',
      slug: 'urban-boutique-' + Date.now(),
      content: 'Curated fashion and lifestyle store featuring independent designers and unique pieces. Your style destination.',
      excerpt: 'Curated fashion boutique',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      address: '987 Soho Street, New York, NY 10012',
      phone: '+1 (212) 555-0600',
      email: 'shop@urbanboutique.com',
      website: 'https://urbanboutique.com',
      latitude: 40.7233,
      longitude: -74.0030,
      priceMin: 30,
      priceMax: 500,
      ratingAvg: 4.4,
      ratingCount: 298,
      userId: demo.id,
      cityId: nyCity?.id,
      countryId: usCountry?.id,
      categoryId: shoppingCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', thumb: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', order: 2 },
      ],
    },
    {
      title: 'Ocean View Resort',
      slug: 'ocean-view-resort-' + Date.now(),
      content: 'Beachfront luxury resort with world-class amenities. Wake up to the sound of waves and stunning ocean views.',
      excerpt: 'Beachfront luxury resort',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      address: '100 Pacific Coast Highway, Los Angeles, CA 90265',
      phone: '+1 (310) 555-0700',
      email: 'reservations@oceanviewresort.com',
      website: 'https://oceanviewresort.com',
      latitude: 34.0259,
      longitude: -118.7798,
      priceMin: 300,
      priceMax: 1200,
      ratingAvg: 4.7,
      ratingCount: 421,
      userId: admin.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: hotelCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', thumb: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', thumb: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', order: 2 },
      ],
    },
    {
      title: 'Taco Loco',
      slug: 'taco-loco-' + Date.now(),
      content: 'Authentic Mexican street food with a modern twist. Fresh ingredients, bold flavors, and a vibrant atmosphere.',
      excerpt: 'Authentic Mexican street food',
      status: 'publish',
      thumbnail: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
      address: '555 Sunset Blvd, Los Angeles, CA 90028',
      phone: '+1 (323) 555-0800',
      email: 'hello@tacoloco.com',
      website: 'https://tacoloco.com',
      latitude: 34.0982,
      longitude: -118.3287,
      priceMin: 10,
      priceMax: 35,
      ratingAvg: 4.6,
      ratingCount: 512,
      userId: demo.id,
      cityId: laCity?.id,
      countryId: usCountry?.id,
      categoryId: restaurantCat?.id,
      galleries: [
        { full: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', thumb: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', order: 1 },
        { full: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800', thumb: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400', order: 2 },
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
