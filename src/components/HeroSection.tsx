import React from 'react';
import { Announcement } from '../types';
import { Bell, Sparkles, PlayCircle, ArrowRight, Calendar, MapPin, Clock, Award, Users, ShieldCheck, ChevronRight, Flame } from 'lucide-react';

interface HeroSectionProps {
  latestAnnouncement?: Announcement;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ latestAnnouncement, onOpenVideo }) => {
  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-purple-50/30 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Urgent Notice Flash Ticker */}
        {latestAnnouncement && (
          <div className="mb-8">
            <a
              href="#hebahan"
              className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 hover:border-purple-300 hover:bg-purple-100/70 transition-all text-xs text-purple-950 font-medium shadow-xs group"
            >
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-700 text-white font-bold text-[10px] font-mono-code uppercase tracking-wide">
                <Bell className="w-3 h-3 animate-bounce" /> Terkini
              </span>
              <span className="font-semibold text-slate-800 line-clamp-1">
                {latestAnnouncement.title}
              </span>
              <span className="text-purple-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto sm:ml-2">
                <span>Baca Notis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Campus & Club Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono-code text-slate-700 mb-6 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>UiTM CAWANGAN MELAKA • KAMPUS JASIN</span>
              <span className="text-slate-300">|</span>
              <span className="text-purple-800 font-bold">FSKM & FPA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-space tracking-tight leading-[1.12] mb-6">
              Menerajui Revolusi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-indigo-800 to-amber-700">
                Kecerdasan Buatan
              </span>{' '}
              & Agroteknologi Pintar
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8 font-normal">
              Persatuan rasmi penggerak kemahiran AI, sains data, keselamatan rangkaian, dan teknologi pertanian pintar. Terbuka kepada seluruh mahasiswa semua kursus di UiTM Melaka Kampus Jasin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <a
                href="#hebahan"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-sm font-space shadow-sm hover:shadow transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                <span>LIHAT HEBAHAN & NOTIS RASMI</span>
              </a>

              <a
                href="#join-us"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm font-space shadow-xs hover:border-slate-400 transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>DAFTAR AHLI BARU</span>
              </a>

              <button
                onClick={onOpenVideo}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-slate-600 hover:text-purple-800 text-sm font-bold font-space transition-colors hover:bg-purple-50"
                title="Tonton video pengenalan 15 saat"
              >
                <PlayCircle className="w-5 h-5 text-purple-800" />
                <span>Teaser 15s</span>
              </button>
            </div>

            {/* Clean Statistics Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 w-full max-w-lg">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-space">
                  350+
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                  <Users className="w-3.5 h-3.5 text-purple-700" /> Ahli Berdaftar
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-purple-800 font-space">
                  15+
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Juara Hackathon
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-indigo-700 font-space">
                  100%
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> D1 Cloudflare SQL
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Latest Notice Spotlight Card (Right on the First Page!) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {latestAnnouncement ? (
              <div className="w-full max-w-md bg-white rounded-3xl p-5 border border-slate-200 shadow-lg shadow-purple-900/5 hover:shadow-xl transition-shadow flex flex-col">
                {/* Header Banner */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-purple-100 text-purple-900 border border-purple-200">
                      {latestAnnouncement.category}
                    </span>
                    {latestAnnouncement.isUrgent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <Flame className="w-3 h-3 text-amber-600" /> PENTING
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono-code font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-700" /> {latestAnnouncement.date}
                  </span>
                </div>

                {/* Banner Photo */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 mb-4 group">
                  <img
                    src={latestAnnouncement.bannerUrl}
                    alt={latestAnnouncement.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-purple-900 shadow-xs">
                    Hebahan Pilihan
                  </div>
                </div>

                {/* Notice Details */}
                <h3 className="text-base font-bold text-slate-900 font-space line-clamp-2 mb-2 leading-snug">
                  {latestAnnouncement.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {latestAnnouncement.description}
                </p>

                {/* Venue & Time if available */}
                {(latestAnnouncement.location || latestAnnouncement.eventTime) && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 space-y-1 text-[11px] text-slate-600">
                    {latestAnnouncement.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span className="truncate">{latestAnnouncement.location}</span>
                      </div>
                    )}
                    {latestAnnouncement.eventTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span>Masa: {latestAnnouncement.eventTime}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Action Button */}
                <a
                  href={latestAnnouncement.registrationLink || '#hebahan'}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs text-center font-space shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Daftar / Lihat Butiran Notis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center">
                <Bell className="w-10 h-10 text-purple-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-space mb-1">
                  Hebahan Terkini AISA
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Sila layari bahagian notis rasmi untuk aktiviti dan pengumuman terkini.
                </p>
                <a
                  href="#hebahan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-800 text-white text-xs font-bold"
                >
                  <span>Lihat Semua Notis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
