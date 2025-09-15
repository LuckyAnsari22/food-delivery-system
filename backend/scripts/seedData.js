const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const FoodItem = require('../models/FoodItem');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '9876543210',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '9876543211',
    role: 'customer'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '9876543212',
    role: 'admin'
  }
];

const sampleVendors = [
  {
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
    businessHours: {
      monday: { open: '10:00', close: '23:00', isOpen: true },
      tuesday: { open: '10:00', close: '23:00', isOpen: true },
      wednesday: { open: '10:00', close: '23:00', isOpen: true },
      thursday: { open: '10:00', close: '23:00', isOpen: true },
      friday: { open: '10:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '23:00', isOpen: true },
      sunday: { open: '10:00', close: '23:00', isOpen: true }
    },
    deliveryInfo: {
      minOrderAmount: 200,
      deliveryFee: 30,
      estimatedTime: 35,
      deliveryRadius: 5
    },
    bankDetails: {
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      accountHolderName: 'Spice Garden Restaurant',
      bankName: 'State Bank of India'
    },
    isActive: true,
    isVerified: true,
    isOpen: true
  },
  {
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
    businessHours: {
      monday: { open: '11:00', close: '22:30', isOpen: true },
      tuesday: { open: '11:00', close: '22:30', isOpen: true },
      wednesday: { open: '11:00', close: '22:30', isOpen: true },
      thursday: { open: '11:00', close: '22:30', isOpen: true },
      friday: { open: '11:00', close: '22:30', isOpen: true },
      saturday: { open: '11:00', close: '22:30', isOpen: true },
      sunday: { open: '11:00', close: '22:30', isOpen: true }
    },
    deliveryInfo: {
      minOrderAmount: 150,
      deliveryFee: 25,
      estimatedTime: 30,
      deliveryRadius: 4
    },
    bankDetails: {
      accountNumber: '2345678901',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Dragon Palace',
      bankName: 'HDFC Bank'
    },
    isActive: true,
    isVerified: true,
    isOpen: true
  },
  {
    businessName: 'Pizza Corner',
    description: 'Fresh, hot, and delicious pizzas made with the finest ingredients. Your favorite Italian flavors delivered to your doorstep.',
    cuisine: ['Italian', 'Fast Food'],
    address: {
      street: '789 MG Road, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      coordinates: {
        latitude: 19.1136,
        longitude: 72.8697
      }
    },
    contactInfo: {
      phone: '9876543215',
      email: 'pizzacorner@example.com'
    },
    businessHours: {
      monday: { open: '12:00', close: '24:00', isOpen: true },
      tuesday: { open: '12:00', close: '24:00', isOpen: true },
      wednesday: { open: '12:00', close: '24:00', isOpen: true },
      thursday: { open: '12:00', close: '24:00', isOpen: true },
      friday: { open: '12:00', close: '24:00', isOpen: true },
      saturday: { open: '12:00', close: '24:00', isOpen: true },
      sunday: { open: '12:00', close: '24:00', isOpen: true }
    },
    deliveryInfo: {
      minOrderAmount: 300,
      deliveryFee: 40,
      estimatedTime: 25,
      deliveryRadius: 6
    },
    bankDetails: {
      accountNumber: '3456789012',
      ifscCode: 'ICIC0001234',
      accountHolderName: 'Pizza Corner',
      bankName: 'ICICI Bank'
    },
    isActive: true,
    isVerified: true,
    isOpen: true
  }
];

const sampleFoodItems = [
  // Indian Cuisine - Spice Garden
  {
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken pieces, exotic spices, and saffron. Served with raita and pickle.',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 280,
    images: [
      { url: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=500', alt: 'Chicken Biryani', isPrimary: true }
    ],
    ingredients: ['Basmati Rice', 'Chicken', 'Onions', 'Yogurt', 'Saffron', 'Spices'],
    preparationTime: 30,
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 3,
    isPopular: true,
    rating: { average: 4.5, count: 120 },
    totalOrders: 150
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken pieces in a rich, creamy tomato-based gravy with aromatic spices. Best served with naan or rice.',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 320,
    images: [
      { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', alt: 'Butter Chicken', isPrimary: true }
    ],
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Onions', 'Ginger', 'Garlic', 'Spices'],
    preparationTime: 25,
    isVegetarian: false,
    isSpicy: false,
    spiceLevel: 1,
    isPopular: true,
    rating: { average: 4.7, count: 95 },
    totalOrders: 120
  },
  {
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and cream. A rich and flavorful vegetarian delight.',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 180,
    images: [
      { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500', alt: 'Dal Makhani', isPrimary: true }
    ],
    ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes', 'Onions', 'Spices'],
    preparationTime: 20,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    spiceLevel: 1,
    rating: { average: 4.3, count: 80 },
    totalOrders: 100
  },
  {
    name: 'Garlic Naan',
    description: 'Soft and fluffy bread baked in tandoor with fresh garlic and herbs. Perfect accompaniment to any curry.',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 60,
    images: [
      { url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', alt: 'Garlic Naan', isPrimary: true }
    ],
    ingredients: ['Flour', 'Garlic', 'Herbs', 'Yogurt', 'Butter'],
    preparationTime: 10,
    isVegetarian: true,
    isSpicy: false,
    spiceLevel: 0,
    rating: { average: 4.2, count: 200 },
    totalOrders: 250
  },

  // Chinese Cuisine - Dragon Palace
  {
    name: 'Chicken Manchurian',
    description: 'Crispy chicken balls in a tangy and spicy Manchurian sauce. A perfect Indo-Chinese fusion dish.',
    category: 'Main Course',
    cuisine: 'Chinese',
    price: 220,
    images: [
      { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', alt: 'Chicken Manchurian', isPrimary: true }
    ],
    ingredients: ['Chicken', 'Cornflour', 'Soy Sauce', 'Ginger', 'Garlic', 'Green Chilies', 'Bell Peppers'],
    preparationTime: 20,
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 3,
    isPopular: true,
    rating: { average: 4.4, count: 110 },
    totalOrders: 140
  },
  {
    name: 'Vegetable Fried Rice',
    description: 'Fragrant basmati rice stir-fried with fresh vegetables and aromatic spices. A healthy and delicious option.',
    category: 'Main Course',
    cuisine: 'Chinese',
    price: 160,
    images: [
      { url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500', alt: 'Vegetable Fried Rice', isPrimary: true }
    ],
    ingredients: ['Basmati Rice', 'Carrots', 'Beans', 'Cabbage', 'Bell Peppers', 'Spring Onions', 'Soy Sauce'],
    preparationTime: 15,
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    spiceLevel: 1,
    rating: { average: 4.1, count: 90 },
    totalOrders: 110
  },
  {
    name: 'Chicken Spring Rolls',
    description: 'Crispy spring rolls filled with seasoned chicken and vegetables. Served with sweet and sour sauce.',
    category: 'Appetizer',
    cuisine: 'Chinese',
    price: 120,
    images: [
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', alt: 'Chicken Spring Rolls', isPrimary: true }
    ],
    ingredients: ['Chicken', 'Cabbage', 'Carrots', 'Spring Roll Wrappers', 'Soy Sauce', 'Ginger'],
    preparationTime: 12,
    isVegetarian: false,
    isSpicy: false,
    spiceLevel: 1,
    rating: { average: 4.0, count: 75 },
    totalOrders: 90
  },

  // Italian Cuisine - Pizza Corner
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil leaves. Simple yet delicious.',
    category: 'Main Course',
    cuisine: 'Italian',
    price: 350,
    images: [
      { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Margherita Pizza', isPrimary: true }
    ],
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella Cheese', 'Fresh Basil', 'Olive Oil'],
    preparationTime: 20,
    isVegetarian: true,
    isSpicy: false,
    spiceLevel: 0,
    isPopular: true,
    rating: { average: 4.6, count: 180 },
    totalOrders: 220
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with spicy pepperoni, mozzarella cheese, and our signature tomato sauce on a crispy crust.',
    category: 'Main Course',
    cuisine: 'Italian',
    price: 420,
    images: [
      { url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', alt: 'Pepperoni Pizza', isPrimary: true }
    ],
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella Cheese', 'Pepperoni', 'Oregano'],
    preparationTime: 22,
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 2,
    isPopular: true,
    rating: { average: 4.5, count: 150 },
    totalOrders: 180
  },
  {
    name: 'Chicken BBQ Pizza',
    description: 'Tender grilled chicken with BBQ sauce, red onions, and mozzarella cheese on our signature crust.',
    category: 'Main Course',
    cuisine: 'Italian',
    price: 450,
    images: [
      { url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500', alt: 'Chicken BBQ Pizza', isPrimary: true }
    ],
    ingredients: ['Pizza Dough', 'BBQ Sauce', 'Grilled Chicken', 'Red Onions', 'Mozzarella Cheese', 'Cilantro'],
    preparationTime: 25,
    isVegetarian: false,
    isSpicy: false,
    spiceLevel: 1,
    rating: { average: 4.4, count: 120 },
    totalOrders: 150
  },
  {
    name: 'Garlic Bread',
    description: 'Crispy bread topped with garlic butter and herbs. Perfect as a starter or side dish.',
    category: 'Appetizer',
    cuisine: 'Italian',
    price: 80,
    images: [
      { url: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500', alt: 'Garlic Bread', isPrimary: true }
    ],
    ingredients: ['Bread', 'Garlic', 'Butter', 'Herbs', 'Parmesan Cheese'],
    preparationTime: 8,
    isVegetarian: true,
    isSpicy: false,
    spiceLevel: 0,
    rating: { average: 4.2, count: 160 },
    totalOrders: 200
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await FoodItem.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create vendor users
    const vendorUsers = [];
    for (let i = 0; i < sampleVendors.length; i++) {
      const vendorUser = new User({
        name: `Vendor ${i + 1}`,
        email: `vendor${i + 1}@example.com`,
        password: 'vendor123',
        phone: `98765432${20 + i}`,
        role: 'vendor'
      });
      await vendorUser.save();
      vendorUsers.push(vendorUser);
      console.log(`Created vendor user: ${vendorUser.name}`);
    }

    // Create vendors
    const vendors = [];
    for (let i = 0; i < sampleVendors.length; i++) {
      const vendorData = {
        user: vendorUsers[i]._id,
        ...sampleVendors[i]
      };
      const vendor = new Vendor(vendorData);
      await vendor.save();
      vendors.push(vendor);
      console.log(`Created vendor: ${vendor.businessName}`);
    }

    // Create food items
    const foodItems = [];
    let vendorIndex = 0;
    
    for (let i = 0; i < sampleFoodItems.length; i++) {
      // Assign items to vendors based on cuisine
      if (i >= 4) vendorIndex = 1; // Chinese items
      if (i >= 7) vendorIndex = 2; // Italian items
      
      const foodItemData = {
        vendor: vendors[vendorIndex]._id,
        ...sampleFoodItems[i]
      };
      
      const foodItem = new FoodItem(foodItemData);
      await foodItem.save();
      foodItems.push(foodItem);
      console.log(`Created food item: ${foodItem.name}`);
    }

    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users, ${vendors.length} vendors, and ${foodItems.length} food items`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
