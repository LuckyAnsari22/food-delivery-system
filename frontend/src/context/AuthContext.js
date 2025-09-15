import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check if it's a mock token
          if (token.startsWith('mock-token-')) {
            // For mock tokens, create a mock user
            const mockUser = {
              id: token === 'mock-token-123' ? '1' : '2',
              name: token === 'mock-token-123' ? 'John Doe' : 'Vendor 1',
              email: token === 'mock-token-123' ? 'john@example.com' : 'vendor1@example.com',
              role: token === 'mock-token-123' ? 'customer' : 'vendor',
              avatar: ''
            };
            
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: mockUser,
                token
              }
            });
          } else {
            // Try to validate with backend
            const response = await authAPI.getMe();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.data,
                token
              }
            });
          }
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({
            type: 'AUTH_FAILURE',
            payload: 'Session expired. Please login again.'
          });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Try to connect to backend first
      try {
        const response = await authAPI.login(credentials);
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
        
        toast.success('Login successful!');
        return { success: true };
      } catch (apiError) {
        // If backend is not available, use mock authentication
        console.warn('Backend not available, using mock authentication');
        
        // Mock authentication for demo
        if (credentials.email === 'john@example.com' && credentials.password === 'password123') {
          const mockUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'customer',
            avatar: ''
          };
          
          const mockToken = 'mock-token-123';
          localStorage.setItem('token', mockToken);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: mockUser, token: mockToken }
          });
          
          toast.success('Login successful! (Demo Mode)');
          return { success: true };
        } else if (credentials.email === 'vendor1@example.com' && credentials.password === 'vendor123') {
          const mockUser = {
            id: '2',
            name: 'Vendor 1',
            email: 'vendor1@example.com',
            role: 'vendor',
            avatar: ''
          };
          
          const mockToken = 'mock-token-456';
          localStorage.setItem('token', mockToken);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: mockUser, token: mockToken }
          });
          
          toast.success('Login successful! (Demo Mode)');
          return { success: true };
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      const message = error.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Try to connect to backend first
      try {
        const response = await authAPI.register(userData);
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
        
        toast.success('Registration successful!');
        return { success: true };
      } catch (apiError) {
        // If backend is not available, use mock registration
        console.warn('Backend not available, using mock registration');
        
        const mockUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: 'customer',
          avatar: ''
        };
        
        const mockToken = `mock-token-${Date.now()}`;
        localStorage.setItem('token', mockToken);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: mockUser, token: mockToken }
        });
        
        toast.success('Registration successful! (Demo Mode)');
        return { success: true };
      }
    } catch (error) {
      const message = error.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.data
      });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
