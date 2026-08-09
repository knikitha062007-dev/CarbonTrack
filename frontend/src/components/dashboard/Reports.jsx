import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import PremiumCard from '../common/PremiumCard';
import PremiumButton from '../common/PremiumButton';

const Reports = ({ 
  fromDate, 
  setFromDate, 
  toDate, 
  setToDate, 
  email, 
  setEmail, 
  onExportPDF, 
  onExportExcel, 
  isExporting 
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black text-white">Data Reports</h2>
        <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">Export your emission data</p>
      </div>

      <PremiumCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 border-r border-white/10 pr-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-emerald-400" /> Date Range
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Download className="text-emerald-400" /> Export Options
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Download a comprehensive PDF report of your activities and emissions for the selected date range.
                </p>
                <PremiumButton 
                  onClick={onExportPDF} 
                  disabled={isExporting} 
                  className="w-full justify-center"
                >
                  <FileText size={18} />
                  {isExporting ? 'Generating PDF...' : 'Download PDF Report'}
                </PremiumButton>
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Report To</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <PremiumButton 
                  onClick={onExportExcel} 
                  disabled={isExporting} 
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Download size={18} />
                  {isExporting ? 'Sending...' : 'Email Excel Report'}
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};

export default Reports;
