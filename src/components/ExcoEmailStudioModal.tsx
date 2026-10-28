import React, { useState } from 'react';
import { CustomEmailCampaign, ClubRegistration, NoticeSubscriber } from '../types';
import { X, Send, Eye, Palette, Calendar, MapPin, Clock, Check, Sparkles, Copy, Users, FileText } from 'lucide-react';
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
    templateStyle: 'uitm_official',
    senderRole: 'Setiausaha Kehormat AISA (Biro Pentadbiran)',
    eventDate: 'Jumaat, 14 November 2026',
    eventTime: '8:30 PM - 10:30 PM',
    location: 'Dewan Seminar Al-Khawarizmi, FSKM Jasin & Google Meet',
    agendaItems: [
      'Amanat Khas Pensyarah Penasihat (Dr. Ahmad Faizal)',
      'Pelantikan Jawatankuasa Kecil (AJK Biro Pelajar)',
      'Taklimat Geran Hackathon & Latihan Superkomputer DGX',
      'Sesi Q&A & Pembahagian Pasukan Projek'
    ],
    mainMessage: 'Sukacita dimaklumkan bahawa semua mahasiswa yang telah mendaftar sebagai ahli rasmi AISA diwajibkan menghadiri perjumpaan ini bagi melengkapkan pendaftaran keahlian dan mengambil bahagian dalam inisiatif AI semester ini.',
    actionButtonText: 'Sahkan Kehadiran (RSVP)',
    actionButtonUrl: 'https://meet.google.com/aisa-uitm-jasin',
  });

  const [newAgendaInput, setNewAgendaInput] = useState('');
  const [targetGroup, setTargetGroup] = useState<'all_members' | 'all_subscribers' | 'custom'>('all_members');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

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

  const handleSendCampaign = () => {
    const finalCampaign: CustomEmailCampaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recipientCount: targetGroup === 'all_members' ? registrations.length : subscribers.length,
    };

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
    navigator.clipboard.writeText(`<!-- AISA Email Design (${campaign.templateStyle}) -->\n<h1>${campaign.title}</h1>\n<p>${campaign.mainMessage}</p>`);
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
                KONSOL PENGGUBAL EMEL EXCO (EMAIL CAMPAIGN STUDIO)
              </h3>
              <p className="text-xs text-slate-400">
                Pilih gaya template berlainan, masukkan agenda mesyuarat/program, dan hantar terus ke emel peserta.
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
              <span>Emel "{campaign.title}" berjaya dihantar kepada {campaign.recipientCount || registrations.length} penerima!</span>
            </span>
            <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded">STATUS: DELIVERED</span>
          </div>
        )}

        {/* Main Grid: Left Editor | Right Live Email Render */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1 overflow-y-auto pr-1">
          {/* LEFT: EXCO CONTROLS FORM (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Design Style Selector */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 block mb-2 font-mono-code">
                1. PILIH GAYA REKA BENTUK TEMPLATE:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'uitm_official' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'uitm_official'
                      ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-md shadow-purple-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block font-bold">MEMO RASMI</span>
                  <span className="text-xs font-bold block text-white">UiTM Royal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'modern_card' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'modern_card'
                      ? 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-md shadow-blue-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block font-bold">TECH CARD</span>
                  <span className="text-xs font-bold block text-white">Summit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, templateStyle: 'minimal_alert' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaign.templateStyle === 'minimal_alert'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono-code block font-bold">MINIMAL</span>
                  <span className="text-xs font-bold block text-white">Clean Alert</span>
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
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> PREVIEW EMEL LANGSUNG
              </span>
              <span className="font-mono-code text-[11px] text-slate-500">
                Penerima: student@isiswa.uitm.edu.my
              </span>
            </div>

            {/* LIVE RENDER CANVAS */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-[#0d121f] p-6 shadow-inner font-sans text-left">
              {/* STYLE 1: UITM OFFICIAL EXECUTIVE MEMO */}
              {campaign.templateStyle === 'uitm_official' && (
                <div className="space-y-4">
                  {/* UiTM Official Header Strip */}
                  <div className="border-b-2 border-purple-600/50 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono-code font-bold text-purple-400 block tracking-widest uppercase">
                        UNIVERSITI TEKNOLOGI MARA • KAMPUS JASIN
                      </span>
                      <h4 className="text-base font-bold text-white font-space mt-0.5">
                        ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION (AISA)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono-code">
                        Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM)
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono-code text-purple-300 font-bold">
                      MEMORANDUM RASMI
                    </div>
                  </div>

                  {/* Title & Subject */}
                  <div>
                    <span className="text-[11px] font-mono-code text-purple-300 font-bold block mb-1">
                      SUBJEK: {campaign.subject}
                    </span>
                    <h3 className="text-xl font-black text-white font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  {/* Body Paragraph */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    <p className="mb-2">Assalamualaikum WBT & Salam Sejahtera,</p>
                    <p>{campaign.mainMessage}</p>
                  </div>

                  {/* Logistics Box */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-purple-950/30 p-4 rounded-xl border border-purple-500/30">
                    <div>
                      <span className="text-[10px] text-purple-300 block font-mono-code">TARIKH & MASA:</span>
                      <strong className="text-white">{campaign.eventDate} ({campaign.eventTime})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-300 block font-mono-code">LOKASI:</span>
                      <strong className="text-white">{campaign.location}</strong>
                    </div>
                  </div>

                  {/* Agenda List */}
                  {campaign.agendaItems.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-xs font-mono-code text-purple-300 font-bold block mb-2">
                        AGENDA PROGRAM / PERBINCANGAN:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action CTA */}
                  <div className="text-center pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-space shadow-lg shadow-purple-600/30"
                    >
                      {campaign.actionButtonText}
                    </a>
                  </div>

                  {/* Signoff */}
                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                    <p>Disediakan oleh:</p>
                    <strong className="text-white">{campaign.senderRole}</strong>
                    <p className="text-[10px] text-slate-500 font-mono-code mt-0.5">AISA UiTM Melaka Kampus Jasin</p>
                  </div>
                </div>
              )}

              {/* STYLE 2: MODERN TECH SUMMIT CARD */}
              {campaign.templateStyle === 'modern_card' && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl p-5 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-code font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        AISA TECH BRIEFING
                      </span>
                      <span className="text-xs text-slate-400 font-mono-code">UiTM Jasin</span>
                    </div>

                    <h3 className="text-xl font-black text-white font-space mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {campaign.mainMessage}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">TARIKH:</span>
                        <strong className="text-blue-300">{campaign.eventDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">LOKASI:</span>
                        <strong className="text-white">{campaign.location}</strong>
                      </div>
                    </div>

                    {campaign.agendaItems.length > 0 && (
                      <div className="space-y-1 mb-4 text-xs text-slate-300">
                        {campaign.agendaItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-blue-400 font-mono-code">⚡</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-center">
                      <a
                        href={campaign.actionButtonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-space shadow-lg shadow-blue-600/30 text-center"
                      >
                        {campaign.actionButtonText}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE 3: MINIMAL ALERT BULLETIN */}
              {campaign.templateStyle === 'minimal_alert' && (
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4 py-1">
                    <span className="text-[10px] font-mono-code text-emerald-400 font-bold block uppercase">
                      PEMBERITAHUAN SEGERA • AISA KPPIM
                    </span>
                    <h3 className="text-lg font-bold text-white font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {campaign.mainMessage}
                  </p>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div>📅 <strong>Tarikh & Masa:</strong> {campaign.eventDate} ({campaign.eventTime})</div>
                    <div>📍 <strong>Tempat:</strong> {campaign.location}</div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="text-xs space-y-1 text-slate-300">
                      <strong>Senarai Agenda:</strong>
                      {campaign.agendaItems.map((item, idx) => (
                        <div key={idx} className="text-slate-400 ml-2">
                          - {item}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      {campaign.actionButtonText}
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-space transition-all shadow-lg shadow-purple-600/30"
            >
              <Send className="w-4 h-4" /> HANTAR EMEL KEPADA SEMUA PESERTA ({targetGroup === 'all_members' ? registrations.length : subscribers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
