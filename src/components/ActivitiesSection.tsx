import React, { useState } from 'react';
import { Activity } from '../types';
import { History, Calendar, Users, Award, Image as ImageIcon, X, Cpu, MapPin } from 'lucide-react';

interface ActivitiesSectionProps {
  activities: Activity[];
  isAdmin: boolean;
  onAddNew: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities, isAdmin, onAddNew }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section id="activities" className="py-20 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-mono-code font-bold mb-3">
              <History className="w-3.5 h-3.5 text-purple-700" /> REKOD AKTIVITI & SHOWCASE (1-4 GAMBAR)
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-space tracking-tight">
              Arkib Aktiviti & <span className="text-purple-800">Bengkel Terdahulu</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl">
              Sorotan penganjuran bengkel AI, hackathon tanpa henti, dan pencapaian projek mahasiswa AISA UiTM Cawangan Melaka Kampus Jasin.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onAddNew}
              className="px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space transition-all cursor-pointer shadow-md"
            >
              + TAMBAH REKOD AKTIVITI (1-4 GAMBAR)
            </button>
          )}
        </div>

        {/* Activities Timeline / Cards */}
        <div className="space-y-8">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 flex flex-col lg:flex-row gap-8 items-center transition-all"
            >
              {/* Event Cover / Gallery Mini-Grid (Up to 4 Pictures) */}
              <div className="w-full lg:w-1/2 flex flex-col gap-3">
                <div
                  onClick={() => setSelectedPhoto(act.coverImage)}
                  className="relative h-64 w-full rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200 shadow-xs"
                >
                  <img
                    src={act.coverImage}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-white/90 text-slate-900 text-xs font-mono-code flex items-center gap-1.5 shadow-md">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-700" /> Lihat Gambar Penuh
                    </span>
                  </div>
                </div>

                {/* Sub-gallery thumbnails (Slots 2, 3, 4) */}
                {act.gallery && act.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {act.gallery.map((thumb, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPhoto(thumb)}
                        className="h-20 rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:border-purple-400 transition-transform hover:scale-105 shadow-xs"
                      >
                        <img src={thumb} alt={`Galeri ${idx + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-purple-50 text-purple-900 border border-purple-200">
                      {act.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono-code text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-purple-700" /> {act.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono-code text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                      <Users className="w-3.5 h-3.5 text-emerald-700" /> {act.attendeesCount} Peserta
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 font-space mb-2 leading-snug">
                    {act.title}
                  </h3>

                  {/* AI Research Field & Location */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {act.aiField && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code bg-purple-50 border border-purple-200 text-purple-900">
                        <Cpu className="w-3 h-3 text-purple-700" /> {act.aiField}
                      </span>
                    )}
                    {act.location && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code bg-slate-100 border border-slate-200 text-slate-700">
                        <MapPin className="w-3 h-3 text-purple-700" /> {act.location}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {act.summary}
                  </p>
                </div>

                {/* Output / Pencapaian Utama Banner */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono-code text-amber-900 block uppercase font-bold">
                      OUTPUT / HASIL PROJEK:
                    </span>
                    <span className="text-xs font-bold text-amber-950">{act.highlightText}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
          >
            <div
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 text-white z-10 hover:bg-slate-900"
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
