import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

// ============================================
// MONTHLY TREND CHART COMPONENT
// ============================================
export const MonthlyTrendChart = ({ staff }) => {
  const monthlyData = useMemo(() => {
    const months = ['Nov', 'Dec'];
    const counts = months.map(month => {
      const monthNum = month === 'Nov' ? 10 : 11;
      return staff.filter(s => new Date(s.onboardedDate).getMonth() === monthNum).length;
    });
    return { months, counts };
  }, [staff]);

  const maxCount = Math.max(...monthlyData.counts, 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-orange-500" />
        <span>Monthly Onboarding Trend</span>
      </h3>
      <div className="flex items-end justify-around h-64 space-x-4">
        {monthlyData.months.map((month, index) => {
          const height = (monthlyData.counts[index] / maxCount) * 100;
          return (
            <div key={month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center h-48">
                <div 
                  className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-orange-500"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                >
                  <div className="text-white font-bold text-center pt-2">
                    {monthlyData.counts[index]}
                  </div>
                </div>
              </div>
              <div className="mt-2 font-semibold text-gray-700">{month} 2024</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};