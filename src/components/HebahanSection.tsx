import React, { useState } from 'react';
import { Announcement } from '../types';
import { Bell, Calendar, ExternalLink, Flame, Plus, Trash2, ChevronRight, MapPin, Clock, Image as ImageIcon, X } from 'lucide-react';

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
    <section id="hebahan" className="py-20 relative bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-mono-code font-bold mb-3">
              <Bell className="w-3.5 h-3.5 text-purple-700 animate-bounce" /> HEBAHAN & NOTIS TERKINI (KAMPUS JASIN)
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-space tracking-tight">
              Hebahan, Pertandingan & <span className="text-purple-800">Peluang Emas</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl">
              Maklumat terkini pertandingan hackathon, bengkel teknikal khas, dan pengumuman rasmi daripada kepimpinan AISA UiTM Cawangan Melaka Kampus Jasin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onAddNew}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space shadow-md hover:shadow-lg transition-all cursor-pointer"
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
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-purple-800 hover:border-purple-300'
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
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 flex flex-col transition-all duration-300"
            >
              {/* Banner Image Container with 1 or 2 images support */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.bannerUrl}
                  alt={item.title}
                  onClick={() => setActiveImageModal({ url: item.bannerUrl, title: item.title })}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-white/95 text-purple-900 border border-slate-200 shadow-sm">
                    {item.category}
                  </span>
                  {item.isUrgent && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-rose-600 text-white shadow-sm animate-pulse">
                      <Flame className="w-3 h-3" /> PENTING
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {item.bannerUrl2 && (
                    <span
                      onClick={() => setActiveImageModal({ url: item.bannerUrl2!, title: `${item.title} (Infografik 2)` })}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-white/95 text-indigo-900 border border-indigo-200 shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3 text-indigo-700" /> 2 Gambar
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                      item.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.status === 'Coming Soon'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Date & Deadline info overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-code text-white">
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-3 h-3 text-purple-300" />
                    <span>{item.date}</span>
                  </div>
                  {item.deadline && (
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-sm text-amber-300 font-bold">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>Tutup: {item.deadline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2nd Image Thumbnail Bar (If available) */}
              {item.bannerUrl2 && (
                <div className="px-5 pt-3 flex items-center gap-2 bg-slate-50 border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono-code text-slate-500">Gambar Tambahan:</span>
                  <div
                    onClick={() => setActiveImageModal({ url: item.bannerUrl2!, title: `${item.title} (Gambar 2)` })}
                    className="w-10 h-10 rounded-lg overflow-hidden border border-purple-200 cursor-pointer hover:scale-105 transition-transform shadow-xs"
                  >
                    <img src={item.bannerUrl2} alt="Thumb 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-800 transition-colors line-clamp-2 mb-2 font-space">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Location & Time Pills if available */}
                  {(item.location || item.eventTime) && (
                    <div className="mb-4 flex flex-wrap gap-2 text-[10px] font-mono-code text-slate-600">
                      {item.location && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          <MapPin className="w-3 h-3 text-purple-700" /> {item.location}
                        </span>
                      )}
                      {item.eventTime && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          <Clock className="w-3 h-3 text-indigo-700" /> {item.eventTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  {item.registrationLink ? (
                    <a
                      href={item.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold font-space transition-colors shadow-xs"
                    >
                      <span>DAFTAR SEKARANG</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : item.status === 'Open' ? (
                    <a
                      href="#join-us"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold font-space transition-colors shadow-xs"
                    >
                      <span>DAFTAR PENYERTAAN</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Notis Rasmi Kelab</span>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
          >
            <div
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 text-white z-10 hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={activeImageModal.url} alt={activeImageModal.title} className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-800 font-space font-bold">
                {activeImageModal.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
