import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiEdit, FiSave, FiX, FiMapPin, FiPhone, FiMail, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    restaurantName: 'Pizza Palace',
    description: 'Authentic Italian pizza with fresh ingredients',
    address: '123 Main Street, Downtown, City 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@pizzapalace.com',
    cuisine: 'Italian',
    deliveryRadius: 5,
    deliveryTime: '30-45 min',
    minimumOrder: 200,
    deliveryFee: 29,
    rating: 4.7,
    totalOrders: 1234
  });

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  return (
    <>
      <Helmet>
        <title>Vendor Profile - FoodDelivery</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.restaurantName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.restaurantName}</h1>
                  <p className="text-gray-600">{profile.cuisine} • {profile.deliveryTime} delivery</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      <span>{profile.rating}</span>
                    </div>
                    <span>{profile.totalOrders} orders</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? <FiX className="w-4 h-4" /> : <FiEdit className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.restaurantName}
                      onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.restaurantName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  {isEditing ? (
                    <textarea
                      value={profile.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.cuisine}
                      onChange={(e) => handleInputChange('cuisine', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.cuisine}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Delivery Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profile.deliveryRadius}
                        onChange={(e) => handleInputChange('deliveryRadius', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.deliveryRadius} km</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.deliveryTime}
                        onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.deliveryTime}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order (₹)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profile.minimumOrder}
                        onChange={(e) => handleInputChange('minimumOrder', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">₹{profile.minimumOrder}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profile.deliveryFee}
                        onChange={(e) => handleInputChange('deliveryFee', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">₹{profile.deliveryFee}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end gap-4"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default VendorProfile;