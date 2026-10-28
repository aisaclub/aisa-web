import React, { useState } from 'react';
import { X, Mail, Check, Copy, Calendar, Sparkles, Send, Bell, ShieldCheck, QrCode } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  if (!isOpen) return null;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(`<!DOCTYPE html>... (AISA Cyber Email Template for ${recipientName})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSimulation = () => {
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-space">
                REKABENTUK TEMPLATE EMEL AISA (AI CYBER EDITION)
              </h3>
              <p className="text-xs text-slate-400 font-mono-code">
                Dihantar kepada: <span className="text-cyan-300 font-bold">{recipientEmail}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="flex flex-wrap gap-2 my-3 shrink-0">
          <button
            onClick={() => setSelectedTemplate('welcome')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTemplate === 'welcome'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🎫 Emel Pengesahan Ahli & ID
          </button>
          <button
            onClick={() => setSelectedTemplate('meeting')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTemplate === 'meeting'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            📅 Peringatan Mesyuarat / Reminder
          </button>
          <button
            onClick={() => setSelectedTemplate('notice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTemplate === 'notice'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            ⚡ Buletin & Panggilan Hackathon
          </button>
        </div>

        {/* Sent Notification */}
        {sentNotice && (
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono-code font-bold flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>⚡ Emel simulasi berjaya dihantar ke {recipientEmail}!</span>
          </div>
        )}

        {/* Scrollable Email Preview Frame */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-[#060814] p-6 shadow-inner font-sans">
          {/* EMAIL HEADER */}
          <div className="border-b border-indigo-500/20 pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center font-black text-cyan-400 text-xs">
                  AI
                </div>
              </div>
              <div>
                <span className="font-space font-bold text-white text-sm block">AISA UiTM MELAKA</span>
                <span className="text-[10px] text-slate-400 font-mono-code">KAMPUS JASIN • KPPIM FSKM</span>
              </div>
            </div>
            <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
              VERIFIED NOTIFICATION
            </span>
          </div>

          {/* TEMPLATE 1: WELCOME & MEMBERSHIP CONFIRMATION */}
          {selectedTemplate === 'welcome' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30">
                <span className="text-xs font-mono-code text-indigo-400 uppercase font-bold tracking-wider block mb-1">
                  STATUS: PENDAFTARAN DISAHKAN
                </span>
                <h4 className="text-xl font-black text-white font-space mb-1">
                  Selamat Datang ke Keluarga AISA, {recipientName}!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Permohonan pendaftaran anda sebagai ahli rasmi Artificial Intelligence Student Association sesi 2026/2027 telah diluluskan oleh Majlis Tertinggi dan Penasihat KPPIM.
                </p>
              </div>

              {/* Digital Membership Pass Card */}
              <div className="relative rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono-code text-cyan-300 font-bold">
                    KAD KEAHLIAN DIGITAL (AISA PASS)
                  </span>
                  <span className="text-xs font-mono-code text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    ACTIVE MEMBER
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono-code">NAMA AHLI:</span>
                    <strong className="text-white text-xs">{recipientName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono-code">NO. PELAJAR (ID):</span>
                    <strong className="text-cyan-400 font-mono-code text-xs">{studentId}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono-code">ID KEAHLIAN:</span>
                    <strong className="text-indigo-300 font-mono-code text-xs">{membershipId}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono-code">KAMPUS:</span>
                    <strong className="text-white text-xs">UiTM Cawangan Melaka Kampus Jasin</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono-code">
                  <span>⚡ KPPIM AI Research Lab Access</span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <QrCode className="w-3.5 h-3.5" /> Barcode Verified
                  </span>
                </div>
              </div>

              {/* Next Steps Buttons in Email */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xs text-slate-300 mb-3">
                  Sila sertai saluran rasmi Discord & WhatsApp AISA untuk menerima notis mesyuarat agung pertama:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="inline-block px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs font-space">
                    Sertai Discord AISA
                  </span>
                  <span className="inline-block px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs font-space">
                    Sertai WhatsApp Komuniti
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: MEETING & REMINDER NOTIFICATION */}
          {selectedTemplate === 'meeting' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/30">
                <span className="text-xs font-mono-code text-cyan-400 uppercase font-bold tracking-wider block mb-1">
                  PERINGATAN MESYUARAT & BENGKEL
                </span>
                <h4 className="text-xl font-black text-white font-space mb-1">
                  Peringatan: Perjumpaan Agung & Bengkel AI Sesi 1
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assalamualaikum & Salam Sejahtera {recipientName}, ini adalah peringatan automatik bagi menghadiri perjumpaan rasmi persatuan AISA minggu ini.
                </p>
              </div>

              {/* Meeting Logistics Box */}
              <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>Tarikh:</strong> Jumaat, 6 November 2026 (Malam)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold font-mono-code shrink-0">⏰</span>
                  <span><strong>Masa:</strong> 8:30 PM - 10:30 PM (Kehadiran Diambil)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold font-mono-code shrink-0">📍</span>
                  <span><strong>Tempat:</strong> Dewan Seminar Al-Khawarizmi, FSKM Jasin & Google Meet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Agenda:</strong> Amanat Penasihat, Pelantikan Biro Pelajar & Taklimat Hackathon</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="inline-block px-6 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs font-space">
                  Sahkan Kehadiran (RSVP)
                </span>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: NOTICE & HACKATHON BULLETIN */}
          {selectedTemplate === 'notice' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/40 border border-purple-500/30">
                <span className="text-xs font-mono-code text-purple-300 uppercase font-bold tracking-wider block mb-1">
                  HEBAHAN KHAS PERTANDINGAN
                </span>
                <h4 className="text-xl font-black text-white font-space mb-1">
                  AISA National AI Hackathon 2026: Pendaftaran Dibuka!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rebut peluang bertanding bersama 50 pasukan AI terbaik universiti seluruh Malaysia dengan hadiah wang tunai terkumpul bernilai <strong>RM 10,000</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div>⚡ <strong>Kategori:</strong> Autonomous Agent, Vision AI & Smart Campus</div>
                <div>📅 <strong>Tarikh Tutup Pendaftaran:</strong> 10 November 2026</div>
                <div>🎁 <strong>Hadiah Utama:</strong> RM 5,000 + Tajaan Cloud GPU Credits</div>
              </div>

              <div className="text-center pt-2">
                <span className="inline-block px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs font-space">
                  Daftar Pasukan Anda Sekarang
                </span>
              </div>
            </div>
          )}

          {/* EMAIL FOOTER */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono-code space-y-1">
            <p>Emel ini dihantar secara automatik oleh Sistem Pengurusan AISA UiTM Melaka Kampus Jasin.</p>
            <p>Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM), 77300 Merlimau, Melaka.</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {copied ? '✅ Disalin ke papan keratan' : 'Salin kod HTML emel atau hantar ujian'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-space transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Salin HTML Emel
            </button>
            <button
              onClick={handleSendSimulation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-space transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Hantar Ujian Emel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
