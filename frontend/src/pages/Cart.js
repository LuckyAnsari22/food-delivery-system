import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items: cartItems, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeItem(itemId);
      } else {
        updateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart - FoodDelivery</title>
        </Helmet>

        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow-sm p-12">
                <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't added any items to your cart yet. Start exploring our delicious food!
                </p>
                <Link
                  to="/vendors"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Restaurants
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart - FoodDelivery</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <span className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-6 border-b border-gray-200 last:border-b-0">
                      <img
                        src={item.foodItem.images?.[0]?.url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100'}
                        alt={item.foodItem.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.foodItem.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.foodItem.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>₹{item.price}</span>
                          {item.foodItem.isVegetarian && (
                            <span className="text-green-600">Veg</span>
                          )}
                          {item.foodItem.isSpicy && (
                            <span className="text-red-600">Spicy</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ₹{item.totalPrice}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="mt-4 text-right">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-900">₹30</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">₹{(totalPrice * 0.05).toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-semibold text-gray-900">
                          ₹{(totalPrice + 30 + (totalPrice * 0.05)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Link
                      to="/checkout"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
                    >
                      Proceed to Checkout
                    </Link>
                    
                    <Link
                      to="/vendors"
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block font-medium"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>Free delivery on orders above ₹200</p>
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

export default Cart;