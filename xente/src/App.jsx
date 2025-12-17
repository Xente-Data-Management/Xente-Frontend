import React, { useState } from 'react';
// import { useAuth, useStaffManagement } from './hooks/hooks';
import { ROLES } from './constants';
import { LoginPage } from './Pages/LoginPage';
import { AdminDashboard } from './Pages/AdminDashboard';
import { AmbassadorDashboard } from './Pages/AmbassadorDashboard';
import ApiService from './services/api';


// ============================================
// MAIN APP (src/App.jsx)
// ============================================


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

  // Show login page if no user is authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} loading={loading} error={error} />;
  }

  // Show admin dashboard for admin users
  if (currentUser.role === 'admin') {
    return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  // Show ambassador dashboard for ambassador users
  return <AmbassadorDashboard currentUser={currentUser} onLogout={handleLogout} />;
}