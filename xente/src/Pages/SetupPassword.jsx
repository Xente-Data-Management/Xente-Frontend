import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import ApiService from '../services/api';

const SetupPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      setStatus('loading');
      await ApiService.completeAdminSetup({ token, password });
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white">Account Verified!</h1>
          <p className="text-gray-400">Your password has been set. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Setup Admin Account</h1>
          <p className="text-gray-500 text-sm text-center mt-2">Create a secure password to access the AdminHQ directory.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="password" 
                required 
                className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={status === 'loading'}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Saving...' : 'Finalize Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPassword;