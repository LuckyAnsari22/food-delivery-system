import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTrendingUp, FiUsers, FiDollarSign, FiClock, FiStar, FiEye, FiEdit, FiPlus, FiPackage, FiBell, FiSettings, FiBarChart, FiTruck, FiMessageCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});

  // Mock data
  const mockStats = {
    totalRevenue: 45680,
    totalOrders: 234,
    activeCustomers: 189,
    averageRating: 4.7,
    todayRevenue: 2340,
    todayOrders: 12,
    pendingOrders: 8,
    completedOrders: 156
  };

  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      items: ['Margherita Pizza', 'Caesar Salad'],
      total: 478,
      status: 'preparing',
      time: '2:20 PM',
      deliveryTime: '2:45 PM',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      items: ['Chicken Burger', 'Fries'],
      total: 299,
      status: 'ready',
      time: '2:15 PM',
      deliveryTime: '2:30 PM',
      phone: '+1 (555) 987-6543'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      items: ['Pasta Alfredo'],
      total: 249,
      status: 'delivered',
      time: '1:45 PM',
      deliveryTime: '2:00 PM',
      phone: '+1 (555) 456-7890'
    }
  ];

  const mockMenuItems = [
    { id: 1, name: 'Margherita Pizza', price: 299, category: 'Pizza', status: 'active', orders: 45 },
    { id: 2, name: 'Chicken Burger', price: 199, category: 'Burgers', status: 'active', orders: 32 },
    { id: 3, name: 'Caesar Salad', price: 179, category: 'Salads', status: 'active', orders: 28 },
    { id: 4, name: 'Pasta Alfredo', price: 249, category: 'Pasta', status: 'inactive', orders: 15 }
  ];

  useEffect(() => {
    setStats(mockStats);
    setOrders(mockOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'preparing': return <FiPackage className="w-4 h-4" />;
      case 'ready': return <FiTruck className="w-4 h-4" />;
      case 'delivered': return <FiStar className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Vendor Dashboard - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-gray-600">Pizza Palace - Manage your restaurant</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <FiBell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <FiSettings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiDollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiPackage className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                <span>+8% from last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiUsers className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-purple-600">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                <span>+15% from last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FiStar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-yellow-600">
                <FiStar className="w-4 h-4 mr-1" />
                <span>Based on 234 reviews</span>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', name: 'Overview', icon: FiBarChart },
                  { id: 'orders', name: 'Orders', icon: FiPackage },
                  { id: 'menu', name: 'Menu', icon: FiEdit },
                  { id: 'analytics', name: 'Analytics', icon: FiTrendingUp }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Today's Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Today's Revenue</h3>
                      <p className="text-2xl font-bold text-blue-900">₹{stats.todayRevenue}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-2">Today's Orders</h3>
                      <p className="text-2xl font-bold text-green-900">{stats.todayOrders}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-900 mb-2">Pending Orders</h3>
                      <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">#{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{order.total}</p>
                            <p className="text-sm text-gray-600">{order.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Orders List */}
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">#{order.id}</h3>
                              <p className="text-sm text-gray-600">{order.customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">₹{order.total}</p>
                            <p className="text-sm text-gray-600">{order.time}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {order.items.map((item, itemIndex) => (
                                <li key={itemIndex}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Delivery Info</h4>
                            <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                            <p className="text-sm text-gray-600">ETA: {order.deliveryTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Update Status
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FiMessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <FiPlus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockMenuItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                        <p className="text-lg font-bold text-gray-900 mb-2">₹{item.price}</p>
                        <p className="text-sm text-gray-600 mb-4">{item.orders} orders</p>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <FiEdit className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                            <FiEye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Revenue Trend</h4>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Chart would be here</p>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Popular Items</h4>
                      <div className="space-y-3">
                        {mockMenuItems.slice(0, 4).map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.name}</span>
                            <span className="text-sm font-medium text-gray-900">{item.orders} orders</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
