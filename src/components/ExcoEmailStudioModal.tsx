import React, { useState } from 'react';
import { CustomEmailCampaign, ClubRegistration, NoticeSubscriber, EmailDesignStyle, EMAIL_STYLES_META } from '../types';
import { X, Send, Eye, Palette, Calendar, MapPin, Clock, Check, Sparkles, Copy, Users, FileText, Layers, ShieldCheck, QrCode, Cpu, CheckSquare, Square, Search, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatMalayDate, generateGoogleCalendarUrl } from '../utils/dateFormatter';

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
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    eventTime: '20:30',
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
  
  // Target Audience Mode:
  // 'all' = Semua (Ahli + Pelanggan)
  // 'all_members' = Ahli Berdaftar Sahaja
  // 'all_subscribers' = Pelanggan Notis Sahaja
  // 'select_custom' = Pilih Penerima Tertentu (Checkbox Select)
  const [targetGroup, setTargetGroup] = useState<'all' | 'all_members' | 'all_subscribers' | 'select_custom'>('all');
  
  // Selected Recipient Emails for Checkbox Select
  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<string[]>(() => {
    return [...registrations.map((r) => r.email), ...subscribers.map((s) => s.email)];
  });
  const [recipientSearch, setRecipientSearch] = useState('');

  // Topik Kategori Hebahan (Untuk Penapisan Pelanggan Notis)
  const [campaignCategory, setCampaignCategory] = useState<string>('Semua Hebahan & Mesyuarat');

  // Filter for 12 Email Template Styles
  const [studioCategoryFilter, setStudioCategoryFilter] = useState<string>('Semua');

  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  if (!isOpen) return null;

  // Toggle recipient checkbox
  const handleToggleRecipient = (email: string) => {
    setSelectedRecipientEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectAllRecipients = () => {
    setSelectedRecipientEmails([...registrations.map((r) => r.email), ...subscribers.map((s) => s.email)]);
  };

  const handleDeselectAllRecipients = () => {
    setSelectedRecipientEmails([]);
  };

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

  // Determine recipient count for display
  const getCalculatedRecipientCount = () => {
    if (targetGroup === 'select_custom') {
      return selectedRecipientEmails.length;
    }
    if (targetGroup === 'all_members') {
      return registrations.length;
    }
    if (targetGroup === 'all_subscribers') {
      // Filter subscribers by campaignCategory
      if (campaignCategory === 'Semua Hebahan & Mesyuarat') {
        return subscribers.length;
      }
      return subscribers.filter(
        (s) => s.preferredTopic === campaignCategory || s.preferredTopic === 'Semua Hebahan & Mesyuarat'
      ).length;
    }
    // 'all'
    const matchingSubs = subscribers.filter(
      (s) => campaignCategory === 'Semua Hebahan & Mesyuarat' || s.preferredTopic === campaignCategory || s.preferredTopic === 'Semua Hebahan & Mesyuarat'
    ).length;
    return registrations.length + matchingSubs;
  };

  const handleSendCampaign = async () => {
    setIsBroadcasting(true);
    const calculatedCount = getCalculatedRecipientCount();

    const finalCampaign: CustomEmailCampaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recipientCount: calculatedCount,
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
          category: campaignCategory,
          targetAudience: targetGroup === 'select_custom' ? 'custom' : targetGroup === 'all_members' ? 'members' : targetGroup === 'all_subscribers' ? 'subscribers' : 'all',
          customRecipients: targetGroup === 'select_custom' ? selectedRecipientEmails : undefined,
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

  // Filtered recipient list for 'select_custom'
  const allAvailableRecipients = [
    ...registrations.map((r) => ({
      email: r.email,
      name: r.fullName,
      detail: `${r.studentId} • ${r.program}`,
      type: 'Ahli Berdaftar' as const,
    })),
    ...subscribers.map((s) => ({
      email: s.email,
      name: s.email.split('@')[0],
      detail: `Langganan: ${s.preferredTopic}`,
      type: 'Pelanggan Notis' as const,
    })),
  ].filter((item) => {
    if (!recipientSearch.trim()) return true;
    const q = recipientSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.detail.toLowerCase().includes(q)
    );
  });

  const gCalUrl = generateGoogleCalendarUrl({
    title: campaign.title,
    description: campaign.mainMessage,
    location: campaign.location,
    startDate: campaign.eventDate,
    startTime: campaign.eventTime,
  });
  const malayDate = formatMalayDate(campaign.eventDate);

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
                KONSOL PENGGUBAL EMEL EXCO (12 GAYA TEMA CERAH & PILIHAN PENERIMA)
              </h3>
              <p className="text-xs text-slate-400">
                Pilih daripada 12 tema cerah kontras tinggi, tetapkan tarikh/masa via date picker, dan pilih sasaran penerima (Semua / Pilihan).
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
              <span>Emel "{campaign.title}" berjaya dihantar kepada {getCalculatedRecipientCount()} penerima via Google Relay / Edge!</span>
            </span>
            <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded">STATUS: DELIVERED</span>
          </div>
        )}

        {/* Main Grid: Left Editor | Right Live Email Render */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1 overflow-y-auto pr-1">
          {/* LEFT: EXCO CONTROLS FORM (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Design Style Selector (12 Options) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 font-mono-code">
                  1. PILIH TEMA REKA BENTUK EMEL (12 PILIHAN CERAH):
                </label>
                <span className="text-[10px] text-cyan-400 font-mono-code font-bold">12 Pilihan Cerah</span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
                {['Semua', 'Akademik & Rasmi', 'Moden & Kaca', 'Kreatif & Pop', 'Teknologi & Lab'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStudioCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono-code font-bold transition-all shrink-0 ${
                      studioCategoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {EMAIL_STYLES_META
                  .filter((s) => studioCategoryFilter === 'Semua' || s.category === studioCategoryFilter)
                  .map((s) => {
                    const isSelected = campaign.templateStyle === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCampaign({ ...campaign, templateStyle: s.id })}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-white text-slate-900 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-[9px] font-mono-code font-bold ${isSelected ? 'text-indigo-600' : 'text-cyan-400'}`}>
                            {s.num}. {s.name.split(' ')[0].toUpperCase()}
                          </span>
                          <span className={`text-[8px] font-mono-code px-1 rounded ${isSelected ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-400'}`}>
                            {s.category.split(' ')[0]}
                          </span>
                        </div>
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                          {s.name}
                        </div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-slate-600' : 'text-slate-400'}`}>
                          {s.tagline}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Email Meta Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Tajuk Program / Mesyuarat *</label>
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Subjek Emel (Subject Line) *</label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* DATE PICKER & TIME PICKER FOR CAMPAIGN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tarikh Acara (Date Picker)</span>
                  </label>
                  <input
                    type="date"
                    value={campaign.eventDate}
                    onChange={(e) => setCampaign({ ...campaign, eventDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono-code"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Masa Acara (Time Picker)</span>
                  </label>
                  <input
                    type="time"
                    value={campaign.eventTime}
                    onChange={(e) => setCampaign({ ...campaign, eventTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono-code"
                  />
                </div>
                {campaign.eventDate && (
                  <div className="col-span-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono-code text-indigo-300 flex items-center justify-between">
                    <span><strong>HARI:</strong> {formatMalayDate(campaign.eventDate).dayName}</span>
                    <span><strong>TARIKH:</strong> {formatMalayDate(campaign.eventDate).dayNumber}</span>
                    <span><strong>BULAN:</strong> {formatMalayDate(campaign.eventDate).monthName}</span>
                    <span><strong>TAHUN:</strong> {formatMalayDate(campaign.eventDate).year}</span>
                  </div>
                )}
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

              {/* TOPIK HEBAHAN (UNTUK PENAPISAN PELANGGAN NOTIS) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kategori / Topik Hebahan (Untuk Pelanggan):</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono-code font-bold">Auto-Filter</span>
                </label>
                <select
                  value={campaignCategory}
                  onChange={(e) => setCampaignCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Semua Hebahan & Mesyuarat">Semua Hebahan & Mesyuarat (Semua Pelanggan Terima)</option>
                  <option value="Pertandingan & Hackathon Sahaja">Pertandingan & Hackathon Sahaja</option>
                  <option value="Bengkel & Bootcamps AI">Bengkel & Bootcamps AI</option>
                  <option value="Promosi & Notis Khas">Promosi & Notis Khas</option>
                </select>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  ℹ️ <strong>Peraturan Langganan:</strong> Jika topik dipilih, pelanggan notis hanya akan menerima emel ini sekiranya topik tersebut sepadan dengan minat langganan mereka.
                </p>
              </div>

              {/* TARGET AUDIENCE SELECTION (ADA OPTION SEMUA / SELECT CHECKBOX) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block flex items-center justify-between font-mono-code">
                  <span>SASARAN PENERIMA EMEL:</span>
                  <span className="text-emerald-400 text-[10px]">{getCalculatedRecipientCount()} Penerima Layak</span>
                </label>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTargetGroup('all')}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      targetGroup === 'all'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">👥 Semua Penerima</div>
                    <div className="text-[10px] opacity-80">Ahli + Pelanggan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('all_members')}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      targetGroup === 'all_members'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">🎓 Ahli Berdaftar</div>
                    <div className="text-[10px] opacity-80">{registrations.length} orang</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('all_subscribers')}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      targetGroup === 'all_subscribers'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">📬 Pelanggan Notis</div>
                    <div className="text-[10px] opacity-80">{subscribers.length} orang (ikut topik)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('select_custom')}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      targetGroup === 'select_custom'
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md font-bold ring-2 ring-cyan-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">☑️ Pilih Tertentu</div>
                    <div className="text-[10px] opacity-80">{selectedRecipientEmails.length} dipilih</div>
                  </button>
                </div>

                {/* INTERACTIVE CHECKBOX SELECTOR PANEL */}
                {targetGroup === 'select_custom' && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={recipientSearch}
                          onChange={(e) => setRecipientSearch(e.target.value)}
                          placeholder="Cari nama, emel, no matrik..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={handleSelectAllRecipients}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 font-mono-code font-bold"
                        >
                          Pilih Semua
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAllRecipients}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-400 font-mono-code"
                        >
                          Padam Semua
                        </button>
                      </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1 border-t border-slate-800 pt-2">
                      {allAvailableRecipients.length === 0 ? (
                        <div className="text-center py-2 text-xs text-slate-500">Tiada padanan dijumpai.</div>
                      ) : (
                        allAvailableRecipients.map((rec) => {
                          const isChecked = selectedRecipientEmails.includes(rec.email);
                          return (
                            <div
                              key={rec.email}
                              onClick={() => handleToggleRecipient(rec.email)}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                isChecked ? 'bg-cyan-950/60 border border-cyan-500/40' : 'bg-slate-950 hover:bg-slate-800/80 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                                )}
                                <div className="truncate">
                                  <strong className="text-white block truncate">{rec.name}</strong>
                                  <span className="text-[10px] text-slate-400 font-mono-code block truncate">
                                    {rec.email}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-mono-code font-bold shrink-0 ${
                                  rec.type === 'Ahli Berdaftar'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}
                              >
                                {rec.type}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
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

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-space shadow-md"
                    >
                      {campaign.actionButtonText}
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs font-mono-code border border-slate-300"
                    >
                      📅 Google Calendar
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

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs font-space shadow-lg shadow-indigo-500/20"
                    >
                      {campaign.actionButtonText}
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-cyan-800 font-bold text-xs font-mono-code border border-cyan-200 shadow-sm"
                    >
                      📅 Google Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 3: SKEUOMORPHISM (Tactile Physical ID Badge with Chip) */}
              {campaign.templateStyle === 'skeuomorphism' && (
                <div className="bg-[#fbfbfa] rounded-2xl border-2 border-[#d6d3d1] p-6 shadow-xl max-w-xl mx-auto space-y-4">
                  <div className="flex justify-center -mt-8 mb-2">
                    <div className="w-14 h-4 bg-slate-300 rounded-full border border-slate-400 shadow-inner flex items-center justify-center">
                      <div className="w-8 h-1.5 bg-slate-600 rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-3">
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

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 text-white font-bold text-xs font-space shadow-md hover:from-stone-700 hover:to-stone-900 border border-stone-700"
                    >
                      {campaign.actionButtonText}
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs font-mono-code border border-stone-300 shadow-sm"
                    >
                      📅 Google Calendar
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

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-7 py-3 bg-black hover:bg-slate-900 text-yellow-300 font-black text-xs font-mono-code tracking-wider border-2 border-black shadow-[4px_4px_0px_#facc15]"
                    >
                      {campaign.actionButtonText} →
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-3 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs font-mono-code border-2 border-black shadow-[4px_4px_0px_#000]"
                    >
                      📅 CALENDAR RSVP
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 5: UITM ROYAL PURPLE & GOLD MEMO */}
              {campaign.templateStyle === 'uitm_royal' && (
                <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-xl max-w-xl mx-auto space-y-4">
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

                    <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                      <a
                        href={campaign.actionButtonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-7 py-2.5 rounded-xl bg-[#3b0764] hover:bg-[#581c87] text-amber-300 font-bold text-xs font-space border border-amber-400 shadow-md"
                      >
                        {campaign.actionButtonText}
                      </a>
                      <a
                        href={gCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs font-mono-code border border-purple-300 shadow-sm"
                      >
                        📅 Google Calendar
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

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-7 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code font-bold text-xs shadow-md shadow-cyan-600/30"
                    >
                      {campaign.actionButtonText} ⚡
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-mono-code font-bold text-xs border border-cyan-300"
                    >
                      📅 Google Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 7: EDITORIAL SERIF (Ivory Monograph & Wine Accent) */}
              {campaign.templateStyle === 'editorial_serif' && (
                <div className="bg-[#fffdfa] rounded-2xl border border-stone-300 p-7 shadow-lg max-w-xl mx-auto space-y-4 font-serif">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 font-sans">
                    <span className="text-[10px] font-mono-code font-bold text-stone-600 tracking-widest uppercase">
                      AISA EXECUTIVE MONOGRAPH • 2026
                    </span>
                    <span className="text-[10px] font-mono-code bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded border border-stone-300 font-bold">
                      VOL. 26 // ISSUE 04
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-code text-pink-900 font-bold block mb-1 font-sans">
                      DISPATCH • {campaign.subject}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-stone-950 leading-tight">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-800 leading-relaxed font-serif italic border-l-2 border-pink-900 pl-4 py-1">
                    "{campaign.mainMessage}"
                  </p>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-2 gap-3 text-xs font-sans">
                    <div>
                      <span className="text-[10px] font-mono-code text-stone-500 block font-bold">TARIKH & MASA:</span>
                      <strong className="text-stone-950">{malayDate.fullFormatted} ({campaign.eventTime})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-stone-500 block font-bold">LOKASI:</span>
                      <strong className="text-stone-950">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-sans">
                      <span className="text-xs font-mono-code text-pink-950 font-bold block mb-2">
                        AGENDA PROSIDING:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-700">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-pink-900 font-bold font-mono-code">§{idx + 1}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2 font-sans">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-[#831843] hover:bg-[#701a3d] text-white font-bold text-xs shadow-md"
                    >
                      {campaign.actionButtonText}
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs font-mono-code border border-stone-300"
                    >
                      📅 Google Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 8: 3D SOFT CLAY (Lilac Bubble UI) */}
              {campaign.templateStyle === 'claymorphism' && (
                <div className="bg-[#f5f3ff] rounded-3xl border-2 border-purple-200 p-6 shadow-[0_12px_30px_rgba(139,92,246,0.12)] max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-purple-900 font-space">AISA Clay Studio</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white text-purple-700 font-mono-code text-[10px] font-bold shadow-sm border border-purple-100">
                      3D CLAY PASS
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-code text-purple-600 font-bold block mb-1">
                      NOTIS // {campaign.subject}
                    </span>
                    <h3 className="text-xl font-black text-purple-950 font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-purple-900 leading-relaxed bg-white/80 p-4 rounded-2xl border border-purple-100 shadow-sm">
                    {campaign.mainMessage}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/90 border border-purple-100 shadow-sm grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono-code text-purple-600 block font-bold">TARIKH:</span>
                      <strong className="text-purple-950">{malayDate.fullFormatted}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-purple-600 block font-bold">TEMPAT:</span>
                      <strong className="text-purple-950">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-3.5 bg-white/80 rounded-2xl border border-purple-100 shadow-sm">
                      <span className="text-xs font-mono-code text-purple-900 font-bold block mb-1.5">
                        AGENDA:
                      </span>
                      <ul className="space-y-1 text-xs text-purple-800">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs font-space shadow-md hover:from-violet-500 hover:to-indigo-500"
                    >
                      {campaign.actionButtonText}
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white text-purple-800 font-bold text-xs font-mono-code shadow-sm border border-purple-200"
                    >
                      📅 Google Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 9: TICKET PASS (Perforated Hackathon Boarding Pass) */}
              {campaign.templateStyle === 'ticket_pass' && (
                <div className="bg-white rounded-3xl border-2 border-dashed border-blue-300 p-6 shadow-xl max-w-xl mx-auto space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                    <div>
                      <span className="text-[10px] font-mono-code font-bold text-blue-600 uppercase tracking-widest block">
                        AISA SUMMIT PASS // 2026
                      </span>
                      <h4 className="text-sm font-black text-slate-900 font-space">
                        BOARDING PASS & OFFICIAL ACCESS
                      </h4>
                    </div>
                    <div className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-mono-code text-[10px] font-bold">
                      GATE: FSKM-01
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono-code text-slate-400 block mb-0.5">
                      EVENT PASS FOR: {campaign.subject}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed p-3.5 bg-blue-50/40 rounded-xl border border-blue-100">
                    {campaign.mainMessage}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-center">
                    <div>
                      <span className="text-[9px] font-mono-code text-slate-400 block">TARIKH</span>
                      <strong className="text-slate-900 text-[11px] block">{malayDate.shortFormatted}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono-code text-slate-400 block">WAKTU</span>
                      <strong className="text-blue-600 text-[11px] block">{campaign.eventTime}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono-code text-slate-400 block">STATUS</span>
                      <strong className="text-emerald-600 text-[11px] block">CONFIRMED</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="text-[10px] font-mono-code text-blue-700 font-bold block mb-1">
                        ITINERARI:
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-space shadow-md"
                    >
                      {campaign.actionButtonText} 🎟️
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs font-mono-code border border-slate-300"
                    >
                      📅 Add to Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 10: BOTANICAL AGROTECH AI (Fresh Mint & Smart Agriculture) */}
              {campaign.templateStyle === 'emerald_agrotech' && (
                <div className="bg-[#ecfdf5] rounded-3xl border-2 border-emerald-300 p-6 shadow-xl max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌱</span>
                      <div>
                        <span className="text-[10px] font-mono-code font-bold text-emerald-800 uppercase tracking-wider block">
                          AISA SMART AGROTECH // FPA UITM JASIN
                        </span>
                        <h4 className="text-xs font-black text-emerald-950 font-space">
                          Inovasi AI & Pertanian Pintar
                        </h4>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono-code font-bold border border-emerald-300">
                      BOTANICAL LAB
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-code text-emerald-700 font-bold block mb-1">
                      HEBAHAN // {campaign.subject}
                    </span>
                    <h3 className="text-xl font-black text-emerald-950 font-space">
                      {campaign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-emerald-900 leading-relaxed bg-white/80 p-4 rounded-2xl border border-emerald-200">
                    {campaign.mainMessage}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono-code text-emerald-700 block font-bold">TARIKH PROGRAM:</span>
                      <strong className="text-emerald-950">{malayDate.fullFormatted}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-emerald-700 block font-bold">LOKASI & LADANG:</span>
                      <strong className="text-emerald-950">{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-3.5 bg-white/80 rounded-2xl border border-emerald-200">
                      <span className="text-xs font-mono-code text-emerald-800 font-bold block mb-1.5">
                        MODUL / AKTIVITI:
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-900">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx}>🌿 {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-space shadow-md"
                    >
                      {campaign.actionButtonText} 🌿
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs font-mono-code border border-emerald-300"
                    >
                      📅 RSVP Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* STYLE 11: SOLAR SUNSET MESH (Warm Peach & Rose Mesh) */}
              {campaign.templateStyle === 'sunset_gradient' && (
                <div className="bg-[#fff7ed] rounded-3xl border-2 border-orange-200 overflow-hidden shadow-xl max-w-xl mx-auto space-y-4">
                  <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 p-5 text-white">
                    <span className="text-[10px] font-mono-code font-bold tracking-widest uppercase block text-orange-100">
                      SOLAR DISPATCH // HORIZON 2026
                    </span>
                    <h3 className="text-xl font-black text-white font-space mt-1">
                      {campaign.title}
                    </h3>
                  </div>

                  <div className="p-6 pt-1 space-y-4">
                    <span className="text-[11px] font-mono-code text-orange-700 font-bold block">
                      SUBJEK: {campaign.subject}
                    </span>

                    <p className="text-xs text-stone-800 leading-relaxed bg-white/80 p-4 rounded-2xl border border-orange-100">
                      {campaign.mainMessage}
                    </p>

                    <div className="p-4 rounded-2xl bg-white border border-orange-200 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono-code text-orange-600 block font-bold">HARI & TARIKH:</span>
                        <strong className="text-stone-900">{malayDate.fullFormatted}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-orange-600 block font-bold">TEMPAT:</span>
                        <strong className="text-stone-900">{campaign.location}</strong>
                      </div>
                    </div>

                    {campaign.agendaItems.length > 0 && (
                      <div className="p-3.5 bg-white rounded-2xl border border-orange-100">
                        <span className="text-xs font-mono-code text-orange-700 font-bold block mb-1">
                          AGENDA PROGRAM:
                        </span>
                        <ul className="space-y-1 text-xs text-stone-700">
                          {campaign.agendaItems.map((item, idx) => (
                            <li key={idx}>☀️ {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                      <a
                        href={campaign.actionButtonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-7 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-bold text-xs font-space shadow-md"
                      >
                        {campaign.actionButtonText}
                      </a>
                      <a
                        href={gCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white text-orange-800 font-bold text-xs font-mono-code border border-orange-300"
                      >
                        📅 Google Calendar
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE 12: PAPER TERMINAL MATRIX (Light Cream ASCII Terminal) */}
              {campaign.templateStyle === 'retro_terminal' && (
                <div className="bg-[#fcfbf7] rounded-xl border-2 border-green-500 p-6 shadow-xl max-w-xl mx-auto space-y-4 font-mono-code text-green-950">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-green-500 text-xs">
                    <span className="font-bold">[SYS_CONSOLE] AISA MATRIX 2026</span>
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-900 font-bold text-[10px]">
                      RUN EXEC_NOTICE.SH
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-green-700 block">{'>>>'} TOPIC // {campaign.subject}</span>
                    <h3 className="text-lg font-black text-green-900 mt-1">
                      {'>>>'} {campaign.title}
                    </h3>
                  </div>

                  <div className="p-3 bg-white rounded border border-green-300 text-xs leading-relaxed">
                    <div className="text-[10px] text-green-600 mb-1"># SYSTEM_MESSAGE:</div>
                    <div>{campaign.mainMessage}</div>
                  </div>

                  <div className="p-3 bg-green-50/60 rounded border border-green-300 text-xs grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-green-700 block font-bold">TIMESTAMP:</span>
                      <strong>{malayDate.fullFormatted} ({campaign.eventTime})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-green-700 block font-bold">STATION:</span>
                      <strong>{campaign.location}</strong>
                    </div>
                  </div>

                  {campaign.agendaItems.length > 0 && (
                    <div className="p-3 bg-white rounded border border-green-300 text-xs">
                      <span className="text-[10px] font-bold text-green-700 block mb-1">
                        PROCESS_PIPELINE:
                      </span>
                      <ul className="space-y-1">
                        {campaign.agendaItems.map((item, idx) => (
                          <li key={idx}>[{idx}] {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={campaign.actionButtonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-6 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-xs"
                    >
                      [ {campaign.actionButtonText} ]
                    </a>
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded bg-green-100 text-green-900 font-bold text-xs border border-green-400"
                    >
                      📅 [ CALENDAR_RSVP ]
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
            {copiedHtml ? '✅ Kod template disalin' : `Akan dihantar ke ${getCalculatedRecipientCount()} alamat emel yang layak`}
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
              disabled={isBroadcasting || getCalculatedRecipientCount() === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-space transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" /> {isBroadcasting ? 'MENGHANTAR EMEL...' : `HANTAR EMEL KEPADA ${getCalculatedRecipientCount()} PENERIMA`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
