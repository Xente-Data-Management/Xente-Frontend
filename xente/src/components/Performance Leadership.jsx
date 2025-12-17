import React from 'react';
import { Award } from 'lucide-react';

// ============================================
// PERFORMANCE LEADERBOARD COMPONENT
// ============================================
export const PerformanceLeaderboard = ({ ambassadorStats }) => {
  const sortedAmbassadors = [...ambassadorStats].sort((a, b) => b.count - a.count);
  const maxCount = sortedAmbassadors[0]?.count || 1;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Award className="w-6 h-6 text-orange-500" />
          <span>Ambassador Performance Leaderboard</span>
        </h3>
      </div>
      <div className="space-y-4">
        {sortedAmbassadors.map((amb, index) => (
          <div key={amb.id} className="flex items-center space-x-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                index === 1 ? 'bg-gray-300 text-gray-700' : 
                index === 2 ? 'bg-orange-300 text-orange-900' : 
                'bg-gray-200 text-gray-600'}`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-900">{amb.name}</span>
                <span className="text-sm font-bold text-orange-600">{amb.count} staff</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${(amb.count / maxCount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{amb.region} Region</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};