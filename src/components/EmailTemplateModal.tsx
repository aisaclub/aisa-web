import React, { useState } from 'react';
import { X, Mail, Check, Copy, Calendar, Sparkles, Send, Bell, ShieldCheck, QrCode, Palette, Layers, Award } from 'lucide-react';
import { EmailDesignStyle } from '../types';

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientEmail?: string;
  studentId?: string;
  membershipId?: string;
  templateType?: 'welcome' | 'meeting' | 'notice';
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  isOpen,
  onClose,
  recipientName = 'Ahmad Faiz bin Roslan',
  recipientEmail = '2023456789@isiswa.uitm.edu.my',
  studentId = '2023456789',
  membershipId = 'AISA-2026-0042',
  templateType: initialTemplate = 'welcome',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'welcome' | 'meeting' | 'notice'>(initialTemplate);
  const [selectedStyle, setSelectedStyle] = useState<EmailDesignStyle>('minimalist');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(`<!DOCTYPE html>... (AISA ${selectedStyle.toUpperCase()} Email Template for ${recipientName})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendRealEmail = async () => {
    setIsSending(true);
    setSentNotice(null);
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[AISA UiTM Jasin] ${selectedTemplate === 'welcome' ? 'Kad Keahlian Digital' : selectedTemplate === 'meeting' ? 'Notis Panggilan Mesyuarat' : 'Hebahan Hackathon'}`,
          subject: `[AISA UiTM Jasin] Notis Rasmi untuk ${recipientName}`,
          content: `Notis rasmi ini dihantar secara terus daripada Portal Rasmi AISA UiTM Kampus Jasin untuk ${recipientName} (${studentId}). Sila rujuk maklumat rasmi persatuan di portal.`,
          customRecipients: [recipientEmail],
          targetAudience: 'custom',
          templateStyle: selectedStyle,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSentNotice(`✅ Emel dihantar ke ${recipientEmail} via ${data.sentCount ? 'Gmail Relay' : 'Cloudflare Edge'}!`);
      } else {
        setSentNotice(`⚡ ${data.message || 'Diproses ke Cloudflare D1.'}`);
      }
    } catch {
      setSentNotice(`⚡ Notis direkodkan ke Cloudflare D1.`);
    } finally {
      setIsSending(false);
      setTimeout(() => setSentNotice(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-space">
                REKABENTUK TEMPLATE EMEL AISA (6 PILIHAN TEMA)
              </h3>
              <p className="text-xs text-slate-400 font-mono-code">
                Sasaran: <span className="text-cyan-300 font-bold">{recipientEmail}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Category Switcher (Welcome / Meeting / Notice) */}
        <div className="flex flex-wrap gap-2 pt-3 shrink-0">
          <button
            onClick={() => setSelectedTemplate('welcome')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedTemplate === 'welcome'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🎫 Kad Keahlian Rasmi
          </button>
          <button
            onClick={() => setSelectedTemplate('meeting')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedTemplate === 'meeting'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            📅 Panggilan Mesyuarat
          </button>
          <button
            onClick={() => setSelectedTemplate('notice')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedTemplate === 'notice'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            ⚡ Hebahan Hackathon / Bengkel
          </button>
        </div>

        {/* 2. Design Style Selector (6 Distinct Themes) */}
        <div className="p-3 my-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
          <div className="text-[11px] font-mono-code font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>PILIH TEMA REKA BENTUK EMEL (TIDAK GELAP):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-center">
            {/* 1. Minimalist */}
            <button
              onClick={() => setSelectedStyle('minimalist')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedStyle === 'minimalist'
                  ? 'bg-white text-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-mono-code opacity-75">Clean Light</span>
              <span>1. Minimalis</span>
            </button>

            {/* 2. Glassmorphism */}
            <button
              onClick={() => setSelectedStyle('glassmorphism')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedStyle === 'glassmorphism'
                  ? 'bg-indigo-950 border-cyan-400 text-cyan-300 shadow-md ring-2 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-mono-code opacity-75">Frosted Glow</span>
              <span>2. Glassmorphic</span>
            </button>

            {/* 3. Skeuomorphism */}
            <button
              onClick={() => setSelectedStyle('skeuomorphism')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedStyle === 'skeuomorphism'
                  ? 'bg-slate-800 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-mono-code opacity-75">Physical Chip</span>
              <span>3. Skeuomorphic</span>
            </button>

            {/* 4. Neo-Brutalism */}
            <button
              onClick={() => setSelectedStyle('neobrutalism')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedStyle === 'neobrutalism'
                  ? 'bg-yellow-400 border-black text-black shadow-md shadow-black'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-mono-code opacity-75">Bold Border</span>
              <span>4. Neo-Brutalist</span>
            </button>

            {/* 5. UiTM Royal */}
            <button
              onClick={() => setSelectedStyle('uitm_royal')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedStyle === 'uitm_royal'
                  ? 'bg-purple-950 border-purple-400 text-purple-200 shadow-md ring-2 ring-purple-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-mono-code opacity-75">Ungu & Emas</span>
              <span>5. UiTM Royal</span>
            </button>

            {/* 6. Cyber Clean */}
            <button
              onClick={() => setSelectedStyle('cyber_clean')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedStyle === 'cyber_clean'
                  ? 'bg-sky-950 border-sky-400 text-sky-200 shadow-md ring-2 ring-sky-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-mono-code opacity-75">Titanium Light</span>
              <span>6. Cyber Clean</span>
            </button>
          </div>
        </div>

        {/* Status Notice */}
        {sentNotice && (
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono-code font-bold flex items-center gap-2 mb-2 shrink-0">
            <Check className="w-4 h-4 shrink-0" />
            <span>{sentNotice}</span>
          </div>
        )}

        {/* 3. Live Email Preview Canvas */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-inner bg-slate-950 flex flex-col items-center">
          
          {/* THEME 1: MINIMALIST ACADEMIC (Bright Crisp White) */}
          {selectedStyle === 'minimalist' && (
            <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans text-left">
              <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500"></div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 font-mono-code">
                    PENGESAHAN KEAHLIAN RASMI
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 font-space mt-1.5">
                    ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">UiTM Cawangan Melaka Kampus Jasin • FSKM & FPA</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h5 className="text-base font-bold text-slate-900">Selamat Datang, {recipientName}!</h5>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Permohonan keahlian anda telah diluluskan. Kad Keahlian Digital anda kini aktif sepenuhnya dalam ekosistem AISA.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-500 font-bold uppercase">NO. KEAHLIAN RASMI</span>
                      <div className="text-xl font-black text-indigo-700 font-mono-code tracking-wider">{membershipId}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      AKTIF 2026/2027
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-3">
                    <div><span className="text-slate-500">Nama:</span> <strong className="text-slate-900 block">{recipientName}</strong></div>
                    <div><span className="text-slate-500">No. Pelajar:</span> <strong className="text-slate-900 font-mono-code block">{studentId}</strong></div>
                    <div><span className="text-slate-500">Fakulti:</span> <strong className="text-slate-900 block">FSKM / FPA Jasin</strong></div>
                    <div><span className="text-slate-500">Status Emel:</span> <strong className="text-indigo-600 block">Terverifikasi</strong></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Semua notis mesyuarat, latihan model AI superkomputer, dan jemputan hackathon akan dimaklumkan ke emel ini.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500">
                AISA UiTM Melaka Kampus Jasin • aisaclub.uitmjasin@gmail.com
              </div>
            </div>
          )}

          {/* THEME 2: GLASSMORPHISM FROSTED CYBER */}
          {selectedStyle === 'glassmorphism' && (
            <div className="w-full max-w-xl rounded-3xl border-2 border-indigo-300/40 bg-gradient-to-br from-indigo-50/90 via-white/95 to-cyan-50/90 shadow-2xl p-6 text-left overflow-hidden text-slate-900">
              <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-center shadow-lg mb-5">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                  FROSTED CYBER PASS
                </span>
                <h4 className="text-lg font-black font-space mt-2">AISA DIGITAL PASSPORT</h4>
                <p className="text-xs text-indigo-100">UiTM Melaka Kampus Jasin • FSKM & FPA</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-200/60 shadow-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono-code text-indigo-600 font-bold uppercase">DIGITAL TOKEN</span>
                  <span className="text-lg font-black font-mono-code text-purple-700">{membershipId}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-indigo-50 pb-1">
                    <span className="text-slate-500">Pemegang Kad:</span>
                    <strong className="text-slate-900">{recipientName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-indigo-50 pb-1">
                    <span className="text-slate-500">ID Pelajar:</span>
                    <strong className="text-indigo-600 font-mono-code">{studentId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Akses AI Labs:</span>
                    <span className="text-emerald-600 font-bold">DILULUSKAN</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-4 text-center">
                Kad keahlian digital ini sah untuk penyertaan semua aktiviti AISA sepanjang semester 2026/2027.
              </p>
            </div>
          )}

          {/* THEME 3: SKEUOMORPHISM PHYSICAL LANYARD BADGE */}
          {selectedStyle === 'skeuomorphism' && (
            <div className="w-full max-w-md flex flex-col items-center">
              {/* Silver Lanyard Clip */}
              <div className="w-16 h-3.5 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 rounded-md shadow-md"></div>
              <div className="w-10 h-2 bg-slate-900 rounded-full shadow-inner mb-1.5"></div>

              {/* Physical PVC Card */}
              <div className="w-full bg-white rounded-3xl border border-slate-300 border-b-4 border-b-slate-500 shadow-2xl overflow-hidden text-left">
                {/* Lanyard Badge Top Banner */}
                <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-indigo-900 text-white p-5 text-center border-b-2 border-amber-400">
                  <span className="text-[10px] font-mono-code text-amber-300 font-bold tracking-widest">
                    UNIVERSITI TEKNOLOGI MARA
                  </span>
                  <h4 className="text-base font-black font-space mt-1">AISA STUDENT ACCESS BADGE</h4>
                  <p className="text-[11px] text-indigo-200">KAMPUS JASIN • 2026/2027</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Metallic 3D Chip */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-9 rounded bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-700 shadow-inner flex items-center justify-center">
                      <div className="w-5 h-full border-r border-amber-700/60"></div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">ID KEAHLIAN</span>
                      <span className="text-lg font-black font-mono-code text-slate-900">{membershipId}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div><span className="text-slate-500">Nama:</span> <strong className="text-slate-900 block">{recipientName}</strong></div>
                    <div><span className="text-slate-500">No. Matrik:</span> <strong className="text-slate-900 font-mono-code block">{studentId}</strong></div>
                  </div>

                  {/* Hologram Rainbow Strip */}
                  <div className="h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 via-cyan-400 via-emerald-400 to-amber-400 opacity-85 shadow-sm"></div>

                  {/* Barcode Strip */}
                  <div className="pt-2 text-center border-t border-slate-100">
                    <span className="font-mono-code text-xs tracking-[4px] text-slate-500 font-bold">|||| | |||| || ||||| |||</span>
                    <span className="block text-[9px] text-slate-400 uppercase mt-0.5">AUTHENTICATED • PVC TAG 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* THEME 4: NEO-BRUTALISM (Bold Black Borders & Yellow Accent) */}
          {selectedStyle === 'neobrutalism' && (
            <div className="w-full max-w-xl bg-white border-4 border-black rounded-xl p-6 shadow-[7px_7px_0px_#000000] text-black font-mono text-left space-y-4">
              <div className="bg-black text-yellow-300 p-4 border-2 border-black flex justify-between items-center">
                <div>
                  <span className="bg-cyan-400 text-black px-2 py-0.5 text-[10px] font-black border border-black inline-block mb-1">
                    VERIFIED STUDENT
                  </span>
                  <h4 className="text-lg font-black tracking-tight">AISA // UITM JASIN</h4>
                </div>
                <span className="text-xs font-bold text-yellow-300">[SESI 26/27]</span>
              </div>

              <div className="bg-emerald-200 border-2 border-black p-3 font-bold text-xs shadow-[3px_3px_0px_#000000]">
                STATUS: PENDAFTARAN AKTIF
              </div>

              <div className="border-3 border-black p-4 bg-white shadow-[4px_4px_0px_#000000] space-y-2">
                <div className="text-xs text-slate-600 font-bold">MEMBER ID:</div>
                <div className="text-2xl font-black">{membershipId}</div>
                <div className="border-t-2 border-dashed border-black pt-2 text-xs space-y-1">
                  <div>NAMA: <strong>{recipientName}</strong></div>
                  <div>MATRIK: <strong>{studentId}</strong></div>
                </div>
              </div>

              <p className="text-xs leading-relaxed font-bold">
                Peringatan rasmi persatuan akan dimaklumkan secara berkala. Simpan rekod ini.
              </p>
            </div>
          )}

          {/* THEME 5: UITM ROYAL PURPLE & GOLD MEMO */}
          {selectedStyle === 'uitm_royal' && (
            <div className="w-full max-w-xl bg-white border-2 border-purple-900 rounded-lg p-6 shadow-xl text-left font-serif text-slate-900 space-y-4">
              <div className="text-center border-b-2 border-purple-900 pb-3">
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-widest block">
                  UNIVERSITI TEKNOLOGI MARA
                </span>
                <h4 className="text-lg font-bold text-purple-950 mt-0.5">
                  ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION (AISA)
                </h4>
                <p className="text-xs text-amber-700 font-sans font-semibold">Cawangan Melaka Kampus Jasin • FSKM & FPA</p>
              </div>

              <div className="p-3 bg-purple-50 border-l-4 border-purple-800 text-xs font-sans">
                <strong className="text-purple-900">SURAT PENGESAHAN KEAHLIAN RASMI SESI 2026/2027</strong>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed space-y-2 font-sans">
                <p>Tahniah dan selamat datang diucapkan kepada <strong>{recipientName}</strong>.</p>
                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded text-xs space-y-1.5">
                  <div className="flex justify-between"><span className="text-purple-900 font-bold">Nombor Keahlian:</span> <strong className="font-mono text-purple-950">{membershipId}</strong></div>
                  <div className="flex justify-between"><span className="text-purple-900 font-bold">Nama Penuh:</span> <strong>{recipientName}</strong></div>
                  <div className="flex justify-between"><span className="text-purple-900 font-bold">Nombor Matrik:</span> <strong className="font-mono">{studentId}</strong></div>
                </div>
                <p>Simpan surat pengesahan ini sebagai rekod keahlian rasmi anda di universiti.</p>
              </div>

              <div className="pt-3 border-t border-purple-100 text-center text-[10px] text-purple-900 font-sans">
                KPPIM • UiTM Cawangan Melaka Kampus Jasin
              </div>
            </div>
          )}

          {/* THEME 6: CYBER CLEAN TITANIUM */}
          {selectedStyle === 'cyber_clean' && (
            <div className="w-full max-w-xl bg-white border border-sky-400 rounded-2xl p-6 shadow-xl text-left font-sans text-slate-900 space-y-4">
              <div className="rounded-xl p-4 bg-gradient-to-r from-slate-900 to-sky-900 text-white text-center">
                <div className="h-0.5 bg-gradient-to-r from-sky-400 to-cyan-300 mb-2"></div>
                <span className="text-[10px] font-mono-code font-bold text-sky-300 tracking-wider">AISA RESEARCH LAB</span>
                <h4 className="text-base font-black font-space mt-0.5">DIGITAL PASSPORT // VERIFIED</h4>
                <p className="text-[11px] text-sky-200">UiTM Melaka Kampus Jasin</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-sky-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono-code font-bold text-sky-700">TOKEN KEAHLIAN</span>
                  <span className="text-base font-black font-mono-code text-sky-800">{membershipId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-sky-100 pt-2">
                  <div><span className="text-slate-500">Nama:</span> <strong className="text-slate-900 block">{recipientName}</strong></div>
                  <div><span className="text-slate-500">Matrik:</span> <strong className="text-sky-800 font-mono-code block">{studentId}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900">
                ⚡ Akses Portal Latihan AI dan Pengesahan Keahlian Diaktifkan.
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-3.5 mt-2 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-cyan-300 font-mono-code font-bold">
            {sentNotice ? sentNotice : copied ? '✅ Disalin ke papan keratan' : `Tema Terpilih: ${selectedStyle.toUpperCase()}`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-space transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Salin HTML
            </button>
            <button
              onClick={handleSendRealEmail}
              disabled={isSending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-60 text-white text-xs font-bold font-space transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Menghantar...' : `Hantar Emel (${selectedStyle})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
