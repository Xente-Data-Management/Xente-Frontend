import React, { useState, useMemo } from 'react';
import { Trophy, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PaymentQueuePage({ ambassadors, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const queueData = useMemo(() => {
    // Only consider ambassadors who have onboarded someone this month or at least are active.
    // The requirement says "once they hit 45 they are added into that queue list... those who are almost can be put like a remark".
    // We'll show everyone who has at least 1 recruit this month, or we can just show all ambassadors and sort by thisMonthStaff.
    const activeAmbassadors = ambassadors.filter(a => (a.thisMonthStaff || 0) > 0);
    
    // Sort descending by thisMonthStaff
    return activeAmbassadors.sort((a, b) => (b.thisMonthStaff || 0) - (a.thisMonthStaff || 0));
  }, [ambassadors]);

  const filteredData = queueData.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (count) => {
    if (count >= 45) {
      return { label: 'Eligible for Payment', color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle };
    } else if (count >= 35) {
      return { label: 'Almost', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', icon: Clock };
    } else {
      return { label: 'In Progress', color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Queue</h2>
        <p className="text-gray-500 text-sm">Track ambassador onboarding performance for the current month. Target is 45 staff.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-gray-950 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 focus:border-orange-500 outline-none text-sm text-gray-900 transition-all" 
            placeholder="Search queue..." 
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4">Ambassador</th>
              <th className="px-6 py-4 text-center">This Month</th>
              <th className="px-6 py-4">Progress to Target (45)</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading queue...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No active ambassadors in the queue this month.</td>
              </tr>
            ) : (
              filteredData.map(amb => {
                const count = amb.thisMonthStaff || 0;
                const status = getStatus(count);
                const StatusIcon = status.icon;
                const progressPercentage = Math.min((count / 45) * 100, 100);
                
                return (
                  <tr key={amb.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-orange-500 font-bold border border-gray-200">
                          {amb.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{amb.name}</p>
                          <p className="text-xs text-gray-500">{amb.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-bold ${count >= 45 ? 'text-green-400' : 'text-gray-900'}`}>{count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${count >= 45 ? 'bg-green-500' : count >= 35 ? 'bg-orange-500' : 'bg-gray-500'}`} 
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 text-right">{progressPercentage.toFixed(0)}%</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
