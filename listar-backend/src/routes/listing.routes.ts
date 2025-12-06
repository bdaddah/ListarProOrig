import { Router } from 'express';
import * as listingController from '../controllers/listing.controller';
import { authenticate, optionalAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// ==========================================
// PUBLIC ENDPOINTS (or optional auth)
// ==========================================

// Get public listings (only published listings visible to public)
router.get('/place/list', optionalAuth, listingController.getListings);

// Get single listing (visibility check handled in controller)
router.get('/place/view', optionalAuth, listingController.getListing);

// Get form settings for creating listings
router.get('/place/form', listingController.getSubmitSettings);

// Get tags for autocomplete
router.get('/place/terms', listingController.getTags);

// Author public listings
router.get('/author/listing', optionalAuth, listingController.getListings);

// ==========================================
// AUTHENTICATED USER ENDPOINTS
// ==========================================

// Create or update listing (new listings go to 'pending', updates to published go back to 'pending')
router.post('/place/save', authenticate, listingController.saveListing);

// Delete own listing (owner or admin can delete)
router.post('/place/delete', authenticate, listingController.deleteListing);

// Get user's own listings (all statuses)
router.get('/place/my-listings', authenticate, listingController.getMyListings);

// Get current user's role
router.get('/auth/role', authenticate, listingController.getCurrentUserRole);

// ==========================================
// ADMIN-ONLY ENDPOINTS (Moderation)
// ==========================================

// Get all listings pending moderation
router.get(
  '/admin/listings/pending',
  authenticate,
  requireAdmin,
  listingController.getPendingListings,
);

// Approve/Reject listing (change status)
router.put(
  '/admin/listings/:id/status',
  authenticate,
  requireAdmin,
  listingController.updateListingStatus,
);

// Admin delete any listing
router.delete(
  '/admin/listings/:id',
  authenticate,
  requireAdmin,
  listingController.adminDeleteListing,
);

export default router;
