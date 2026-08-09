import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit2, Trash2, Car, Zap, Utensils, ShoppingBag, Plus } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';
import PremiumButton from '../common/PremiumButton';

const ActivityIcon = ({ type }) => {
  switch (type.toUpperCase()) {
    case 'TRANSPORT': return <Car size={18} className="text-blue-400" />;
    case 'ELECTRICITY': return <Zap size={18} className="text-yellow-400" />;
    case 'FOOD': return <Utensils size={18} className="text-orange-400" />;
    case 'SHOPPING': return <ShoppingBag size={18} className="text-purple-400" />;
    default: return <Activity size={18} className="text-emerald-400" />;
  }
};

const ActivityLog = ({ 
  activities, 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.subType?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         act.activityType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || act.activityType?.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Transport">Transport</option>
              <option value="Electricity">Electricity</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>
          <PremiumButton onClick={onAdd} className="px-4">
            <Plus size={20} />
            <span className="hidden md:inline">Log Activity</span>
          </PremiumButton>
        </div>
      </div>

      <PremiumCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Impact</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((act) => (
                    <motion.tr
                      key={act.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                            <ActivityIcon type={act.activityType} />
                          </div>
                          <span className="font-bold text-white">{act.activityType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-300 font-medium">{act.subType}</span>
                          <span className="text-xs text-slate-500">{act.quantity} {act.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-emerald-400">{act.emission.toFixed(1)}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">kg CO₂</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400 font-medium">
                          {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => onEdit(act)}
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 transition-all duration-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(act.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-white/5 text-slate-600">
                          <Search size={40} />
                        </div>
                        <p className="text-slate-500 font-bold">No activities found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </div>
  );
};

export default ActivityLog;
