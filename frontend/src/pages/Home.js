import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiSearch, 
  FiClock, 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiHeart,
  FiArrowRight,
  FiMapPin
} from 'react-icons/fi';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for vendors
  const mockVendors = [
    {
      _id: '1',
      businessName: 'Spice Garden Restaurant',
      description: 'Authentic Indian cuisine with a modern twist. We serve the best biryani, curries, and tandoori dishes in town.',
      cuisine: ['Indian'],
      address: {
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      images: {
        cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
      },
      rating: {
        average: 4.5,
        count: 120
      },
      deliveryInfo: {
        estimatedTime: 35
      }
    },
    {
      _id: '2',
      businessName: 'Dragon Palace',
      description: 'Experience the authentic flavors of China with our traditional and modern Chinese dishes.',
      cuisine: ['Chinese'],
      address: {
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      images: {
        cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
      },
      rating: {
        average: 4.3,
        count: 95
      },
      deliveryInfo: {
        estimatedTime: 30
      }
    },
    {
      _id: '3',
      businessName: 'Pizza Corner',
      description: 'Fresh, hot, and delicious pizzas made with the finest ingredients. Your favorite Italian flavors delivered to your doorstep.',
      cuisine: ['Italian', 'Fast Food'],
      address: {
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      images: {
        cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
      },
      rating: {
        average: 4.6,
        count: 180
      },
      deliveryInfo: {
        estimatedTime: 25
      }
    }
  ];

  // Mock data for food items
  const mockFoodItems = [
    {
      _id: '1',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice cooked with tender chicken pieces, exotic spices, and saffron.',
      price: 280,
      images: [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Chicken Biryani', isPrimary: true }
      ],
      rating: { average: 4.5, count: 120 },
      vendor: { businessName: 'Spice Garden Restaurant' }
    },
    {
      _id: '2',
      name: 'Butter Chicken',
      description: 'Tender chicken pieces in a rich, creamy tomato-based gravy with aromatic spices.',
      price: 320,
      images: [
        { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', alt: 'Butter Chicken', isPrimary: true }
      ],
      rating: { average: 4.7, count: 95 },
      vendor: { businessName: 'Spice Garden Restaurant' }
    },
    {
      _id: '3',
      name: 'Chicken Manchurian',
      description: 'Crispy chicken balls in a tangy and spicy Manchurian sauce.',
      price: 220,
      images: [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Chicken Manchurian', isPrimary: true }
      ],
      rating: { average: 4.4, count: 110 },
      vendor: { businessName: 'Dragon Palace' }
    },
    {
      _id: '4',
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil leaves.',
      price: 350,
      images: [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Margherita Pizza', isPrimary: true }
      ],
      rating: { average: 4.6, count: 180 },
      vendor: { businessName: 'Pizza Corner' }
    }
  ];

  const cuisines = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food', 'Desserts'
  ];

  const features = [
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: FiShield,
      title: 'Safe & Secure',
      description: 'Your data and payments are completely secure'
    },
    {
      icon: FiHeart,
      title: 'Quality Food',
      description: 'Fresh ingredients from trusted restaurants'
    },
    {
      icon: FiClock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/food-items?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>FoodDelivery - Order Food Online | Fast Delivery</title>
        <meta name="description" content="Order delicious food from your favorite restaurants with fast delivery. Browse menus, place orders, and track your food in real-time." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Delicious Food
                <span className="block text-yellow-300">Delivered Fast</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100">
                Order from your favorite restaurants and get it delivered to your doorstep
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for food, restaurants, or cuisines..."
                    className="w-full px-6 py-4 pr-16 text-gray-900 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    <FiSearch className="w-6 h-6" />
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-orange-200">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-orange-200">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">30min</div>
                  <div className="text-orange-200">Avg Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cuisine Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Cuisines</h2>
              <p className="text-gray-600">Explore different flavors from around the world</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {cuisines.map((cuisine) => (
                <Link
                  key={cuisine}
                  to={`/food-items?cuisine=${cuisine}`}
                  className="group p-4 text-center rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <span className="text-orange-600 group-hover:text-white font-bold">
                      {cuisine.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                    {cuisine}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Restaurants */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Restaurants</h2>
                <p className="text-gray-600">Top-rated restaurants in your area</p>
              </div>
              <Link
                to="/vendors"
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <span>View All</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVendors.map((vendor) => (
                  <Link
                    key={vendor._id}
                    to={`/vendors/${vendor._id}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={vendor.images?.cover || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}
                        alt={vendor.businessName}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                        {vendor.businessName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {vendor.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">
                              {vendor.rating?.average?.toFixed(1) || '4.0'}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            ({vendor.rating?.count || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiClock className="w-4 h-4 mr-1" />
                          {vendor.deliveryInfo?.estimatedTime || 30} min
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-gray-500 text-sm">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {vendor.address?.city}, {vendor.address?.state}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Popular Food Items */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Dishes</h2>
                <p className="text-gray-600">Most ordered items this week</p>
              </div>
              <Link
                to="/food-items"
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <span>View All</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockFoodItems.map((item) => (
                  <Link
                    key={item._id}
                    to={`/food-items/${item._id}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500'}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">
                              {item.rating?.average?.toFixed(1) || '4.0'}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            ({item.rating?.count || 0})
                          </span>
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          ₹{item.price}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {item.vendor?.businessName}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-gray-600">We make food delivery simple, fast, and reliable</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
            <p className="text-xl mb-8 text-orange-100">
              Join thousands of satisfied customers and get your favorite food delivered
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vendors"
                className="px-8 py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Restaurants
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-500 transition-colors"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
