const Vendor = require('../models/Vendor');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Register vendor
// @route   POST /api/vendors/register
// @access  Private (Customer role)
exports.registerVendor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user already has a vendor profile
    const existingVendor = await Vendor.findOne({ user: req.user.id });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor profile already exists for this user'
      });
    }

    const vendorData = {
      user: req.user.id,
      ...req.body
    };

    const vendor = await Vendor.create(vendorData);

    // Update user role to vendor
    await User.findByIdAndUpdate(req.user.id, { role: 'vendor' });

    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vendor registration'
    });
  }
};

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor role)
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private (Vendor role)
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email phone avatar');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor profile updated successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};

// @desc    Get all vendors (for customers)
// @route   GET /api/vendors
// @access  Public
exports.getVendors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      cuisine,
      minRating,
      maxDistance,
      latitude,
      longitude,
      isOpen,
      search
    } = req.query;

    const query = { isActive: true };

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',') };
    }

    // Filter by minimum rating
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Filter by distance (if coordinates provided)
    if (latitude && longitude && maxDistance) {
      // This is a simplified distance filter
      // In production, you'd use MongoDB's geospatial queries
      query['address.coordinates.latitude'] = {
        $gte: parseFloat(latitude) - 0.1,
        $lte: parseFloat(latitude) + 0.1
      };
      query['address.coordinates.longitude'] = {
        $gte: parseFloat(longitude) - 0.1,
        $lte: parseFloat(longitude) + 0.1
      };
    }

    // Filter by open status
    if (isOpen === 'true') {
      query.isOpen = true;
    }

    // Search by business name or description
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await Vendor.find(query)
      .populate('user', 'name avatar')
      .select('-bankDetails -documents')
      .sort({ 'rating.average': -1, totalOrders: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vendor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: vendors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: vendors
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get vendor by ID
// @route   GET /api/vendors/:id
// @access  Public
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('user', 'name avatar')
      .select('-bankDetails -documents');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Get vendor's food items
    const foodItems = await FoodItem.find({ 
      vendor: vendor._id, 
      isAvailable: true 
    }).sort({ isPopular: -1, 'rating.average': -1 });

    res.status(200).json({
      success: true,
      data: {
        vendor,
        foodItems
      }
    });
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get vendor dashboard data
// @route   GET /api/vendors/dashboard
// @access  Private (Vendor role)
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Get recent orders
    const recentOrders = await Order.find({ vendor: vendor._id })
      .populate('customer', 'name phone')
      .populate('items.foodItem', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get order statistics
    const totalOrders = await Order.countDocuments({ vendor: vendor._id });
    const pendingOrders = await Order.countDocuments({ 
      vendor: vendor._id, 
      status: { $in: ['pending', 'confirmed', 'preparing'] } 
    });
    const completedOrders = await Order.countDocuments({ 
      vendor: vendor._id, 
      status: 'delivered' 
    });

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      vendor: vendor._id,
      createdAt: { $gte: today }
    });

    // Get today's earnings
    const todayEarnings = await Order.aggregate([
      {
        $match: {
          vendor: vendor._id,
          status: 'delivered',
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' }
        }
      }
    ]);

    // Get popular food items
    const popularItems = await FoodItem.find({ vendor: vendor._id })
      .sort({ totalOrders: -1 })
      .limit(5)
      .select('name totalOrders rating');

    res.status(200).json({
      success: true,
      data: {
        vendor,
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          todayOrders,
          todayEarnings: todayEarnings[0]?.total || 0
        },
        recentOrders,
        popularItems
      }
    });
  } catch (error) {
    console.error('Get vendor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update vendor status (open/closed)
// @route   PUT /api/vendors/status
// @access  Private (Vendor role)
exports.updateVendorStatus = async (req, res) => {
  try {
    const { isOpen } = req.body;

    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user.id },
      { isOpen },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Vendor is now ${isOpen ? 'open' : 'closed'}`,
      data: { isOpen: vendor.isOpen }
    });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get vendor analytics
// @route   GET /api/vendors/analytics
// @access  Private (Vendor role)
exports.getVendorAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const vendor = await Vendor.findOne({ user: req.user.id });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get order analytics
    const orderAnalytics = await Order.aggregate([
      {
        $match: {
          vendor: vendor._id,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get top selling items
    const topItems = await Order.aggregate([
      {
        $match: {
          vendor: vendor._id,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.foodItem',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'fooditems',
          localField: '_id',
          foreignField: '_id',
          as: 'foodItem'
        }
      },
      { $unwind: '$foodItem' },
      {
        $project: {
          name: '$foodItem.name',
          quantity: 1,
          revenue: 1
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        orderAnalytics,
        topItems
      }
    });
  } catch (error) {
    console.error('Get vendor analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
