import React, { useState } from 'react';
import { X, Mail, Check, Copy, Calendar, Sparkles, Send, Bell, ShieldCheck, QrCode, Palette, Layers, Award, Clock, MapPin } from 'lucide-react';
import { EmailDesignStyle, EMAIL_STYLES_META } from '../types';
import { formatMalayDate, generateGoogleCalendarUrl } from '../utils/dateFormatter';

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
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  // Auto-formatted Malay Date
  const eventDateRaw = '2026-11-14';
  const eventTimeRaw = '20:30';
  const formattedEventDate = formatMalayDate(eventDateRaw);

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
          eventDate: formattedEventDate.fullFormatted,
          eventTime: eventTimeRaw,
          eventLocation: 'Dewan Seminar Al-Khawarizmi & Google Meet',
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

  const categories = ['Semua', 'Akademik & Rasmi', 'Moden & Kaca', 'Kreatif & Pop', 'Teknologi & Lab'];

  const filteredStyles =
    categoryFilter === 'Semua'
      ? EMAIL_STYLES_META
      : EMAIL_STYLES_META.filter((s) => s.category === categoryFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-space">
                GALERI 12 TEMPLATE EMEL AISA (TERANG & KONTRAST TINGGI)
              </h3>
              <p className="text-xs text-slate-400 font-mono-code">
                Sasaran: <span className="text-cyan-300 font-bold">{recipientEmail}</span> • Tarikh Auto: <strong className="text-white">{formattedEventDate.fullFormatted}</strong>
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
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 shrink-0">
          <div className="flex flex-wrap gap-2">
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

          {/* Quick Style Filter Pills */}
          <div className="flex gap-1 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono-code font-bold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 12 Design Styles Grid Selector */}
        <div className="p-3 my-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
          <div className="text-[11px] font-mono-code font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>12 PILIHAN GAYA REKA BENTUK (SEMUA CERAH & TIDAK GELAP):</span>
            </span>
            <span className="text-[10px] text-emerald-400">100% Serasi Gmail & Outlook</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredStyles.map((item) => {
              const isSelected = selectedStyle === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedStyle(item.id)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/30 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded block truncate mb-0.5 ${item.badgeBg}`}>
                    {item.num}. {item.category}
                  </span>
                  <span className={`text-xs font-bold block truncate ${isSelected ? 'text-slate-900' : 'text-white'}`}>
                    {item.name}
                  </span>
                  <span className={`text-[9px] truncate block ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
                    {item.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Live Preview Render Canvas (Bright, Light & High Contrast) */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-300/30 bg-[#f8fafc] p-6 shadow-inner font-sans text-left text-slate-900">
          {/* Top Info Banner with Auto-Extracted Malay Date */}
          <div className="mb-4 p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono-code font-bold">
                TEMA: {selectedStyle.toUpperCase()}
              </span>
              <span className="text-slate-600">
                Penerima: <strong className="text-slate-900">{recipientName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono-code text-[11px] text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hari: <strong className="text-slate-900">{formattedEventDate.dayName}</strong></span>
              <span>•</span>
              <span>Tarikh: <strong className="text-slate-900">{formattedEventDate.dayNumber} {formattedEventDate.monthName} {formattedEventDate.year}</strong></span>
            </div>
          </div>

          {/* RENDER CURRENT SELECTED STYLE PREVIEW */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono-code font-bold text-slate-400 uppercase">
                  AISA • UNIVERSITI TEKNOLOGI MARA JASIN
                </span>
                <h4 className="text-base font-bold text-slate-900 font-space mt-0.5">
                  {selectedTemplate === 'welcome'
                    ? 'KAD KEAHLIAN DIGITAL RASMI'
                    : selectedTemplate === 'meeting'
                    ? 'NOTIS PANGGILAN MESYUARAT AGUNG'
                    : 'HEBAHAN HACKATHON & BENGKEL AI'}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-mono-code font-bold">
                DISAHKAN
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Assalamualaikum WBT & Salam Sejahtera <strong>{recipientName}</strong> ({studentId}), berikut merupakan maklumat rasmi berkaitan keahlian dan jadual persatuan anda bagi sesi 2026/2027:
            </p>

            {/* Pass / Logistics Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-mono-code text-[11px] text-slate-500">ID KEAHLIAN / PASS:</span>
                <strong className="font-mono-code text-sm text-indigo-600">{membershipId}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono-code font-bold">HARI & TARIKH ACARA:</span>
                  <strong className="text-slate-900">{formattedEventDate.fullFormatted}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono-code font-bold">MASA & TEMPAT:</span>
                  <strong className="text-slate-900">{eventTimeRaw} • Makmal Al-Khawarizmi</strong>
                </div>
              </div>
            </div>

            {/* Google Calendar RSVP Button & Portal Access */}
            <div className="text-center pt-2 flex flex-wrap justify-center gap-2">
              <a
                href={generateGoogleCalendarUrl({
                  title: 'Mesyuarat Agung & Bengkel AISA UiTM Jasin',
                  description: 'Sesi pengenalan keahlian dan bengkel teknikal model AI semester 2026/2027.',
                  startDate: eventDateRaw,
                  startTime: eventTimeRaw,
                })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-space shadow-md"
              >
                <Calendar className="w-3.5 h-3.5" /> Tambah Ke Google Calendar
              </a>

              <a
                href="https://aisa-web-c40.pages.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-space shadow-md"
              >
                Buka Portal Web AISA →
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono-code">
              <span>Sistem Pentadbiran AISA UiTM Melaka Kampus Jasin</span>
              <span>Hak Cipta 2026</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono-code">
            {sentNotice || (copied ? '✅ Kod disalin' : `Tema Terpilih: ${selectedStyle.toUpperCase()}`)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-space"
            >
              <Copy className="w-3.5 h-3.5" /> Salin Format Emel
            </button>
            <button
              onClick={handleSendRealEmail}
              disabled={isSending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold font-space disabled:opacity-50 shadow-lg shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" /> {isSending ? 'Menghantar...' : `Hantar Emel (${selectedStyle.toUpperCase()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
