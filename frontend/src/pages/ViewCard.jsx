import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSharedCard } from '../api';
import { ArrowLeft, Eye, Sparkles } from 'lucide-react';

const ViewCard = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCard = async () => {
      try {
        const data = await fetchSharedCard(id);
        setCard(data);
      } catch (err) {
        setError(err.message || 'Could not load shared card');
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [id]);

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6">
          <ArrowLeft size={18} /> Back to 3D Builder
        </Link>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-400">
              <div className="h-16 w-16 rounded-full border-4 border-blue-500/40 animate-spin" />
              <p>Loading shared card...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-red-400 mb-4">{error}</p>
              <Link to="/build" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-semibold">
                Build your own
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Eye size={18} />
                  <span>{card.views || 0} views</span>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#020617] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                  <div className="space-y-4">
                    <div className="text-5xl font-extrabold tracking-tight text-white">{card.name}</div>
                    <div className="text-xl text-slate-300">{card.designation} at {card.company}</div>
                    <div className="grid gap-3 sm:grid-cols-2 mt-6 text-slate-400 text-sm">
                      <div className="rounded-2xl bg-white/5 p-4 border border-white/5">Phone<br /><span className="text-white font-semibold">{card.phone}</span></div>
                      <div className="rounded-2xl bg-white/5 p-4 border border-white/5">Email<br /><span className="text-white font-semibold">{card.email}</span></div>
                      <div className="rounded-2xl bg-white/5 p-4 border border-white/5 sm:col-span-2">Website<br /><span className="text-white font-semibold">{card.website}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-blue-500/10 px-4 py-3 text-blue-300 text-sm font-semibold">
                  <Sparkles size={18} /> Shared Card
                </div>
                <div className="mt-8 space-y-4 text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Style</p>
                    <p className="mt-2 text-base font-medium text-white capitalize">{card.style}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Primary Gradient</p>
                    <div className="mt-2 h-10 rounded-2xl" style={{ background: `linear-gradient(135deg, ${card.color1}, ${card.color2})` }} />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Details</p>
                    <p className="mt-2 text-sm text-slate-300">A polished profile card that loads instantly from the cloud.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ViewCard;
