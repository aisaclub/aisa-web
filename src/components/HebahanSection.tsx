import React, { useState } from 'react';
import { Announcement } from '../types';
import { Bell, Calendar, ExternalLink, Flame, Plus, Trash2, Tag, CheckCircle2, ChevronRight } from 'lucide-react';

interface HebahanSectionProps {
  announcements: Announcement[];
  isAdmin: boolean;
  onAddNew: () => void;
  onDelete: (id: string) => void;
}

export const HebahanSection: React.FC<HebahanSectionProps> = ({
  announcements,
  isAdmin,
  onAddNew,
  onDelete,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Pertandingan', 'Bengkel', 'Hebahan', 'Notis Penting'];

  const filtered =
    selectedCategory === 'Semua'
      ? announcements
      : announcements.filter((a) => a.category === selectedCategory);

  return (
    <section id="hebahan" className="py-20 relative bg-slate-950/40 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code font-semibold mb-3">
              <Bell className="w-3.5 h-3.5 animate-bounce" /> HEBAHAN & NOTIS TERKINI
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-space tracking-tight">
              Pertandingan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Peluang Emas</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
              Daftar pertandingan hackathon, bengkel teknikal khas, dan pengumuman rasmi daripada kepimpinan AISA UiTM Melaka Kampus Jasin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onAddNew}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs font-space shadow-lg shadow-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" /> TAMBAH HEBAHAN BARU
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group glass-panel rounded-3xl overflow-hidden border border-slate-800 flex flex-col transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10"
            >
              {/* Banner Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.bannerUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-slate-950/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
                    {item.category}
                  </span>
                  {item.isUrgent && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-rose-500/80 text-white shadow animate-pulse">
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                      item.status === 'Open'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'Coming Soon'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.deadline && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-mono-code text-slate-300 bg-slate-950/70 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Tutup: <strong className="text-white">{item.deadline}</strong></span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 font-space">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                  {item.status === 'Open' ? (
                    <a
                      href="#join-us"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-space transition-colors"
                    >
                      <span>DAFTAR PENYERTAAN</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Notis Dalaman</span>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Padam Hebahan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
