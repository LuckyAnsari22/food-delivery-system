const FoodItem = require('../models/FoodItem');
const Vendor = require('../models/Vendor');
const { validationResult } = require('express-validator');

// @desc    Create food item
// @route   POST /api/food-items
// @access  Private (Vendor role)
exports.createFoodItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if vendor exists
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const foodItemData = {
      vendor: vendor._id,
      ...req.body
    };

    const foodItem = await FoodItem.create(foodItemData);

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: foodItem
    });
  } catch (error) {
    console.error('Create food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during food item creation'
    });
  }
};

// @desc    Get all food items for a vendor
// @route   GET /api/food-items/vendor/:vendorId
// @access  Public
exports.getFoodItemsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { category, isVegetarian, isVegan, isSpicy, minPrice, maxPrice, sortBy = 'name' } = req.query;

    const query = { vendor: vendorId, isAvailable: true };

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (isVegetarian === 'true') {
      query.isVegetarian = true;
    }
    if (isVegan === 'true') {
      query.isVegan = true;
    }
    if (isSpicy === 'true') {
      query.isSpicy = true;
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'popular':
        sort = { totalOrders: -1 };
        break;
      default:
        sort = { name: 1 };
    }

    const foodItems = await FoodItem.find(query)
      .populate('vendor', 'businessName images.logo')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems
    });
  } catch (error) {
    console.error('Get food items by vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get food item by ID
// @route   GET /api/food-items/:id
// @access  Public
exports.getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id)
      .populate('vendor', 'businessName images.logo rating address');

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    console.error('Get food item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update food item
// @route   PUT /api/food-items/:id
// @access  Private (Vendor role)
exports.updateFoodItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if vendor exists
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const foodItem = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, vendor: vendor._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found or you are not authorized to update it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: foodItem
    });
  } catch (error) {
    console.error('Update food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during food item update'
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/food-items/:id
// @access  Private (Vendor role)
exports.deleteFoodItem = async (req, res) => {
  try {
    // Check if vendor exists
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const foodItem = await FoodItem.findOneAndDelete({
      _id: req.params.id,
      vendor: vendor._id
    });

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found or you are not authorized to delete it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Delete food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during food item deletion'
    });
  }
};

// @desc    Search food items
// @route   GET /api/food-items/search
// @access  Public
exports.searchFoodItems = async (req, res) => {
  try {
    const {
      q,
      category,
      cuisine,
      minPrice,
      maxPrice,
      isVegetarian,
      isVegan,
      isSpicy,
      minRating,
      latitude,
      longitude,
      maxDistance,
      page = 1,
      limit = 20,
      sortBy = 'relevance'
    } = req.query;

    const query = { isAvailable: true };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Filters
    if (category) {
      query.category = category;
    }
    if (cuisine) {
      query.cuisine = cuisine;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (isVegetarian === 'true') {
      query.isVegetarian = true;
    }
    if (isVegan === 'true') {
      query.isVegan = true;
    }
    if (isSpicy === 'true') {
      query.isSpicy = true;
    }
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Distance filter (simplified)
    if (latitude && longitude && maxDistance) {
      // This is a simplified implementation
      // In production, use MongoDB's geospatial queries
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'popular':
        sort = { totalOrders: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        if (q) {
          sort = { score: { $meta: 'textScore' } };
        } else {
          sort = { 'rating.average': -1 };
        }
    }

    const foodItems = await FoodItem.find(query)
      .populate('vendor', 'businessName images.logo rating address')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FoodItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: foodItems.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: foodItems
    });
  } catch (error) {
    console.error('Search food items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get popular food items
// @route   GET /api/food-items/popular
// @access  Public
exports.getPopularFoodItems = async (req, res) => {
  try {
    const { limit = 10, cuisine } = req.query;

    const query = { isAvailable: true, isPopular: true };
    if (cuisine) {
      query.cuisine = cuisine;
    }

    const foodItems = await FoodItem.find(query)
      .populate('vendor', 'businessName images.logo rating')
      .sort({ totalOrders: -1, 'rating.average': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems
    });
  } catch (error) {
    console.error('Get popular food items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get food items by category
// @route   GET /api/food-items/category/:category
// @access  Public
exports.getFoodItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20, sortBy = 'rating' } = req.query;

    const query = { category, isAvailable: true };

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'popular':
        sort = { totalOrders: -1 };
        break;
      default:
        sort = { 'rating.average': -1 };
    }

    const foodItems = await FoodItem.find(query)
      .populate('vendor', 'businessName images.logo rating')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FoodItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: foodItems.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: foodItems
    });
  } catch (error) {
    console.error('Get food items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle food item availability
// @route   PUT /api/food-items/:id/availability
// @access  Private (Vendor role)
exports.toggleFoodItemAvailability = async (req, res) => {
  try {
    // Check if vendor exists
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const foodItem = await FoodItem.findOne({
      _id: req.params.id,
      vendor: vendor._id
    });

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found or you are not authorized to update it'
      });
    }

    foodItem.isAvailable = !foodItem.isAvailable;
    await foodItem.save();

    res.status(200).json({
      success: true,
      message: `Food item is now ${foodItem.isAvailable ? 'available' : 'unavailable'}`,
      data: { isAvailable: foodItem.isAvailable }
    });
  } catch (error) {
    console.error('Toggle food item availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
