import React, { useState } from 'react';
import { Gamepad2, PlayCircle, ShieldCheck, LogIn, Menu, X, Cpu, Moon, Sun, Crown } from 'lucide-react';
import { WebThemeMode } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenGame: () => void;
  onOpenVideo: () => void;
  onOpenAdminPortal: () => void;
  themeMode: WebThemeMode;
  onThemeChange: (mode: WebThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onToggleAdmin,
  onOpenGame,
  onOpenVideo,
  onOpenAdminPortal,
  themeMode,
  onThemeChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 transition-colors">
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

          {/* Desktop Nav Links (Formal Academic Register) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">
              Laman Utama
            </a>
            <a href="#organization" className="hover:text-cyan-400 transition-colors">
              Carta Organisasi & Jawatankuasa
            </a>
            <a href="#hebahan" className="hover:text-cyan-400 transition-colors">
              Hebahan Rasmi & Inovasi
            </a>
            <a href="#activities" className="hover:text-cyan-400 transition-colors">
              Arkib Aktiviti
            </a>
            <a href="#join-us" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Pendaftaran Keahlian</span>
            </a>
          </div>

          {/* Action CTAs + 3-Mode Theme Selector */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* 3-Mode Theme Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1" title="Pilih Tema Laman Web">
              <button
                onClick={() => onThemeChange('cyber_dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-bold transition-all ${
                  themeMode === 'cyber_dark'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mod Gelap Cyber (Asal)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Gelap</span>
              </button>

              <button
                onClick={() => onThemeChange('soft_light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-bold transition-all ${
                  themeMode === 'soft_light'
                    ? 'bg-slate-200 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mod Cerah Lembut (Warm Slate Ambient - Bukan Putih Menyilau)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Cerah</span>
              </button>

              <button
                onClick={() => onThemeChange('uitm_royal')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-bold transition-all ${
                  themeMode === 'uitm_royal'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mod Diraja UiTM (Ungu Diraja & Emas Korporat)"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Diraja</span>
              </button>
            </div>

            {/* Video Teaser Button */}
            <button
              onClick={onOpenVideo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 text-slate-200 hover:text-white text-xs font-bold font-space transition-all group"
              title="Tonton Video Pengenalan 15 Saat"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Teaser 15s</span>
            </button>

            {/* AI Interactive Game */}
            <button
              onClick={onOpenGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs font-bold font-space transition-all group"
              title="Buka Modul Simulasi & Permainan Pendidikan AI"
            >
              <Gamepad2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span>Modul Game AI</span>
            </button>

            {/* Admin / Exco Portal Toggle */}
            {isAdmin ? (
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 p-1 rounded-xl">
                <button
                  onClick={onOpenAdminPortal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black font-space hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Portal Exco
                </button>
                <button
                  onClick={onToggleAdmin}
                  className="px-2 py-1 text-[10px] text-slate-400 hover:text-white font-mono-code"
                  title="Log Keluar Sesi Admin"
                >
                  Log Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onToggleAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono-code transition-colors"
                title="Log masuk untuk kemas kini data rasmi AISA"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" /> Log Masuk Exco
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
          {/* Mobile Theme Selector */}
          <div className="pb-3 border-b border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono-code font-bold uppercase block mb-1.5">
              PILIH TEMA PAPARAN LAMAN WEB:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onThemeChange('cyber_dark')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-mono-code font-bold ${
                  themeMode === 'cyber_dark'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Gelap
              </button>
              <button
                onClick={() => onThemeChange('soft_light')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-mono-code font-bold ${
                  themeMode === 'soft_light'
                    ? 'bg-slate-200 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Cerah
              </button>
              <button
                onClick={() => onThemeChange('uitm_royal')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-mono-code font-bold ${
                  themeMode === 'uitm_royal'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                <Crown className="w-3.5 h-3.5" /> Diraja
              </button>
            </div>
          </div>

          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Laman Utama
          </a>
          <a
            href="#organization"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Carta Organisasi & Jawatankuasa
          </a>
          <a
            href="#hebahan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Hebahan Rasmi & Inovasi
          </a>
          <a
            href="#activities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Arkib Aktiviti Lepas
          </a>
          <a
            href="#join-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-cyan-400 py-1.5"
          >
            ⚡ Pendaftaran Keahlian Rasmi
          </a>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVideo();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold font-space"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" /> Tonton Video Pengenalan 15s
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGame();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold font-space"
            >
              <Gamepad2 className="w-4 h-4" /> Buka Modul Permainan AI (2 Games)
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
              <ShieldCheck className="w-4 h-4" /> {isAdmin ? 'Buka Portal Pengurusan Exco' : 'Log Masuk Portal Pengurusan Exco'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
