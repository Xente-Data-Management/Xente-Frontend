import React from 'react';
import { Trophy } from 'lucide-react';

export const TopPerformerCard = ({ ambassador }) => {
  if (!ambassador) return null;
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 shadow-xl shadow-orange-500/20 relative overflow-hidden group h-full">
      <Trophy className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" /> Top Performer
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{ambassador.name}</h3>
        <p className="text-orange-100 text-sm mb-4">{ambassador.region} Region</p>
        <div className="flex gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-white font-bold text-lg">{ambassador.totalStaff || 0}</div>
            <div className="text-orange-100 text-[10px] uppercase">Recruits</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-white font-bold text-lg">Active</div>
            <div className="text-orange-100 text-[10px] uppercase">Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};
