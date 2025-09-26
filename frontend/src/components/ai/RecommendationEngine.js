import React, { useState, useEffect } from 'react';
import { FiCpu, FiStar, FiTrendingUp, FiClock, FiHeart, FiZap, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendationEngine = ({ userPreferences, orderHistory, weatherData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock AI recommendations based on various factors
  const generateRecommendations = () => {
    const baseRecommendations = [
      {
        id: 1,
        name: 'Spicy Chicken Pizza',
        reason: 'Based on your love for spicy food',
        confidence: 95,
        category: 'pizza',
        price: 349,
        rating: 4.8,
        prepTime: '20-25 min',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        tags: ['Spicy', 'Popular', 'AI Recommended'],
        aiFactors: ['Weather: Hot', 'History: Spicy preference', 'Time: Lunch']
      },
      {
        id: 2,
        name: 'Caesar Salad',
        reason: 'Perfect for your healthy eating goals',
        confidence: 88,
        category: 'salad',
        price: 179,
        rating: 4.6,
        prepTime: '10-15 min',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        tags: ['Healthy', 'Fresh', 'AI Recommended'],
        aiFactors: ['Health: Low calorie', 'Time: Quick', 'Weather: Light meal']
      },
      {
        id: 3,
        name: 'Chocolate Lava Cake',
        reason: 'You usually order dessert on weekends',
        confidence: 82,
        category: 'dessert',
        price: 149,
        rating: 4.9,
        prepTime: '15-20 min',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        tags: ['Sweet', 'Weekend Special', 'AI Recommended'],
        aiFactors: ['Pattern: Weekend dessert', 'Mood: Indulgent', 'Time: Evening']
      },
      {
        id: 4,
        name: 'Margherita Pizza',
        reason: 'Classic choice that matches your taste profile',
        confidence: 90,
        category: 'pizza',
        price: 299,
        rating: 4.7,
        prepTime: '25-30 min',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
        tags: ['Classic', 'Vegetarian', 'AI Recommended'],
        aiFactors: ['History: Pizza preference', 'Weather: Comfort food', 'Time: Dinner']
      },
      {
        id: 5,
        name: 'Fresh Orange Juice',
        reason: 'Great for hydration in this weather',
        confidence: 75,
        category: 'beverage',
        price: 89,
        rating: 4.5,
        prepTime: '5-10 min',
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        tags: ['Fresh', 'Healthy', 'AI Recommended'],
        aiFactors: ['Weather: Hot day', 'Health: Hydration', 'Time: Any time']
      }
    ];

    return baseRecommendations;
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate AI processing time
    setTimeout(() => {
      setRecommendations(generateRecommendations());
      setIsLoading(false);
    }, 1500);
  }, [userPreferences, orderHistory, weatherData]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 80) return 'text-blue-600 bg-blue-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Medium';
    return 'Low';
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true;
    return rec.category === activeFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-full">
            <FiCpu className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
            <p className="text-sm text-gray-600">Personalized suggestions just for you</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setRecommendations(generateRecommendations());
              setIsLoading(false);
            }, 1000);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Trending</span>
          </div>
          <p className="text-sm text-blue-700">Spicy foods are popular today</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiClock className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">Time-based</span>
          </div>
          <p className="text-sm text-green-700">Lunch time - quick meals preferred</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiStar className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-900">Personal</span>
          </div>
          <p className="text-sm text-yellow-700">Based on your order history</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-600">Filter by:</span>
        {['all', 'pizza', 'salad', 'dessert', 'beverage'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">AI is analyzing your preferences...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecommendations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 group"
              >
                {/* AI Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiZap className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">AI Recommended</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                    {getConfidenceText(item.confidence)} Match
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-gray-700">{item.confidence}%</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                  </div>

                  {/* AI Factors */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500">AI Analysis:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.aiFactors.map((factor, factorIndex) => (
                        <span
                          key={factorIndex}
                          className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                      <div className="flex items-center gap-1">
                        <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{item.prepTime}</p>
                      <button className="mt-1 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* No Recommendations */}
      {!isLoading && filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <FiFilter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or refresh for new suggestions</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Show All Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationEngine;
