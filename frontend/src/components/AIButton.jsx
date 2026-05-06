import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useCardStore } from '../store';

const AIButton = () => {
  const { updateCard } = useCardStore();
  const [loading, setLoading] = useState(false);

  const generateAIAesthetic = () => {
    setLoading(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const palettes = [
        { color1: '#ff0055', color2: '#00ffee', style: 'neon' },
        { color1: '#00ff88', color2: '#0088ff', style: 'glass' },
        { color1: '#facc15', color2: '#f43f5e', style: 'minimal' },
        { color1: '#a855f7', color2: '#ec4899', style: 'glass' },
        { color1: '#14b8a6', color2: '#6366f1', style: 'neon' }
      ];
      const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
      
      updateCard(randomPalette);
      setLoading(false);
    }, 1500);
  };

  return (
    <button 
      onClick={generateAIAesthetic}
      disabled={loading}
      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-slate-900 border border-purple-500/50 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50"
    >
      <Sparkles size={18} className={loading ? "animate-pulse text-purple-400" : "text-purple-400"} />
      {loading ? 'AI Designing...' : 'AI Auto-Design Palette'}
    </button>
  );
};

export default AIButton;
