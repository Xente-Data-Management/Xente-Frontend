import React from 'react';
import { Trophy, Hash } from 'lucide-react';

export const TopPerformerCard = ({ ambassador }) => {
  if (!ambassador) return null;

  // Safety: ensure we have a real name (not a code accidentally stored as name)
  const displayName = ambassador.name && !ambassador.name.startsWith('XA-') && !ambassador.name.startsWith('AMB-')
    ? ambassador.name
    : ambassador.email?.split('@')[0] || 'Top Ambassador';

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 shadow-xl shadow-orange-500/20 relative overflow-hidden group h-full">
      <Trophy className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-orange-100 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-4 h-4" /> Top Performer
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-extrabold text-xl mb-3">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <h3 className="text-2xl font-bold text-white mb-0.5">{displayName}</h3>
        <p className="text-orange-200 text-sm mb-1">{ambassador.region} Region</p>

        {/* Ambassador Code Badge */}
        {ambassador.ambassador_code && (
          <div className="flex items-center gap-1.5 mb-4">
            <Hash className="w-3 h-3 text-orange-300" />
            <span className="text-orange-200 font-mono text-xs font-bold tracking-wider">
              {ambassador.ambassador_code}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-2.5 text-center flex-1">
            <div className="text-white font-bold text-lg">{ambassador.totalStaff || 0}</div>
            <div className="text-orange-100 text-[10px] uppercase tracking-wide">Recruits</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-2.5 text-center flex-1">
            <div className="text-white font-bold text-lg">{ambassador.thisMonthStaff || 0}</div>
            <div className="text-orange-100 text-[10px] uppercase tracking-wide">This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};
