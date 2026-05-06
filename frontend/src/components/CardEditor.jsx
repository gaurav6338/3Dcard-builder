import React, { useState, useEffect, useRef } from 'react';
import { useCardStore } from '../store';
import { motion } from 'framer-motion';
import AIButton from './AIButton';
import FloatingInput from './FloatingInput';
import { saveCardToCloud, fetchMyCard } from '../api';
import { Loader2 } from 'lucide-react';

import interFont from '@fontsource/inter/files/inter-latin-400-normal.woff';
import playfairFont from '@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff';
import spaceMonoFont from '@fontsource/space-mono/files/space-mono-latin-400-normal.woff';
import robotoFont from '@fontsource/roboto/files/roboto-latin-400-normal.woff';
import merriweatherFont from '@fontsource/merriweather/files/merriweather-latin-400-normal.woff';
import outfitFont from '@fontsource/outfit/files/outfit-latin-400-normal.woff';

const PRESET_COLORS = [
  { name: 'Cyberpunk', c1: '#f43f5e', c2: '#06b6d4', font: spaceMonoFont, style: 'neon' },
  { name: 'Corporate', c1: '#1e293b', c2: '#334155', font: interFont, style: 'minimal' },
  { name: 'Ocean', c1: '#0ea5e9', c2: '#3b82f6', font: interFont, style: 'glass' },
  { name: 'Elegant', c1: '#fcd34d', c2: '#f59e0b', font: playfairFont, style: 'glass' },
  { name: 'Sunset', c1: '#f97316', c2: '#ec4899', font: outfitFont, style: 'holographic' },
  { name: 'Forest', c1: '#10b981', c2: '#064e3b', font: merriweatherFont, style: 'minimal' },
  { name: 'Midnight', c1: '#0f172a', c2: '#3b0764', font: robotoFont, style: 'metallic' },
  { name: 'Luxury', c1: '#000000', c2: '#eab308', font: playfairFont, style: 'metallic' },
];

const FONTS = [
  { name: 'Inter', url: interFont },
  { name: 'Playfair', url: playfairFont },
  { name: 'Space Mono', url: spaceMonoFont },
  { name: 'Roboto', url: robotoFont },
  { name: 'Merriweather', url: merriweatherFont },
  { name: 'Outfit', url: outfitFont },
];

const CardEditor = () => {
  const { cardData, updateCard, user, setCardData } = useCardStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState('ready');
  const [lastSyncAt, setLastSyncAt] = useState('');
  const [autoSync, setAutoSync] = useState(() => {
    const stored = localStorage.getItem('autoSync');
    return stored ? JSON.parse(stored) : true;
  });
  const [isReloading, setIsReloading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const syncDebounceRef = useRef(null);
  const skipAutoSaveRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('autoSync', JSON.stringify(autoSync));
  }, [autoSync]);

  useEffect(() => {
    if (!autoSync || !user) return;
    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    setSyncStatus('pending');
    if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);

    syncDebounceRef.current = setTimeout(async () => {
      try {
        const savedCard = await saveCardToCloud(cardData);
        skipAutoSaveRef.current = true;
        setCardData(savedCard);
        setSyncStatus('synced');
        setSaveStatus('success');
        setLastSyncAt(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus(null), 2500);
      } catch (err) {
        console.error(err);
        setSyncStatus('error');
      }
    }, 900);

    return () => clearTimeout(syncDebounceRef.current);
  }, [cardData, autoSync, user, initialLoad, setCardData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCard({ [name]: value });
  };

  const handleToggleField = (field) => {
    updateCard({
      visibleFields: {
        ...cardData.visibleFields,
        [field]: !cardData.visibleFields?.[field]
      }
    });
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please login first to save your design.');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);
    try {
      const savedCard = await saveCardToCloud(cardData);
      setCardData(savedCard);
      setSaveStatus('success');
      setSyncStatus('synced');
      setLastSyncAt(new Date().toLocaleTimeString());
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert(err.message);
      setSyncStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReloadFromCloud = async () => {
    if (!user) {
      alert('Login first to reload from cloud.');
      return;
    }

    setIsReloading(true);
    setSyncStatus('reloading');
    try {
      const cloudCard = await fetchMyCard();
      if (cloudCard && cloudCard._id) {
        skipAutoSaveRef.current = true;
        setCardData(cloudCard);
        setSaveStatus('reloaded');
        setSyncStatus('synced');
        setLastSyncAt(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSyncStatus('empty');
        alert('No saved cloud card found yet. Save your design first.');
      }
    } catch (err) {
      alert(err.message);
      setSyncStatus('error');
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-12 w-full pb-48">
      {/* Left Column: Form Details */}
      <div className="flex-1 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Customize Card</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Fill in your details below to update the 3D preview in real-time.
          </p>
        </motion.div>

        {/* Step 1: Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="text-2xl font-bold text-white">Your Details</h2>
          </div>

          <div className="space-y-6">
            <FloatingInput label="Full Name" name="name" value={cardData.name} onChange={handleChange} />
            <FloatingInput label="Designation" name="designation" value={cardData.designation} onChange={handleChange} />
            <FloatingInput label="Company" name="company" value={cardData.company} onChange={handleChange} />
          </div>
        </motion.div>

        {/* Step 2: Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="text-2xl font-bold text-white">Contact Info</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FloatingInput label="Phone" name="phone" value={cardData.phone} onChange={handleChange} />
            <FloatingInput label="Email" name="email" value={cardData.email} onChange={handleChange} type="email" />
            <div className="sm:col-span-2">
              <FloatingInput label="Website" name="website" value={cardData.website} onChange={handleChange} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
            <h2 className="text-2xl font-bold text-white">Brand Details</h2>
          </div>

          <div className="space-y-6">
            <FloatingInput label="Tagline" name="tagline" value={cardData.tagline} onChange={handleChange} />
            <FloatingInput label="Location" name="location" value={cardData.location} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FloatingInput label="LinkedIn" name="linkedin" value={cardData.linkedin} onChange={handleChange} />
            <FloatingInput label="Twitter" name="twitter" value={cardData.twitter} onChange={handleChange} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-sm">4</div>
            <h2 className="text-2xl font-bold text-white">Visible Sections</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'tagline', label: 'Tagline' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'website', label: 'Website' },
              { key: 'location', label: 'Location' },
              { key: 'linkedin', label: 'LinkedIn' },
              { key: 'twitter', label: 'Twitter' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 cursor-pointer hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={cardData.visibleFields?.[key] ?? true}
                  onChange={() => handleToggleField(key)}
                  className="h-4 w-4 rounded border border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">{label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Cloud Sync</p>
                <p className="text-slate-400 text-xs">Save, reload and share your card from the cloud.</p>
              </div>
              <label className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 cursor-pointer transition-colors hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={() => setAutoSync((prev) => !prev)}
                  className="w-4 h-4 rounded bg-slate-800 border border-slate-700"
                />
                <span className="text-slate-300 text-sm">Auto</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleReloadFromCloud}
                disabled={isReloading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-700/80 border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600/80 transition-colors disabled:opacity-50"
              >
                {isReloading ? 'Reloading...' : 'Reload from Cloud'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-500 hover:to-purple-500 transition-colors disabled:opacity-50"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save to Cloud'}
              </button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">Status</p>
              <p className="text-sm font-semibold text-white">
                {user ? (syncStatus === 'error' ? 'Sync error' : syncStatus === 'pending' ? 'Pending changes' : syncStatus === 'synced' ? 'Cloud synced' : syncStatus === 'reloading' ? 'Reloading' : 'Ready') : 'Login to sync'}
              </p>
              {lastSyncAt && <p className="text-xs text-slate-500 mt-2">Last sync at {lastSyncAt}</p>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Aesthetics & Styles */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex-1 space-y-8 bg-slate-900/20 p-8 rounded-3xl border border-white/5 shadow-2xl relative"
      >
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div className="w-8 h-8 rounded-full bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-sm">4</div>
          <h2 className="text-2xl font-bold text-white">Aesthetics</h2>
        </div>

        {/* Recommended Preset Hub */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Smart Recommendations</label>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateCard({ color1: preset.c1, color2: preset.c2, font: preset.font, style: preset.style })}
                className="flex items-center justify-between bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 hover:bg-white/5 hover:border-white/20 transition-all group"
              >
                <span className="text-sm font-bold text-slate-300 group-hover:text-white">{preset.name}</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: preset.c1 }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: preset.c2 }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">Card Style</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['glass', 'neon', 'minimal', 'holographic', 'metallic', 'wireframe'].map((style) => (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={style}
                onClick={() => updateCard({ style })}
                className={`flex flex-col items-center justify-center py-6 px-2 rounded-2xl capitalize transition-all border ${cardData.style === style
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-900/30 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10 hover:bg-slate-800/50'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full mb-3 shadow-inner ${style === 'glass' ? 'bg-white/10 backdrop-blur-md border border-white/20' :
                  style === 'neon' ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]' :
                    style === 'holographic' ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500' :
                      style === 'metallic' ? 'bg-gradient-to-b from-gray-300 to-gray-500 border border-gray-400' :
                        style === 'wireframe' ? 'bg-transparent border border-white/50 border-dashed' :
                          'bg-slate-800'
                  }`} />
                <span className="font-bold text-sm">{style}</span>
              </motion.button>
            ))}
          </div>
          {cardData.style === 'glass' && (
            <p className="text-slate-500 text-xs mt-4 text-center bg-white/5 py-2 rounded-lg">✨ Glass requires a slightly better GPU to render refractions.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-900/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Primary Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color" name="color1" value={cardData.color1} onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
              />
              <span className="text-base text-slate-300 font-mono font-medium">{cardData.color1}</span>
            </div>
          </div>
          <div className="bg-slate-900/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Accent Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color" name="color2" value={cardData.color2} onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
              />
              <span className="text-base text-slate-300 font-mono font-medium">{cardData.color2}</span>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mt-8">
          <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Typography</label>
          <div className="grid grid-cols-3 gap-3">
            {FONTS.map((font) => (
              <button
                key={font.name}
                onClick={() => updateCard({ font: font.url })}
                className={`py-3 text-sm font-bold rounded-xl transition-all ${cardData.font === font.url ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-white/5 bg-slate-900/30'}`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <AIButton />
        </div>
      </motion.div>

    </div>);
};

export default CardEditor;
