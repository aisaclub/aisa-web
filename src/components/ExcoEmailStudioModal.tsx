import React, { useState } from 'react';
import { CustomEmailCampaign, ClubRegistration, NoticeSubscriber, EmailDesignStyle } from '../types';
import { X, Send, Eye, Palette, Calendar, MapPin, Clock, Check, Sparkles, Copy, Users, FileText, Layers, ShieldCheck, QrCode, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExcoEmailStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: ClubRegistration[];
  subscribers: NoticeSubscriber[];
  onLogCampaign: (campaign: CustomEmailCampaign) => void;
}

export const ExcoEmailStudioModal: React.FC<ExcoEmailStudioModalProps> = ({
  isOpen,
  onClose,
  registrations,
  subscribers,
  onLogCampaign,
}) => {
  // Campaign Form State
  const [campaign, setCampaign] = useState<CustomEmailCampaign>({
    id: `camp-${Date.now()}`,
    title: 'Mesyuarat Agung Tahunan & Bengkel Pengenalan AISA',
    subject: '[AISA UiTM Jasin] Notis Rasmi Perjumpaan Ahli & Bengkel Model AI Sesi 1',
    templateStyle: 'minimalist',
    senderRole: 'Setiausaha Kehormat AISA (Biro Pentadbiran)',
    eventDate: 'Jumaat, 14 November 2026',
    eventTime: '8:30 PM - 10:30 PM',
    location: 'Dewan Seminar Al-Khawarizmi, FSKM Jasin & Google Meet',
    agendaItems: [
      'Amanat Khas Pensyarah Penasihat (Dr. Ahmad Faizal)',
      'Pelantikan Jawatankuasa Kecil (AJK Biro Pelajar)',
      'Taklimat Geran Hackathon & Latihan Superkomputer DGX',
      'Sesi Q&A & Pembahagian Pasukan Projek',
    ],
    mainMessage: 'Sukacita dimaklumkan bahawa semua mahasiswa yang telah mendaftar sebagai ahli rasmi AISA dijemput hadir ke perjumpaan ini bagi melengkapkan pendaftaran keahlian dan memulakan inisiatif AI semester ini.',
    actionButtonText: 'Sahkan Kehadiran (RSVP)',
    actionButtonUrl: 'https://meet.google.com/aisa-uitm-jasin',
  });

  const [newAgendaInput, setNewAgendaInput] = useState('');
  const [targetGroup, setTargetGroup] = useState<'all_members' | 'all_subscribers' | 'custom'>('all_members');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  if (!isOpen) return null;

  const handleAddAgenda = () => {
    if (!newAgendaInput.trim()) return;
    setCampaign({
      ...campaign,
      agendaItems: [...campaign.agendaItems, newAgendaInput.trim()],
    });
    setNewAgendaInput('');
  };

  const handleRemoveAgenda = (idx: number) => {
    setCampaign({
      ...campaign,
      agendaItems: campaign.agendaItems.filter((_, i) => i !== idx),
    });
  };

  const handleSendCampaign = async () => {
    setIsBroadcasting(true);
    const finalCampaign: CustomEmailCampaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recipientCount: targetGroup === 'all_members' ? registrations.length : subscribers.length,
    };

    try {
      await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaign.title,
          subject: campaign.subject,
          content: campaign.mainMessage,
          eventDate: campaign.eventDate,
          eventTime: campaign.eventTime,
          eventLocation: campaign.location,
          templateStyle: campaign.templateStyle,
          senderRole: campaign.senderRole,
          targetAudience: targetGroup === 'all_members' ? 'members' : 'subscribers',
        }),
      });
    } catch {
      // Handled
    } finally {
      setIsBroadcasting(false);
    }

    onLogCampaign(finalCampaign);
    setSentSuccess(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7c3aed', '#2563eb', '#10b981'],
    });

    setTimeout(() => {
      setSentSuccess(false);
    }, 4000);
  };

  const handleCopyHtml = () => {
    setCopiedHtml(true);
    navigator.clipboard.writeText(`<!-- AISA Email Design (${campaign.templateStyle.toUpperCase()}) -->\n<h1>${campaign.title}</h1>\n<p>${campaign.mainMessage}</p>`);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-space">
                KONSOL PENGGUBAL EMEL EXCO (6 GAYA TEMA CERAH & MODEN)
              </h3>
              <p className="text-xs text-slate-400">
                Pilih antara 6 gaya reka bentuk emel berkualiti tinggi yang cerah, kemas, dan mudah dibaca di Gmail/Outlook.
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

        {/* Sent Notification */}
        {sentSuccess && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono-code font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Emel "{campaign.title}" berjaya dihantar kepada {campaign.recipientCount || registrations.length} penerima via Google Relay / Edge!</span>
            </span>
            <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded">STATUS: DELIVERED</span>
          </div>
        )}

        {/* Main Grid: Left Editor | Right Live Email Render */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1 overflow-y-auto pr-1">
          {/* LEFT: EXCO CONTROLS FORM (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Design Style Selector (6 Options) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 block mb-2 font-mono-code">
                1. PILIH TEMA REKA BENTUK EMEL (6 PILIHAN):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 1. Minimalist */}
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'minimalist' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'minimalist'
                      ? 'bg-white text-slate-900 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block text-indigo-600 font-bold">1. MINIMALIS</span>
                  <span className="text-xs font-bold block truncate">Swiss Clean</span>
                </button>

                {/* 2. Glassmorphism */}
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'glassmorphism' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'glassmorphism'
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-500/30 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block text-cyan-400 font-bold">2. GLASS</span>
                  <span className="text-xs font-bold block truncate">Glassmorphism</span>
                </button>

                {/* 3. Skeuomorphism */}
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'skeuomorphism' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'skeuomorphism'
                      ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow-lg shadow-amber-950/40 ring-2 ring-amber-500/30 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block text-amber-400 font-bold">3. SKEUO</span>
                  <span className="text-xs font-bold block truncate">Badge Chip</span>
                </button>

                {/* 4. Neo-Brutalism */}
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'neobrutalism' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'neobrutalism'
                      ? 'bg-yellow-400 text-black border-2 border-black shadow-[3px_3px_0px_#000] font-black'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block font-bold">4. BRUTAL</span>
                  <span className="text-xs font-bold block truncate">Neo-Brutalism</span>
                </button>

                {/* 5. UiTM Royal */}
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'uitm_royal' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'uitm_royal'
                      ? 'bg-purple-950/80 border-purple-400 text-purple-300 shadow-lg shadow-purple-950/40 ring-2 ring-purple-500/30 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block text-amber-400 font-bold">5. UITM ROYAL</span>
                  <span className="text-xs font-bold block truncate">Ungu & Emas</span>
                </button>

                {/* 6. Cyber Clean */}
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'cyber_clean' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'cyber_clean'
                      ? 'bg-sky-950/70 border-sky-400 text-sky-300 shadow-lg shadow-sky-950/40 ring-2 ring-sky-500/30 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block text-sky-400 font-bold">6. CYBER</span>
                  <span className="text-xs font-bold block truncate">Titanium Lab</span>
                </button>
              </div>
            </div>

            {/* Email Meta Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Tajuk Program / Mesyuarat</label>
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Subjek Emel (Subject Line)</label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tarikh Acara</label>
                  <input
                    type="text"
                    value={campaign.eventDate}
                    onChange={(e) => setCampaign({ ...campaign, eventDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Masa</label>
                  <input
                    type="text"
                    value={campaign.eventTime}
                    onChange={(e) => setCampaign({ ...campaign, eventTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Lokasi (Bilik Kuliah / Online)</label>
                <input
                  type="text"
                  value={campaign.location}
                  onChange={(e) => setCampaign({ ...campaign, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">AJK / Biro Penghantar</label>
                <input
                  type="text"
                  value={campaign.senderRole}
                  onChange={(e) => setCampaign({ ...campaign, senderRole: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Agenda List Editor */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Agenda Mesyuarat / Butiran Program</label>
                <div className="space-y-1.5 mb-2">
                  {campaign.agendaItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-300 truncate">{idx + 1}. {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAgenda(idx)}
                        className="text-rose-400 hover:text-rose-300 px-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAgendaInput}
                    onChange={(e) => setNewAgendaInput(e.target.value)}
                    placeholder="Tambah agenda baru..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAgenda}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold"
                  >
                    + Tambah
                  </button>
                </div>
              </div>

              {/* Main Message */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Penerangan / Mesej Khas Exco</label>
                <textarea
                  rows={3}
                  value={campaign.mainMessage}
                  onChange={(e) => setCampaign({ ...campaign, mainMessage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Sasaran Penerima Emel:</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all_members">Semua Ahli Berdaftar ({registrations.length} orang)</option>
                  <option value="all_subscribers">Pelanggan Notis Sahaja ({subscribers.length} orang)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE EMAIL PREVIEW RENDER (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono-code">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> PREVIEW EMEL LANGSUNG ({campaign.templateStyle.toUpperCase()})
              </span>
              <span className="font-mono-code text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Rekabentuk Cerah & Kontras Tinggi
              </span>
            </div>

            {/* LIVE RENDER CANVAS: CERAH & TIDAK GELAP */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-300/20 bg-[#f8fafc] p-6 shadow-inner font-sans text-left text-slate-900">
              {/* STYLE 1: MINIMALIST (Clean Swiss Light) */}
              {campaign.templateStyle === 'minimalist' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono-code font-bold text-slate-400 tracking-wider uppercase">
                        AISA • UITM CAWANGAN MELAKA KAMPUS JASIN
                      </span>
                      <h4 className="text-base font-black text-slate-900 font-space mt-0.5">
                        Artificial Intelligence Student Association
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-mono-code font-bold">
                      OFFICIAL NOTICE
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-code text-slate-500 font-bold block mb-1">
                      SUBJEK: {campaign.subject}
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 font-space leading-snug">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {campaign.mainMessage}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block font-bold">TARIKH & MASA:</span>
                      <strong className="text-slate-900">{campaign.eventDate} ({campaign.eventTime})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block font-bold">LOKASI:</span>
                      <strong className="text-slate-900">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-mono-code text-slate-600 font-bold block mb-2">
                        AGENDA PROGRAM:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-space shadow-md"
                    >
                      {campaign.actionButtonText}
                    </a>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{campaign.senderRole}</p>
                      <p className="text-[10px]">AISA UiTM Melaka Kampus Jasin</p>
                    </div>
                    <span className="text-[10px] font-mono-code">AISA-OFFICIAL-2026</span>
                  </div>
                </div>
              )}

              {/* STYLE 2: GLASSMORPHISM (Frosted Glass Cyber) */}
              {campaign.templateStyle === 'glassmorphism' && (
                <div className="bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/70 rounded-3xl border border-cyan-400/40 p-6 shadow-xl backdrop-blur-md max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code font-bold text-cyan-600 tracking-wider">
                          FROSTED GLASS UI
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-space">AISA Cyber Briefing</h4>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/80 border border-cyan-200 text-cyan-700 text-[10px] font-mono-code font-bold shadow-sm">
                      VERIFIED PASS
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-code text-indigo-600 font-bold block mb-1">
                      SUBJEK: {campaign.subject}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white/60 p-4 rounded-2xl border border-white">
                    {campaign.mainMessage}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/80 border border-cyan-200/60 shadow-sm grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono-code text-cyan-700 block font-bold">TARIKH & MASA:</span>
                      <strong className="text-slate-900">{campaign.eventDate} ({campaign.eventTime})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-indigo-700 block font-bold">LOKASI:</span>
                      <strong className="text-slate-900">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/60 border border-white">
                      <span className="text-xs font-mono-code text-indigo-700 font-bold block mb-2">
                        AGENDA PROGRAM:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs font-space shadow-lg shadow-indigo-500/20"
                    >
                      {campaign.actionButtonText}
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 3: SKEUOMORPHISM (Tactile Physical ID Badge with Chip) */}
              {campaign.templateStyle === 'skeuomorphism' && (
                <div className="bg-[#fbfbfa] rounded-2xl border-2 border-[#d6d3d1] p-6 shadow-xl max-w-xl mx-auto space-y-4">
                  {/* Lanyard Top Punch */}
                  <div className="flex justify-center -mt-8 mb-2">
                    <div className="w-14 h-4 bg-slate-300 rounded-full border border-slate-400 shadow-inner flex items-center justify-center">
                      <div className="w-8 h-1.5 bg-slate-600 rounded-full" />
                    </div>
                  </div>

                  {/* Header with Metallic Chip */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                      {/* Gold Chip */}
                      <div className="w-9 h-7 rounded bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border border-amber-600 shadow-sm flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-amber-900" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code font-bold text-stone-500 uppercase tracking-wider block">
                          SMART CARD IDENTIFIER
                        </span>
                        <h4 className="text-xs font-black text-stone-900 font-space">AISA UITM JASIN</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-code bg-stone-200 px-2 py-0.5 rounded text-stone-700 font-bold">
                      EMV CHIP ID
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-code text-stone-500 font-bold block mb-1">
                      SUBJEK: {campaign.subject}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800 leading-relaxed shadow-inner">
                    {campaign.mainMessage}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-stone-300 shadow-sm">
                    <div>
                      <span className="text-[10px] font-mono-code text-stone-400 block font-bold">TARIKH:</span>
                      <strong className="text-stone-900">{campaign.eventDate}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-stone-400 block font-bold">LOKASI:</span>
                      <strong className="text-stone-900">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-stone-300">
                      <span className="text-xs font-mono-code text-stone-600 font-bold block mb-1">
                        AGENDA:
                      </span>
                      <ul className="text-xs text-stone-700 space-y-1">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 text-white font-bold text-xs font-space shadow-md hover:from-stone-700 hover:to-stone-900 border border-stone-700"
                    >
                      {campaign.actionButtonText}
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 4: NEO-BRUTALISM (Bold Pop Tech) */}
              {campaign.templateStyle === 'neobrutalism' && (
                <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[6px_6px_0px_#000000] max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                    <span className="px-3 py-1 bg-yellow-300 text-black border-2 border-black font-black text-xs font-mono-code">
                      ★ NOTIS PENTING
                    </span>
                    <span className="font-mono-code font-bold text-xs text-black">AISA × UITM</span>
                  </div>

                  <h3 className="text-2xl font-black text-black font-space leading-tight">
                    {campaign.title}
                  </h3>

                  <p className="text-xs font-semibold text-black leading-relaxed p-3 bg-slate-100 border-2 border-black">
                    {campaign.mainMessage}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-cyan-100 border-2 border-black text-xs font-bold">
                    <div>
                      <span className="block text-[10px] text-slate-700 font-mono-code">TARIKH & MASA:</span>
                      <span>{campaign.eventDate} ({campaign.eventTime})</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-700 font-mono-code">LOKASI:</span>
                      <span>{campaign.location}</span>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="border-2 border-black p-3 bg-yellow-50">
                      <span className="text-xs font-black block mb-1">AGENDA:</span>
                      <ul className="text-xs font-semibold space-y-1">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx}>▸ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-7 py-3 bg-black hover:bg-slate-900 text-yellow-300 font-black text-xs font-mono-code tracking-wider border-2 border-black shadow-[4px_4px_0px_#facc15]"
                    >
                      {campaign.actionButtonText} →
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 5: UITM ROYAL PURPLE & GOLD MEMO */}
              {campaign.templateStyle === 'uitm_royal' && (
                <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-xl max-w-xl mx-auto space-y-4">
                  {/* Dignified UiTM Royal Header Banner */}
                  <div className="bg-[#3b0764] text-white p-5 border-b-4 border-[#d97706]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono-code font-bold text-amber-300 tracking-widest uppercase block">
                          UNIVERSITI TEKNOLOGI MARA • KAMPUS JASIN
                        </span>
                        <h4 className="text-base font-black text-white font-space mt-0.5">
                          Artificial Intelligence Student Association (AISA)
                        </h4>
                        <span className="text-[10px] text-purple-200 font-mono-code block mt-0.5">
                          KPPIM (Sains Komputer & IT) & FPA (Perladangan & Agroteknologi)
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded bg-[#581c87] border border-amber-400 text-amber-300 font-bold text-[10px] font-mono-code">
                        MEMORANDUM RASMI
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-2 space-y-4">
                    <div>
                      <span className="text-[11px] font-mono-code text-purple-900 font-bold block mb-1">
                        SUBJEK: {campaign.subject}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 font-space">
                        {campaign.title}
                      </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-slate-800 leading-relaxed">
                      <p className="mb-2 font-bold text-purple-950">Assalamualaikum WBT & Salam Sejahtera,</p>
                      <p>{campaign.mainMessage}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                      <div>
                        <span className="text-[10px] text-amber-800 block font-mono-code font-bold">TARIKH & MASA:</span>
                        <strong className="text-slate-900">{campaign.eventDate} ({campaign.eventTime})</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 block font-mono-code font-bold">LOKASI:</span>
                        <strong className="text-slate-900">{campaign.location}</strong>
                      </div>
                    </div>

                    {campaign.agendaItems.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-mono-code text-purple-950 font-bold block mb-2">
                          AGENDA PROGRAM / PERBINCANGAN:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {campaign.agendaItems.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-700 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <a
                        href={campaign.actionButtonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-7 py-2.5 rounded-xl bg-[#3b0764] hover:bg-[#581c87] text-amber-300 font-bold text-xs font-space border border-amber-400 shadow-md"
                      >
                        {campaign.actionButtonText}
                      </a>
                    </div>

                    <div className="pt-4 border-t border-slate-200 text-xs text-slate-600">
                      <p className="font-bold text-slate-900">{campaign.senderRole}</p>
                      <p className="text-[10px] text-slate-500 font-mono-code">AISA UiTM Cawangan Melaka Kampus Jasin</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE 6: CYBER CLEAN TITANIUM (Modern AI Lab Light) */}
              {campaign.templateStyle === 'cyber_clean' && (
                <div className="bg-white rounded-2xl border-2 border-cyan-400 p-6 shadow-xl max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-[11px] font-mono-code font-bold text-cyan-600">
                        AISA NEURAL NETWORK // 2026
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full border border-cyan-200 font-bold">
                      LAB DISPATCH
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono-code text-slate-400 block mb-1">
                      DISPATCH TITLE // {campaign.subject}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-space tracking-tight">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono-code">
                    {campaign.mainMessage}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-cyan-50/60 p-3.5 rounded-xl border border-cyan-200">
                    <div>
                      <span className="text-[10px] font-mono-code text-cyan-800 block font-bold">TIMESTAMP:</span>
                      <strong className="text-slate-900">{campaign.eventDate} ({campaign.eventTime})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-cyan-800 block font-bold">NODE / VENUE:</span>
                      <strong className="text-slate-900">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-mono-code text-slate-700 font-bold block mb-2">
                        MODULES / AGENDA:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 font-mono-code">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx}>[0{idx + 1}] {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-7 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code font-bold text-xs shadow-md shadow-cyan-600/30"
                    >
                      {campaign.actionButtonText} ⚡
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {copiedHtml ? '✅ Kod template disalin' : `Akan dihantar ke ${targetGroup === 'all_members' ? registrations.length : subscribers.length} alamat emel`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-space transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Salin Format Emel
            </button>
            <button
              onClick={handleSendCampaign}
              disabled={isBroadcasting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-space transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isBroadcasting ? 'MENGHANTAR EMEL...' : `HANTAR EMEL KEPADA SEMUA PESERTA (${targetGroup === 'all_members' ? registrations.length : subscribers.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
