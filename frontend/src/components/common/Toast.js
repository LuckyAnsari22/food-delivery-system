import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-green-600" />,
    error: <FiXCircle className="w-5 h-5 text-red-600" />,
    warning: <FiAlertCircle className="w-5 h-5 text-yellow-600" />,
    info: <FiInfo className="w-5 h-5 text-blue-600" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        ${colors[type]}
        border rounded-lg p-4 shadow-lg max-w-sm w-full
        flex items-start gap-3
      `}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium text-gray-900 text-sm">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-sm text-gray-600 mt-1">
            {message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast, ToastContainer };
