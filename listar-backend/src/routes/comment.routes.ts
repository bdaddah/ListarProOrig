import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/comments', commentController.getComments);
router.post('/comments', authenticate, commentController.saveComment);

export default router;
