const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay (with fallback for demo)
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} catch (error) {
  console.warn('Razorpay not configured, using demo mode');
  razorpay = null;
}

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private (Customer role)
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Get order from database
    const order = await Order.findById(orderId)
      .populate('customer', 'name email phone')
      .populate('vendor', 'businessName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create payment for this order'
      });
    }

    // Check if order is in pending status
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is not in pending status'
      });
    }

    // Check if payment is already completed
    if (order.payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this order'
      });
    }

    // Create Razorpay order (with demo fallback)
    let razorpayOrder;
    if (razorpay) {
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.pricing.total * 100), // Convert to paise
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order._id.toString(),
          customerId: order.customer._id.toString(),
          vendorId: order.vendor._id.toString()
        }
      });
    } else {
      // Demo mode - create mock order
      razorpayOrder = {
        id: `order_demo_${Date.now()}`,
        amount: Math.round(order.pricing.total * 100),
        currency: 'INR',
        receipt: order.orderNumber
      };
    }

    // Update order with Razorpay order ID
    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment order creation'
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private (Customer role)
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Payment ID, and Signature are required'
      });
    }

    // Get order from database
    const order = await Order.findById(orderId);

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
        message: 'Not authorized to verify payment for this order'
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Verify payment with Razorpay (with demo fallback)
    let payment;
    if (razorpay) {
      payment = await razorpay.payments.fetch(paymentId);
      if (payment.status !== 'captured') {
        return res.status(400).json({
          success: false,
          message: 'Payment not captured'
        });
      }
    } else {
      // Demo mode - simulate successful payment
      payment = {
        status: 'captured',
        id: paymentId
      };
    }

    // Update order payment status
    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = paymentId;
    order.payment.razorpaySignature = signature;
    order.status = 'confirmed';
    
    // Add timeline update
    order.timeline.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Payment completed successfully'
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentId: paymentId,
        status: order.status,
        amount: order.pricing.total
      }
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification'
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:orderId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'name email')
      .populate('vendor', 'businessName');

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
        message: 'Not authorized to view payment details'
      });
    }

    let paymentDetails = null;

    // If Razorpay payment, get details from Razorpay
    if (order.payment.razorpayPaymentId) {
      try {
        paymentDetails = await razorpay.payments.fetch(order.payment.razorpayPaymentId);
      } catch (error) {
        console.error('Error fetching Razorpay payment details:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          payment: order.payment,
          pricing: order.pricing
        },
        paymentDetails
      }
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private (Admin/Vendor role)
exports.processRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    if (!orderId || !amount || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, amount, and reason are required'
      });
    }

    const order = await Order.findById(orderId)
      .populate('vendor', 'user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isVendorOwner = order.vendor.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isVendorOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process refund'
      });
    }

    // Check if payment was made through Razorpay
    if (!order.payment.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'No Razorpay payment found for this order'
      });
    }

    // Check if payment is completed
    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed, cannot process refund'
      });
    }

    // Process refund with Razorpay
    const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
      amount: Math.round(amount * 100), // Convert to paise
      notes: {
        reason: reason,
        orderId: orderId,
        processedBy: req.user.id
      }
    });

    // Update order refund status
    order.refundAmount = amount;
    order.refundReason = reason;
    order.refundStatus = 'processed';
    order.payment.status = 'refunded';
    
    // Add timeline update
    order.timeline.push({
      status: 'refunded',
      timestamp: new Date(),
      note: `Refund processed: ${reason}`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100, // Convert back to rupees
        status: refund.status,
        orderId: order._id
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during refund processing'
    });
  }
};

// @desc    Get refund status
// @route   GET /api/payments/refund/:orderId
// @access  Private
exports.getRefundStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.customer.toString() !== req.user.id && 
        order.vendor.user.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view refund status'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        refundStatus: order.refundStatus,
        refundAmount: order.refundAmount,
        refundReason: order.refundReason,
        paymentStatus: order.payment.status
      }
    });
  } catch (error) {
    console.error('Get refund status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'Pay with UPI, Cards, Wallets, Net Banking',
        icon: 'credit-card',
        isAvailable: true
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: 'money-bill',
        isAvailable: true
      }
    ];

    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
