import { Request, Response } from 'express';
import prisma from '../utils/db';
import { asyncHandler } from '../middlewares/error.middleware';

// Get app settings
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await prisma.setting.findMany();

  const settingsObj: any = {};
  settings.forEach((s) => {
    settingsObj[s.key] = s.value;
  });

  res.json({
    success: true,
    data: {
      per_page: parseInt(process.env.PER_PAGE || '10'),
      use_view_map: true,
      use_view_galleries: true,
      use_view_status: true,
      use_view_video: true,
      use_view_address: true,
      use_view_phone: true,
      use_view_fax: true,
      use_view_email: true,
      use_view_website: true,
      use_view_date_establish: true,
      use_view_price: true,
      use_view_feature: true,
      use_view_open_hours: true,
      use_view_tags: true,
      use_view_attachment: true,
      use_view_social: true,
      ...settingsObj,
    },
  });
});

// Get payment settings
export const getPaymentSettings = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    payment: {
      methods: [
        { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
        { id: 'stripe', name: 'Credit Card', icon: 'fas fa-credit-card' },
      ],
    },
  });
});
