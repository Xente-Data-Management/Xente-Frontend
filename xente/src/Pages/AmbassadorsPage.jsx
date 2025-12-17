import React, { useState } from 'react';
import { 
  Users, Search, Download, ChevronRight, ArrowLeft, 
  MapPin, Mail, Calendar, Edit2, Check, X, Filter 
} from 'lucide-react';
import ApiService from '../services/api';

const AmbassadorsPage = ({ ambassadors, staff, onRefresh }) => {
  const [selectedAmb, setSelectedAmb] = useState(null);
  const [query, setQuery] = useState('');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', region: '' });

  // Date Filter State
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  // 1. Ambassador Filtering
  const filteredAmbassadors = ambassadors.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) || 
    a.region.toLowerCase().includes(query.toLowerCase())
  );

  // 2. Staff Filtering (Search + Date Range)
  const recruits = selectedAmb 
    ? staff.filter(s => {
        const matchesAmb = s.ambassador_id === selectedAmb.id;
        const matchesSearch = s.name.toLowerCase().includes(query.toLowerCase());
        
        // Date Logic
        if (!s.created_at) return matchesAmb && matchesSearch;
        const staffDate = new Date(s.created_at).toISOString().split('T')[0];
        const afterStart = dateFilter.start ? staffDate >= dateFilter.start : true;
        const beforeEnd = dateFilter.end ? staffDate <= dateFilter.end : true;

        return matchesAmb && matchesSearch && afterStart && beforeEnd;
      })
    : [];

  const handleStartEdit = () => {
    setEditForm({ name: selectedAmb.name, region: selectedAmb.region });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await ApiService.updateAmbassador(selectedAmb.id, editForm);
      setSelectedAmb({ ...selectedAmb, ...editForm }); // Update local view
      setIsEditing(false);
      onRefresh(); // Sync main dashboard data
    } catch (err) {
      alert("Failed to update: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedAmb ? (
        /* VIEW 1: AMBASSADOR TABLE */
        <div className="animate-in fade-in duration-500 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Ambassador Registry</h1>
              <p className="text-gray-500">Manage representative profiles and recruitment data.</p>
            </div>
            <button 
              onClick={() => window.open(ApiService.getExportUrl(), '_blank')}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl border border-gray-700 transition-all text-sm"
            >
              <Download className="w-4 h-4" /> Download Master List
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or region..." 
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-all"
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Representative</th>
                  <th className="px-8 py-5">Region</th>
                  <th className="px-8 py-5 text-center">Recruits</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredAmbassadors.map(amb => (
                  <tr key={amb.id} onClick={() => { setSelectedAmb(amb); setQuery(''); }} className="hover:bg-orange-500/[0.03] cursor-pointer transition-colors group">
                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-500 font-bold border border-gray-700 group-hover:border-orange-500/50">{amb.name.charAt(0)}</div>
                      <div><p className="text-sm font-bold text-white">{amb.name}</p><p className="text-xs text-gray-500">{amb.email}</p></div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">{amb.region}</td>
                    <td className="px-8 py-5 text-center"><span className="bg-gray-800 text-orange-500 px-3 py-1 rounded-lg text-xs font-bold">{amb.totalStaff || 0}</span></td>
                    <td className="px-8 py-5 text-right"><ChevronRight className="inline w-5 h-5 text-gray-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW 2: STAFF DRILL-DOWN + EDITING */
        <div className="animate-in slide-in-from-right duration-300 space-y-6">
          <button onClick={() => { setSelectedAmb(null); setIsEditing(false); setDateFilter({start:'', end:''}); }} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Registry
          </button>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-orange-500/20">{selectedAmb.name.charAt(0)}</div>
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input 
                        className="bg-black border border-gray-700 rounded-lg px-3 py-1 text-white block"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                      <select 
                        className="bg-black border border-gray-700 rounded-lg px-3 py-1 text-white block text-sm"
                        value={editForm.region}
                        onChange={(e) => setEditForm({...editForm, region: e.target.value})}
                      >
                        {['Northern', 'Central', 'Western', 'Eastern'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-white">{selectedAmb.name}</h2>
                      <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-500" /> {selectedAmb.region}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-orange-500" /> {selectedAmb.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all"><Check className="w-5 h-5"/></button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700"><X className="w-5 h-5"/></button>
                  </>
                ) : (
                  <button onClick={handleStartEdit} className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
                <button 
                  onClick={() => window.open(ApiService.getExportUrl(selectedAmb.id), '_blank')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-5 h-5" /> Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
             <div className="p-6 border-b border-gray-800 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-black/20">
                <h3 className="font-bold text-white">Filter Recruits</h3>
                
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                  {/* Date Start */}
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">From</span>
                    <input 
                      type="date" 
                      className="bg-transparent text-sm text-white outline-none invert-[0.8]"
                      value={dateFilter.start}
                      onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                    />
                  </div>
                  {/* Date End */}
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">To</span>
                    <input 
                      type="date" 
                      className="bg-transparent text-sm text-white outline-none invert-[0.8]"
                      value={dateFilter.end}
                      onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                    />
                  </div>
                  {/* Search Staff */}
                  <div className="relative flex-1 xl:flex-none xl:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      value={query} 
                      onChange={(e) => setQuery(e.target.value)} 
                      placeholder="Search staff by name..." 
                      className="w-full bg-black border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-orange-500 outline-none" 
                    />
                  </div>
                  {/* Clear Date Filter */}
                  {(dateFilter.start || dateFilter.end) && (
                    <button 
                      onClick={() => setDateFilter({start:'', end:''})}
                      className="text-orange-500 text-xs hover:underline"
                    >
                      Clear Dates
                    </button>
                  )}
                </div>
             </div>
             
             <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/40 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-4">Name</th>
                      <th className="px-8 py-4">Department</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recruits.map(s => (
                      <tr key={s.id} className="hover:bg-white/[0.01]">
                        <td className="px-8 py-4">
                          <p className="font-bold text-white">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.position}</p>
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-400">
                          <span className="bg-gray-800/50 px-2 py-1 rounded border border-gray-700">{s.department || 'N/A'}</span>
                        </td>
                        <td className="px-8 py-4">
                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 uppercase">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                           </span>
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-500">
                          {new Date(s.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                    {recruits.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-600">
                            <Filter className="w-8 h-8 opacity-20" />
                            <p>No staff found matching these filters.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorsPage;