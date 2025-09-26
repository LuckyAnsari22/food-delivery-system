import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiFilter, FiStar, FiClock, FiTruck, FiHeart, FiShoppingCart, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import RecommendationEngine from '../components/ai/RecommendationEngine';
import { useCart } from '../context/CartContext';

const FoodItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { addItem } = useCart();

  // Mock data for demonstration
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'salad', name: 'Salads', icon: '🥗' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'beverage', name: 'Beverages', icon: '🥤' }
  ];

  const mockFoodItems = [
    {
      _id: 1,
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviewCount: 124,
      prepTime: '25-30 min',
      deliveryFee: 29,
      images: [{ url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' }],
      category: 'pizza',
      restaurant: 'Pizza Palace',
      isVegetarian: true,
      isSpicy: false,
      isPopular: true,
      tags: ['Chef Special', 'Best Seller'],
      vendor: { _id: 'vendor1', name: 'Pizza Palace' }
    },
    {
      _id: 2,
      name: 'Chicken Burger Deluxe',
      description: 'Juicy chicken patty with lettuce, tomato, and special sauce',
      price: 199,
      originalPrice: 249,
      rating: 4.6,
      reviewCount: 89,
      prepTime: '15-20 min',
      deliveryFee: 29,
      images: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' }],
      category: 'burger',
      restaurant: 'Burger Junction',
      isVegetarian: false,
      isSpicy: true,
      isPopular: true,
      tags: ['Spicy', 'Crispy'],
      vendor: { _id: 'vendor2', name: 'Burger Junction' }
    },
    {
      _id: 3,
      name: 'Creamy Alfredo Pasta',
      description: 'Rich and creamy pasta with parmesan cheese',
      price: 249,
      originalPrice: 299,
      rating: 4.7,
      reviewCount: 67,
      prepTime: '20-25 min',
      deliveryFee: 29,
      images: [{ url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400' }],
      category: 'pasta',
      restaurant: 'Italian Corner',
      isVegetarian: true,
      isSpicy: false,
      isPopular: false,
      tags: ['Creamy', 'Rich'],
      vendor: { _id: 'vendor3', name: 'Italian Corner' }
    },
    {
      _id: 4,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing and croutons',
      price: 179,
      originalPrice: 199,
      rating: 4.4,
      reviewCount: 45,
      prepTime: '10-15 min',
      deliveryFee: 29,
      images: [{ url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' }],
      category: 'salad',
      restaurant: 'Healthy Bites',
      isVegetarian: true,
      isSpicy: false,
      isPopular: false,
      tags: ['Healthy', 'Fresh'],
      vendor: { _id: 'vendor4', name: 'Healthy Bites' }
    },
    {
      _id: 5,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 149,
      originalPrice: 179,
      rating: 4.9,
      reviewCount: 156,
      prepTime: '15-20 min',
      deliveryFee: 29,
      images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' }],
      category: 'dessert',
      restaurant: 'Sweet Dreams',
      isVegetarian: true,
      isSpicy: false,
      isPopular: true,
      tags: ['Chocolate', 'Warm'],
      vendor: { _id: 'vendor5', name: 'Sweet Dreams' }
    },
    {
      _id: 6,
      name: 'Fresh Orange Juice',
      description: '100% fresh squeezed orange juice',
      price: 89,
      originalPrice: 99,
      rating: 4.5,
      reviewCount: 34,
      prepTime: '5-10 min',
      deliveryFee: 29,
      images: [{ url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' }],
      category: 'beverage',
      restaurant: 'Juice Bar',
      isVegetarian: true,
      isSpicy: false,
      isPopular: false,
      tags: ['Fresh', 'Healthy'],
      vendor: { _id: 'vendor6', name: 'Juice Bar' }
    }
  ];

  const [filteredItems, setFilteredItems] = useState(mockFoodItems);

  useEffect(() => {
    let filtered = mockFoodItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    // Sort items
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'prep-time':
        filtered.sort((a, b) => parseInt(a.prepTime) - parseInt(b.prepTime));
        break;
      default:
        // Popularity (default)
        filtered.sort((a, b) => b.isPopular - a.isPopular);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const addToCart = (item) => {
    addItem({
      foodItem: item,
      quantity: 1
    });
  };

  const getDiscountPercentage = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <>
      <Helmet>
        <title>Food Items - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discover Amazing Food</h1>
                <p className="text-gray-600 mt-1">Find your favorite dishes from top restaurants</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search food, restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                  >
                    <FiFilter />
                  </button>
                </div>

                <AnimatePresence>
                  {(showFilters || window.innerWidth >= 1024) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      {/* Categories */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                selectedCategory === category.id
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-lg">{category.icon}</span>
                              <span className="text-sm font-medium">{category.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort By */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="popularity">Most Popular</option>
                          <option value="rating">Highest Rated</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="prep-time">Fastest Delivery</option>
                        </select>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            step="50"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredItems.length} items found
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {selectedCategory !== 'all' && `in ${categories.find(c => c.id === selectedCategory)?.name}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Quick Actions:</span>
                  <button 
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <FiZap className="inline mr-1" />
                    AI Recommendations
                  </button>
                </div>
              </div>

              {/* AI Recommendations */}
              {showAIRecommendations && (
                <div className="mb-8">
                  <RecommendationEngine 
                    userPreferences={{ spicy: true, healthy: false, quick: true }}
                    orderHistory={[]}
                    weatherData={{ temp: 28, condition: 'sunny' }}
                  />
                </div>
              )}

              {/* Food Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Discount Badge */}
                        {item.originalPrice > item.price && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {getDiscountPercentage(item.originalPrice, item.price)}% OFF
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <FiHeart
                            className={`w-4 h-4 ${
                              favorites.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                            }`}
                          />
                        </button>

                        {/* Popular Badge */}
                        {item.isPopular && (
                          <div className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <FiStar className="w-3 h-3 fill-current" />
                            Popular
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{item.restaurant}</p>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <FiStar className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{item.rating}</span>
                            <span className="text-xs text-gray-500">({item.reviewCount})</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.isVegetarian && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              🥬 Veg
                            </span>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {item.prepTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiTruck className="w-3 h-3" />
                                ₹{item.deliveryFee} delivery
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => addToCart(item)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FiShoppingCart className="w-4 h-4" />
                            <span className="text-sm font-medium">Add</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* No Results */}
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setPriceRange([0, 1000]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodItems;
