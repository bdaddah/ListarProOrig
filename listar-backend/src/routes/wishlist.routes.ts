import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/wishlist/list', authenticate, wishlistController.getWishlist);
router.post('/wishlist/save', authenticate, wishlistController.addWishlist);
router.post('/wishlist/remove', authenticate, wishlistController.removeWishlist);
router.post('/wishlist/reset', authenticate, wishlistController.clearWishlist);

export default router;
