import React, { useState } from 'react';
import { Users, UserPlus, Download, LogOut, Calendar, BarChart3 } from 'lucide-react';
// import { OnboardingForm } from './OnboardingForm';
import { Button, SearchBar, StatCard } from '../components/components';
import { OnboardingForm } from '../components/onBoarding';
import { StaffTable } from '../components/StaffTable';

// ============================================
// AMBASSADOR DASHBOARD COMPONENT
// ============================================
export const AmbassadorDashboard = ({ currentUser, staffManagement, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const { filteredStaff, filters, setFilters, addStaff, exportStaff } = staffManagement;

  const handleAddStaff = (staffData) => {
    addStaff(staffData);
    setShowForm(false);
  };

  const thisMonthCount = filteredStaff.filter(s => 
    new Date(s.onboardedDate).getMonth() === new Date().getMonth()
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
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Onboarded" value={filteredStaff.length} icon={Users} gradient />
          <StatCard title="This Month" value={thisMonthCount} icon={Calendar} />
          <StatCard title="Performance" value="Excellent" icon={BarChart3} />
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar 
              value={filters.search}
              onChange={(value) => setFilters({ ...filters, search: value })}
              placeholder="Search staff by name, email, or position..."
            />
            <div className="flex space-x-3">
              <Button icon={UserPlus} onClick={() => setShowForm(true)}>Onboard Staff</Button>
              <Button variant="secondary" icon={Download} onClick={exportStaff}>Export</Button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <OnboardingForm
            currentUser={currentUser}
            onSubmit={handleAddStaff}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Table */}
        <StaffTable staff={filteredStaff} />
      </main>
    </div>
  );
};