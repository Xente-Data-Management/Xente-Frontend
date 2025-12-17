import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, LogOut, BarChart3, TrendingUp, Mail, MapPin, 
  Menu, X, Home, Search, Calendar, Download, 
  RefreshCw, UserPlus, Trophy, AlertCircle, 
  Edit2, Trash2, ChevronRight
} from 'lucide-react';
import ApiService from '../services/api';
import AmbassadorsPage from '../Pages/AmbassadorsPage';

// --- Reusable UI Components (Button, StatCard, TopPerformerCard) ---
const Button = ({ children, variant = 'primary', className = '', icon: Icon, loading, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
    outline: 'border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20'
  };
  return (
    <button disabled={loading} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const StatCard = ({ icon: Icon, label, value, colorClass = "text-orange-500" }) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-orange-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

const TopPerformerCard = ({ ambassador }) => {
  if (!ambassador) return null;
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 shadow-xl shadow-orange-500/20 relative overflow-hidden group h-full">
      <Trophy className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" /> Top Performer
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{ambassador.name}</h3>
        <p className="text-orange-100 text-sm mb-4">{ambassador.region} Region</p>
        <div className="flex gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-white font-bold text-lg">{ambassador.totalStaff || 0}</div>
            <div className="text-orange-100 text-[10px] uppercase">Recruits</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-white font-bold text-lg">Active</div>
            <div className="text-orange-100 text-[10px] uppercase">Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAmbassadorForModal, setSelectedAmbassadorForModal] = useState(null);

  const [staff, setStaff] = useState([]);
  const [ambassadors, setAmbassadors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const REGIONS = ['All', 'Northern', 'Central', 'Western', 'Eastern'];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [staffData, ambData, statData] = await Promise.all([
        ApiService.getAllStaff(),
        ApiService.getAllAmbassadors(),
        ApiService.getStatistics()
      ]);
      setStaff(staffData.staff || []);
      setAmbassadors(ambData.ambassadors || []);
      setStats(statData);
    } catch (err) {
      setError(err.message || 'Failed to sync data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const topAmbassador = [...ambassadors].sort((a, b) => (b.totalStaff || 0) - (a.totalStaff || 0))[0];

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      const results = await ApiService.searchStaff(query);
      setStaff(results.staff || []);
    } else if (query.length === 0) loadData();
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      setLoading(true);
      if (modalMode === 'edit') {
        await ApiService.updateAmbassador(selectedAmbassadorForModal.id, data);
      } else {
        await ApiService.createAmbassador(data);
      }
      setShowModal(false);
      loadData();
    } catch (err) { setError(err.message); }
  };

  const filteredAmbassadors = selectedRegion === 'All' 
    ? ambassadors 
    : ambassadors.filter(a => a.region === selectedRegion);

  return (
    <div className="flex min-h-screen bg-black text-gray-200 font-sans">
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-950 border-r border-gray-800 z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"><Users className="text-white w-6 h-6" /></div>
            <span className="text-white font-bold text-xl">Admin<span className="text-orange-500">HQ</span></span>
          </div>
          <nav className="flex-1 space-y-2">
            {[{ id: 'dashboard', label: 'Overview', icon: Home }, { id: 'ambassadors', label: 'Ambassadors', icon: Users }].map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-900'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-6 border-t border-gray-800">
            <Button variant="danger" className="w-full" icon={LogOut} onClick={onLogout}>Sign Out</Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-950/50 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu /></button>
            <h2 className="text-lg font-semibold text-white uppercase tracking-wider">{activeTab}</h2>
          </div>
          <Button onClick={() => { setSelectedAmbassadorForModal(null); setModalMode('create'); setShowModal(true); }} icon={UserPlus}>Add Ambassador</Button>
        </header>

        <main className="p-8 overflow-y-auto flex-1 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black">
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"><AlertCircle className="w-5 h-5" />{error}</div>}

          {loading ? (
            <div className="flex h-full items-center justify-center flex-col gap-4 text-gray-500"><RefreshCw className="animate-spin text-orange-500" /> Syncing system...</div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <TopPerformerCard ambassador={topAmbassador} />
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <StatCard icon={Users} label="Total Recruits" value={stats?.totalStaff || staff.length} />
                      <StatCard icon={TrendingUp} label="Ambassadors" value={ambassadors.length} />
                      <StatCard icon={BarChart3} label="Departments" value={stats?.departmentCount || 0} colorClass="text-blue-400" />
                      <StatCard icon={Calendar} label="Active This Month" value={stats?.newThisMonth || 0} colorClass="text-green-400" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input value={searchTerm} onChange={handleSearch} className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-orange-500 outline-none text-sm text-white" placeholder="Search master directory..." />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                      {REGIONS.map(region => (
                        <button key={region} onClick={() => setSelectedRegion(region)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedRegion === region ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{region}</button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-950/50 text-gray-500 text-[10px] uppercase tracking-widest">
                          <th className="px-6 py-4">Ambassador</th>
                          <th className="px-6 py-4">Region</th>
                          <th className="px-6 py-4 text-center">Staff Count</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredAmbassadors.map(amb => (
                          <tr key={amb.id} className="hover:bg-gray-800/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-orange-500 font-bold border border-gray-700">{amb.name.charAt(0)}</div>
                                <div><p className="text-sm font-bold text-white">{amb.name}</p><p className="text-xs text-gray-500">{amb.email}</p></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">{amb.region}</td>
                            <td className="px-6 py-4 text-center font-bold text-orange-500">{amb.totalStaff || 0}</td>
                            <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setSelectedAmbassadorForModal(amb); setModalMode('edit'); setShowModal(true); }} className="p-2 hover:bg-gray-800 rounded-lg text-blue-400"><Edit2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'ambassadors' && (
                <AmbassadorsPage 
                  ambassadors={ambassadors} 
                  staff={staff} 
                  loading={loading}
                  onRefresh={loadData}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleModalSubmit} className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{modalMode === 'edit' ? 'Update Profile' : 'New Ambassador'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X /></button>
            </div>
            <div className="space-y-4">
              <input name="name" defaultValue={selectedAmbassadorForModal?.name} placeholder="Full Name" required className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none" />
              <input name="email" defaultValue={selectedAmbassadorForModal?.email} type="email" placeholder="Email Address" required className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none" />
              <select name="region" defaultValue={selectedAmbassadorForModal?.region} required className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none">
                <option value="">Select Region</option>
                {['Northern', 'Central', 'Western', 'Eastern'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <Button type="submit" className="w-full" loading={loading}>{modalMode === 'edit' ? 'Save Changes' : 'Confirm Onboarding'}</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;