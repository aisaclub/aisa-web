import React, { useState } from 'react';
import { Sparkles, Gamepad2, PlayCircle, ShieldCheck, LogIn, Menu, X, Cpu } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenGame: () => void;
  onOpenVideo: () => void;
  onOpenAdminPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onToggleAdmin,
  onOpenGame,
  onOpenVideo,
  onOpenAdminPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-space font-black text-xl tracking-wider text-white">
                  AISA
                </span>
                <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  UiTM JASIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-tight block">
                Artificial Intelligence Student Association
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">
              Utama
            </a>
            <a href="#organization" className="hover:text-cyan-400 transition-colors">
              Carta Organisasi
            </a>
            <a href="#hebahan" className="hover:text-cyan-400 transition-colors">
              Hebahan & Pertandingan
            </a>
            <a href="#activities" className="hover:text-cyan-400 transition-colors">
              Aktiviti Lepas
            </a>
            <a href="#join-us" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Daftar Ahli
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* 15s Teaser Video Button */}
            <button
              onClick={onOpenVideo}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 text-slate-200 hover:text-white text-xs font-bold font-space transition-all group"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Teaser 15s</span>
            </button>

            {/* Play Mini Game Button */}
            <button
              onClick={onOpenGame}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs font-bold font-space transition-all group"
            >
              <Gamepad2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span>Main Game AI</span>
            </button>

            {/* Admin Mode Toggle / Open Portal */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 p-1 rounded-xl">
                <button
                  onClick={onOpenAdminPortal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black font-space hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Portal Exco
                </button>
                <button
                  onClick={onToggleAdmin}
                  className="px-2 py-1 text-[10px] text-slate-400 hover:text-white font-mono-code"
                  title="Log Keluar Admin"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onToggleAdmin}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono-code transition-colors"
                title="Log masuk untuk kemas kini carta atau pos hebahan"
              >
                <LogIn className="w-3.5 h-3.5" /> Exco Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-4 space-y-3 animate-fadeIn">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-2"
          >
            Utama
          </a>
          <a
            href="#organization"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-2"
          >
            Carta Organisasi
          </a>
          <a
            href="#hebahan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-2"
          >
            Hebahan & Pertandingan
          </a>
          <a
            href="#activities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-2"
          >
            Aktiviti Lepas
          </a>
          <a
            href="#join-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-cyan-400 py-2"
          >
            ⚡ Daftar Ahli (Join Us)
          </a>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVideo();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold font-space"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" /> Tonton Teaser 15s
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGame();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold font-space"
            >
              <Gamepad2 className="w-4 h-4" /> Main Game AI (Epoch Rush)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdmin) {
                  onOpenAdminPortal();
                } else {
                  onToggleAdmin();
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-indigo-300 text-xs font-mono-code"
            >
              <ShieldCheck className="w-4 h-4" /> {isAdmin ? 'Buka Portal Exco' : 'Log Masuk Exco (Admin)'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
