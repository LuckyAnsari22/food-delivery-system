const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
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
  foodItems: [{
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String
  }],
  overallRating: {
    food: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    packaging: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  review: {
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    images: [{
      url: {
        type: String,
        required: true
      },
      caption: String
    }],
    tags: [String]
  },
  vendorResponse: {
    response: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isHelpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ vendor: 1, createdAt: -1 });
reviewSchema.index({ customer: 1, createdAt: -1 });
reviewSchema.index({ order: 1 });
reviewSchema.index({ 'overallRating.food': -1 });
reviewSchema.index({ isVisible: 1 });

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function() {
  const ratings = [
    this.overallRating.food,
    this.overallRating.delivery,
    this.overallRating.packaging,
    this.overallRating.value
  ];
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

// Method to check if user can review this order
reviewSchema.statics.canReview = function(orderId, customerId) {
  return this.findOne({ order: orderId, customer: customerId }).then(review => !review);
};

// Method to add vendor response
reviewSchema.methods.addVendorResponse = function(response, vendorId) {
  this.vendorResponse = {
    response: response,
    respondedAt: new Date(),
    respondedBy: vendorId
  };
  return this.save();
};

// Method to mark as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.isHelpful.users.includes(userId)) {
    this.isHelpful.users.push(userId);
    this.isHelpful.count += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unmark as helpful
reviewSchema.methods.unmarkHelpful = function(userId) {
  const index = this.isHelpful.users.indexOf(userId);
  if (index > -1) {
    this.isHelpful.users.splice(index, 1);
    this.isHelpful.count -= 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Post-save middleware to update vendor and food item ratings
reviewSchema.post('save', async function() {
  try {
    // Update vendor rating
    const vendorReviews = await this.constructor.find({ 
      vendor: this.vendor, 
      isVisible: true 
    });
    
    if (vendorReviews.length > 0) {
      const avgRating = vendorReviews.reduce((sum, review) => sum + review.averageRating, 0) / vendorReviews.length;
      await mongoose.model('Vendor').findByIdAndUpdate(this.vendor, {
        'rating.average': Math.round(avgRating * 10) / 10,
        'rating.count': vendorReviews.length
      });
    }

    // Update food item ratings
    for (const item of this.foodItems) {
      const itemReviews = await this.constructor.find({
        'foodItems.foodItem': item.foodItem,
        isVisible: true
      });
      
      if (itemReviews.length > 0) {
        const itemRatings = itemReviews.flatMap(review => 
          review.foodItems.filter(fi => fi.foodItem.toString() === item.foodItem.toString())
        );
        
        if (itemRatings.length > 0) {
          const avgRating = itemRatings.reduce((sum, rating) => sum + rating.rating, 0) / itemRatings.length;
          await mongoose.model('FoodItem').findByIdAndUpdate(item.foodItem, {
            'rating.average': Math.round(avgRating * 10) / 10,
            'rating.count': itemRatings.length
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
