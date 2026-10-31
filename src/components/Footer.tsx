import React from 'react';
import { Cpu, MapPin, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-16 pb-12 relative overflow-hidden text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1: Club Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-indigo-700 to-amber-500 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-purple-800" />
                </div>
              </div>
              <div>
                <span className="font-space font-black text-xl text-slate-900">AISA UiTM JASIN</span>
                <span className="text-[10px] text-slate-500 block">
                  Artificial Intelligence Student Association
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-4">
              Persatuan pelajar di bawah naungan Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM), Universiti Teknologi MARA Cawangan Melaka Kampus Jasin.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono-code">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Kampus Jasin, 77300 Merlimau, Melaka, Malaysia</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-900 mb-4">
              Pautan Pantas
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#hero" className="hover:text-purple-800 transition-colors">
                  Laman Utama
                </a>
              </li>
              <li>
                <a href="#hebahan" className="hover:text-purple-800 transition-colors font-bold text-purple-900">
                  Hebahan & Notis Terkini
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-purple-800 transition-colors">
                  Arkib Aktiviti Lepas
                </a>
              </li>
              <li>
                <a href="#organization" className="hover:text-purple-800 transition-colors">
                  Carta Organisasi Exco
                </a>
              </li>
              <li>
                <a href="#join-us" className="hover:text-purple-800 transition-colors">
                  Pendaftaran Ahli Baru
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Cloudflare & Tech Badges */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-900 mb-4">
              Infrastruktur Awan
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-purple-900 font-bold block text-[11px] font-mono-code">
                  ⚡ CLOUDFLARE PAGES & D1
                </span>
                <span className="text-[10px] text-slate-500">
                  Zero Cold Start • Global Edge CDN • Serverless Database
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono-code">
                Dihoskan dengan latensi minimum di edge node Cloudflare Kuala Lumpur & rantau Asia.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discrete Exco Login Link (Bawah Sekali) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AISA UiTM Melaka Kampus Jasin. Hak Cipta Terpelihara.</p>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <p className="flex items-center gap-1">
              Dibina dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk Komuniti AI UiTM
            </p>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-purple-800 hover:underline transition-colors flex items-center gap-1.5 font-mono-code text-[11px] py-1 px-2 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              title="Akses Portal Pengurusan & Log Masuk Exco AISA"
            >
              <Shield className="w-3.5 h-3.5 text-purple-700" />
              <span>Log Masuk Exco</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
