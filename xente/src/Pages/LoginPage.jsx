import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Shield, Users, TrendingUp, Loader2 } from 'lucide-react';
import ApiService from '../services/api';

export const LoginPage = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [stats, setStats] = useState({ totalStaff: 0, growthRate: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ApiService.getPublicStats();
        if (response.success && response.stats) {
          setStats({
            totalStaff: response.stats.totalStaff || 0,
            growthRate: response.stats.growthRate || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch public stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (email && password) onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Dark Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        {/* Decorative glows */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.15)_0%,transparent_70%)]" />
        <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <img src="/xenteLogo2.png" alt="Xente" className="h-10" />
          </div>

          {/* Hero text */}
          <div>
            <h1 className="text-4xl xl:text-[44px] font-extrabold text-white leading-tight mb-5 tracking-tight">
              Ambassador<br />Onboarding<br />
              <span className="text-orange-500">Platform</span>
            </h1>
            <p className="text-base text-gray-400 leading-relaxed max-w-[380px]">
              Track, manage, and grow your ambassador network. One platform for all your onboarding needs across Africa.
            </p>

            {/* Stat cards */}
            <div className="flex gap-3 mt-10">
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4 flex-1 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1">
                <Users className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-[22px] font-extrabold text-white">{stats.totalStaff.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Staff Onboarded</p>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4 flex-1 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1">
                <TrendingUp className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-[22px] font-extrabold text-white">
                  {Number(stats.growthRate) > 0 ? '+' : ''}{Number(stats.growthRate).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Growth Rate</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Xente Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Image background + Card */}
      <div
        className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-10 min-h-screen lg:min-h-0"
        style={{
          backgroundImage: "url('/xenteloginimge.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Floating form card */}
        <div className="relative z-10 w-full max-w-[420px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/30 p-8 sm:p-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/xenteLogo2.png" alt="Xente" className="h-9" />
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to your Xente dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2.5">
              <Shield className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && email && password) handleSubmit(e); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@company.com"
                  className={`w-full py-3.5 pl-12 pr-4 text-sm text-gray-900 bg-white border-2 rounded-xl outline-none transition-all duration-200 ${
                    emailFocused
                      ? 'border-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.1)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && email && password) handleSubmit(e); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className={`w-full py-3.5 pl-12 pr-4 text-sm text-gray-900 bg-white border-2 rounded-xl outline-none transition-all duration-200 ${
                    passwordFocused
                      ? 'border-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.1)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full py-4 px-6 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 mt-2 ${
                loading || !email || !password
                  ? 'bg-orange-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/35 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 active:translate-y-0'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-[18px] h-[18px]" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 px-5 py-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              Demo Credentials
            </p>
            <p className="text-[13px] text-amber-900 mb-1">
              <span className="font-semibold">Admin:</span>{' '}
              <span className="font-mono bg-orange-100 px-1.5 py-0.5 rounded-md text-xs">admin@example.com</span> / <span className="font-mono bg-orange-100 px-1.5 py-0.5 rounded-md text-xs">admin123</span>
            </p>
          </div>

          {/* Mobile footer */}
          <p className="lg:hidden text-center text-xs text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} Xente Technologies
          </p>
        </div>
      </div>
    </div>
  );
};