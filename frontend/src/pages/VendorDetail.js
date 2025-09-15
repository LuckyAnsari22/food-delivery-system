import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiStar, FiClock, FiMapPin, FiPhone, FiMail, FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const VendorDetail = () => {
  const { id } = useParams();
  const { addToCart, getItemQuantity } = useCart();
  const [vendor, setVendor] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock data
  const mockVendor = {
    _id: id,
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
      cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
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
  };

  const mockFoodItems = [
    {
      _id: '1',
      vendor: id,
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
      vendor: id,
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
      vendor: id,
      name: 'Dal Makhani',
      description: 'Creamy black lentils slow-cooked with butter and cream. A rich and flavorful vegetarian dish.',
      category: 'Main Course',
      cuisine: 'Indian',
      price: 180,
      images: [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Dal Makhani', isPrimary: true }
      ],
      preparationTime: 20,
      isVegetarian: true,
      isSpicy: false,
      spiceLevel: 1,
      isPopular: false,
      rating: { average: 4.3, count: 80 },
      totalOrders: 90
    },
    {
      _id: '4',
      vendor: id,
      name: 'Gulab Jamun',
      description: 'Soft, spongy milk dumplings soaked in rose-flavored sugar syrup. A perfect dessert to end your meal.',
      category: 'Dessert',
      cuisine: 'Indian',
      price: 80,
      images: [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500', alt: 'Gulab Jamun', isPrimary: true }
      ],
      preparationTime: 15,
      isVegetarian: true,
      isSpicy: false,
      spiceLevel: 0,
      isPopular: true,
      rating: { average: 4.6, count: 60 },
      totalOrders: 75
    }
  ];

  useEffect(() => {
    const fetchVendorData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVendor(mockVendor);
        setFoodItems(mockFoodItems);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurant details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [id]);

  const categories = ['All', ...new Set(mockFoodItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleQuantityChange = (item, change) => {
    const currentQuantity = getItemQuantity(item._id);
    if (change > 0) {
      addToCart(item);
    } else if (currentQuantity > 0) {
      // Remove one item
      addToCart(item, -1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Restaurant not found" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{vendor.businessName} - FoodDelivery</title>
        <meta name="description" content={vendor.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 bg-gray-900">
          <img
            src={vendor.images.cover}
            alt={vendor.businessName}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{vendor.businessName}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>{vendor.rating.average}</span>
                  <span className="text-gray-300 ml-1">({vendor.rating.count} reviews)</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{vendor.deliveryInfo.estimatedTime} min</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>{vendor.address.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Restaurant Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About {vendor.businessName}</h2>
                <p className="text-gray-600 mb-4">{vendor.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Cuisine</h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.cuisine.map((cuisine, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Delivery Info</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Min. Order: ₹{vendor.deliveryInfo.minOrderAmount}</p>
                      <p>Delivery Fee: ₹{vendor.deliveryInfo.deliveryFee}</p>
                      <p>Est. Time: {vendor.deliveryInfo.estimatedTime} min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Menu</h2>
                  <div className="flex space-x-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredItems.map((item) => {
                    const quantity = getItemQuantity(item._id);
                    return (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <img
                          src={item.images[0].url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>₹{item.price}</span>
                                <div className="flex items-center">
                                  <FiStar className="text-yellow-400 mr-1" />
                                  <span>{item.rating.average}</span>
                                </div>
                                <span>{item.preparationTime} min</span>
                                {item.isVegetarian && (
                                  <span className="text-green-600">Veg</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {quantity > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(item, -1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                  >
                                    <FiMinus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{quantity}</span>
                                  <button
                                    onClick={() => handleQuantityChange(item, 1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <FiPlus className="w-4 h-4" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Restaurant Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                    <div className="flex items-start">
                      <FiMapPin className="text-gray-400 mr-2 mt-1" />
                      <div className="text-sm text-gray-600">
                        <p>{vendor.address.street}</p>
                        <p>{vendor.address.city}, {vendor.address.state}</p>
                        <p>{vendor.address.pincode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{vendor.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{vendor.contactInfo.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Minimum Order: ₹{vendor.deliveryInfo.minOrderAmount}</p>
                      <p>Delivery Fee: ₹{vendor.deliveryInfo.deliveryFee}</p>
                      <p>Estimated Time: {vendor.deliveryInfo.estimatedTime} minutes</p>
                      <p>Delivery Radius: {vendor.deliveryInfo.deliveryRadius} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDetail;