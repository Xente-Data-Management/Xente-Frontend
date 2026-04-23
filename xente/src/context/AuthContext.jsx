import React, { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // We could implement verifyToken endpoint here, but for now we'll just check if we have a token
  // and require user to login again if refreshed, or we'd ideally fetch a /me endpoint.
  useEffect(() => {
    const token = ApiService.getToken();
    if (token) {
      // In a real app we would fetch the user profile here:
      // fetch('/api/v1/auth/me').then(res => setCurrentUser(res.user))
      // Since we don't have that, a page refresh currently drops currentUser state but keeps token.
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      // In app.jsx, it only passed email. 
      const data = await ApiService.login(email);
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const data = await ApiService.adminLogin(email, password);
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ApiService.logout();
    setCurrentUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
