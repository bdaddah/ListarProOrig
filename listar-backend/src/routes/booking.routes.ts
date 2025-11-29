import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/booking/form', bookingController.getBookingForm);
router.post('/booking/cart', authenticate, bookingController.calculatePrice);
router.post('/booking/order', authenticate, bookingController.createOrder);
router.get('/booking/list', authenticate, bookingController.getBookings);

export default router;
