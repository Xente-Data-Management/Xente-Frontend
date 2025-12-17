import React, { useMemo } from 'react';

// ============================================
// DEPARTMENT BREAKDOWN COMPONENT
// ============================================
export const DepartmentBreakdown = ({ staff }) => {
  const departmentData = useMemo(() => {
    const counts = {};
    staff.forEach(s => {
      counts[s.department] = (counts[s.department] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [staff]);

  const total = staff.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Department Distribution</h3>
      <div className="space-y-3">
        {departmentData.map(({ dept, count }) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={dept}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{dept}</span>
                <span className="text-sm font-bold text-orange-600">{count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};