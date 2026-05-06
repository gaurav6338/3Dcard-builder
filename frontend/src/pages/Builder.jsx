import React from 'react';
import CanvasView from '../components/CanvasView';
import CardEditor from '../components/CardEditor';

const Builder = () => {
  return (
    <main className="w-full flex flex-col relative min-h-[calc(100vh-73px)]">
      {/* Top Section: Majestic Hero 3D Canvas */}
      <div className="w-full h-[55vh] border-b border-white/10 relative bg-gradient-to-b from-[#020617] to-[#0a0f1f]">
        <CanvasView />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400 text-xs sm:text-sm bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/5 pointer-events-none whitespace-nowrap">
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Bottom Section: The Control Deck */}
      <div className="w-full flex-1 bg-[#0a0f1f]">
        <div className="max-w-[1400px] mx-auto py-12 px-6 sm:px-12">
          <CardEditor />
        </div>
      </div>
    </main>
  );
};

export default Builder;
