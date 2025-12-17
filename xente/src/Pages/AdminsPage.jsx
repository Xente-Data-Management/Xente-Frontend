import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Trash2, Mail, AlertCircle, CheckCircle, Send } from 'lucide-react';
import ApiService from '../services/api';

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllAdmins();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      // This will now send just Name, Email, and Role to your backend
      await ApiService.createAdmin(data); 
      setMsg({ type: 'success', text: `Invitation sent to ${data.email} successfully!` });
      setShowCreate(false);
      fetchAdmins();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const deleteAdmin = async (id) => {
    if(!confirm("Revoke all administrative access for this user?")) return;
    try {
      await ApiService.deleteAdmin(id);
      fetchAdmins();
      setMsg({ type: 'success', text: 'Admin access revoked.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete admin.' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">System Administrators</h2>
          <p className="text-gray-500 text-sm">Manage dashboard access. New admins will receive an invite email.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <UserPlus className="w-4 h-4" /> Invite New Admin
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center justify-between ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          <div className="flex items-center gap-3">
            {msg.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
            <span className="text-sm font-medium">{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-xs uppercase font-bold opacity-50 hover:opacity-100">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map(admin => (
          <div key={admin.id} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group hover:border-gray-700 transition-colors">
            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-orange-500/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-orange-500 border border-gray-700">
                <Shield className="w-6 h-6" />
              </div>
              <button 
                onClick={() => deleteAdmin(admin.id)} 
                className="text-gray-600 hover:text-red-500 transition-colors p-2 bg-gray-800/50 rounded-lg"
                title="Revoke Access"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg leading-tight">{admin.name}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1 mb-4">
                <Mail className="w-3.5 h-3.5" /> {admin.email}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                  admin.role === 'super' 
                  ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                  : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                  {admin.role === 'super' ? 'Super Admin' : 'Standard Admin'}
                </span>
                <span className="text-[10px] text-gray-600 font-medium">Joined {new Date(admin.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INVITE ADMIN MODAL (No Password Field) */}
      {showCreate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleInviteAdmin} className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="text-orange-500 w-5 h-5" /> Invite Administrator
              </h2>
              <button type="button" onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white transition-colors">
                <Trash2 className="w-5 h-5 rotate-45" /> {/* Using Trash as an X icon replacement or just import X */}
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Enter the details below. We will send an email to this address with instructions to set up their account.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input 
                  name="name" 
                  placeholder="e.g. John Doe" 
                  required 
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="admin@company.com" 
                  required 
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Access Level</label>
                <select 
                  name="role" 
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="admin">Standard Admin (View & Edit Staff)</option>
                  <option value="super">Super Admin (Can manage other Admins)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Invitation
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreate(false)} 
                className="w-full py-3 text-gray-500 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;