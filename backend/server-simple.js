const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
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
app.use(morgan('dev'));

// CORS middleware
app.use(cors({
  origin: "http://localhost:3000",
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
    environment: 'development'
  });
});

// Mock data
const mockVendors = [
  {
    _id: '1',
    businessName: 'Spice Garden Restaurant',
    description: 'Authentic Indian cuisine with a modern twist. We serve the best biryani, curries, and tandoori dishes in town.',
    cuisine: ['Indian'],
    address: {
      street: '123 Main Street, Sector 15',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
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
    businessName: 'Dragon Palace',
    description: 'Experience the authentic flavors of China with our traditional and modern Chinese dishes.',
    cuisine: ['Chinese'],
    address: {
      street: '456 Park Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
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
    vendor: { _id: '1', businessName: 'Spice Garden Restaurant' },
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
    vendor: { _id: '1', businessName: 'Spice Garden Restaurant' },
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
    vendor: { _id: '2', businessName: 'Dragon Palace' },
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

// Mock API endpoints
app.get('/api/vendors', (req, res) => {
  res.json({
    success: true,
    count: mockVendors.length,
    data: mockVendors
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
  
  const foodItems = mockFoodItems.filter(item => item.vendor._id === vendor._id);
  
  res.json({
    success: true,
    data: {
      vendor,
      foodItems
    }
  });
});

app.get('/api/food-items/popular', (req, res) => {
  res.json({
    success: true,
    count: mockFoodItems.length,
    data: mockFoodItems
  });
});

app.get('/api/food-items/search', (req, res) => {
  res.json({
    success: true,
    count: mockFoodItems.length,
    data: mockFoodItems
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
  
  res.json({
    success: true,
    data: item
  });
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email === 'john@example.com' && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: ''
      }
    });
  } else if (email === 'vendor1@example.com' && password === 'vendor123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-vendor',
      user: {
        id: '2',
        name: 'Vendor 1',
        email: 'vendor1@example.com',
        role: 'vendor',
        avatar: ''
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful',
    token: 'mock-jwt-token',
    user: {
      id: '3',
      name: req.body.name,
      email: req.body.email,
      role: 'customer',
      avatar: ''
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      avatar: ''
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
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
});

module.exports = app;
