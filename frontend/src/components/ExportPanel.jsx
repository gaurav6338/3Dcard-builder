import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useCardStore } from '../store';

const ExportPanel = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const { cardData } = useCardStore();
  const shareLink = cardData._id ? `${window.location.origin}/view/${cardData._id}` : '';

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('printable-card-view');
      if (element) {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${cardData.name.replace(/\s+/g, '_')}_Visiting_Card.png`;
        link.href = url;
        link.click();
      }
    } catch (err) {
      console.error(err);
    }
    setDownloading(false);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('printable-card-view');
      if (element) {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${cardData.name.replace(/\s+/g, '_')}_Visiting_Card.pdf`);
      }
    } catch (err) {
      console.error(err);
    }
    setDownloading(false);
  };

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Copy failed');
    }
  };

  const cardStyle = {
    width: '1050px',
    height: '600px',
    backgroundColor: cardData.color1,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: '80px',
    color: cardData.textColor || '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: '24px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Export & Share</h2>

            <div className="flex flex-col items-center mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-slate-400 text-sm mb-4">Scan to view your shared card.</p>
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={shareLink || window.location.origin} size={150} />
              </div>
              <div className="mt-4 w-full flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={shareLink || 'Save to cloud to get a share link'}
                  className="bg-transparent text-xs text-slate-300 w-full outline-none px-2"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!shareLink}
                  className="text-blue-400 hover:text-blue-300 px-2 text-sm font-semibold disabled:opacity-50"
                >
                  {copyStatus || 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDownloadPNG}
                disabled={downloading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <Download size={18} /> PNG
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <FileText size={18} /> PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Off-screen Print View */}
      <div style={{ position: 'fixed', top: '-20000px', left: '-20000px', pointerEvents: 'none' }}>
        <div id="printable-card-view" style={{ backgroundColor: '#ffffff', padding: '60px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
          
          {/* Front Face */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '-1px' }}>{cardData.name}</div>
                <div style={{ fontSize: '28px', color: cardData.style === 'neon' ? '#ffffff' : cardData.color2, fontWeight: '500' }}>{cardData.designation}</div>
              </div>
              <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-1px' }}>{cardData.company}</div>
            </div>
            
            <div style={{ position: 'absolute', bottom: '80px', left: '80px', right: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '26px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.9 }}>
                <div>{cardData.phone}</div>
                <div>{cardData.email}</div>
              </div>
              <div style={{ fontSize: '26px', opacity: 0.9, fontWeight: '500' }}>{cardData.website}</div>
            </div>
          </div>

          {/* Back Face */}
          <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '96px', fontWeight: '900', letterSpacing: '4px' }}>{cardData.company}</div>
          </div>
          
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ExportPanel;
