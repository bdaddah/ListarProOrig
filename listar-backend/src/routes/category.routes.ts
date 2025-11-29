import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/category/list', categoryController.getCategories);
router.get('/category/list_discover', categoryController.getDiscovery);
router.get('/location/list', categoryController.getLocations);
router.post('/category', authenticate, requireAdmin, categoryController.createCategory);
router.put('/category/:id', authenticate, requireAdmin, categoryController.updateCategory);
router.delete('/category/:id', authenticate, requireAdmin, categoryController.deleteCategory);

export default router;
