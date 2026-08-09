import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calculator, Info } from 'lucide-react';
import PremiumButton from '../common/PremiumButton';

const AddActivityModal = ({ 
  isOpen, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  editingId 
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Calculator size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Update Activity' : 'Log New Activity'}
              </h3>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Category</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                >
                  <option value="Transport">Transport</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>

              {form.type === 'Transport' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Mode</label>
                  <select
                    name="transportMode"
                    value={form.transportMode}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="Petrol Car">Petrol Car</option>
                    <option value="Diesel Car">Diesel Car</option>
                    <option value="Hybrid Car">Hybrid Car</option>
                    <option value="Electric Car">Electric Car</option>
                    <option value="Public Transit">Public Transit</option>
                    <option value="Bicycle/Walk">Bicycle/Walk</option>
                  </select>
                </div>
              )}

              {form.type === 'Electricity' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Appliance</label>
                  <select
                    name="appliance"
                    value={form.appliance}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="Air Conditioner">Air Conditioner</option>
                    <option value="Heater">Heater</option>
                    <option value="Desktop PC">Desktop PC</option>
                    <option value="Washing Machine">Washing Machine</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="LED Bulbs">LED Bulbs</option>
                  </select>
                </div>
              )}

              {form.type === 'Food' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Meal Type</label>
                  <select
                    name="mealType"
                    value={form.mealType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="Red Meat">Red Meat</option>
                    <option value="Poultry/Fish">Poultry/Fish</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              )}

              {form.type === 'Shopping' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Category</label>
                  <select
                    name="shoppingCat"
                    value={form.shoppingCat}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home Goods">Home Goods</option>
                    <option value="Plastic/Packaging">Plastic/Packaging</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">
                {form.type === 'Transport' ? 'Distance (km)' : 
                 form.type === 'Electricity' ? 'Duration (hours)' : 
                 form.type === 'Shopping' ? 'Items Count' : 'Quantity'}
              </label>
              <input
                type="number"
                name={form.type === 'Transport' ? 'distance' : 
                      form.type === 'Electricity' ? 'hours' : 
                      form.type === 'Shopping' ? 'itemsCount' : 'manualValue'}
                value={form.type === 'Transport' ? form.distance : 
                       form.type === 'Electricity' ? form.hours : 
                       form.type === 'Shopping' ? form.itemsCount : form.manualValue}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-3">
              <Info className="text-emerald-400 shrink-0" size={18} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Our smart calculator uses standard GHG protocol factors to estimate your footprint based on these inputs.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <PremiumButton type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </PremiumButton>
              <PremiumButton type="submit" className="flex-1">
                <Save size={18} />
                {editingId ? 'Update Log' : 'Save Activity'}
              </PremiumButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddActivityModal;
