// ============================================
// AMBASSADOR DASHBOARD (src/pages/AmbassadorDashboard.jsx)
// ============================================

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Download, LogOut, Calendar, BarChart3, Search, Copy, CheckCheck, Hash, Menu, Upload } from 'lucide-react';
import { Button, StatCard, ErrorAlert } from '../components/components';
import { OnboardingForm } from '../components/OnboardingForm';
import { StaffTable } from '../components/StaffTable';
import { AmbassadorBulkUpload } from '../components/AmbassadorBulkUpload';
import ApiService from '../services/api';
import toast from 'react-hot-toast';

export const AmbassadorDashboard = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    if (currentUser?.ambassador_code) {
      navigator.clipboard.writeText(currentUser.ambassador_code);
      setCodeCopied(true);
      toast.success('Ambassador code copied!');
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

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
      const response = await ApiService.getAllStaff(currentUser.id);
      setStaff(response.data);
      setFilteredStaff(response.data);
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

  const handleExport = async () => {
    try {
      const blob = await ApiService.downloadExport(currentUser.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `staff-export-${currentUser.id}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error('Failed to export staff statistics');
    }
  };

  const thisMonthCount = filteredStaff.filter(s => 
    new Date(s.onboarded_date).getMonth() === new Date().getMonth() &&
    new Date(s.onboarded_date).getFullYear() === new Date().getFullYear()
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload },
  ];

  return (
    <div className="flex min-h-screen bg-black text-gray-200 font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex-1 flex flex-col h-full overflow-y-auto">
           {/* Brand (Desktop) */}
           <div className="hidden md:flex items-center gap-3 mb-10">
             <img src="/xenteLogo2.png" alt="Xente" className="h-8 w-auto" />
           </div>

           {/* User Profile */}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
             <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
             <p className="text-xs text-gray-400 truncate mt-0.5">{currentUser.email}</p>
             <div className="mt-3 text-[10px] bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded border border-orange-500/20 w-fit uppercase font-bold tracking-wider">
               Ambassador
             </div>
           </div>

           {/* Navigation */}
           <nav className="space-y-1.5 flex-1">
             {navItems.map(item => (
               <button
                 key={item.id}
                 onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                   activeTab === item.id
                     ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                     : 'text-gray-400 hover:text-white hover:bg-white/5'
                 }`}
               >
                 <item.icon className="w-5 h-5" />
                 {item.label}
               </button>
             ))}
           </nav>

           {/* Sign Out */}
           <div className="pt-4 mt-auto">
             <Button variant="danger" className="w-full" icon={LogOut} onClick={onLogout}>Sign Out</Button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[100vw] md:max-w-none p-4 sm:p-6 lg:p-10 relative overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <img src="/xenteLogo2.png" alt="Xente" className="h-6 w-auto" />
          <div className="w-10" />
        </div>

        {activeTab === 'dashboard' ? (
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Title */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Ambassador Dashboard</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your onboarded staff and track your performance.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <ErrorAlert message={error} onClose={() => setError('')} />
            )}

            {/* Ambassador Code Banner */}
            {currentUser?.ambassador_code && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Hash className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-1">Your Ambassador Code</p>
                    <p className="text-2xl font-mono font-bold text-orange-500 tracking-widest">{currentUser.ambassador_code}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Share this code when onboarding staff so they can be tracked under your account.</p>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-orange-500 text-sm font-bold transition-colors whitespace-nowrap w-full sm:w-auto"
                  >
                    {codeCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {codeCopied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search staff by name, email, or position..."
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <Button icon={UserPlus} onClick={() => setShowForm(true)} className="whitespace-nowrap shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30">
                    <span className="hidden sm:inline">Onboard Staff</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  <Button variant="secondary" icon={Download} onClick={handleExport} className="whitespace-nowrap">
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Onboarding Form */}
            {showForm && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <OnboardingForm
                  currentUser={currentUser}
                  onSubmit={handleAddStaff}
                  onCancel={() => setShowForm(false)}
                  loading={loading}
                />
              </div>
            )}

            {/* Staff Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <StaffTable 
                staff={filteredStaff} 
                onDelete={handleDeleteStaff} 
                loading={loading} 
              />
            </div>
          </div>
        ) : (
          <AmbassadorBulkUpload currentUser={currentUser} />
        )}
      </main>
    </div>
  );
};