import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, Plus, Search, Filter, Eye, CheckCircle, 
  XCircle, Clock, FileEdit, Trash2, ArrowRight, DollarSign
} from 'lucide-react';
import ApiService from '../services/api';
import { Button, LoadingSpinner, ErrorAlert } from '../components/components';
import { toast } from 'react-hot-toast';

const STATUS_COLORS = {
  draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
};

export const RequisitionsPage = ({ currentUser }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [reqDetailsLoading, setReqDetailsLoading] = useState(false);
  
  // Create Form State
  const [formData, setFormData] = useState({ title: '', department: '', description: '' });
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0, category: 'general' }]);
  const [submitting, setSubmitting] = useState(false);
  
  // Action state (Approve/Reject)
  const [actionNotes, setActionNotes] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiService.getAllRequisitions();
      setRequisitions(res.requisitions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, category: 'general' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return toast.error('Please add at least one item');
    if (items.some(i => !i.description || i.quantity <= 0 || i.unitPrice < 0)) {
      return toast.error('Please fill all item details correctly');
    }

    try {
      setSubmitting(true);
      await ApiService.createRequisition({
        ...formData,
        items
      });
      toast.success('Requisition created successfully');
      setShowCreateModal(false);
      setFormData({ title: '', department: '', description: '' });
      setItems([{ description: '', quantity: 1, unitPrice: 0, category: 'general' }]);
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewRequisition = async (reqId) => {
    try {
      setReqDetailsLoading(true);
      setShowViewModal(true);
      const res = await ApiService.getRequisitionById(reqId);
      setSelectedReq(res.requisition);
    } catch (err) {
      toast.error(err.message);
      setShowViewModal(false);
    } finally {
      setReqDetailsLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setSubmitting(true);
      await ApiService.updateRequisitionStatus(selectedReq.id, status, actionNotes);
      toast.success(`Requisition ${status}`);
      setShowViewModal(false);
      setActionNotes('');
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.admin_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const canApprove = ['super', 'director', 'finance'].includes(currentUser?.role);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-orange-500 outline-none text-sm text-white" 
            placeholder="Search requisitions..." 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Draft', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button 
              key={status} 
              onClick={() => setStatusFilter(status)} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${statusFilter === status ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {status}
            </button>
          ))}
          <Button onClick={() => setShowCreateModal(true)} icon={Plus} className="ml-2">New Request</Button>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Requisitions List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequisitions.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No requisitions found matching your criteria.</p>
            </div>
          ) : (
            filteredRequisitions.map(req => (
              <div key={req.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-orange-500/50 transition-colors group flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{req.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{req.department}</span>
                      <span>•</span>
                      <span>By {req.admin_name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-lg font-bold text-white">${Number(req.total_amount).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${STATUS_COLORS[req.status]}`}>
                    {req.status}
                  </span>
                  <button 
                    onClick={() => handleViewRequisition(req.id)}
                    className="p-2 bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileEdit className="w-5 h-5 text-orange-500" /> New Requisition</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold ml-1">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors" placeholder="e.g. Office Supplies Q3" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold ml-1">Department</label>
                  <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors">
                    <option value="">Select Department</option>
                    <option value="IT">IT & Engineering</option>
                    <option value="HR">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-bold ml-1">Description (Optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors min-h-[80px]" placeholder="Brief justification for this request..." />
              </div>

              <div className="bg-black/50 rounded-2xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-300">Line Items</h3>
                  <button type="button" onClick={handleAddItem} className="text-xs flex items-center gap-1 text-orange-500 hover:text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-900 p-3 rounded-xl border border-gray-800">
                      <div className="flex-1 w-full">
                        <input required placeholder="Item description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none" />
                      </div>
                      <div className="w-full md:w-24">
                        <input required type="number" min="1" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none" />
                      </div>
                      <div className="w-full md:w-32 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input required type="number" min="0" step="0.01" placeholder="Price" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:border-orange-500 outline-none" />
                      </div>
                      <div className="w-full md:w-auto text-right font-bold text-orange-500 min-w-[80px]">
                        ${(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                      {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end items-center gap-4 pt-4 border-t border-gray-800">
                  <span className="text-gray-400">Total Estimated Cost:</span>
                  <span className="text-2xl font-bold text-white">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowCreateModal(false)} type="button">Cancel</Button>
                <Button type="submit" loading={submitting}>Submit Requisition</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW/APPROVE MODAL */}
      {showViewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">Requisition Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-white"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              {reqDetailsLoading ? (
                <div className="py-12 flex justify-center"><LoadingSpinner /></div>
              ) : selectedReq ? (
                <>
                  <div className="flex flex-col md:flex-row justify-between gap-4 bg-black/30 p-5 rounded-2xl border border-gray-800">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{selectedReq.title}</h3>
                      <p className="text-gray-400 text-sm">Requested by <span className="text-white">{selectedReq.admin_name}</span> ({selectedReq.department})</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${STATUS_COLORS[selectedReq.status]}`}>
                        {selectedReq.status}
                      </span>
                      <span className="text-gray-500 text-xs">{new Date(selectedReq.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedReq.description && (
                    <div className="text-gray-300 text-sm bg-gray-800/30 p-4 rounded-xl">
                      {selectedReq.description}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Line Items</h4>
                    <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-900 text-gray-500 border-b border-gray-800">
                          <tr>
                            <th className="p-3">Description</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Unit Price</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                          {selectedReq.items?.map(item => (
                            <tr key={item.id}>
                              <td className="p-3">{item.description}</td>
                              <td className="p-3 text-center">{item.quantity}</td>
                              <td className="p-3 text-right">${Number(item.unit_price).toLocaleString()}</td>
                              <td className="p-3 text-right font-medium text-white">${Number(item.total_price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-900/50 border-t border-gray-800">
                          <tr>
                            <td colSpan="3" className="p-4 text-right font-bold text-gray-400">Total Approved Amount</td>
                            <td className="p-4 text-right font-bold text-xl text-orange-500">${Number(selectedReq.total_amount).toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {selectedReq.logs?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Approval History</h4>
                      <div className="space-y-3">
                        {selectedReq.logs.map(log => (
                          <div key={log.id} className="flex gap-4 p-3 bg-gray-800/20 rounded-xl border border-gray-800/50">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-gray-400 text-xs font-bold border border-gray-700">
                              {log.action_by_name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-300">
                                <span className="font-bold text-white">{log.action_by_name}</span> marked as <span className={`capitalize font-bold ${log.action === 'approved' ? 'text-green-400' : log.action === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{log.action}</span>
                              </p>
                              {log.notes && <p className="text-sm text-gray-500 mt-1 italic">"{log.notes}"</p>}
                              <p className="text-xs text-gray-600 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedReq.status === 'pending' || selectedReq.status === 'draft') && canApprove && (
                    <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-800 space-y-4">
                      <h4 className="text-sm font-bold text-white mb-2">Review Action</h4>
                      <textarea 
                        value={actionNotes} 
                        onChange={e => setActionNotes(e.target.value)} 
                        placeholder="Add notes or reason (optional)..." 
                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors min-h-[80px] text-sm" 
                      />
                      <div className="flex justify-end gap-3">
                        <Button 
                          variant="danger" 
                          icon={XCircle}
                          onClick={() => handleUpdateStatus('rejected')}
                          loading={submitting}
                        >
                          Reject Request
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-500 text-white shadow-green-900/20"
                          icon={CheckCircle}
                          onClick={() => handleUpdateStatus('approved')}
                          loading={submitting}
                        >
                          Approve Request
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Option for creator to submit a draft */}
                  {selectedReq.status === 'draft' && selectedReq.admin_id === currentUser?.id && (
                     <div className="flex justify-end pt-4 border-t border-gray-800">
                        <Button 
                          onClick={() => handleUpdateStatus('pending')}
                          loading={submitting}
                          icon={ArrowRight}
                        >
                          Submit for Approval
                        </Button>
                     </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequisitionsPage;
