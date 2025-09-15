import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  deliveryFee: 0,
  tax: 0,
  grandTotal: 0,
  vendor: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return addItemToCart(state, action.payload);
    case 'REMOVE_ITEM':
      return removeItemFromCart(state, action.payload);
    case 'UPDATE_QUANTITY':
      return updateItemQuantity(state, action.payload);
    case 'CLEAR_CART':
      return initialState;
    case 'SET_VENDOR':
      return {
        ...state,
        vendor: action.payload
      };
    case 'LOAD_CART':
      return loadCartFromStorage(action.payload);
    default:
      return state;
  }
};

const addItemToCart = (state, item) => {
  const { foodItem, quantity = 1, variant, addOns = [], specialInstructions = '' } = item;
  
  // Check if vendor is different
  if (state.vendor && state.vendor._id !== foodItem.vendor._id) {
    toast.error('You can only order from one vendor at a time. Clear your cart to order from a different vendor.');
    return state;
  }

  // Calculate item price
  let itemPrice = foodItem.price;
  if (variant) {
    itemPrice = variant.price;
  }
  
  let addOnsPrice = 0;
  if (addOns.length > 0) {
    addOnsPrice = addOns.reduce((total, addOn) => total + addOn.price, 0);
  }
  
  const totalItemPrice = (itemPrice + addOnsPrice) * quantity;

  // Check if item already exists
  const existingItemIndex = state.items.findIndex(
    cartItem => 
      cartItem.foodItem._id === foodItem._id &&
      JSON.stringify(cartItem.variant) === JSON.stringify(variant) &&
      JSON.stringify(cartItem.addOns) === JSON.stringify(addOns)
  );

  let newItems;
  if (existingItemIndex >= 0) {
    // Update existing item
    newItems = [...state.items];
    newItems[existingItemIndex].quantity += quantity;
    newItems[existingItemIndex].totalPrice = (itemPrice + addOnsPrice) * newItems[existingItemIndex].quantity;
  } else {
    // Add new item
    const newItem = {
      id: Date.now() + Math.random(),
      foodItem,
      quantity,
      price: itemPrice,
      variant,
      addOns,
      addOnsPrice,
      totalPrice: totalItemPrice,
      specialInstructions
    };
    newItems = [...state.items, newItem];
  }

  return calculateTotals({
    ...state,
    items: newItems,
    vendor: foodItem.vendor
  });
};

const removeItemFromCart = (state, itemId) => {
  const newItems = state.items.filter(item => item.id !== itemId);
  
  // If cart is empty, clear vendor
  const newVendor = newItems.length === 0 ? null : state.vendor;
  
  return calculateTotals({
    ...state,
    items: newItems,
    vendor: newVendor
  });
};

const updateItemQuantity = (state, { itemId, quantity }) => {
  if (quantity <= 0) {
    return removeItemFromCart(state, itemId);
  }

  const newItems = state.items.map(item => {
    if (item.id === itemId) {
      const totalPrice = (item.price + item.addOnsPrice) * quantity;
      return { ...item, quantity, totalPrice };
    }
    return item;
  });

  return calculateTotals({
    ...state,
    items: newItems
  });
};

const calculateTotals = (state) => {
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Calculate delivery fee (simplified logic)
  const deliveryFee = state.vendor?.deliveryInfo?.deliveryFee || 0;
  
  // Calculate tax (5% GST)
  const tax = totalPrice * 0.05;
  
  const grandTotal = totalPrice + deliveryFee + tax;

  return {
    ...state,
    totalItems,
    totalPrice,
    deliveryFee,
    tax,
    grandTotal
  };
};

const loadCartFromStorage = (cartData) => {
  return calculateTotals({
    ...initialState,
    ...cartData
  });
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item.foodItem.name} added to cart`);
  };

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const setVendor = (vendor) => {
    dispatch({ type: 'SET_VENDOR', payload: vendor });
  };

  const getItemQuantity = (foodItemId, variant, addOns) => {
    const item = state.items.find(
      cartItem => 
        cartItem.foodItem._id === foodItemId &&
        JSON.stringify(cartItem.variant) === JSON.stringify(variant) &&
        JSON.stringify(cartItem.addOns) === JSON.stringify(addOns)
    );
    return item ? item.quantity : 0;
  };

  const isItemInCart = (foodItemId, variant, addOns) => {
    return getItemQuantity(foodItemId, variant, addOns) > 0;
  };

  const canAddItem = (foodItem) => {
    // Check if cart is empty or vendor matches
    if (!state.vendor || state.vendor._id === foodItem.vendor._id) {
      return true;
    }
    return false;
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setVendor,
    getItemQuantity,
    isItemInCart,
    canAddItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
