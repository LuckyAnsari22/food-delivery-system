const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // If MongoDB is not available, continue without it for now
    if (error.message.includes('ECONNREFUSED')) {
      console.log('⚠️  MongoDB not available, running in mock mode');
      return null;
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
