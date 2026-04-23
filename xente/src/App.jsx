import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './Pages/LoginPage';
import { AdminDashboard } from './Pages/AdminDashboard';
import { AmbassadorDashboard } from './Pages/AmbassadorDashboard';
import SetupPassword from './Pages/SetupPassword';
import SplashScreen from './components/SplashScreen';
import ApiService from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      setError('');
      const data = await ApiService.login(email);
      setCurrentUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setError('');
  };

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid rgba(249,115,22,0.2)',
            fontSize: '14px',
          },
        }}
      />

      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      <BrowserRouter>
        <Routes>
          <Route path="/setup-password" element={<SetupPassword />} />

          <Route path="/" element={
            !currentUser ? (
              <LoginPage onLogin={handleLogin} loading={loading} error={error} />
            ) : (currentUser.role === 'admin' || currentUser.role === 'super') ? (
              <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <AmbassadorDashboard currentUser={currentUser} onLogout={handleLogout} />
            )
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}