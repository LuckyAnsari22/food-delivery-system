const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getVendorOrders,
  trackOrder,
  addTrackingUpdate,
  reorder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateOrder,
  validatePagination,
  validateObjectId
} = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), validateOrder, createOrder);
router.get('/', authorize('customer'), validatePagination, getUserOrders);
router.get('/:id', validateObjectId('id'), getOrderById);
router.put('/:id/cancel', authorize('customer'), validateObjectId('id'), cancelOrder);
router.get('/:id/track', validateObjectId('id'), trackOrder);
router.post('/:id/reorder', authorize('customer'), validateObjectId('id'), reorder);

// Vendor routes
router.get('/vendor', authorize('vendor', 'admin'), validatePagination, getVendorOrders);
router.put('/:id/status', authorize('vendor', 'admin'), validateObjectId('id'), updateOrderStatus);
router.post('/:id/tracking', authorize('vendor', 'admin'), validateObjectId('id'), addTrackingUpdate);

module.exports = router;
