import React from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Utensils, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';

const StatCard = ({ title, value, unit, icon: Icon, trend, colorClass }) => {
  const isPositive = trend > 0;

  return (
    <PremiumCard className={`border-l-4 ${colorClass}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/20 transition-all duration-500">
          <Icon className="h-6 w-6 text-emerald-400" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
          isPositive ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-semibold mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <span className="text-slate-500 text-sm font-medium">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};

const StatCards = ({ stats }) => {
  const cards = [
    { title: 'Transport', value: stats.Transport, unit: 'kg CO₂', icon: Car, trend: -12, colorClass: 'border-l-blue-500' },
    { title: 'Electricity', value: stats.Electricity, unit: 'kg CO₂', icon: Zap, trend: 8, colorClass: 'border-l-yellow-500' },
    { title: 'Food', value: stats.Food, unit: 'kg CO₂', icon: Utensils, trend: -5, colorClass: 'border-l-orange-500' },
    { title: 'Shopping', value: stats.Shopping, unit: 'kg CO₂', icon: ShoppingBag, trend: 2, colorClass: 'border-l-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default StatCards;
