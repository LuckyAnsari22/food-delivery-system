const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentDetails,
  processRefund,
  getRefundStatus,
  getPaymentMethods
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

// Public routes
router.get('/methods', getPaymentMethods);

// Protected routes
router.use(protect);

// Customer routes
router.post('/create-order', authorize('customer'), createRazorpayOrder);
router.post('/verify', authorize('customer'), verifyRazorpayPayment);
router.get('/:orderId', validateObjectId('orderId'), getPaymentDetails);
router.get('/refund/:orderId', validateObjectId('orderId'), getRefundStatus);

// Vendor/Admin routes
router.post('/refund', authorize('vendor', 'admin'), processRefund);

module.exports = router;
