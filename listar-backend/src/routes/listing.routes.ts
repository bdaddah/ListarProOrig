import { Router } from 'express';
import * as listingController from '../controllers/listing.controller';
import { authenticate, optionalAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Listing endpoints
router.get('/place/list', optionalAuth, listingController.getListings);
router.get('/place/view', optionalAuth, listingController.getListing);
router.post('/place/save', authenticate, listingController.saveListing);
router.post('/place/delete', authenticate, listingController.deleteListing);
router.get('/place/form', listingController.getSubmitSettings);
router.get('/place/terms', listingController.getTags);
router.put(
  '/admin/listings/:id/status',
  authenticate,
  requireAdmin,
  listingController.updateListingStatus,
);
router.delete(
  '/admin/listings/:id',
  authenticate,
  requireAdmin,
  listingController.adminDeleteListing,
);

// Author endpoints (listings by user)
router.get('/author/listing', optionalAuth, listingController.getListings);

export default router;
