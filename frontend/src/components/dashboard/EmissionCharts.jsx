import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PremiumCard from '../common/PremiumCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-emerald-400 text-lg font-black">
          {payload[0].value.toFixed(1)} <span className="text-xs font-bold text-slate-500">kg CO₂</span>
        </p>
      </div>
    );
  }
  return null;
};

const EmissionCharts = ({ weeklyChart, monthlyChart, catStats, chartView, setChartView }) => {
  const chartData = chartView === 'week' ? weeklyChart : monthlyChart;
  
  const pieData = Object.entries(catStats).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#eab308', '#f97316', '#a855f7'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <PremiumCard className="lg:col-span-2">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Emission Trends</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Historical Footprint</p>
          </div>
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setChartView('week')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                chartView === 'week' ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView('month')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                chartView === 'month' ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="emission"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </PremiumCard>

      <PremiumCard>
        <div className="mb-8 text-center lg:text-left">
          <h3 className="text-xl font-bold text-white">Breakdown</h3>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Impact by Category</p>
        </div>
        
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">kg CO₂</span>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white">{entry.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
};

export default EmissionCharts;
