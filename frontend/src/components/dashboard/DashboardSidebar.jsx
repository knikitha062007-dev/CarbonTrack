import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  User, 
  LogOut, 
  Leaf, 
  Trophy, 
  Award,
  ChevronRight
} from 'lucide-react';

const DashboardSidebar = ({ activeTab, setActiveTab, onLogout, userInfo }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'badges', label: 'Achievements', icon: Award },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Settings', icon: User },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 border-r border-white/10 bg-slate-950/50 backdrop-blur-2xl z-50 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Leaf className="text-slate-900 h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          CarbonTracker
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-10 px-2 py-4 rounded-2xl bg-white/5 border border-white/5">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
          {userInfo.fullName?.charAt(0) || 'E'}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-white truncate">{userInfo.fullName}</span>
          <span className="text-xs text-emerald-400/80 font-medium uppercase tracking-wider">Eco Warrior</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isActive ? 'text-emerald-400' : 'group-hover:text-emerald-400 transition-colors'} />
                <span className="font-semibold">{item.label}</span>
              </div>
              {isActive && <motion.div layoutId="activeDot" className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
            </motion.button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 font-semibold border border-transparent hover:border-red-500/20"
      >
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default DashboardSidebar;
