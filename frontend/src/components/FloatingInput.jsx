import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FloatingInput = ({ label, name, value, onChange, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value !== '';

  return (
    <div className="relative w-full">
      <motion.label
        initial={false}
        animate={{
          top: isActive ? '-10px' : '16px',
          left: isActive ? '12px' : '20px',
          fontSize: isActive ? '12px' : '16px',
          color: isActive ? '#60a5fa' : '#64748b',
          backgroundColor: isActive ? '#020617' : 'transparent',
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute px-2 pointer-events-none font-medium z-10 rounded-md"
      >
        {label}
      </motion.label>
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-slate-900/30 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner relative z-0"
      />
    </div>
  );
};

export default FloatingInput;
