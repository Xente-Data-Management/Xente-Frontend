import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, XCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import ApiService from '../services/api';
import { Button, LoadingSpinner, ErrorAlert } from '../components/components';
import { toast } from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20'
};

const LEAVE_TYPES = [
  'Annual',
  'Sick',
  'Personal',
  'Maternity',
  'Paternity',
  'Compassionate'
];

export default function LeaveRequestsPage({ currentUser }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  
  // Create Form State
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Review State
  const [reviewNotes, setReviewNotes] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiService.getAllLeaveRequests();
      setRequests(res.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Calculate days between dates (excluding weekends roughly, or just straight days for now)
  const calculateDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    if (s > e) return 0;
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const days = calculateDays(formData.startDate, formData.endDate);
    
    if (days <= 0) {
      return toast.error('End date must be after start date');
    }

    if (formData.leaveType === 'Sick' && days > 3) {
      return toast.error('Sick leave cannot exceed 3 days. Please choose another leave type or adjust dates.');
    }

    try {
      setSubmitting(true);
      await ApiService.createLeaveRequest({
        ...formData,
        days
      });
      toast.success('Leave request submitted');
      setShowCreateModal(false);
      setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewAction = async (status) => {
    try {
      setSubmitting(true);
      await ApiService.updateLeaveStatus(selectedReq.id, status, reviewNotes);
      toast.success(`Leave request ${status}`);
      setShowReviewModal(false);
      setReviewNotes('');
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const searchString = `${req.user_name} ${req.leave_type} ${req.reason}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const canReview = ['hr', 'super', 'director'].includes(currentUser?.role);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-orange-500 outline-none text-sm text-white transition-all" 
            placeholder="Search requests..." 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button 
              key={status} 
              onClick={() => setStatusFilter(status)} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${statusFilter === status ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {status}
            </button>
          ))}
          <Button onClick={() => setShowCreateModal(true)} icon={Plus} className="ml-2">Request Leave</Button>
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
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                {canReview && <th className="px-6 py-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={canReview ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-orange-500 font-bold border border-gray-700">
                          {req.user_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{req.user_name}</p>
                          <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{req.leave_type}</p>
                      {req.reason && <p className="text-xs text-gray-500 truncate max-w-[200px]">{req.reason}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 font-medium">{req.days} Day(s)</p>
                      <p className="text-xs text-gray-500">
                        {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider ${STATUS_COLORS[req.status]}`}>
                        {req.status}
                      </span>
                      {req.reviewer_name && (
                         <p className="text-[10px] text-gray-500 mt-1">by {req.reviewer_name}</p>
                      )}
                    </td>
                    {canReview && (
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' ? (
                          <button 
                            onClick={() => { setSelectedReq(req); setShowReviewModal(true); }}
                            className="text-xs font-bold bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white border border-orange-500/20 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setSelectedReq(req); setShowReviewModal(true); }}
                            className="text-xs font-bold text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> Request Leave
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Leave Type</label>
                <select 
                  required 
                  value={formData.leaveType} 
                  onChange={e => setFormData({...formData, leaveType: e.target.value})} 
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all"
                >
                  <option value="">Select Leave Type</option>
                  {LEAVE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formData.leaveType === 'Sick' && (
                   <p className="text-xs text-orange-500 mt-1 ml-1">Sick leave is limited to a maximum of 3 days per request.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Start Date</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.startDate} 
                    onChange={e => setFormData({...formData, startDate: e.target.value})} 
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all [color-scheme:dark]" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">End Date</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.endDate} 
                    onChange={e => setFormData({...formData, endDate: e.target.value})} 
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all [color-scheme:dark]" 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Reason (Optional)</label>
                <textarea 
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})} 
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all min-h-[100px]" 
                  placeholder="Provide any relevant details..." 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)} type="button">Cancel</Button>
                <Button type="submit" className="flex-1" loading={submitting}>Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && selectedReq && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">Review Leave Request</h2>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-500 hover:text-white"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4 mb-6">
               <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                  <p className="text-sm font-bold text-white mb-1">{selectedReq.user_name}</p>
                  <p className="text-xs text-gray-400 mb-3">{selectedReq.user_email} • {selectedReq.user_role}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Type</p>
                        <p className="text-white">{selectedReq.leave_type}</p>
                     </div>
                     <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Duration</p>
                        <p className="text-white">{selectedReq.days} Days</p>
                     </div>
                     <div className="col-span-2">
                        <p className="text-gray-500 text-xs uppercase font-bold">Dates</p>
                        <p className="text-white">{new Date(selectedReq.start_date).toLocaleDateString()} to {new Date(selectedReq.end_date).toLocaleDateString()}</p>
                     </div>
                     {selectedReq.reason && (
                        <div className="col-span-2">
                           <p className="text-gray-500 text-xs uppercase font-bold">Reason</p>
                           <p className="text-gray-300 bg-gray-800/30 p-2 rounded mt-1">{selectedReq.reason}</p>
                        </div>
                     )}
                  </div>
               </div>

               {selectedReq.status !== 'pending' && (
                  <div className="bg-gray-800/20 p-4 rounded-xl border border-gray-800 text-sm">
                     <p className="text-gray-500 text-xs uppercase font-bold mb-1">Review Details</p>
                     <p className="text-white">
                        Marked as <span className={`font-bold ${selectedReq.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{selectedReq.status}</span> by {selectedReq.reviewer_name}
                     </p>
                     {selectedReq.review_notes && (
                        <p className="text-gray-400 mt-2 italic">"{selectedReq.review_notes}"</p>
                     )}
                  </div>
               )}
            </div>

            {selectedReq.status === 'pending' && (
               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Review Notes (Optional)</label>
                     <textarea 
                        value={reviewNotes} 
                        onChange={e => setReviewNotes(e.target.value)} 
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all min-h-[80px]" 
                        placeholder="Add comments..." 
                     />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                     <Button variant="danger" className="flex-1" onClick={() => handleReviewAction('rejected')} loading={submitting}>Reject</Button>
                     <Button className="flex-1 bg-green-600 hover:bg-green-500 text-white shadow-green-900/20" onClick={() => handleReviewAction('approved')} loading={submitting}>Approve</Button>
                  </div>
               </div>
            )}
            
            {selectedReq.status !== 'pending' && (
               <Button variant="secondary" className="w-full mt-4" onClick={() => setShowReviewModal(false)}>Close</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
