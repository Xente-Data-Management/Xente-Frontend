import { useState, useMemo, useCallback } from 'react';
import {  mockData, ROLES } from '../constants';
import { exportToCSV, filterStaff } from '../utils';
// import { mockData, ROLES, filterStaff, exportToCSV } from './utils';

// ============================================
// CUSTOM HOOKS
// ============================================

// Authentication Hook
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((email) => {
    if (email === 'admin@example.com') {
      setCurrentUser(mockData.users.admin);
    } else {
      const ambassador = mockData.users.ambassadors.find(a => a.email === email);
      if (ambassador) {
        setCurrentUser({ ...ambassador, role: ROLES.AMBASSADOR });
      }
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return { currentUser, login, logout };
};

// Staff Management Hook
export const useStaffManagement = (currentUser) => {
  const [staff, setStaff] = useState(mockData.staff);
  const [filters, setFilters] = useState({
    search: '',
    ambassadorId: 'all'
  });

  const filteredStaff = useMemo(() => {
    let filtered = staff;
    
    // Role-based filtering
    if (currentUser?.role === ROLES.AMBASSADOR) {
      filtered = filtered.filter(s => s.ambassadorId === currentUser.id);
    } else if (filters.ambassadorId !== 'all') {
      filtered = filtered.filter(s => s.ambassadorId === filters.ambassadorId);
    }
    
    // Search filtering
    if (filters.search) {
      filtered = filterStaff(filtered, filters);
    }
    
    return filtered;
  }, [staff, filters, currentUser]);

  const addStaff = useCallback((staffData) => {
    const newStaff = {
      id: Date.now(),
      ...staffData,
      onboardedDate: new Date().toISOString().split('T')[0]
    };
    setStaff(prev => [...prev, newStaff]);
  }, []);

  const exportStaffData = useCallback(() => {
    exportToCSV(filteredStaff, `staff_onboarding_${new Date().toISOString().split('T')[0]}.csv`);
  }, [filteredStaff]);

  return { 
    staff, 
    filteredStaff, 
    filters, 
    setFilters, 
    addStaff, 
    exportStaff: exportStaffData 
  };
};