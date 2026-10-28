import React from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { Sparkles, Gamepad2, PlayCircle, ArrowRight, ShieldCheck, Terminal, Award, Users, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onOpenGame: () => void;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenGame, onOpenVideo }) => {
  const handleShockwave = () => {
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.5, x: 0.75 },
      colors: ['#6366f1', '#06b6d4', '#a855f7'],
    });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Campus & Club Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md mb-6 shadow-lg shadow-indigo-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono-code font-bold text-cyan-300">
                UiTM CAWANGAN MELAKA • KAMPUS JASIN
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-indigo-300 font-semibold">FSKM & FPA • TERBUKA SEMUA KURSUS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-space tracking-tight leading-[1.08] mb-6">
              Artificial Intelligence{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 drop-shadow-sm">
                Student Association
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              Wadah rasmi penggerak inovasi kecerdasan buatan, sains komputer, sistem maklumat dan teknologi pintar (<strong className="text-cyan-300">Computing, Networks & Smart Agrotech</strong>) — terbuka kepada seluruh mahasiswa semua kursus di UiTM Melaka Kampus Jasin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              {/* Play 15s Teaser Video */}
              <button
                onClick={onOpenVideo}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm font-space shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <PlayCircle className="w-5 h-5 text-white" />
                <span>TONTON PENGENALAN RASMI (15S)</span>
              </button>

              {/* Play Mini-Game */}
              <button
                onClick={onOpenGame}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/40 text-cyan-300 hover:text-white font-bold text-sm font-space hover:border-cyan-400 transition-all group"
              >
                <Gamepad2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>MODUL SIMULASI & GAME AI</span>
              </button>
            </div>

            {/* Interactive Stats Banner */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-lg">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-white font-space">
                  350+
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono-code mt-0.5">
                  <Users className="w-3 h-3 text-indigo-400" /> Ahli Aktif
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-cyan-400 font-space">
                  15+
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono-code mt-0.5">
                  <Award className="w-3 h-3 text-cyan-400" /> Juara Hackathon
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-purple-400 font-space">
                  40+
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono-code mt-0.5">
                  <Code2 className="w-3 h-3 text-purple-400" /> Projek AI
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Three.js Neural Core Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* 3D Canvas Box */}
            <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden glass-panel border border-indigo-500/30 p-2 shadow-2xl glow-indigo group">
              <ThreeCanvas onCoreClick={handleShockwave} />

              {/* Floating badges around the 3D core */}
              <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 backdrop-blur-md flex items-center gap-2 pointer-events-none">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-mono-code text-slate-200">
                  Model: DeepSeek & Llama 3
                </span>
              </div>

              <div className="absolute bottom-10 right-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 backdrop-blur-md flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono-code text-slate-200">
                  Edge Cloudflare Host: Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
