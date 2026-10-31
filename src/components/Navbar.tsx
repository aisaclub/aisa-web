import React, { useState } from 'react';
import { Menu, X, Cpu, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
  onOpenAdminPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-800 via-indigo-700 to-amber-500 p-0.5 shadow-md shadow-purple-900/10 group-hover:rotate-3 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-purple-800 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-space font-black text-xl tracking-tight text-slate-900">
                  AISA
                </span>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  UiTM JASIN
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight block">
                Artificial Intelligence Student Association
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#hero" className="hover:text-purple-800 transition-colors">
              Laman Utama
            </a>
            <a href="#hebahan" className="hover:text-purple-800 transition-colors flex items-center gap-1.5 text-purple-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>Hebahan & Notis Terkini</span>
            </a>
            <a href="#activities" className="hover:text-purple-800 transition-colors">
              Arkib Aktiviti
            </a>
            <a href="#organization" className="hover:text-purple-800 transition-colors">
              Carta Organisasi
            </a>
            <a href="#join-us" className="hover:text-purple-800 transition-colors">
              Syarat & Faedah
            </a>
          </div>

          {/* Desktop CTA Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#join-us"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Daftar Keahlian Rasmi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 shadow-lg animate-fadeIn">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100"
          >
            Laman Utama
          </a>
          <a
            href="#hebahan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-purple-800 py-2 border-b border-slate-100 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span>Hebahan & Notis Terkini</span>
          </a>
          <a
            href="#activities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100"
          >
            Arkib Aktiviti Lepas
          </a>
          <a
            href="#organization"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100"
          >
            Carta Organisasi & Penasihat
          </a>
          <a
            href="#join-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100"
          >
            Syarat & Panduan Keahlian
          </a>

          <div className="pt-2">
            <a
              href="#join-us"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Daftar Keahlian Rasmi AISA</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
