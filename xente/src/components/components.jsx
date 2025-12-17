// ============================================
// UI COMPONENTS (src/components/UI.jsx)
// ============================================

import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', icon: Icon, className = '', disabled, type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      className={`px-4 py-2 rounded-xl font-medium transition flex items-center space-x-2 shadow-lg ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};

export const Input = ({ label, type = 'text', value, onChange, placeholder, required, onKeyPress }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>
);

export const Select = ({ label, value, onChange, options, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const StatCard = ({ title, value, icon: Icon, gradient = false }) => (
  <div className={`rounded-2xl shadow-lg p-6 border ${gradient ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-700' : 'bg-white border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm mb-1 ${gradient ? 'text-orange-100' : 'text-gray-600'}`}>{title}</p>
        <p className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
      {Icon && <Icon className={`w-10 h-10 ${gradient ? 'text-white opacity-80' : 'text-orange-500'}`} />}
    </div>
  </div>
);

export const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between">
    <div className="flex-1">
      <p className="text-red-700 text-sm">{message}</p>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-red-400 hover:text-red-600 ml-4">
        <span className="sr-only">Close</span>
        ×
      </button>
    )}
  </div>
);

export const SuccessAlert = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start justify-between">
    <div className="flex-1">
      <p className="text-green-700 text-sm">{message}</p>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-green-400 hover:text-green-600 ml-4">
        <span className="sr-only">Close</span>
        ×
      </button>
    )}
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    {Icon && (
      <div className="flex justify-center mb-4">
        <Icon className="w-16 h-16 text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);