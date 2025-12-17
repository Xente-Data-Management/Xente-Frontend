import React, { useState } from 'react';
import { Button, Input, Select } from './components';

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'Customer Service', 'IT', 'Finance', 'HR'];

// ============================================
// ONBOARDING FORM COMPONENT
// ============================================
export const OnboardingForm = ({ currentUser, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.position || !formData.department) {
      alert('Please fill all required fields');
      return;
    }
    
    onSubmit({
      ...formData,
      ambassadorId: currentUser.id,
      ambassadorName: currentUser.name
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Onboard New Staff Member</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+256 700 000000"
          required
        />
        <Input
          label="Position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Sales Associate"
          required
        />
        <div className="md:col-span-2">
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Select Department"
            options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
          />
        </div>
        <div className="md:col-span-2 flex space-x-4 pt-4">
          <Button onClick={handleSubmit} className="flex-1">Submit</Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        </div>
      </div>
    </div>
  );
};