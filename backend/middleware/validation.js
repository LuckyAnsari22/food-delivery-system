const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('role')
    .optional()
    .isIn(['customer', 'vendor'])
    .withMessage('Role must be either customer or vendor'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Address validation
const validateAddress = [
  body('type')
    .isIn(['home', 'work', 'other'])
    .withMessage('Address type must be home, work, or other'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Address name must be between 2 and 50 characters'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('pincode')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a valid 6-digit number'),
  body('landmark')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Landmark cannot exceed 100 characters'),
  handleValidationErrors
];

// Vendor registration validation
const validateVendorRegistration = [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('cuisine')
    .isArray({ min: 1 })
    .withMessage('At least one cuisine type must be selected'),
  body('cuisine.*')
    .isIn(['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food', 'Desserts', 'Beverages', 'Other'])
    .withMessage('Invalid cuisine type'),
  body('address.street')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Street address must be between 10 and 200 characters'),
  body('address.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('address.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('address.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a valid 6-digit number'),
  body('address.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('address.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('contactInfo.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

// Food item validation
const validateFoodItem = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Food item name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn(['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Combo', 'Other'])
    .withMessage('Invalid category'),
  body('cuisine')
    .isIn(['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food', 'Desserts', 'Beverages', 'Other'])
    .withMessage('Invalid cuisine type'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('preparationTime')
    .optional()
    .isInt({ min: 5, max: 60 })
    .withMessage('Preparation time must be between 5 and 60 minutes'),
  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean value'),
  body('isVegan')
    .optional()
    .isBoolean()
    .withMessage('isVegan must be a boolean value'),
  body('isSpicy')
    .optional()
    .isBoolean()
    .withMessage('isSpicy must be a boolean value'),
  body('spiceLevel')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('Spice level must be between 0 and 5'),
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.foodItem')
    .isMongoId()
    .withMessage('Invalid food item ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress')
    .isObject()
    .withMessage('Delivery address is required'),
  body('payment.method')
    .isIn(['razorpay', 'cod', 'wallet'])
    .withMessage('Invalid payment method'),
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('overallRating.food')
    .isInt({ min: 1, max: 5 })
    .withMessage('Food rating must be between 1 and 5'),
  body('overallRating.delivery')
    .isInt({ min: 1, max: 5 })
    .withMessage('Delivery rating must be between 1 and 5'),
  body('overallRating.packaging')
    .isInt({ min: 1, max: 5 })
    .withMessage('Packaging rating must be between 1 and 5'),
  body('overallRating.value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Value rating must be between 1 and 5'),
  body('review.title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Review title cannot exceed 100 characters'),
  body('review.description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Review description cannot exceed 1000 characters'),
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('category')
    .optional()
    .isIn(['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Combo', 'Other'])
    .withMessage('Invalid category'),
  query('cuisine')
    .optional()
    .isIn(['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food', 'Desserts', 'Beverages', 'Other'])
    .withMessage('Invalid cuisine type'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateAddress,
  validateVendorRegistration,
  validateFoodItem,
  validateOrder,
  validateReview,
  validateObjectId,
  validatePagination,
  validateSearch
};
