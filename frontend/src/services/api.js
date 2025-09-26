import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Don't redirect on network errors, just log them
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      console.warn('Backend server not available, using mock data');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.put('/auth/reset-password', data),
};

// Vendors API
export const vendorsAPI = {
  getVendors: (params) => api.get('/vendors', { params }),
  getVendorById: (id) => api.get(`/vendors/${id}`),
  registerVendor: (vendorData) => api.post('/vendors/register', vendorData),
  getVendorProfile: () => api.get('/vendors/profile'),
  updateVendorProfile: (profileData) => api.put('/vendors/profile', profileData),
  getVendorDashboard: () => api.get('/vendors/dashboard'),
  updateVendorStatus: (status) => api.put('/vendors/status', { isOpen: status }),
  getVendorAnalytics: (params) => api.get('/vendors/analytics', { params }),
};

// Food Items API
export const foodItemsAPI = {
  getFoodItems: (params) => api.get('/food-items/search', { params }),
  getFoodItemById: (id) => api.get(`/food-items/${id}`),
  getFoodItemsByVendor: (vendorId, params) => api.get(`/food-items/vendor/${vendorId}`, { params }),
  getPopularFoodItems: (params) => api.get('/food-items/popular', { params }),
  getFoodItemsByCategory: (category, params) => api.get(`/food-items/category/${category}`, { params }),
  createFoodItem: (itemData) => api.post('/food-items', itemData),
  updateFoodItem: (id, itemData) => api.put(`/food-items/${id}`, itemData),
  deleteFoodItem: (id) => api.delete(`/food-items/${id}`),
  toggleAvailability: (id) => api.put(`/food-items/${id}/availability`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status, note) => api.put(`/orders/${id}/status`, { status, note }),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getVendorOrders: (params) => api.get('/orders/vendor', { params }),
  trackOrder: (id) => api.get(`/orders/${id}/track`),
  addTrackingUpdate: (id, data) => api.post(`/orders/${id}/tracking`, data),
  reorder: (id) => api.post(`/orders/${id}/reorder`),
};

// Payments API
export const paymentsAPI = {
  createRazorpayOrder: (orderId) => api.post('/payments/create-order', { orderId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentDetails: (orderId) => api.get(`/payments/${orderId}`),
  processRefund: (data) => api.post('/payments/refund', data),
  getRefundStatus: (orderId) => api.get(`/payments/refund/${orderId}`),
  getPaymentMethods: () => api.get('/payments/methods'),
};

// Reviews API
export const reviewsAPI = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getVendorReviews: (vendorId, params) => api.get(`/reviews/vendor/${vendorId}`, { params }),
  getFoodItemReviews: (foodItemId, params) => api.get(`/reviews/food-item/${foodItemId}`, { params }),
  getUserReviews: (params) => api.get('/reviews/user', { params }),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  addVendorResponse: (id, response) => api.post(`/reviews/${id}/response`, { response }),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  unmarkHelpful: (id) => api.delete(`/reviews/${id}/helpful`),
  reportReview: (id, reason) => api.post(`/reviews/${id}/report`, { reason }),
};

// File Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  uploadMultipleImages: (formData) => api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export default api;
