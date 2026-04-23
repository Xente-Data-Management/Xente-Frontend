import React, { useState } from 'react';
import { Button, Input, Select } from './components';
import toast from 'react-hot-toast';

const REGIONS = ['Northern', 'Central', 'Western', 'Eastern'];

// ============================================
// AMBASSADOR ONBOARDING FORM COMPONENT
// ============================================
export const AmbassadorOnboardingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    region: ''
  });

  const handleSubmit = () => {
    // Assuming 'name', 'email', 'phone', 'department' are meant to be derived from formData
    // The provided instruction snippet has a syntax error and refers to variables not directly in formData.
    // I will interpret the instruction to mean the validation logic should be updated as per the snippet,
    // assuming 'name' maps to 'formData.name', 'email' to 'formData.email', and 'department' to 'formData.region'.
    // The 'phone' field is new and not present in the current formData state, so it will be ignored for now
    // to maintain syntactical correctness with the existing formData structure.
    // If the user intended to add 'phone' and 'department' to formData, that would be a separate instruction.
    if (!formData.name || !formData.email || !formData.region) {
      toast.error('Please fill all required fields');
      return;
    }

    onSubmit({
      ...formData,
      id: `amb-${Date.now()}`, // Generate unique ID
      role: 'ambassador'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Onboard New Ambassador</h2>
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
        <div className="md:col-span-2">
          <Select
            label="Region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            placeholder="Select Region"
            options={REGIONS.map(r => ({ value: r, label: r }))}
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