// ============================================
// LOGIN PAGE (src/pages/LoginPage.jsx)
// ============================================

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button, Input } from '../components/components';

export const LoginPage = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) onLogin(email);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/xenteLogo1.png" 
            alt="Xente Logo" 
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Xente Onboarding System</p>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
          />
          <Button 
            onClick={handleSubmit} 
            className="w-full justify-center"
            disabled={loading || !email}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
        
        {/* Demo Credentials */}
        <div className="mt-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="font-semibold mb-2 text-gray-900">Demo Credentials:</p>
          <div className="space-y-1">
            <p><span className="font-medium">Admin:</span> admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};