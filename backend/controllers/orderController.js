const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Customer role)
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, deliveryAddress, payment, specialInstructions } = req.body;

    // Validate items and calculate pricing
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (!foodItem || !foodItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Food item ${item.foodItem} is not available`
        });
      }

      // Check if vendor is open
      const vendor = await Vendor.findById(foodItem.vendor);
      if (!vendor || !vendor.isOpen || !vendor.isActive) {
        return res.status(400).json({
          success: false,
          message: `Vendor ${vendor?.businessName} is currently closed`
        });
      }

      let itemPrice = foodItem.price;
      
      // Add variant price if selected
      if (item.variant) {
        const variant = foodItem.variants.find(v => v.name === item.variant.name);
        if (variant && variant.isAvailable) {
          itemPrice = variant.price;
        }
      }

      // Add add-ons price
      let addOnsPrice = 0;
      if (item.addOns && item.addOns.length > 0) {
        for (const addOn of item.addOns) {
          const addOnItem = foodItem.addOns.find(a => a.name === addOn.name);
          if (addOnItem && addOnItem.isAvailable) {
            addOnsPrice += addOnItem.price;
          }
        }
      }

      const totalItemPrice = (itemPrice + addOnsPrice) * item.quantity;
      subtotal += totalItemPrice;

      validatedItems.push({
        foodItem: foodItem._id,
        quantity: item.quantity,
        price: itemPrice,
        variant: item.variant,
        addOns: item.addOns,
        specialInstructions: item.specialInstructions
      });
    }

    // Get vendor from first item
    const firstItem = await FoodItem.findById(items[0].foodItem);
    const vendor = await Vendor.findById(firstItem.vendor);

    // Calculate delivery fee
    const deliveryFee = vendor.deliveryInfo.deliveryFee || 0;
    
    // Calculate tax (simplified - 5% GST)
    const tax = subtotal * 0.05;
    
    // Calculate total
    const total = subtotal + deliveryFee + tax;

    // Create order
    const orderData = {
      customer: req.user.id,
      vendor: vendor._id,
      items: validatedItems,
      deliveryAddress,
      payment: {
        method: payment.method,
        amount: total
      },
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        total
      },
      specialInstructions,
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed successfully'
      }]
    };

    const order = await Order.create(orderData);

    // Populate order data for response
    await order.populate([
      { path: 'customer', select: 'name phone email' },
      { path: 'vendor', select: 'businessName contactInfo.phone' },
      { path: 'items.foodItem', select: 'name price images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during order creation'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private (Customer role)
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { customer: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('vendor', 'businessName images.logo')
      .populate('items.foodItem', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('vendor', 'businessName contactInfo.phone images.logo')
      .populate('items.foodItem', 'name images price description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.customer._id.toString() !== req.user.id && 
        order.vendor.user.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status (Vendor)
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor role)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('vendor', 'user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if vendor owns this order
    if (order.vendor.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update order status
    await order.updateStatus(status, note);

    // If order is delivered, update vendor stats
    if (status === 'delivered') {
      await Vendor.findByIdAndUpdate(order.vendor._id, {
        $inc: { 
          totalOrders: 1,
          totalEarnings: order.pricing.total
        }
      });

      // Update food item order counts
      for (const item of order.items) {
        await FoodItem.findByIdAndUpdate(item.foodItem, {
          $inc: { totalOrders: item.quantity }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { status: order.status }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer role)
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    await order.updateStatus('cancelled', reason || 'Cancelled by customer');

    // Calculate refund amount
    const refundAmount = order.calculateRefundAmount();
    if (refundAmount > 0) {
      order.refundAmount = refundAmount;
      order.refundStatus = 'requested';
      order.refundReason = reason || 'Order cancelled';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { 
        status: order.status,
        refundAmount: order.refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor
// @access  Private (Vendor role)
exports.getVendorOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Get vendor
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const query = { vendor: vendor._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone email')
      .populate('items.foodItem', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Track order
// @route   GET /api/orders/:id/track
// @access  Private
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendor', 'businessName contactInfo.phone')
      .populate('customer', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.customer._id.toString() !== req.user.id && 
        order.vendor.user.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to track this order'
      });
    }

    // Calculate estimated delivery time
    const estimatedDelivery = order.calculateEstimatedDelivery();

    res.status(200).json({
      success: true,
      data: {
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          timeline: order.timeline,
          estimatedDelivery,
          delivery: order.delivery
        },
        vendor: order.vendor,
        customer: order.customer
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add tracking update
// @route   POST /api/orders/:id/tracking
// @access  Private (Vendor role)
exports.addTrackingUpdate = async (req, res) => {
  try {
    const { location, status, note } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('vendor', 'user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if vendor owns this order
    if (order.vendor.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update tracking for this order'
      });
    }

    // Add tracking update
    await order.addTrackingUpdate(location, status, note);

    res.status(200).json({
      success: true,
      message: 'Tracking updated successfully',
      data: { tracking: order.delivery.tracking }
    });
  } catch (error) {
    console.error('Add tracking update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reorder
// @route   POST /api/orders/:id/reorder
// @access  Private (Customer role)
exports.reorder = async (req, res) => {
  try {
    const originalOrder = await Order.findById(req.params.id)
      .populate('items.foodItem');

    if (!originalOrder) {
      return res.status(404).json({
        success: false,
        message: 'Original order not found'
      });
    }

    // Check if user owns this order
    if (originalOrder.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reorder this order'
      });
    }

    // Check if vendor is still active and open
    const vendor = await Vendor.findById(originalOrder.vendor);
    if (!vendor || !vendor.isActive || !vendor.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'Vendor is currently unavailable'
      });
    }

    // Validate items are still available
    const validatedItems = [];
    for (const item of originalOrder.items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (!foodItem || !foodItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Food item ${foodItem?.name} is no longer available`
        });
      }
      validatedItems.push({
        foodItem: item.foodItem,
        quantity: item.quantity,
        variant: item.variant,
        addOns: item.addOns,
        specialInstructions: item.specialInstructions
      });
    }

    // Create new order with same items and address
    const newOrderData = {
      customer: req.user.id,
      vendor: originalOrder.vendor,
      items: validatedItems,
      deliveryAddress: originalOrder.deliveryAddress,
      payment: {
        method: originalOrder.payment.method,
        amount: originalOrder.pricing.total
      },
      pricing: originalOrder.pricing,
      specialInstructions: originalOrder.specialInstructions,
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Reorder placed successfully'
      }]
    };

    const newOrder = await Order.create(newOrderData);

    res.status(201).json({
      success: true,
      message: 'Reorder created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during reorder'
    });
  }
};
