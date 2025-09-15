import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiClock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600">The order you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100';
      case 'out_for_delivery':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Food';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <>
      <Helmet>
        <title>Order #{order.id} - FoodDelivery</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                  <p className="text-gray-600 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                  
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.images[0]?.url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.price} each</span>
                            {item.isVegetarian && (
                              <span className="text-green-600">Veg</span>
                            )}
                            {item.isSpicy && (
                              <span className="text-red-600">Spicy</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Order Confirmed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {order.status === 'preparing' && (
                      <div className="flex items-center space-x-3">
                        <FiClock className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-gray-900">Preparing Food</p>
                          <p className="text-sm text-gray-600">Your order is being prepared</p>
                        </div>
                      </div>
                    )}
                    
                    {order.status === 'out_for_delivery' && (
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">Out for Delivery</p>
                          <p className="text-sm text-gray-600">Your order is on its way</p>
                        </div>
                      </div>
                    )}
                    
                    {order.status === 'delivered' && (
                      <div className="flex items-center space-x-3">
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">Delivered</p>
                          <p className="text-sm text-gray-600">Order delivered successfully</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary & Customer Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-900">₹30</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">₹{(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05).toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.customer.name}</h4>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <FiPhone className="w-4 h-4 mr-2" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <FiMail className="w-4 h-4 mr-2" />
                        <span>{order.customer.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                      <div className="flex items-start text-sm text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-2 mt-1" />
                        <div>
                          {typeof order.customer.address === 'string' ? (
                            <p>{order.customer.address}</p>
                          ) : (
                            <div>
                              <p>{order.customer.address.street}</p>
                              <p>{order.customer.address.city}, {order.customer.address.state}</p>
                              <p>{order.customer.address.pincode}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600 capitalize">{order.customer.paymentMethod}</p>
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

export default OrderDetail;