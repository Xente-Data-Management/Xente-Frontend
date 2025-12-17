import React from 'react';
import { Search, TrendingUp } from 'lucide-react';

// ============================================
// BASIC UI COMPONENTS
// ============================================

// Button Component
export const Button = ({ variant = 'primary', children, onClick, icon: Icon, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
    secondary: 'bg-black hover:bg-gray-900 text-white',
    outline: 'bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

// Input Component
export const Input = ({ label, value, onChange, type = 'text', placeholder, required = false, onKeyPress }) => (
  <div>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
    />
  </div>
);

// Select Component
export const Select = ({ label, value, onChange, options, placeholder }) => (
  <div>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Stat Card Component
export const StatCard = ({ title, value, icon: Icon, gradient = false, subtitle, trend }) => {
  const bgClass = gradient 
    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
    : 'bg-white border-2 border-gray-200';
  const titleClass = gradient ? 'text-orange-100' : 'text-gray-600';
  const valueClass = gradient ? 'text-white' : 'text-gray-900';
  const iconClass = gradient ? 'text-orange-200' : 'text-orange-500';

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${bgClass}`}>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-medium ${titleClass}`}>{title}</p>
        {Icon && <Icon className={`w-8 h-8 ${iconClass}`} />}
      </div>
      <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
      {subtitle && (
        <p className={`text-sm mt-1 ${gradient ? 'text-orange-100' : 'text-gray-500'}`}>{subtitle}</p>
      )}
      {trend !== undefined && trend !== null && (
        <div className="flex items-center mt-2 space-x-1">
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-semibold ${gradient ? 'text-white' : trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </span>
        </div>
      )}
    </div>
  );
};

// Search Bar Component
export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>
);