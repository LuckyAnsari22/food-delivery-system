const express = require('express');
const router = express.Router();
const {
  createReview,
  getVendorReviews,
  getFoodItemReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  addVendorResponse,
  markReviewHelpful,
  unmarkReviewHelpful,
  reportReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateReview,
  validatePagination,
  validateObjectId
} = require('../middleware/validation');

// Public routes
router.get('/vendor/:vendorId', validateObjectId('vendorId'), validatePagination, getVendorReviews);
router.get('/food-item/:foodItemId', validateObjectId('foodItemId'), validatePagination, getFoodItemReviews);

// Protected routes
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), validateReview, createReview);
router.get('/user', authorize('customer'), validatePagination, getUserReviews);
router.put('/:id', authorize('customer'), validateObjectId('id'), validateReview, updateReview);
router.delete('/:id', authorize('customer'), validateObjectId('id'), deleteReview);
router.post('/:id/helpful', authorize('customer'), validateObjectId('id'), markReviewHelpful);
router.delete('/:id/helpful', authorize('customer'), validateObjectId('id'), unmarkReviewHelpful);
router.post('/:id/report', authorize('customer'), validateObjectId('id'), reportReview);

// Vendor routes
router.post('/:id/response', authorize('vendor', 'admin'), validateObjectId('id'), addVendorResponse);

module.exports = router;
