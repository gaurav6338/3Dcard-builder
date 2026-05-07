import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { loginUser, registerUser, fetchMyCard } from '../api';
import { useCardStore } from '../store';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setAuth, setCardData } = useCardStore();

  const formatAuthError = (err) => {
    const message = err?.message || 'An unexpected error occurred. Please try again.';
    if (message.includes('Unable to reach backend') || message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return 'Unable to reach the backend. Please check your deployment and try again.';
    }
    return message;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (isLogin) {
        data = await loginUser(formData.email, formData.password);
      } else {
        data = await registerUser(formData.name, formData.email, formData.password);
      }
      
      setAuth(data.user, data.token);
      
      // Fetch user's card data if it exists
      try {
        const card = await fetchMyCard();
        if (card && card._id) {
          setCardData(card);
        }
      } catch (err) {
        console.log('No existing card found for user, using defaults.');
      }

      onClose();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#0a0f1c] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl overflow-hidden"
          >
            {/* Background glowing orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/20 blur-[60px] pointer-events-none" />

            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
              <X size={20} />
            </button>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-slate-400 text-sm mb-6">
                {isLogin ? 'Log in to save your 3D visiting card.' : 'Sign up to build your 3D portfolio.'}
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg text-sm text-center font-medium">
                    {error}
                  </div>
                )}
                {!isLogin && (
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 mt-4 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {isLogin ? 'Log In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
