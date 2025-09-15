const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mock data
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2a', // password123
    phone: '9876543210',
    role: 'customer',
    avatar: '',
    addresses: [],
    isActive: true
  },
  {
    _id: '2',
    name: 'Vendor 1',
    email: 'vendor1@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2a', // vendor123
    phone: '9876543211',
    role: 'vendor',
    avatar: '',
    addresses: [],
    isActive: true
  }
];

const mockVendors = [
  {
    _id: '1',
    user: '2',
    businessName: 'Spice Garden Restaurant',
    description: 'Authentic Indian cuisine with a modern twist. We serve the best biryani, curries, and tandoori dishes in town.',
    cuisine: ['Indian'],
    address: {
      street: '123 Main Street, Sector 15',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: {
        latitude: 19.0760,
        longitude: 72.8777
      }
    },
    contactInfo: {
      phone: '9876543213',
      email: 'spicegarden@example.com'
    },
    images: {
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
      cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
    },
    rating: {
      average: 4.5,
      count: 120
    },
    deliveryInfo: {
      minOrderAmount: 200,
      deliveryFee: 30,
      estimatedTime: 35,
      deliveryRadius: 5
    },
    isActive: true,
    isOpen: true
  },
  {
    _id: '2',
    user: '2',
    businessName: 'Dragon Palace',
    description: 'Experience the authentic flavors of China with our traditional and modern Chinese dishes.',
    cuisine: ['Chinese'],
    address: {
      street: '456 Park Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: {
        latitude: 19.0544,
        longitude: 72.8406
      }
    },
    contactInfo: {
      phone: '9876543214',
      email: 'dragonpalace@example.com'
    },
    images: {
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
      cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
    },
    rating: {
      average: 4.3,
      count: 95
    },
    deliveryInfo: {
      minOrderAmount: 150,
      deliveryFee: 25,
      estimatedTime: 30,
      deliveryRadius: 4
    },
    isActive: true,
    isOpen: true
  }
];

const mockFoodItems = [
  {
    _id: '1',
    vendor: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken pieces, exotic spices, and saffron. Served with raita and pickle.',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 280,
    images: [
      { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Chicken Biryani', isPrimary: true }
    ],
    preparationTime: 30,
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 3,
    isPopular: true,
    rating: { average: 4.5, count: 120 },
    totalOrders: 150
  },
  {
    _id: '2',
    vendor: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces in a rich, creamy tomato-based gravy with aromatic spices. Best served with naan or rice.',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 320,
    images: [
      { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', alt: 'Butter Chicken', isPrimary: true }
    ],
    preparationTime: 25,
    isVegetarian: false,
    isSpicy: false,
    spiceLevel: 1,
    isPopular: true,
    rating: { average: 4.7, count: 95 },
    totalOrders: 120
  },
  {
    _id: '3',
    vendor: '2',
    name: 'Chicken Manchurian',
    description: 'Crispy chicken balls in a tangy and spicy Manchurian sauce. A perfect Indo-Chinese fusion dish.',
    category: 'Main Course',
    cuisine: 'Chinese',
    price: 220,
    images: [
      { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Chicken Manchurian', isPrimary: true }
    ],
    preparationTime: 20,
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 3,
    isPopular: true,
    rating: { average: 4.4, count: 110 },
    totalOrders: 140
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      _id: String(mockUsers.length + 1),
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      avatar: '',
      addresses: [],
      isActive: true
    };

    mockUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = mockUsers.find(u => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Vendor Routes
app.get('/api/vendors', (req, res) => {
  const { page = 1, limit = 10, search, cuisine, minRating } = req.query;
  
  let filteredVendors = [...mockVendors];

  // Apply filters
  if (search) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (cuisine) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.cuisine.includes(cuisine)
    );
  }

  if (minRating) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.rating.average >= parseFloat(minRating)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  res.json({
    success: true,
    count: paginatedVendors.length,
    total: filteredVendors.length,
    page: parseInt(page),
    pages: Math.ceil(filteredVendors.length / limit),
    data: paginatedVendors
  });
});

app.get('/api/vendors/:id', (req, res) => {
  const vendor = mockVendors.find(v => v._id === req.params.id);
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }

  const foodItems = mockFoodItems.filter(item => item.vendor === vendor._id);

  res.json({
    success: true,
    data: {
      vendor,
      foodItems
    }
  });
});

// Food Items Routes
app.get('/api/food-items/popular', (req, res) => {
  const { limit = 10 } = req.query;
  const popularItems = mockFoodItems
    .filter(item => item.isPopular)
    .slice(0, parseInt(limit));

  res.json({
    success: true,
    count: popularItems.length,
    data: popularItems
  });
});

app.get('/api/food-items/search', (req, res) => {
  const { q, category, cuisine, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
  
  let filteredItems = [...mockFoodItems];

  // Apply filters
  if (q) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(q.toLowerCase()) ||
      item.description.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  if (cuisine) {
    filteredItems = filteredItems.filter(item => item.cuisine === cuisine);
  }

  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  res.json({
    success: true,
    count: paginatedItems.length,
    total: filteredItems.length,
    page: parseInt(page),
    pages: Math.ceil(filteredItems.length / limit),
    data: paginatedItems
  });
});

app.get('/api/food-items/:id', (req, res) => {
  const item = mockFoodItems.find(item => item._id === req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Food item not found'
    });
  }

  const vendor = mockVendors.find(v => v._id === item.vendor);
  res.json({
    success: true,
    data: {
      ...item,
      vendor
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
