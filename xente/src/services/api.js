// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  // ============================================
  // USER/AUTH ENDPOINTS
  // ============================================
  static async login(email) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  }

  // ============================================
  // ADMIN MANAGEMENT
  // ============================================
  static async getAllAdmins() {
    const response = await fetch(`${API_BASE_URL}/admins/all`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch admins');
    }
    
    return response.json();
  }

  static async createAdmin(data) {
    const response = await fetch(`${API_BASE_URL}/admins/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send invitation');
    }
    
    return response.json();
  }

  static async completeAdminSetup(data) {
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
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to revoke admin access');
    }
    
    return response.json();
  }

  // ============================================
  // AMBASSADOR ENDPOINTS
  // ============================================
  static async getAllAmbassadors() {
    const response = await fetch(`${API_BASE_URL}/users/ambassadors`);
    if (!response.ok) throw new Error('Failed to fetch ambassadors');
    return response.json();
  }

  static async getAmbassador(id) {
    const response = await fetch(`${API_BASE_URL}/users/ambassadors/${id}`);
    if (!response.ok) throw new Error('Failed to fetch ambassador');
    return response.json();
  }

  static async createAmbassador(data) {
    const response = await fetch(`${API_BASE_URL}/users/ambassadors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create ambassador');
    return response.json();
  }

  static async updateAmbassador(id, data) {
    const response = await fetch(`${API_BASE_URL}/users/ambassadors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update ambassador');
    return response.json();
  }

  static async deleteAmbassador(id) {
    const response = await fetch(`${API_BASE_URL}/users/ambassadors/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete ambassador');
    return response.json();
  }

  // ============================================
  // STAFF ENDPOINTS
  // ============================================
  static async getAllStaff(ambassadorId = null) {
    const params = ambassadorId ? `?ambassadorId=${ambassadorId}` : '';
    const response = await fetch(`${API_BASE_URL}/staff${params}`);
    if (!response.ok) throw new Error('Failed to fetch staff');
    return response.json();
  }

  static async getStaff(id) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`);
    if (!response.ok) throw new Error('Failed to fetch staff member');
    return response.json();
  }

  static async createStaff(data) {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create staff member');
    return response.json();
  }

  static async updateStaff(id, data) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update staff member');
    return response.json();
  }

  static async deleteStaff(id) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete staff member');
    return response.json();
  }

  static async searchStaff(query, ambassadorId = null) {
    const params = new URLSearchParams({ q: query });
    if (ambassadorId) params.append('ambassadorId', ambassadorId);
    
    const response = await fetch(`${API_BASE_URL}/staff/search?${params}`);
    if (!response.ok) throw new Error('Failed to search staff');
    return response.json();
  }

  static async filterByDepartment(department, ambassadorId = null) {
    const params = new URLSearchParams({ department });
    if (ambassadorId) params.append('ambassadorId', ambassadorId);
    
    const response = await fetch(`${API_BASE_URL}/staff/filter?${params}`);
    if (!response.ok) throw new Error('Failed to filter staff');
    return response.json();
  }

  static async getStatistics(ambassadorId = null) {
    const params = ambassadorId ? `?ambassadorId=${ambassadorId}` : '';
    const response = await fetch(`${API_BASE_URL}/staff/statistics${params}`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  }

  static getExportUrl(ambassadorId = null) {
    const params = ambassadorId ? `?ambassadorId=${ambassadorId}` : '';
    return `${API_BASE_URL}/staff/export${params}`;
  }
}

export default ApiService;