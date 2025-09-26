import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiClock, FiCheckCircle, FiTruck, FiX, FiFilter, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      customerPhone: '+1 (555) 123-4567',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 299 },
        { name: 'Caesar Salad', quantity: 1, price: 179 }
      ],
      total: 478,
      status: 'preparing',
      orderTime: '2024-01-15T14:20:00Z',
      estimatedDelivery: '2024-01-15T14:45:00Z',
      deliveryAddress: '123 Main St, Downtown, City 12345',
      specialInstructions: 'Extra cheese on pizza',
      paymentMethod: 'card'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      customerPhone: '+1 (555) 987-6543',
      items: [
        { name: 'Chicken Burger', quantity: 2, price: 199 },
        { name: 'French Fries', quantity: 1, price: 99 }
      ],
      total: 497,
      status: 'ready',
      orderTime: '2024-01-15T14:15:00Z',
      estimatedDelivery: '2024-01-15T14:30:00Z',
      deliveryAddress: '456 Oak Ave, Midtown, City 12345',
      specialInstructions: '',
      paymentMethod: 'upi'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      customerPhone: '+1 (555) 456-7890',
      items: [
        { name: 'Pasta Alfredo', quantity: 1, price: 249 }
      ],
      total: 249,
      status: 'delivered',
      orderTime: '2024-01-15T13:45:00Z',
      estimatedDelivery: '2024-01-15T14:00:00Z',
      deliveryAddress: '789 Pine St, Uptown, City 12345',
      specialInstructions: 'No garlic',
      paymentMethod: 'cod'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      customerPhone: '+1 (555) 321-0987',
      items: [
        { name: 'Veggie Wrap', quantity: 1, price: 159 },
        { name: 'Green Salad', quantity: 1, price: 129 }
      ],
      total: 288,
      status: 'cancelled',
      orderTime: '2024-01-15T13:30:00Z',
      estimatedDelivery: '2024-01-15T13:45:00Z',
      deliveryAddress: '321 Elm St, Downtown, City 12345',
      specialInstructions: '',
      paymentMethod: 'card'
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'preparing': return <FiClock className="w-4 h-4" />;
      case 'ready': return <FiCheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <FiTruck className="w-4 h-4" />;
      case 'delivered': return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled': return <FiX className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Vendor Orders - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">Manage and track your restaurant orders</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => setIsLoading(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                        <p className="text-sm text-gray-600">{formatTime(order.orderTime)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <span className="font-medium text-gray-900">{item.name}</span>
                                <span className="text-gray-600 ml-2">x{item.quantity}</span>
                              </div>
                              <span className="text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-600">Phone:</span> {order.customerPhone}</p>
                          <p><span className="text-gray-600">Payment:</span> {order.paymentMethod.toUpperCase()}</p>
                          <p><span className="text-gray-600">Address:</span> {order.deliveryAddress}</p>
                          {order.specialInstructions && (
                            <p><span className="text-gray-600">Instructions:</span> {order.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Start Preparing
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'You don\'t have any orders yet'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorOrders;
