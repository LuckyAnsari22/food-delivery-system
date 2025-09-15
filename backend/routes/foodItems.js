const express = require('express');
const router = express.Router();
const {
  createFoodItem,
  getFoodItemsByVendor,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
  searchFoodItems,
  getPopularFoodItems,
  getFoodItemsByCategory,
  toggleFoodItemAvailability
} = require('../controllers/foodItemController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateFoodItem,
  validatePagination,
  validateSearch,
  validateObjectId
} = require('../middleware/validation');

// Public routes
router.get('/search', validatePagination, validateSearch, searchFoodItems);
router.get('/popular', getPopularFoodItems);
router.get('/category/:category', validatePagination, getFoodItemsByCategory);
router.get('/vendor/:vendorId', validateObjectId('vendorId'), getFoodItemsByVendor);
router.get('/:id', validateObjectId('id'), getFoodItemById);

// Protected routes
router.use(protect);

// Vendor routes
router.use(authorize('vendor', 'admin'));

router.post('/', validateFoodItem, createFoodItem);
router.put('/:id', validateObjectId('id'), validateFoodItem, updateFoodItem);
router.delete('/:id', validateObjectId('id'), deleteFoodItem);
router.put('/:id/availability', validateObjectId('id'), toggleFoodItemAvailability);

module.exports = router;
