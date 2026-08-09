import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info, Target } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';

const CarbonSummary = ({ totalEmissions, goal, progressPercent, isOverGoal, tip }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <PremiumCard className="lg:col-span-2 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-4">
              <Leaf size={16} />
              <span>Current Footprint</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-2">
              {totalEmissions.toLocaleString()} <span className="text-2xl font-bold text-slate-500">kg CO₂</span>
            </h2>
            <p className="text-slate-400 max-w-md mb-8">
              Your carbon footprint is based on your logged activities. Swapping one car commute for public transit saves roughly 15kg of CO₂ weekly.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-1">
              <Info size={18} />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              " {tip} "
            </p>
          </div>
        </div>
      </PremiumCard>

      <PremiumCard className="flex flex-col justify-between">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-wider">
            <Target size={16} />
            <span>Monthly Goal</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
            isOverGoal ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {isOverGoal ? 'Goal Exceeded' : 'On Track'}
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-800"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * Math.min(progressPercent, 100)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={isOverGoal ? "text-red-500" : "text-emerald-400"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{Math.round(progressPercent)}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">of goal</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Limit: {goal}kg</span>
            <span className={isOverGoal ? "text-red-400" : "text-emerald-400"}>
              {Math.max(0, goal - totalEmissions)}kg remaining
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${isOverGoal ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
            />
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};

export default CarbonSummary;
