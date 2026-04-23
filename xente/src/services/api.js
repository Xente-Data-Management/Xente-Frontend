// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  // Helper to get auth header natively
  static getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Centralized fetch wrapper to handle tokens and errors
  static async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      // If 401 Unauthorized, maybe trigger a logout event or clear token
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(error.error || error.msg || 'Request failed');
    }
    
    return response.json();
  }

  // ============================================
  // USER/AUTH ENDPOINTS
  // ============================================
  static async login(email, password) {
    // Admin login uses password, user login might just use email depending on backend
    const body = password ? { email, password } : { email };
    // Assuming backend handles routing logic or we use the users/login endpoint for both
    // If Admin uses /admins/login, we might need a separate method. 
    // Wait, let's keep it exactly as it was:
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  }

  static async adminLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/admins/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  }

  static logout() {
    localStorage.removeItem('token');
  }

  // ============================================
  // ADMIN MANAGEMENT
  // ============================================
  static async getAllAdmins() {
    return this.request('/admins/all');
  }

  static async createAdmin(data) {
    return this.request('/admins/invite', { method: 'POST', body: JSON.stringify(data) });
  }

  static async completeAdminSetup(data) {
    // No token needed for setup
    const response = await fetch(`${API_BASE_URL}/admins/setup-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Setup link invalid or expired');
    }
    return response.json();
  }

  static async deleteAdmin(id) {
    return this.request(`/admins/${id}`, { method: 'DELETE' });
  }

  // ============================================
  // AMBASSADOR ENDPOINTS
  // ============================================
  static async getAllAmbassadors() {
    return this.request('/users/ambassadors');
  }

  static async getAmbassador(id) {
    return this.request(`/users/ambassadors/${id}`);
  }

  static async createAmbassador(data) {
    return this.request('/users/ambassadors', { method: 'POST', body: JSON.stringify(data) });
  }

  static async updateAmbassador(id, data) {
    return this.request(`/users/ambassadors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  static async deleteAmbassador(id) {
    return this.request(`/users/ambassadors/${id}`, { method: 'DELETE' });
  }

  // ============================================
  // STAFF ENDPOINTS
  // ============================================
  static async getAllStaff(ambassadorId = null, page = 1, limit = 50) {
    const params = new URLSearchParams();
    if (ambassadorId) params.append('ambassadorId', ambassadorId);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    return this.request(`/staff?${params.toString()}`);
  }

  static async getStaff(id) {
    return this.request(`/staff/${id}`);
  }

  static async createStaff(data) {
    return this.request('/staff', { method: 'POST', body: JSON.stringify(data) });
  }

  static async updateStaff(id, data) {
    return this.request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  static async deleteStaff(id) {
    return this.request(`/staff/${id}`, { method: 'DELETE' });
  }

  static async searchStaff(query, ambassadorId = null) {
    const params = new URLSearchParams({ q: query });
    if (ambassadorId) params.append('ambassadorId', ambassadorId);
    return this.request(`/staff/search?${params}`);
  }

  static async filterByDepartment(department, ambassadorId = null) {
    const params = new URLSearchParams({ department });
    if (ambassadorId) params.append('ambassadorId', ambassadorId);
    return this.request(`/staff/filter?${params}`);
  }

  static async getStatistics(ambassadorId = null) {
    const params = ambassadorId ? `?ambassadorId=${ambassadorId}` : '';
    return this.request(`/staff/statistics${params}`);
  }

  static getExportUrl(ambassadorId = null) {
    const params = ambassadorId ? `?ambassadorId=${ambassadorId}` : '';
    return `${API_BASE_URL}/staff/export${params}`;
    // WARNING: export URL clicked directly won't have the JWT header.
    // It usually opens in a new tab. Browsers don't support custom headers on native download links.
    // This will need to be handled either by allowing export without token or by fetching blob manually.
  }
  
  static async downloadExport(ambassadorId = null) {
    const params = ambassadorId ? `?ambassadorId=${ambassadorId}` : '';
    const response = await fetch(`${API_BASE_URL}/staff/export${params}`, {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  }

  // ============================================
  // REQUISITION ENDPOINTS
  // ============================================
  static async createRequisition(data) {
    return this.request('/requisitions', { method: 'POST', body: JSON.stringify(data) });
  }

  static async getAllRequisitions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.adminId) params.append('adminId', filters.adminId);
    return this.request(`/requisitions?${params.toString()}`);
  }

  static async getRequisitionById(id) {
    return this.request(`/requisitions/${id}`);
  }

  static async updateRequisitionStatus(id, status, notes = '') {
    return this.request(`/requisitions/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status, notes }) 
    });
  }
}

export default ApiService;