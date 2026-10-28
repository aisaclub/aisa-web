import React, { useState } from 'react';
import { Activity } from '../types';
import { History, Calendar, Users, Award, Image as ImageIcon, ChevronRight, X } from 'lucide-react';

interface ActivitiesSectionProps {
  activities: Activity[];
  isAdmin: boolean;
  onAddNew: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities, isAdmin, onAddNew }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section id="activities" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono-code font-semibold mb-3">
              <History className="w-3.5 h-3.5" /> REKOD AKTIVITI & SHOWCASE
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-space tracking-tight">
              Aktiviti <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Terdahulu</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
              Sorotan penganjuran bengkel AI, hackathon tanpa henti, dan lawatan industri ke pusat pengkomputeran berprestasi tinggi.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onAddNew}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-space transition-all"
            >
              + TAMBAH REKOD AKTIVITI
            </button>
          )}
        </div>

        {/* Activities Timeline / Cards */}
        <div className="space-y-8">
          {activities.map((act, index) => (
            <div
              key={act.id}
              className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col lg:flex-row gap-8 items-center transition-all hover:border-purple-500/40"
            >
              {/* Event Cover / Gallery Mini-Grid */}
              <div className="w-full lg:w-1/2 flex flex-col gap-3">
                <div
                  onClick={() => setSelectedPhoto(act.coverImage)}
                  className="relative h-64 w-full rounded-2xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-800"
                >
                  <img
                    src={act.coverImage}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-slate-950/80 text-white text-xs font-mono-code flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Lihat Galeri Penuh
                    </span>
                  </div>
                </div>

                {/* Sub-gallery thumbnails */}
                {act.gallery && act.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {act.gallery.map((thumb, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPhoto(thumb)}
                        className="h-20 rounded-xl overflow-hidden cursor-pointer border border-slate-800/80 hover:border-indigo-400 transition-colors"
                      >
                        <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {act.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono-code text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> {act.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono-code text-slate-400">
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> {act.attendeesCount} Peserta
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white font-space mb-3 leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {act.summary}
                  </p>
                </div>

                {/* Highlight banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono-code text-purple-300 block uppercase">
                      PENCAPAIAN UTAMA:
                    </span>
                    <span className="text-xs font-bold text-white">{act.highlightText}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PHOTO LIGHTBOX MODAL */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          >
            <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white z-10 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedPhoto} alt="Full view" className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
