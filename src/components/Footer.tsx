import React from 'react';
import { Cpu, MapPin, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Col 1: Club Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-space font-black text-xl text-white">AISA UiTM JASIN</span>
                <span className="text-[10px] text-slate-400 block">
                  Artificial Intelligence Student Association
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              Persatuan pelajar di bawah naungan Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM), Universiti Teknologi MARA Cawangan Melaka Kampus Jasin.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Kampus Jasin, 77300 Merlimau, Melaka, Malaysia</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 mb-4">
              Pautan Pantas
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#hero" className="hover:text-cyan-400 transition-colors">
                  Laman Utama
                </a>
              </li>
              <li>
                <a href="#organization" className="hover:text-cyan-400 transition-colors">
                  Carta Organisasi Exco
                </a>
              </li>
              <li>
                <a href="#hebahan" className="hover:text-cyan-400 transition-colors">
                  Hebahan & Pertandingan
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-cyan-400 transition-colors">
                  Arkib Aktiviti Lepas
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" /> Portal Kemas Kini Exco
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cloudflare & Tech Badges */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 mb-4">
              Infrastruktur Awan
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block text-[11px] font-mono-code">
                  ⚡ CLOUDFLARE PAGES & D1
                </span>
                <span className="text-[10px] text-slate-400">
                  Zero Cold Start • Global Edge CDN • Serverless Database
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono-code">
                Dihoskan dengan latensi minimum di edge node Cloudflare Kuala Lumpur & rantau Asia.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AISA UiTM Melaka Kampus Jasin. Hak Cipta Terpelihara.</p>
          <p className="flex items-center gap-1">
            Dibina dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk Komuniti AI Malaysia
          </p>
        </div>
      </div>
    </footer>
  );
};
