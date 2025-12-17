// ============================================
// ONBOARDING FORM (src/components/OnboardingForm.jsx)
// ============================================

import React, { useState } from 'react';
import { Button, Input } from '../components/components';

export const OnboardingForm = ({ currentUser, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Only require name, phone, and department (email and position are optional)
    if (formData.name && formData.phone && formData.department) {
      onSubmit({
        ...formData,
        ambassadorId: currentUser.id,
        ambassadorName: currentUser.name
      });
    }
  };

  // Updated validation - only name, phone, and department are required
  const isFormValid = formData.name && formData.phone && formData.department;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Onboard New Staff Member</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name - REQUIRED */}
        <Input 
          label="Full Name" 
          value={formData.name} 
          onChange={(e) => handleChange('name', e.target.value)} 
          placeholder="John Doe"
          required 
        />

        {/* Email - OPTIONAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Phone - REQUIRED */}
        <Input 
          label="Phone" 
          type="tel" 
          value={formData.phone} 
          onChange={(e) => handleChange('phone', e.target.value)} 
          placeholder="+256 700 000 000"
          required 
        />

        {/* Position - OPTIONAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder="Software Engineer"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Department - REQUIRED */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Support">Support</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="HR">Human Resources</option>
          </select>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex space-x-3">
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isFormValid}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};