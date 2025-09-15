const express = require('express');
const router = express.Router();
const {
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendors,
  getVendorById,
  getVendorDashboard,
  updateVendorStatus,
  getVendorAnalytics
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateVendorRegistration,
  validatePagination,
  validateSearch,
  validateObjectId
} = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, validateSearch, getVendors);
router.get('/:id', validateObjectId('id'), getVendorById);

// Protected routes
router.use(protect);

// Customer routes
router.post('/register', authorize('customer'), validateVendorRegistration, registerVendor);

// Vendor routes
router.use(authorize('vendor', 'admin'));

router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);
router.get('/dashboard', getVendorDashboard);
router.put('/status', updateVendorStatus);
router.get('/analytics', getVendorAnalytics);

module.exports = router;
