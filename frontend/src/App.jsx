import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import ExportPanel from './components/ExportPanel';
import Builder from './pages/Builder';
import Pricing from './pages/Pricing';
import Home from './pages/Home';
import ViewCard from './pages/ViewCard';
import { LogIn, Hexagon, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { useCardStore } from './store';
import { fetchMyCard } from './api';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { user, token, logout, setCardData } = useCardStore();

  useEffect(() => {
    if (token) {
      fetchMyCard().then(card => {
        if (card && card._id) setCardData(card);
      }).catch(err => console.log('Could not fetch saved card on load'));
    }
  }, [token, setCardData]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      
      <Router>
        {/* Global Navigation Bar */}
        <header className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter drop-shadow-lg">
            <Hexagon className="text-blue-500" size={28} />
            <span><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">3D</span>Builder</span>
          </Link>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <Link to="/build" className="hover:text-white transition-colors">Builder</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-2 text-sm text-slate-300 font-medium">
                <UserIcon size={16} className="text-blue-400" />
                {user.name}
              </span>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 px-3 py-2 rounded-full transition-all text-sm font-semibold hover:bg-red-500/10"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 rounded-full transition-all text-sm font-semibold hover:bg-white/5"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-sm font-semibold"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Export & Print</span>
          </button>
        </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<Builder />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/view/:id" element={<ViewCard />} />
        </Routes>
      </Router>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ExportPanel isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}

export default App;
