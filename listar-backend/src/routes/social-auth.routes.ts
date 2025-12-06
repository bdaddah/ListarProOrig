import { Router } from 'express';
import * as socialAuthController from '../controllers/social-auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Social login (public)
router.post('/login', socialAuthController.socialLogin);

// Link/unlink social accounts (requires auth)
router.post('/link', authenticate, socialAuthController.linkSocialAccount);
router.post('/unlink', authenticate, socialAuthController.unlinkSocialAccount);
router.get('/linked', authenticate, socialAuthController.getLinkedAccounts);

export default router;
