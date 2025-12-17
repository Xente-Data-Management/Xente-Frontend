// ============================================
// STAFF TABLE (src/components/StaffTable.jsx)
// ============================================

import React from 'react';
import { Trash2, Edit, Users } from 'lucide-react';

export const StaffTable = ({ staff, onDelete, onEdit, loading }) => {
  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
        <div className="text-center text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Staff Members</h3>
          <p className="text-sm">Start onboarding staff members to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Email', 'Phone', 'Position', 'Department', 'Date', 'Actions'].map(header => (
                <th 
                  key={header} 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600">{member.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600">{member.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600">{member.position}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {member.department}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600 text-sm">
                    {new Date(member.onboarded_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(member)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(member.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};