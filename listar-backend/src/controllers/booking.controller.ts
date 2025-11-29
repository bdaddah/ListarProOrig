import { Request, Response } from 'express';
import prisma from '../utils/db';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

// Get booking form
export const getBookingForm = asyncHandler(async (req: Request, res: Response) => {
  const { resource_id } = req.query;

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(resource_id as string) },
  });

  if (!listing || !listing.bookingUse) {
    throw new AppError('Booking not available', 404);
  }

  // Mock booking form data based on style
  res.json({
    success: true,
    data: {
      type: listing.bookingStyle || 'standard',
      price: listing.bookingPrice,
      // Additional booking form configuration
    },
    payment: {
      methods: [
        { id: 'paypal', name: 'PayPal', icon: 'paypal' },
        { id: 'stripe', name: 'Credit Card', icon: 'credit-card' },
      ],
    },
  });
});

// Calculate booking price
export const calculatePrice = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Implement price calculation based on booking style
  res.json({
    success: true,
    attr: {
      total_display: '$100.00',
    },
  });
});

// Create booking order
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { resource_id, payment_method, first_name, last_name, email, phone } = req.body;

  const booking = await prisma.booking.create({
    data: {
      listingId: parseInt(resource_id),
      userId: req.user.userId,
      resourceId: parseInt(resource_id),
      bookingStyle: 'standard',
      bookingData: req.body,
      firstName: first_name,
      lastName: last_name,
      email,
      phone,
      totalPrice: '100.00',
      paymentMethod: payment_method,
    },
  });

  res.json({
    success: true,
    message: 'Booking created successfully',
    data: { id: booking.id },
    payment: {
      url: 'https://paypal.com/checkout/...',
    },
  });
});

// Get bookings list
export const getBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.userId },
    include: { listing: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: bookings.map((b) => ({
      ID: b.id,
      listing_id: b.listingId,
      status: b.status,
      total_price: b.totalPrice,
      created_at: b.createdAt,
    })),
    pagination: { page: 1, per_page: 10, total: bookings.length, total_pages: 1 },
    attr: {
      status: [{ value: 'all/all', text: 'All' }],
      sort: [{ value: 'date/desc', text: 'Newest' }],
    },
  });
});
