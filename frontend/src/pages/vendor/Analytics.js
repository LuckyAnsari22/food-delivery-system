import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiPackage, FiStar, FiClock, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const VendorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const analytics = {
    revenue: {
      total: 45680,
      change: 12.5,
      trend: 'up'
    },
    orders: {
      total: 234,
      change: 8.2,
      trend: 'up'
    },
    customers: {
      total: 189,
      change: -2.1,
      trend: 'down'
    },
    rating: {
      total: 4.7,
      change: 0.3,
      trend: 'up'
    }
  };

  const topItems = [
    { name: 'Margherita Pizza', orders: 45, revenue: 13455, growth: 15.2 },
    { name: 'Chicken Burger', orders: 38, revenue: 7562, growth: 8.7 },
    { name: 'Caesar Salad', orders: 32, revenue: 5728, growth: -3.2 },
    { name: 'Pasta Alfredo', orders: 28, revenue: 6972, growth: 12.1 },
    { name: 'Veggie Wrap', orders: 25, revenue: 3975, growth: 5.4 }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 478, time: '2:20 PM', status: 'completed' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 299, time: '2:15 PM', status: 'completed' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 249, time: '1:45 PM', status: 'completed' },
    { id: 'ORD-004', customer: 'Sarah Wilson', amount: 179, time: '1:30 PM', status: 'completed' }
  ];

  const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Vendor Analytics - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your restaurant performance and insights</p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`₹${analytics.revenue.total.toLocaleString()}`}
              change={analytics.revenue.change}
              trend={analytics.revenue.trend}
              icon={FiDollarSign}
              color="bg-green-500"
            />
            <StatCard
              title="Total Orders"
              value={analytics.orders.total}
              change={analytics.orders.change}
              trend={analytics.orders.trend}
              icon={FiPackage}
              color="bg-blue-500"
            />
            <StatCard
              title="Active Customers"
              value={analytics.customers.total}
              change={analytics.customers.change}
              trend={analytics.customers.trend}
              icon={FiUsers}
              color="bg-purple-500"
            />
            <StatCard
              title="Average Rating"
              value={analytics.rating.total}
              change={analytics.rating.change}
              trend={analytics.rating.trend}
              icon={FiStar}
              color="bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Items</h2>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{item.orders} orders</span>
                        <span>₹{item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        item.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.growth > 0 ? (
                          <FiTrendingUp className="w-4 h-4" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4" />
                        )}
                        {item.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiPackage className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">#{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.amount}</p>
                      <p className="text-sm text-gray-600">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiClock className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Average Prep Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">22 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiEye className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Menu Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiStar className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Customer Satisfaction</span>
                  </div>
                  <span className="font-semibold text-gray-900">4.7/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Growth Rate</span>
                  </div>
                  <span className="font-semibold text-gray-900">+12.5%</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="font-medium text-blue-900">View Detailed Reports</div>
                  <div className="text-sm text-blue-700">Generate comprehensive analytics</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="font-medium text-green-900">Export Data</div>
                  <div className="text-sm text-green-700">Download analytics in CSV format</div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="font-medium text-purple-900">Set Goals</div>
                  <div className="text-sm text-purple-700">Define and track business targets</div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorAnalytics;