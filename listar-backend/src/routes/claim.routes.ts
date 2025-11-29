import { Router } from 'express';
import * as claimController from '../controllers/claim.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/claim/submit', authenticate, claimController.submitClaim);
router.get('/claim/list', authenticate, claimController.getClaims);

export default router;
