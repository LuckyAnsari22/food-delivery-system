import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiStar, FiClock, FiMapPin } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock vendors data
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

  useEffect(() => {
    // Simulate API call
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVendors(mockVendors);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [searchQuery, selectedCuisine, minRating, sortBy]);

  const cuisines = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food', 'Desserts'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter vendors based on search query
    const filteredVendors = mockVendors.filter(vendor => {
      const matchesSearch = !searchQuery || 
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCuisine = !selectedCuisine || 
        vendor.cuisine.includes(selectedCuisine);
      
      const matchesRating = !minRating || 
        vendor.rating.average >= parseFloat(minRating);
      
      return matchesSearch && matchesCuisine && matchesRating;
    });
    
    setVendors(filteredVendors);
  };

  return (
    <>
      <Helmet>
        <title>Restaurants - FoodDelivery</title>
        <meta name="description" content="Browse restaurants and order food online" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurants</h1>
            <p className="text-gray-600">Discover amazing restaurants near you</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search restaurants..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>

                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="delivery">Sort by Delivery Time</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </form>
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : error ? (
            <ErrorMessage message="Failed to load restaurants" onRetry={() => window.location.reload()} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Link
                  key={vendor._id}
                  to={`/vendors/${vendor._id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={vendor.images?.cover || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}
                      alt={vendor.businessName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {vendor.businessName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {vendor.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {vendor.rating?.average?.toFixed(1) || '4.0'}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          ({vendor.rating?.count || 0})
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiClock className="w-4 h-4 mr-1" />
                        {vendor.deliveryInfo?.estimatedTime || 30} min
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {vendor.address?.city}, {vendor.address?.state}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {vendor.cuisine?.slice(0, 2).map((cuisine) => (
                        <span
                          key={cuisine}
                          className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {vendors.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Vendors;
