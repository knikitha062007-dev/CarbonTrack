import React from 'react';
import { motion } from 'framer-motion';

const PremiumCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] ${className}`}
      {...props}
    >
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-[80px]" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default PremiumCard;
