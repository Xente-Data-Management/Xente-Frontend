import React, { useState } from 'react';
import { Users, Download, LogOut, Filter, Menu, Calendar, Award, TrendingUp, UserPlus } from 'lucide-react';
import { Button, StatCard, SearchBar, Select } from '../components/components';
import { getMonthlyStats, mockData } from '../constants';
import { DepartmentBreakdown } from '../components/departmentBreakdown';
import { PerformanceLeaderboard } from '../components/Performance Leadership';
import { MonthlyTrendChart } from '../components/monthlyTrendChart';
import { AdminSidebar } from './AdminSidebar';
import { StaffTable } from '../components/StaffTable';
// import { AdminSidebar } from './AdminSidebar';
// import { PerformanceLeaderboard } from './PerformanceLeaderboard';
// import { MonthlyTrendChart } from './MonthlyTrendChart';
// import { DepartmentBreakdown } from './DepartmentBreakdown';
// import { mockData, getMonthlyStats } from './utils';

// ============================================
// ADMIN DASHBOARD COMPONENT
// ============================================
export const AdminDashboard = ({ currentUser, staffManagement, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { staff, filteredStaff, filters, setFilters, exportStaff } = staffManagement;

  const ambassadorStats = mockData.users.ambassadors.map(amb => ({
    ...amb,
    count: staff.filter(s => s.ambassadorId === amb.id).length
  }));

  const { thisMonthCount, growthRate } = getMonthlyStats(staff);
  const topPerformer = [...ambassadorStats].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsMobileOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'dashboard' && 'Dashboard Overview'}
                    {activeTab === 'ambassadors' && 'Ambassador Management'}
                    {activeTab === 'analytics' && 'Advanced Analytics'}
                  </h1>
                  <p className="text-sm text-gray-600">{currentUser.name}</p>
                </div>
              </div>
              <Button variant="danger" icon={LogOut} onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Staff" 
                  value={staff.length} 
                  icon={Users} 
                  gradient 
                  subtitle="All time"
                />
                <StatCard 
                  title="This Month" 
                  value={thisMonthCount} 
                  icon={Calendar}
                  trend={parseFloat(growthRate)}
                />
                <StatCard 
                  title="Top Performer" 
                  value={topPerformer?.name.split(' ')[0]} 
                  icon={Award}
                  subtitle={`${topPerformer?.count} staff`}
                />
                <StatCard 
                  title="Active Ambassadors" 
                  value={ambassadorStats.length} 
                  icon={TrendingUp}
                  subtitle="All regions"
                />
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceLeaderboard ambassadorStats={ambassadorStats} />
                <DepartmentBreakdown staff={staff} />
              </div>

              {/* Monthly Trend */}
              <MonthlyTrendChart staff={staff} />

              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <SearchBar 
                      value={filters.search}
                      onChange={(value) => setFilters({ ...filters, search: value })}
                      placeholder="Search staff..."
                    />
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-gray-400" />
                      <Select
                        value={filters.ambassadorId}
                        onChange={(e) => setFilters({ ...filters, ambassadorId: e.target.value })}
                        options={[
                          { value: 'all', label: 'All Ambassadors' },
                          ...mockData.users.ambassadors.map(a => ({ value: a.id, label: a.name }))
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 font-medium">{filteredStaff.length} results</span>
                    <Button variant="secondary" icon={Download} onClick={exportStaff}>Export CSV</Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <StaffTable staff={filteredStaff} showAmbassador />
            </>
          )}

          {activeTab === 'ambassadors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ambassadorStats.sort((a, b) => b.count - a.count).map((amb, index) => (
                <div key={amb.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 relative overflow-hidden">
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <Award className="w-8 h-8 text-yellow-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{amb.name}</h3>
                  <p className="text-gray-600 mb-1">{amb.email}</p>
                  <p className="text-sm text-gray-500 mb-4">{amb.region} Region</p>
                  <div className="flex items-center space-x-2 mt-4">
                    <UserPlus className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-600">{amb.count}</span>
                    <span className="text-gray-600">staff onboarded</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-700">Rank: #{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyTrendChart staff={staff} />
                <DepartmentBreakdown staff={staff} />
              </div>
              <PerformanceLeaderboard ambassadorStats={ambassadorStats} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};