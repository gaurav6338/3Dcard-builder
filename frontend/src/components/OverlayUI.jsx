import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const OverlayUI = ({ product, onNext, onPrev, total, current }) => {
  if (!product) return null;

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-16">
      {/* Header */}
      <header className="flex justify-between items-center pointer-events-auto">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-blue-500">3D</span>Showcase
        </div>
        <nav className="flex gap-6 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Products</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </nav>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all text-white">
          <ShoppingCart size={18} />
          <span>Cart</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center">
        <div className="max-w-xl pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 font-light">
                {product.description}
              </p>
              
              <div className="flex items-center gap-6">
                <span className="text-3xl font-semibold text-white">
                  ${product.price.toFixed(2)}
                </span>
                <button 
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  style={{ backgroundColor: product.color }}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="flex justify-between items-end pointer-events-auto">
        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span className="text-white text-2xl">0{current}</span>
          <span className="w-12 h-[1px] bg-slate-600"></span>
          <span>0{total}</span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onPrev}
            className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white/10 hover:border-slate-500 transition-all text-white backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={onNext}
            className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white/10 hover:border-slate-500 transition-all text-white backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OverlayUI;
