import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Shield, Target, Leaf, Star, Sparkles, Globe } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';

const BadgeIcon = ({ name, unlocked }) => {
  const props = {
    size: 32,
    className: unlocked ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-slate-600"
  };

  switch (name) {
    case 'Eco Pioneer': return <Leaf {...props} />;
    case 'Carbon Cutter': return <Zap {...props} />;
    case 'Green Master': return <Target {...props} />;
    case 'Earth Guardian': return <Shield {...props} />;
    case 'Sustainability Pro': return <Globe {...props} />;
    case 'Climate Hero': return <Star {...props} />;
    default: return <Award {...props} />;
  }
};

const Badges = ({ activities, totalEmissions, dashboard }) => {
  // Logic from Dashboard.jsx or simplified version
  const badges = [
    { name: 'Eco Pioneer', desc: 'Log your first 5 activities', threshold: 5, current: activities.length },
    { name: 'Carbon Cutter', desc: 'Reduce footprint below 300kg', threshold: 300, current: totalEmissions, inverse: true },
    { name: 'Green Master', desc: 'Maintain streak for 7 days', threshold: 7, current: 4 }, // Placeholder logic
    { name: 'Earth Guardian', desc: 'Total emissions below 1000kg', threshold: 1000, current: totalEmissions, inverse: true },
    { name: 'Sustainability Pro', desc: 'Reach level 5', threshold: 5, current: 3 },
    { name: 'Climate Hero', desc: 'Join the top 10% of users', threshold: 10, current: 15 },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">Achievements</h2>
        <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">Unlock your eco-milestones</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {badges.map((badge, idx) => {
          const isUnlocked = badge.inverse ? badge.current <= badge.threshold : badge.current >= badge.threshold;
          
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <PremiumCard className={`h-full flex flex-col items-center text-center p-8 border-2 transition-all duration-500 ${
                isUnlocked 
                  ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/10' 
                  : 'border-white/5 opacity-60 grayscale'
              }`}>
                <div className="relative mb-6">
                  <div className={`h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isUnlocked ? 'bg-emerald-500/10 rotate-12 group-hover:rotate-0' : 'bg-slate-800'
                  }`}>
                    <BadgeIcon name={badge.name} unlocked={isUnlocked} />
                  </div>
                  {isUnlocked && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full -z-10"
                    />
                  )}
                  {isUnlocked && <Sparkles className="absolute -top-2 -right-2 text-yellow-400 h-5 w-5" />}
                </div>

                <h4 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                  {badge.desc}
                </p>

                <div className="mt-auto w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Progress</span>
                    <span className={isUnlocked ? 'text-emerald-400' : 'text-slate-600'}>
                      {isUnlocked ? 'Completed' : `${Math.min(100, Math.round((badge.current / badge.threshold) * 100))}%`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isUnlocked ? '100%' : `${Math.min(100, (badge.current / badge.threshold) * 100)}%` }}
                      className={`h-full rounded-full ${isUnlocked ? 'bg-emerald-400' : 'bg-slate-700'}`}
                    />
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Badges;
