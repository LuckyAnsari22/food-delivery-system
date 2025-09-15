# Food Delivery System

A comprehensive full-stack food delivery platform built with React.js, Node.js, Express.js, and MongoDB. This system connects customers, vendors, and delivery personnel with real-time order tracking, secure payments, and comprehensive vendor management.

## 🚀 Features

### Core Features
- **Multi-role Authentication**: Customer, Vendor, and Admin roles with JWT-based authentication
- **Vendor Management**: Complete vendor registration, menu management, and order dashboard
- **Customer Ordering**: Browse restaurants, add to cart, place orders with address management
- **Real-time Order Tracking**: Live status updates with Socket.io integration
- **Payment Integration**: Razorpay payment gateway with multiple payment methods
- **Review & Rating System**: Post-delivery reviews with vendor responses
- **Order History**: Complete order management with reorder functionality

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Socket.io for live order tracking and notifications
- **Secure Payments**: Razorpay integration with payment verification
- **File Upload**: Image upload for food items and vendor profiles
- **Search & Filtering**: Advanced search with cuisine, rating, and price filters
- **API Documentation**: Comprehensive RESTful API with proper error handling

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Socket.io Client** - Real-time communication
- **React Icons** - Icon library
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - Real-time bidirectional communication
- **Razorpay** - Payment gateway integration
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Bcryptjs** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
food-delivery-system/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── vendorController.js
│   │   ├── foodItemController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── reviewController.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── FoodItem.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── vendors.js
│   │   ├── foodItems.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── reviews.js
│   ├── scripts/             # Database scripts
│   │   └── seedData.js
│   ├── utils/               # Utility functions
│   │   └── jwt.js
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/           # Page components
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── vendor/
│   │   │   └── admin/
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json
├── package.json             # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-delivery-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # CORS
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Seed the database** (Optional)
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Demo Accounts

The seed script creates demo accounts for testing:

**Customer Account:**
- Email: `john@example.com`
- Password: `password123`

**Vendor Account:**
- Email: `vendor1@example.com`
- Password: `vendor123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Vendor Endpoints
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors/register` - Register as vendor
- `GET /api/vendors/profile` - Get vendor profile
- `PUT /api/vendors/profile` - Update vendor profile
- `GET /api/vendors/dashboard` - Get vendor dashboard data

### Food Items Endpoints
- `GET /api/food-items/search` - Search food items
- `GET /api/food-items/:id` - Get food item by ID
- `GET /api/food-items/vendor/:vendorId` - Get vendor's food items
- `POST /api/food-items` - Create food item (Vendor)
- `PUT /api/food-items/:id` - Update food item (Vendor)
- `DELETE /api/food-items/:id` - Delete food item (Vendor)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Vendor)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/track` - Track order

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:orderId` - Get payment details
- `POST /api/payments/refund` - Process refund

### Review Endpoints
- `POST /api/reviews` - Create review
- `GET /api/reviews/vendor/:vendorId` - Get vendor reviews
- `GET /api/reviews/food-item/:foodItemId` - Get food item reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔧 Configuration

### Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add the keys to your `.env` file

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env` file
3. The application will create the database and collections automatically

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
RAZORPAY_KEY_ID=your-production-razorpay-key-id
RAZORPAY_KEY_SECRET=your-production-razorpay-key-secret
CLIENT_URL=your-production-frontend-url
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Features Overview

### Customer Features
- Browse restaurants and food items
- Search and filter by cuisine, rating, price
- Add items to cart with variants and add-ons
- Multiple saved addresses
- Real-time order tracking
- Payment with Razorpay
- Review and rate orders
- Order history and reorder

### Vendor Features
- Vendor registration and profile management
- Menu management (add, edit, delete food items)
- Order dashboard with real-time updates
- Order status management
- Analytics and earnings tracking
- Review management and responses

### Admin Features
- User and vendor management
- Order monitoring
- Payment and refund management
- System analytics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- Protected routes and role-based access control

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Loading states and error handling
- Toast notifications
- Real-time updates
- Smooth animations
- Accessible design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- Razorpay for payment gateway integration
- MongoDB for the database solution
- All open-source contributors

---

**Happy Coding! 🚀**
