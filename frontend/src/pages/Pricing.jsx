import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <div className="min-h-[calc(100vh-73px)] py-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-400 text-xl">
          Start for free to build your basic 3D card. Upgrade to Pro for high-res exports, AI features, and glassmorphism materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Free Tier */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
          <div className="text-4xl font-extrabold text-white mb-6">Rs.100<span className="text-lg text-slate-500 font-medium"></span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-300"><Check size={20} className="text-blue-500" /> Basic Matte Material</li>
            <li className="flex items-center gap-3 text-slate-300"><Check size={20} className="text-blue-500" /> Standard Resolution Export</li>
            <li className="flex items-center gap-3 text-slate-500"><X size={20} /> <span className="line-through">AI Color Generation</span></li>
            <li className="flex items-center gap-3 text-slate-500"><X size={20} /> <span className="line-through">Glass & Neon Styles</span></li>
          </ul>
          <button className="w-full py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-all">Current Plan</button>
        </motion.div>

        {/* Pro Tier */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-3xl p-8 backdrop-blur-md flex flex-col relative shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Most Popular</div>
          <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
          <div className="text-4xl font-extrabold text-white mb-6">Rs.300<span className="text-lg text-slate-400 font-medium"></span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-200"><Check size={20} className="text-blue-400" /> All Premium Materials (Glass, Neon)</li>
            <li className="flex items-center gap-3 text-slate-200"><Check size={20} className="text-blue-400" /> AI Palette Generation</li>
            <li className="flex items-center gap-3 text-slate-200"><Check size={20} className="text-blue-400" /> High-Res PNG & PDF Exports</li>
            <li className="flex items-center gap-3 text-slate-500"><X size={20} /> <span className="line-through">NFC Sync & Analytics</span></li>
          </ul>
          <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg transition-all">Upgrade to Pro</button>
        </motion.div>

        {/* Enterprise Tier */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <div className="text-4xl font-extrabold text-white mb-6">Rs.499<span className="text-lg text-slate-500 font-medium"></span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-300"><Check size={20} className="text-blue-500" /> Everything in Pro</li>
            <li className="flex items-center gap-3 text-slate-300"><Check size={20} className="text-blue-500" /> Real-time Analytics Dashboard</li>
            <li className="flex items-center gap-3 text-slate-300"><Check size={20} className="text-blue-500" /> NFC Sharing Support</li>
            <li className="flex items-center gap-3 text-slate-300"><Check size={20} className="text-blue-500" /> Custom 3D Model Uploads</li>
          </ul>
          <button className="w-full py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-all">Contact Sales</button>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
