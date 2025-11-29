import { Router } from 'express';
import * as homeController from '../controllers/home.controller';

const router = Router();

router.get('/home/init', homeController.getHome);
router.get('/home/widget', homeController.getHomeWidget);

export default router;
