import React from 'react';
import { Users, Calendar } from 'lucide-react';

// ============================================
// STAFF TABLE COMPONENT
// ============================================
export const StaffTable = ({ staff, showAmbassador = false }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-900 to-black">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Position</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Department</th>
            {showAmbassador && (
              <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Ambassador</th>
            )}
            <th className="px-6 py-4 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {staff.length === 0 ? (
            <tr>
              <td colSpan={showAmbassador ? 7 : 6} className="px-6 py-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No staff members found</p>
              </td>
            </tr>
          ) : (
            staff.map(person => (
              <tr key={person.id} className="hover:bg-orange-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{person.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{person.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{person.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{person.position}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    {person.department}
                  </span>
                </td>
                {showAmbassador && (
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{person.ambassadorName}</td>
                )}
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>{person.onboardedDate}</span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);