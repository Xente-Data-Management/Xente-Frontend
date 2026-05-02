import React, { useState, useMemo } from 'react';
import { Trophy, Search, CheckCircle, Clock, AlertCircle, DollarSign, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentQueuePage({ ambassadors, loading, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local state for tracking frontend-only payment approvals
  const [approvedPayments, setApprovedPayments] = useState(new Set());

  const queueData = useMemo(() => {
    const activeAmbassadors = ambassadors.filter(a => (a.thisMonthStaff || 0) > 0);
    return activeAmbassadors.sort((a, b) => (b.thisMonthStaff || 0) - (a.thisMonthStaff || 0));
  }, [ambassadors]);

  const filteredData = queueData.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (count, ambId) => {
    if (approvedPayments.has(ambId)) {
      return { label: 'Payment Processed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: DollarSign, isPaid: true };
    }
    if (count >= 45) {
      return { label: 'Eligible for Payment', color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle, isEligible: true };
    } else if (count >= 35) {
      return { label: 'Almost', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', icon: Clock };
    } else {
      return { label: 'In Progress', color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: AlertCircle };
    }
  };

  const handleApprovePayment = (ambId) => {
    if (!confirm('Approve payment for this ambassador? This cannot be undone.')) return;
    
    // In a real implementation this would hit the backend
    setApprovedPayments(prev => new Set(prev).add(ambId));
    toast.success('Payment approved and marked as processed');
  };

  const canApprove = ['finance', 'super'].includes(currentUser?.role);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Payment Queue</h2>
        <p className="text-gray-500 text-sm">Track ambassador onboarding performance for the current month. Target is 45 staff.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-orange-500 outline-none text-sm text-gray-900 dark:text-white transition-all" 
            placeholder="Search queue..." 
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden dark:shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950/50 text-gray-500 border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4">Ambassador</th>
              <th className="px-6 py-4 text-center">This Month</th>
              <th className="px-6 py-4">Progress to Target (45)</th>
              <th className="px-6 py-4 text-right">Status</th>
              {canApprove && <th className="px-6 py-4 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={canApprove ? 5 : 4} className="px-6 py-8 text-center text-gray-500">Loading queue...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={canApprove ? 5 : 4} className="px-6 py-8 text-center text-gray-500">No active ambassadors in the queue this month.</td>
              </tr>
            ) : (
              filteredData.map(amb => {
                const count = amb.thisMonthStaff || 0;
                const status = getStatus(count, amb.id);
                const StatusIcon = status.icon;
                const progressPercentage = Math.min((count / 45) * 100, 100);
                
                return (
                  <tr key={amb.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-orange-500 font-bold border border-gray-200 dark:border-gray-700">
                          {amb.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{amb.name}</p>
                          <p className="text-xs text-gray-500">{amb.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-bold ${count >= 45 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>{count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${count >= 45 ? 'bg-green-500' : count >= 35 ? 'bg-orange-500' : 'bg-gray-500'}`} 
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
                    {canApprove && (
                      <td className="px-6 py-4 text-right">
                        {status.isEligible && (
                          <button
                            onClick={() => handleApprovePayment(amb.id)}
                            className="text-xs font-bold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-green-500/20"
                          >
                            Approve
                          </button>
                        )}
                        {status.isPaid && (
                          <span className="text-xs font-bold text-gray-500">Processed</span>
                        )}
                      </td>
                    )}
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
