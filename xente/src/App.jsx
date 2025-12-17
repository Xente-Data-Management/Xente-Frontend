import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage';
import { AdminDashboard } from './Pages/AdminDashboard';
import { AmbassadorDashboard } from './Pages/AmbassadorDashboard';
import SetupPassword from './Pages/SetupPassword';
import ApiService from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Setup Route (Accessible without login) */}
        <Route path="/setup-password" element={<SetupPassword />} />

        {/* 2. Main Auth Logic */}
        <Route path="/" element={
          !currentUser ? (
            <LoginPage onLogin={handleLogin} loading={loading} error={error} />
          ) : (currentUser.role === 'admin' || currentUser.role === 'super') ? (
            <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <AmbassadorDashboard currentUser={currentUser} onLogout={handleLogout} />
          )
        } />

        {/* 3. Catch-all: Redirect back to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}