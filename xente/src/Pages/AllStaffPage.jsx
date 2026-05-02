import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Download, Filter } from 'lucide-react';
import ApiService from '../services/api';
import { Button, LoadingSpinner, ErrorAlert } from '../components/components';

export default function AllStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Passing null for ambassadorId fetches all staff system-wide
      const res = await ApiService.getAllStaff(null, 1, 1000); 
      setStaff(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const departments = ['All', ...new Set(staff.map(s => s.department).filter(Boolean))];

  const filteredStaff = staff.filter(s => {
    const searchString = `${s.name} ${s.email} ${s.position} ${s.ambassador_name}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleExport = async () => {
    try {
      // Pass null to export all staff
      const blob = await ApiService.downloadExport(null);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-staff-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">All Onboarded Staff</h2>
          <p className="text-gray-500 text-sm">System-wide view of all staff onboarded by ambassadors.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-white font-bold">{staff.length}</span>
              <span className="text-gray-500 text-xs">Total Staff</span>
           </div>
           <Button icon={Download} onClick={handleExport} variant="secondary">Export All</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-orange-500 outline-none text-sm text-white transition-all" 
            placeholder="Search name, email, position, or ambassador..." 
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {departments.map(dept => (
            <button 
              key={dept} 
              onClick={() => setDepartmentFilter(dept)} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${departmentFilter === dept ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/50 text-gray-500 text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Onboarded By</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No staff found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map(s => (
                  <tr key={s.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-orange-500 font-bold border border-gray-700">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{s.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.status || 'Active'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{s.position}</p>
                      <p className="text-xs text-gray-500">{s.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{s.email}</p>
                      <p className="text-xs text-gray-500">{s.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-medium">
                        {s.ambassador_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(s.onboarded_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
