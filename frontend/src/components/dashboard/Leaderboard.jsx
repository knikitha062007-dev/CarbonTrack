import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';

const Leaderboard = ({ leaderboard, userInfo, isLoading }) => {
  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-amber-600';
      case 2: return 'from-slate-300 to-slate-500';
      case 3: return 'from-amber-700 to-orange-900';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />;
      case 2: return <Medal className="text-slate-300" size={24} />;
      case 3: return <Medal className="text-amber-700" size={24} />;
      default: return <span className="text-slate-500 font-bold">{rank}</span>;
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">Global Leaderboard</h2>
        <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">Top Eco Warriors of the Month</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Silver - 2nd Place */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <PremiumCard className="relative pt-12 pb-8 text-center border-slate-300/20 bg-slate-300/5">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 p-1 shadow-xl shadow-slate-500/20">
                  <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-900">
                    <UserAvatar name={topThree[1].fullName} rank={2} />
                  </div>
                </div>
                <div className="absolute -bottom-2 right-0 bg-slate-300 text-slate-900 h-6 w-6 rounded-full flex items-center justify-center font-black text-xs">2</div>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{topThree[1].fullName}</h4>
              <p className="text-emerald-400 font-black text-xl">{topThree[1].totalEmission.toFixed(1)} <span className="text-xs font-bold text-slate-500 uppercase">kg</span></p>
            </PremiumCard>
          </motion.div>
        )}

        {/* Gold - 1st Place */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 md:order-2"
          >
            <PremiumCard className="relative pt-16 pb-10 text-center border-yellow-500/30 bg-yellow-500/5 scale-110 z-10">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 p-1 shadow-2xl shadow-yellow-500/30"
                >
                  <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-900">
                    <UserAvatar name={topThree[0].fullName} rank={1} />
                  </div>
                </motion.div>
                <div className="absolute -bottom-2 right-0 bg-yellow-400 text-slate-900 h-8 w-8 rounded-full flex items-center justify-center font-black text-sm ring-4 ring-slate-900">1</div>
                <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400" size={32} />
              </div>
              <h4 className="text-xl font-black text-white mb-1">{topThree[0].fullName}</h4>
              <p className="text-emerald-400 font-black text-2xl">{topThree[0].totalEmission.toFixed(1)} <span className="text-xs font-bold text-slate-500 uppercase">kg</span></p>
              <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
                <Star size={10} fill="currentColor" />
                <span>Top Warrior</span>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* Bronze - 3rd Place */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-3"
          >
            <PremiumCard className="relative pt-12 pb-8 text-center border-amber-700/20 bg-amber-700/5">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-700 to-orange-900 p-1 shadow-xl shadow-amber-900/20">
                  <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-900">
                    <UserAvatar name={topThree[2].fullName} rank={3} />
                  </div>
                </div>
                <div className="absolute -bottom-2 right-0 bg-amber-700 text-slate-900 h-6 w-6 rounded-full flex items-center justify-center font-black text-xs">3</div>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{topThree[2].fullName}</h4>
              <p className="text-emerald-400 font-black text-xl">{topThree[2].totalEmission.toFixed(1)} <span className="text-xs font-bold text-slate-500 uppercase">kg</span></p>
            </PremiumCard>
          </motion.div>
        )}
      </div>

      <PremiumCard className="p-0 overflow-hidden">
        <div className="space-y-1">
          {others.map((user, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 px-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                user.id === userInfo.id ? 'bg-emerald-500/5 border-l-4 border-l-emerald-500' : ''
              }`}
            >
              <div className="flex items-center gap-6">
                <span className="text-slate-500 font-black w-6 text-center">{idx + 4}</span>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-white/10">
                  {user.fullName.charAt(0)}
                </div>
                <span className={`font-bold ${user.id === userInfo.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {user.fullName} {user.id === userInfo.id && '(You)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white">{user.totalEmission.toFixed(1)}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">kg</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
};

const UserAvatar = ({ name, rank }) => {
  return (
    <div className="h-full w-full rounded-full flex items-center justify-center font-black text-2xl text-white overflow-hidden bg-slate-800">
       {name?.charAt(0)}
    </div>
  );
};

export default Leaderboard;
