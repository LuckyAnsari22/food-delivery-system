import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const VendorMenu = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil',
      price: 299,
      category: 'Pizza',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
      prepTime: 25,
      isVegetarian: true,
      isSpicy: false,
      rating: 4.8,
      orders: 156
    },
    {
      id: 2,
      name: 'Chicken Burger',
      description: 'Juicy chicken patty with lettuce, tomato, and special sauce',
      price: 199,
      category: 'Burgers',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      prepTime: 15,
      isVegetarian: false,
      isSpicy: true,
      rating: 4.6,
      orders: 89
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing and croutons',
      price: 179,
      category: 'Salads',
      isAvailable: false,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
      prepTime: 10,
      isVegetarian: true,
      isSpicy: false,
      rating: 4.4,
      orders: 45
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Pizza', 'Burgers', 'Salads', 'Pasta', 'Desserts', 'Beverages'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const deleteItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Menu Management - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
              <p className="text-gray-600 mt-2">Manage your restaurant menu items</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`p-2 rounded-full ${
                          item.isAvailable 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {item.isAvailable ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{item.category}</span>
                      <span>{item.prepTime} min</span>
                      <span>{item.orders} orders</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start by adding your first menu item'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Item
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VendorMenu;
