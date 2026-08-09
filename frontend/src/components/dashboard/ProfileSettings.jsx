import React from 'react';
import { User, Mail, Target, Save, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';
import PremiumButton from '../common/PremiumButton';

const ProfileSettings = ({ 
  userInfo, 
  profileForm, 
  setProfileForm, 
  handleProfileUpdate,
  theme,
  setTheme
}) => {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black text-white">Account Settings</h2>
        <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <PremiumCard className="flex flex-col items-center text-center p-8">
            <div className="relative mb-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-1">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-black text-white border-4 border-slate-900">
                  {userInfo.fullName?.charAt(0)}
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{userInfo.fullName}</h3>
            <p className="text-emerald-400 font-medium text-sm">Eco Warrior</p>
            <div className="w-full h-px bg-white/10 my-6" />
            <div className="flex justify-between w-full text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Member Since</span>
              <span className="text-white font-medium">Aug 2026</span>
            </div>
          </PremiumCard>

          <PremiumCard>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Appearance</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Moon size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Dark</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'light' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Sun size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Light</span>
              </button>
            </div>
          </PremiumCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          <PremiumCard>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-6">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Monthly CO₂ Goal (kg)</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="number"
                      name="goal"
                      value={profileForm.goal}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 px-1 mt-1">Set a realistic goal to reduce your monthly emissions.</p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mt-6">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">Public Profile</h4>
                    <p className="text-xs text-slate-500">Allow your name to appear on the global leaderboard.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="showName"
                      checked={profileForm.showName}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <PremiumButton type="submit">
                  <Save size={18} />
                  Save Changes
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
