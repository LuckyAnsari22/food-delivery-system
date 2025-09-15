const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  items: [{
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    variant: {
      name: String,
      price: Number
    },
    addOns: [{
      name: String,
      price: Number
    }],
    specialInstructions: String
  }],
  deliveryAddress: {
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cod', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: {
      type: Number,
      required: true
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  delivery: {
    estimatedTime: {
      type: Number,
      default: 30
    },
    actualDeliveryTime: Date,
    deliveryPerson: {
      name: String,
      phone: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    tracking: [{
      timestamp: {
        type: Date,
        default: Date.now
      },
      location: {
        latitude: Number,
        longitude: Number
      },
      status: String,
      note: String
    }]
  },
  specialInstructions: String,
  rating: {
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    images: [String]
  },
  isRefundable: {
    type: Boolean,
    default: true
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected', 'processed'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note
  });
  return this.save();
};

// Method to add tracking update
orderSchema.methods.addTrackingUpdate = function(location, status, note = '') {
  this.delivery.tracking.push({
    timestamp: new Date(),
    location: location,
    status: status,
    note: note
  });
  return this.save();
};

// Method to calculate estimated delivery time
orderSchema.methods.calculateEstimatedDelivery = function() {
  const now = new Date();
  const estimatedMinutes = this.delivery.estimatedTime;
  return new Date(now.getTime() + estimatedMinutes * 60000);
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const cancellableStatuses = ['pending', 'confirmed'];
  return cancellableStatuses.includes(this.status) && this.payment.status !== 'completed';
};

// Method to calculate refund amount
orderSchema.methods.calculateRefundAmount = function() {
  if (this.status === 'cancelled' && this.payment.status === 'completed') {
    // Full refund if cancelled before preparation
    if (['pending', 'confirmed'].includes(this.timeline[this.timeline.length - 2]?.status)) {
      return this.pricing.total;
    }
    // Partial refund if cancelled after preparation
    return this.pricing.total * 0.5;
  }
  return 0;
};

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
  return `${itemCount} item${itemCount > 1 ? 's' : ''} from ${this.vendor.businessName}`;
});

module.exports = mongoose.model('Order', orderSchema);
