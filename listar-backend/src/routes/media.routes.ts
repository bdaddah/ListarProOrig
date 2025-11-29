import { Router } from 'express';
import * as mediaController from '../controllers/media.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/media', authenticate, mediaController.uploadMedia);

export default router;
