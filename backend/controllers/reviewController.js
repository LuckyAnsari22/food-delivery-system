const Review = require('../models/Review');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const FoodItem = require('../models/FoodItem');
const { validationResult } = require('express-validator');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (Customer role)
exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, foodItems, overallRating, review } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId)
      .populate('vendor', 'user')
      .populate('items.foodItem');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this order'
      });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only review delivered orders'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this order'
      });
    }

    // Validate food items in review match order items
    const orderFoodItemIds = order.items.map(item => item.foodItem._id.toString());
    const reviewFoodItemIds = foodItems.map(item => item.foodItem.toString());
    
    const isValidItems = reviewFoodItemIds.every(id => orderFoodItemIds.includes(id));
    if (!isValidItems) {
      return res.status(400).json({
        success: false,
        message: 'Review items must match order items'
      });
    }

    // Create review
    const reviewData = {
      order: orderId,
      customer: req.user.id,
      vendor: order.vendor._id,
      foodItems,
      overallRating,
      review
    };

    const newReview = await Review.create(reviewData);

    // Update order with rating
    order.rating = {
      food: overallRating.food,
      delivery: overallRating.delivery,
      overall: (overallRating.food + overallRating.delivery + overallRating.packaging + overallRating.value) / 4,
      review: review.description,
      images: review.images || []
    };
    await order.save();

    // Populate review data
    await newReview.populate([
      { path: 'customer', select: 'name avatar' },
      { path: 'vendor', select: 'businessName' },
      { path: 'foodItems.foodItem', select: 'name images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during review creation'
    });
  }
};

// @desc    Get reviews for vendor
// @route   GET /api/reviews/vendor/:vendorId
// @access  Public
exports.getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;

    const query = { vendor: vendorId, isVisible: true };

    // Filter by rating
    if (rating) {
      const ratingNum = parseInt(rating);
      query['overallRating.food'] = { $gte: ratingNum, $lt: ratingNum + 1 };
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'rating_high':
        sort = { 'overallRating.food': -1 };
        break;
      case 'rating_low':
        sort = { 'overallRating.food': 1 };
        break;
      case 'helpful':
        sort = { 'isHelpful.count': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('customer', 'name avatar')
      .populate('foodItems.foodItem', 'name images')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { vendor: vendorId, isVisible: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgFoodRating: { $avg: '$overallRating.food' },
          avgDeliveryRating: { $avg: '$overallRating.delivery' },
          avgPackagingRating: { $avg: '$overallRating.packaging' },
          avgValueRating: { $avg: '$overallRating.value' },
          ratingDistribution: {
            $push: {
              $switch: {
                branches: [
                  { case: { $eq: ['$overallRating.food', 5] }, then: 5 },
                  { case: { $eq: ['$overallRating.food', 4] }, then: 4 },
                  { case: { $eq: ['$overallRating.food', 3] }, then: 3 },
                  { case: { $eq: ['$overallRating.food', 2] }, then: 2 },
                  { case: { $eq: ['$overallRating.food', 1] }, then: 1 }
                ],
                default: 0
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        reviews,
        stats: ratingStats[0] || {
          totalReviews: 0,
          avgFoodRating: 0,
          avgDeliveryRating: 0,
          avgPackagingRating: 0,
          avgValueRating: 0
        }
      }
    });
  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get reviews for food item
// @route   GET /api/reviews/food-item/:foodItemId
// @access  Public
exports.getFoodItemReviews = async (req, res) => {
  try {
    const { foodItemId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({
      'foodItems.foodItem': foodItemId,
      isVisible: true
    })
      .populate('customer', 'name avatar')
      .populate('vendor', 'businessName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({
      'foodItems.foodItem': foodItemId,
      isVisible: true
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reviews
    });
  } catch (error) {
    console.error('Get food item reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user
// @access  Private (Customer role)
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ customer: req.user.id })
      .populate('vendor', 'businessName images.logo')
      .populate('foodItems.foodItem', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ customer: req.user.id });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Customer role)
exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'customer', select: 'name avatar' },
      { path: 'vendor', select: 'businessName' },
      { path: 'foodItems.foodItem', select: 'name images' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during review update'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Customer role)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during review deletion'
    });
  }
};

// @desc    Add vendor response to review
// @route   POST /api/reviews/:id/response
// @access  Private (Vendor role)
exports.addVendorResponse = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response is required'
      });
    }

    const review = await Review.findById(req.params.id)
      .populate('vendor', 'user');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if vendor owns this review
    if (review.vendor.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this review'
      });
    }

    // Check if response already exists
    if (review.vendorResponse.response) {
      return res.status(400).json({
        success: false,
        message: 'Response already exists for this review'
      });
    }

    // Add vendor response
    await review.addVendorResponse(response, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: { vendorResponse: review.vendorResponse }
    });
  } catch (error) {
    console.error('Add vendor response error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private (Customer role)
exports.markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review as helpful
    if (review.isHelpful.users.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked this review as helpful'
      });
    }

    await review.markHelpful(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: { helpfulCount: review.isHelpful.count }
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unmark review as helpful
// @route   DELETE /api/reviews/:id/helpful
// @access  Private (Customer role)
exports.unmarkReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.unmarkHelpful(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Review unmarked as helpful',
      data: { helpfulCount: review.isHelpful.count }
    });
  } catch (error) {
    console.error('Unmark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private (Customer role)
exports.reportReview = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already reported this review
    if (review.isReported) {
      return res.status(400).json({
        success: false,
        message: 'Review already reported'
      });
    }

    review.isReported = true;
    review.reportReason = reason;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
