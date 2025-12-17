// ============================================
// AMBASSADOR DASHBOARD (src/pages/AmbassadorDashboard.jsx)
// ============================================

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Download, LogOut, Calendar, BarChart3, Search } from 'lucide-react';
import { Button, StatCard, ErrorAlert } from '../components/components';
import { OnboardingForm } from '../components/OnboardingForm';
import { StaffTable } from '../components/StaffTable';
import ApiService from '../services/api';

export const AmbassadorDashboard = ({ currentUser, onLogout }) => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    const filtered = staff.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staff]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllStaff(currentUser.id);
      setStaff(data.staff);
      setFilteredStaff(data.staff);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      setLoading(true);
      await ApiService.createStaff(staffData);
      await loadStaff();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      setLoading(true);
      await ApiService.deleteStaff(id);
      await loadStaff();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.open(ApiService.getExportUrl(currentUser.id), '_blank');
  };

  const thisMonthCount = filteredStaff.filter(s => 
    new Date(s.onboarded_date).getMonth() === new Date().getMonth() &&
    new Date(s.onboarded_date).getFullYear() === new Date().getFullYear()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-orange-950 shadow-xl border-b border-orange-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Onboarding Portal</h1>
                <p className="text-sm text-orange-300">Ambassador Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs text-orange-300">{currentUser.email}</p>
              </div>
              <Button variant="danger" icon={LogOut} onClick={onLogout}>
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <ErrorAlert message={error} onClose={() => setError('')} />
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Onboarded" 
            value={filteredStaff.length} 
            icon={Users} 
            gradient 
          />
          <StatCard 
            title="This Month" 
            value={thisMonthCount} 
            icon={Calendar} 
          />
          <StatCard 
            title="Performance" 
            value="Excellent" 
            icon={BarChart3} 
          />
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff by name, email, or position..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Actions */}
            <div className="flex space-x-3">
              <Button icon={UserPlus} onClick={() => setShowForm(true)}>
                <span className="hidden sm:inline">Onboard Staff</span>
                <span className="sm:hidden">Add</span>
              </Button>
              <Button variant="secondary" icon={Download} onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Onboarding Form */}
        {showForm && (
          <OnboardingForm
            currentUser={currentUser}
            onSubmit={handleAddStaff}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        )}

        {/* Staff Table */}
        <StaffTable 
          staff={filteredStaff} 
          onDelete={handleDeleteStaff} 
          loading={loading} 
        />
      </main>
    </div>
  );
};