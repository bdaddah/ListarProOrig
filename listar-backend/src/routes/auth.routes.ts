import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// JWT Auth endpoints (WordPress compatible)
router.post('/token', authController.login);
router.post('/token/validate', authenticate, authController.validateToken);

// Listar auth endpoints
const authRouter = Router();
authRouter.post('/register', authController.register);
authRouter.post('/reset_password', authController.forgotPassword);
authRouter.post('/set_new_password', authController.resetPassword);
authRouter.get('/user', authenticate, authController.getUser);
authRouter.post('/otp', authenticate, authController.requestOTP);
authRouter.post('/deactivate', authenticate, authController.deactivateAccount);

export default router;
export { authRouter };
