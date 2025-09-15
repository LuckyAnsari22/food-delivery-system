const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Combo', 'Other']
  },
  cuisine: {
    type: String,
    required: true,
    enum: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food', 'Desserts', 'Beverages', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: 5,
    max: 60
  },
  isVegetarian: {
    type: Boolean,
    default: true
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  variants: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  addOns: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  tags: [String],
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  minQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  maxQuantity: {
    type: Number,
    default: 10,
    min: 1
  }
}, {
  timestamps: true
});

// Indexes for better performance
foodItemSchema.index({ vendor: 1, isAvailable: 1 });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ cuisine: 1 });
foodItemSchema.index({ 'rating.average': -1 });
foodItemSchema.index({ price: 1 });
foodItemSchema.index({ isPopular: 1 });
foodItemSchema.index({ name: 'text', description: 'text' });

// Virtual for discounted price
foodItemSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for primary image
foodItemSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : '');
});

// Method to check if item is on discount
foodItemSchema.methods.isOnDiscount = function() {
  return this.discount > 0;
};

// Method to get savings amount
foodItemSchema.methods.getSavings = function() {
  if (this.discount > 0) {
    return this.price - this.discountedPrice;
  }
  return 0;
};

module.exports = mongoose.model('FoodItem', foodItemSchema);
