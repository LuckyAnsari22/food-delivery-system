import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiClock, FiTruck, FiCheckCircle, FiUser, FiPhone, FiNavigation, FiStar, FiMessageCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const OrderTracking = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(2);
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [isLive, setIsLive] = useState(true);

  // Mock order data
  const orderData = {
    id: id || 'ORD-2024-001',
    status: 'out_for_delivery',
    restaurant: 'Pizza Palace',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 299 },
      { name: 'Caesar Salad', quantity: 1, price: 179 }
    ],
    total: 478,
    deliveryFee: 29,
    address: '123 Main Street, Downtown, City 12345',
    phone: '+1 (555) 123-4567',
    estimatedDelivery: '2:45 PM',
    orderTime: '2:20 PM'
  };

  const deliverySteps = [
    { id: 1, title: 'Order Confirmed', description: 'Your order has been confirmed', time: '2:20 PM', completed: true },
    { id: 2, title: 'Preparing Food', description: 'Restaurant is preparing your order', time: '2:25 PM', completed: true },
    { id: 3, title: 'Out for Delivery', description: 'Your order is on the way', time: '2:40 PM', completed: true },
    { id: 4, title: 'Delivered', description: 'Order delivered successfully', time: '2:45 PM', completed: false }
  ];

  const mockDeliveryPerson = {
    name: 'John Smith',
    phone: '+1 (555) 987-6543',
    rating: 4.8,
    vehicle: 'Bike',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    location: { lat: 40.7128, lng: -74.0060 },
    estimatedArrival: '5-10 minutes'
  };

  useEffect(() => {
    setDeliveryPerson(mockDeliveryPerson);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (step) => {
    if (step.completed) return 'text-green-600 bg-green-50';
    if (step.id === currentStep) return 'text-blue-600 bg-blue-50';
    return 'text-gray-400 bg-gray-50';
  };

  const getStatusIcon = (step) => {
    if (step.completed) return <FiCheckCircle className="w-5 h-5 text-green-600" />;
    if (step.id === currentStep) return <div className="w-5 h-5 bg-blue-600 rounded-full animate-pulse" />;
    return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
  };

  return (
    <>
      <Helmet>
        <title>Order Tracking - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
                <p className="text-gray-600">Order #{orderData.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">{isLive ? 'Live Tracking' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
                
                <div className="space-y-4">
                  {deliverySteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-4 p-4 rounded-lg ${getStatusColor(step)}`}
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(step)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Estimated Delivery</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{orderData.estimatedDelivery}</p>
                  <p className="text-sm text-blue-700">About {estimatedTime} minutes remaining</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
                
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-gray-900">₹{item.price}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-gray-900">₹{orderData.deliveryFee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">₹{orderData.total + orderData.deliveryFee}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Person & Map */}
            <div className="space-y-6">
              {/* Delivery Person */}
              {deliveryPerson && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Delivery Person</h2>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={deliveryPerson.photo}
                      alt={deliveryPerson.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{deliveryPerson.name}</h3>
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{deliveryPerson.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4" />
                      <span>{deliveryPerson.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTruck className="w-4 h-4" />
                      <span>{deliveryPerson.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>ETA: {deliveryPerson.estimatedArrival}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <FiPhone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <FiMessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-900 font-medium">{orderData.address}</p>
                    <p className="text-sm text-gray-600 mt-1">{orderData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Live Map Simulation */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Tracking</h2>
                
                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                  
                  {/* Restaurant Marker */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                  
                  {/* Delivery Person Marker */}
                  <motion.div
                    className="absolute bottom-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    animate={{
                      x: [0, -20, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FiTruck className="w-4 h-4 text-white" />
                  </motion.div>
                  
                  {/* Delivery Address Marker */}
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FiMapPin className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs text-gray-600">Route in progress</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <FiNavigation className="w-4 h-4" />
                    View Full Route
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <FiMessageCircle className="w-4 h-4" />
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;
