import { Router } from 'express';
import * as settingController from '../controllers/setting.controller';

const router = Router();

router.get('/setting/init', settingController.getSettings);
router.get('/setting/payment', settingController.getPaymentSettings);

export default router;
