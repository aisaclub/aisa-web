import React, { useState } from 'react';
import { Announcement } from '../types';
import { Bell, Calendar, ExternalLink, Flame, Plus, Trash2, Tag, CheckCircle2, ChevronRight, MapPin, Clock, Image as ImageIcon, X } from 'lucide-react';

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
  const [activeImageModal, setActiveImageModal] = useState<{ url: string; title: string } | null>(null);

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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs font-space shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> TAMBAH HEBAHAN (1-2 GAMBAR)
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
              {/* Banner Image Container with 1 or 2 images support */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.bannerUrl}
                  alt={item.title}
                  onClick={() => setActiveImageModal({ url: item.bannerUrl, title: item.title })}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

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

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {item.bannerUrl2 && (
                    <span
                      onClick={() => setActiveImageModal({ url: item.bannerUrl2!, title: `${item.title} (Infografik 2)` })}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-purple-950/80 border border-purple-500/50 text-purple-300 backdrop-blur-md cursor-pointer hover:bg-purple-800/80 transition-colors flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" /> 2 Gambar
                    </span>
                  )}
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

                {/* Date & Deadline info overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-code text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-slate-800">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{item.date}</span>
                  </div>
                  {item.deadline && (
                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-slate-800 text-amber-300">
                      <Clock className="w-3 h-3" />
                      <span>Tutup: <strong>{item.deadline}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2nd Image Thumbnail Bar (If available) */}
              {item.bannerUrl2 && (
                <div className="px-5 pt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono-code text-slate-400">Gambar Tambahan:</span>
                  <div
                    onClick={() => setActiveImageModal({ url: item.bannerUrl2!, title: `${item.title} (Gambar 2)` })}
                    className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/40 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img src={item.bannerUrl2} alt="Thumb 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 font-space">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Location & Time Pills if available */}
                  {(item.location || item.eventTime) && (
                    <div className="mb-4 flex flex-wrap gap-2 text-[10px] font-mono-code text-slate-400">
                      {item.location && (
                        <span className="inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          <MapPin className="w-3 h-3 text-emerald-400" /> {item.location}
                        </span>
                      )}
                      {item.eventTime && (
                        <span className="inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          <Clock className="w-3 h-3 text-indigo-400" /> {item.eventTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                  {item.registrationLink ? (
                    <a
                      href={item.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-space transition-colors"
                    >
                      <span>DAFTAR SEKARANG</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : item.status === 'Open' ? (
                    <a
                      href="#join-us"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-space transition-colors"
                    >
                      <span>DAFTAR PENYERTAAN</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Notis Rasmi</span>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
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

        {/* FULL IMAGE LIGHTBOX MODAL */}
        {activeImageModal && (
          <div
            onClick={() => setActiveImageModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          >
            <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
              <button
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white z-10 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={activeImageModal.url} alt={activeImageModal.title} className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-300 font-space font-bold">
                {activeImageModal.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
