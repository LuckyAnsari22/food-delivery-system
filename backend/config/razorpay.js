const Razorpay = require('razorpay');

// Initialize Razorpay with fallback for missing credentials
let razorpay = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.log('⚠️  Razorpay credentials not found, using mock mode');
  }
} catch (error) {
  console.log('⚠️  Razorpay initialization failed, using mock mode:', error.message);
}

// Mock Razorpay functions for development
const mockRazorpay = {
  orders: {
    create: async (orderData) => {
      return {
        id: `mock_order_${Date.now()}`,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        status: 'created'
      };
    }
  },
  payments: {
    fetch: async (paymentId) => {
      return {
        id: paymentId,
        amount: 10000,
        currency: 'INR',
        status: 'captured',
        method: 'card'
      };
    },
    refund: async (paymentId, refundData) => {
      return {
        id: `mock_refund_${Date.now()}`,
        payment_id: paymentId,
        amount: refundData.amount,
        status: 'processed'
      };
    }
  }
};

module.exports = razorpay || mockRazorpay;
