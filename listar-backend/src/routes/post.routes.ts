import { Router } from 'express';
import * as postController from '../controllers/post.controller';

const router = Router();

router.get('/post/home', postController.getPosts);
router.get('/post/view', postController.getPost);

export default router;
