import React, { useState, useEffect, useRef } from 'react';
import { CommitteeMember, Announcement, Activity, ClubRegistration, NoticeSubscriber, LecturerAdvisor, AI_RESEARCH_FIELDS } from '../types';
import { X, Save, User, Bell, History, Database, Check, Users, Mail, Send, Download, Sparkles, RefreshCw, GraduationCap, Trash2, Upload, Image as ImageIcon, Calendar, Clock, MapPin, Award, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatMalayDate } from '../utils/dateFormatter';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: CommitteeMember[];
  registrations: ClubRegistration[];
  subscribers: NoticeSubscriber[];
  advisors: LecturerAdvisor[];
  onUpdateMember: (member: CommitteeMember) => void;
  onAddAnnouncement: (ann: Announcement) => void;
  onAddActivity: (act: Activity) => void;
  onResetData: () => void;
  onTriggerEmailToMember: (member: ClubRegistration, template: 'welcome' | 'meeting' | 'notice') => void;
  onOpenEmailStudio: () => void;
  onUpdateRegStatus: (id: string, status: ClubRegistration['status'], assignedPic?: string) => void;
  onDeleteRegistration: (id: string) => void;
  initialEditMember?: CommitteeMember | null;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  members,
  registrations,
  subscribers,
  advisors,
  onUpdateMember,
  onAddAnnouncement,
  onAddActivity,
  onResetData,
  onTriggerEmailToMember,
  onOpenEmailStudio,
  onUpdateRegStatus,
  onDeleteRegistration,
  initialEditMember,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'registrations' | 'announcement' | 'activity' | 'subscribers' | 'cloudflare'>('profile');

  // 1. Profile Edit State & Auto-save (3 Detik)
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialEditMember ? initialEditMember.id : members[0]?.id || ''
  );
  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const [profileForm, setProfileForm] = useState<CommitteeMember>(() => {
    return initialEditMember || currentMember || ({} as CommitteeMember);
  });

  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'typing' | 'saving'>('saved');
  const isFirstRender = useRef(true);
  const autoSaveTimerRef = useRef<any>(null);

  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
    const target = members.find((m) => m.id === id);
    if (target) {
      setProfileForm({ ...target });
      setAutoSaveStatus('saved');
    }
  };

  // Auto-Save Effect (3 Detik / 3000ms delay debounce)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!profileForm.id) return;

    setAutoSaveStatus('typing');
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      setAutoSaveStatus('saving');
      onUpdateMember(profileForm);
      setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 600);
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [profileForm]);

  // 2. Announcement Form State (1-2 Images, Date Picker)
  const [newAnn, setNewAnn] = useState<Partial<Announcement>>({
    title: '',
    category: 'Pertandingan',
    description: '',
    date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    eventTime: '08:30',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    bannerUrl2: '',
    location: 'Dewan Al-Khawarizmi, FSKM Jasin',
    registrationLink: 'https://forms.gle/',
    isUrgent: false,
    status: 'Open',
  });

  // 3. Activity Form State (1-4 Pictures, Date, Total Peserta, Output, AI Field)
  const [newAct, setNewAct] = useState<{
    title: string;
    date: string;
    category: Activity['category'];
    summary: string;
    coverImage: string;
    gallerySlot2: string;
    gallerySlot3: string;
    gallerySlot4: string;
    attendeesCount: number;
    highlightText: string;
    aiField: string;
    location: string;
  }>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Workshop',
    summary: '',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    gallerySlot2: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    gallerySlot3: '',
    gallerySlot4: '',
    attendeesCount: 85,
    highlightText: '12 Prototaip AI Berjaya Dibina & Diuji',
    aiField: 'Autonomous Agents & Large Language Models (LLM)',
    location: 'Makmal Al-Khawarizmi, UiTM Jasin & Google Meet',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper: File Upload to base64 Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Saiz gambar terlalu besar (Maksimum 4MB). Sila pilih gambar yang lebih kecil.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        callback(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Announcement Handler
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.description) return;
    const annItem: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnn.title || 'Hebahan Baru',
      category: (newAnn.category as Announcement['category']) || 'Hebahan',
      description: newAnn.description || '',
      date: newAnn.date || new Date().toISOString().split('T')[0],
      deadline: newAnn.deadline,
      eventTime: newAnn.eventTime,
      location: newAnn.location,
      bannerUrl: newAnn.bannerUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      bannerUrl2: newAnn.bannerUrl2 || undefined,
      registrationLink: newAnn.registrationLink,
      isUrgent: newAnn.isUrgent,
      status: (newAnn.status as Announcement['status']) || 'Open',
    };
    onAddAnnouncement(annItem);
    showNotify('🎉 Hebahan & Notis baru berjaya dimuat naik bersama tarikh & gambar!');
  };

  // Save Activity Handler
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAct.title || !newAct.summary) return;

    // Collect up to 3 sub-gallery images (making 1-4 pictures total)
    const galleryImages: string[] = [];
    if (newAct.gallerySlot2.trim()) galleryImages.push(newAct.gallerySlot2.trim());
    if (newAct.gallerySlot3.trim()) galleryImages.push(newAct.gallerySlot3.trim());
    if (newAct.gallerySlot4.trim()) galleryImages.push(newAct.gallerySlot4.trim());

    const actItem: Activity = {
      id: `act-${Date.now()}`,
      title: newAct.title || 'Aktiviti Baru',
      date: newAct.date || new Date().toISOString().split('T')[0],
      category: newAct.category,
      summary: newAct.summary || '',
      coverImage: newAct.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      gallery: galleryImages,
      attendeesCount: Number(newAct.attendeesCount) || 50,
      highlightText: newAct.highlightText || 'Pencapaian Berjaya Dicatat',
      aiField: newAct.aiField,
      location: newAct.location,
    };
    onAddActivity(actItem);
    showNotify('🏆 Rekod aktiviti lepas berjaya ditambah bersama 1-4 gambar & output!');
  };

  // Delete Member Handler
  const handleDeleteMember = (reg: ClubRegistration) => {
    if (confirm(`Adakah anda pasti mahu memadamkan ahli ${reg.fullName} (${reg.studentId}) daripada sistem pendaftaran & Cloudflare D1?`)) {
      onDeleteRegistration(reg.id);
      showNotify(`🗑️ Ahli ${reg.fullName} (${reg.studentId}) telah dipadam daripada rekod.`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Membership ID', 'Nama', 'Student ID', 'Email', 'Phone', 'Program', 'Semester', 'Minat AI', 'Tarikh Daftar'];
    const rows = registrations.map(r => [
      r.membershipId,
      `"${r.fullName}"`,
      r.studentId,
      r.email,
      r.phoneNumber,
      `"${r.program}"`,
      r.semester,
      `"${r.aiInterest}"`,
      r.registeredAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AISA_Ahli_Berdaftar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotify('📥 Senarai ahli berjaya dieksport ke CSV!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-space">
                PORTAL PENGURUSAN EXCO & ADMIN AISA
              </h3>
              <p className="text-xs text-slate-400">
                Pusat kemas kini carta organisasi, pendaftaran ahli, auto-save pintar & arkib aktiviti.
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

        {/* Notification Toast */}
        {notification && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold font-mono-code flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 my-4 shrink-0 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profil Exco (Auto-Save 3 Detik)
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'registrations'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Ahli Berdaftar ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'announcement'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Tambah Hebahan (1-2 Gambar)
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Tambah Aktiviti (1-4 Gambar)
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subscribers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Langganan Notis ({subscribers.length})
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cloudflare'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Cloudflare D1 SQL
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* TAB 1: EXCO PROFILE UPDATE (AUTO-SAVE 3 DETIK, TIADA BUTTON SIMPAN) */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Member Picker & Live Auto-Save Status */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-300 block mb-1 font-mono-code">
                    PILIH NAMA EXCO UNTUK DIKEMAS KINI:
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => handleSelectMember(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.role} - {m.name} ({m.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Auto-Save Status Indicator */}
                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  {autoSaveStatus === 'typing' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono-code animate-pulse">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Sedang menaip... auto-save dalam 3 saat</span>
                    </span>
                  )}
                  {autoSaveStatus === 'saving' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono-code">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke sistem...</span>
                    </span>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Disimpan secara automatik (3 detik)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Nama Penuh</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Jawatan / Gelaran</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Profile Photo with Upload or URL */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Gambar Profil (Upload / URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={profileForm.photoUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setProfileForm({ ...profileForm, photoUrl: url }))}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Program & Semester</label>
                  <input
                    type="text"
                    value={profileForm.yearProgram}
                    onChange={(e) => setProfileForm({ ...profileForm, yearProgram: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Bidang Minat Penyelidikan AI (DROPDOWN PILIH JE) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center justify-between">
                    <span>Bidang Minat Penyelidikan AI (Dropdown)</span>
                    <span className="text-[10px] text-cyan-400 font-mono-code">Pilih Terus</span>
                  </label>
                  <select
                    value={profileForm.aiSpecialty}
                    onChange={(e) => setProfileForm({ ...profileForm, aiSpecialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {AI_RESEARCH_FIELDS.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Emel Pelajar / Rasmi</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Bio / Pengenalan Diri Ringkas</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Informative Auto-Save Note (Button Simpan Dibuang) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-mono-code text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sistem auto-save aktif: Sebarang perubahan disimpan automatik dalam tempoh 3 saat tanpa perlu klik butang.</span>
                </span>
                <span className="text-[10px] font-mono-code text-indigo-400 font-bold uppercase">
                  STATUS: {autoSaveStatus.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTERED MEMBERS WITH DELETE ACTION */}
          {activeTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30">
                <div>
                  <h4 className="text-sm font-bold text-white font-space flex items-center gap-2">
                    <span>Pengurusan Ahli & Tindakan Emel</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      {registrations.length} Pelajar Berdaftar
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Data disimpan dalam Cloudflare D1. Exco boleh semak status, hantar emel, atau padam ahli jika perlu.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenEmailStudio}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-space transition-all shadow-lg shadow-purple-600/30 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> Buka Email Studio (Blast)
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold font-mono-code transition-colors shrink-0"
                    title="Muat Turun Senarai Ahli"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono-code border-b border-slate-800">
                    <tr>
                      <th className="p-3">ID Ahli</th>
                      <th className="p-3">Nama & No. Matrik</th>
                      <th className="p-3">No. Telefon</th>
                      <th className="p-3">Program</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Exco PIC</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          Tiada rekod ahli berdaftar buat masa ini.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono-code text-cyan-400 font-bold">{reg.membershipId}</td>
                          <td className="p-3">
                            <strong className="text-white block">{reg.fullName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono-code">{reg.studentId} • {reg.email}</span>
                          </td>
                          <td className="p-3 font-mono-code text-slate-300">{reg.phoneNumber}</td>
                          <td className="p-3 text-slate-300">
                            <span className="line-clamp-1">{reg.program}</span>
                            <span className="block text-[10px] text-indigo-400 font-mono-code">{reg.semester}</span>
                          </td>
                          <td className="p-3">
                            <select
                              value={reg.status}
                              onChange={(e) => onUpdateRegStatus(reg.id, e.target.value as any, reg.assignedPic)}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-mono-code text-white focus:outline-none focus:border-indigo-500"
                            >
                              <option value="Baru">🟡 Baru</option>
                              <option value="Disemak">🔵 Disemak</option>
                              <option value="Lulus">🟢 Lulus</option>
                              <option value="Perlu Dihubungi">🔴 Perlu Dihubungi</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select
                              value={reg.assignedPic || 'Belum Ditetapkan'}
                              onChange={(e) => onUpdateRegStatus(reg.id, reg.status, e.target.value)}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="Belum Ditetapkan">- Pilih PIC -</option>
                              <option value="Muhammad Faris (YDP)">Muhammad Faris (YDP)</option>
                              <option value="Nur Aisyah (TYDP)">Nur Aisyah (TYDP)</option>
                              <option value="Wan Amirul (SU)">Wan Amirul (SU)</option>
                              <option value="Siti Sarah (Bendahari)">Siti Sarah (Bendahari)</option>
                              <option value="Harith Iskandar (Ketua AI)">Harith Iskandar (Ketua AI)</option>
                              <option value="Alia Maisarah (Ketua Media)">Alia Maisarah (Ketua Media)</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onTriggerEmailToMember(reg, 'welcome')}
                                className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 text-[10px] font-mono-code font-bold transition-colors"
                                title="Emel Kad Keahlian"
                              >
                                Kad ID
                              </button>
                              <button
                                onClick={() => onTriggerEmailToMember(reg, 'meeting')}
                                className="px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-200 text-[10px] font-mono-code font-bold transition-colors"
                                title="Hantar Notis Mesyuarat"
                              >
                                Notis
                              </button>
                              {/* DELETE BUTTON (HOW NAK DELETE AHLI BERDAFTAR) */}
                              <button
                                onClick={() => handleDeleteMember(reg)}
                                className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors"
                                title="Padam Ahli Berdaftar Ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENT (1-2 PICTURES & DATE PICKER) */}
          {activeTab === 'announcement' && (
            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tajuk Hebahan / Pertandingan *</label>
                  <input
                    type="text"
                    value={newAnn.title}
                    onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                    placeholder="cth: UiTM Melaka Hackathon AI 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Kategori</label>
                  <select
                    value={newAnn.category}
                    onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value as Announcement['category'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Pertandingan">Pertandingan</option>
                    <option value="Bengkel">Bengkel</option>
                    <option value="Hebahan">Hebahan</option>
                    <option value="Notis Penting">Notis Penting</option>
                    <option value="Mesyuarat">Mesyuarat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Status Pendaftaran</label>
                  <select
                    value={newAnn.status}
                    onChange={(e) => setNewAnn({ ...newAnn, status: e.target.value as Announcement['status'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Open">Open (Buka)</option>
                    <option value="Coming Soon">Coming Soon (Akan Datang)</option>
                    <option value="Closed">Closed (Tutup)</option>
                  </select>
                </div>

                {/* DATE PICKERS FOR HEBAHAN */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tarikh Acara / Hebahan (Date Picker)</span>
                  </label>
                  <input
                    type="date"
                    value={newAnn.date}
                    onChange={(e) => setNewAnn({ ...newAnn, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-code"
                    required
                  />
                  {newAnn.date && (
                    <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono-code text-cyan-300 flex items-center justify-between">
                      <span><strong>HARI:</strong> {formatMalayDate(newAnn.date).dayName}</span>
                      <span><strong>TARIKH:</strong> {formatMalayDate(newAnn.date).dayNumber}</span>
                      <span><strong>BULAN:</strong> {formatMalayDate(newAnn.date).monthName}</span>
                      <span><strong>TAHUN:</strong> {formatMalayDate(newAnn.date).year}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tarikh Tutup / Deadline (Date Picker)</span>
                  </label>
                  <input
                    type="date"
                    value={newAnn.deadline}
                    onChange={(e) => setNewAnn({ ...newAnn, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-code"
                  />
                  {newAnn.deadline && (
                    <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-[11px] font-mono-code text-amber-300 flex items-center justify-between">
                      <span><strong>HARI:</strong> {formatMalayDate(newAnn.deadline).dayName}</span>
                      <span><strong>TARIKH:</strong> {formatMalayDate(newAnn.deadline).dayNumber}</span>
                      <span><strong>BULAN:</strong> {formatMalayDate(newAnn.deadline).monthName}</span>
                      <span><strong>TAHUN:</strong> {formatMalayDate(newAnn.deadline).year}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Masa Program (Time Picker)</span>
                  </label>
                  <input
                    type="time"
                    value={newAnn.eventTime}
                    onChange={(e) => setNewAnn({ ...newAnn, eventTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-code"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lokasi Acara</span>
                  </label>
                  <input
                    type="text"
                    value={newAnn.location}
                    onChange={(e) => setNewAnn({ ...newAnn, location: e.target.value })}
                    placeholder="cth: Dewan Al-Khawarizmi & Google Meet"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* GAMBAR 1 & GAMBAR 2 (UPLOAD GAMBAR 1/2 EACH) */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono-code flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span>MUAT NAIK GAMBAR POSTER / HEBAHAN (1 ATAU 2 GAMBAR):</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono-code">Max 4MB setiap gambar</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image 1 */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">Gambar Utama / Poster (Wajib)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAnn.bannerUrl}
                          onChange={(e) => setNewAnn({ ...newAnn, bannerUrl: e.target.value })}
                          placeholder="URL atau klik upload..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <label className="px-3 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-200 text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => setNewAnn({ ...newAnn, bannerUrl: url }))}
                          />
                        </label>
                      </div>
                      {newAnn.bannerUrl && (
                        <div className="relative h-28 rounded-xl overflow-hidden border border-slate-700">
                          <img src={newAnn.bannerUrl} alt="Preview 1" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1.5 py-0.5 rounded text-white font-mono-code">
                            Gambar 1
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image 2 (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">Gambar Kedua / Infografik (Pilihan)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAnn.bannerUrl2 || ''}
                          onChange={(e) => setNewAnn({ ...newAnn, bannerUrl2: e.target.value })}
                          placeholder="URL atau klik upload..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <label className="px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => setNewAnn({ ...newAnn, bannerUrl2: url }))}
                          />
                        </label>
                      </div>
                      {newAnn.bannerUrl2 ? (
                        <div className="relative h-28 rounded-xl overflow-hidden border border-slate-700">
                          <img src={newAnn.bannerUrl2} alt="Preview 2" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewAnn({ ...newAnn, bannerUrl2: '' })}
                            className="absolute top-1 right-1 bg-rose-600 p-1 rounded-md text-white text-[10px]"
                          >
                            ✕
                          </button>
                          <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1.5 py-0.5 rounded text-white font-mono-code">
                            Gambar 2
                          </span>
                        </div>
                      ) : (
                        <div className="h-28 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                          Tiada Gambar Kedua Ditambah
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Pautan Pendaftaran Luar (Google Form / Portal)</label>
                  <input
                    type="url"
                    value={newAnn.registrationLink}
                    onChange={(e) => setNewAnn({ ...newAnn, registrationLink: e.target.value })}
                    placeholder="https://forms.gle/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Penerangan Penuh Hebahan *</label>
                <textarea
                  rows={3}
                  value={newAnn.description}
                  onChange={(e) => setNewAnn({ ...newAnn, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-space shadow-lg shadow-cyan-600/30 transition-all"
                >
                  <Save className="w-4 h-4" /> TERBITKAN HEBAHAN SEKARANG
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ACTIVITY (1-4 PICTURES, DATE, TOTAL PESERTA, OUTPUT, AI SPECIALTY) */}
          {activeTab === 'activity' && (
            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tajuk Aktiviti *</label>
                  <input
                    type="text"
                    value={newAct.title}
                    onChange={(e) => setNewAct({ ...newAct, title: e.target.value })}
                    placeholder="cth: Bengkel Vision AI & OpenCV 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Kategori Program</label>
                  <select
                    value={newAct.category}
                    onChange={(e) => setNewAct({ ...newAct, category: e.target.value as Activity['category'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Workshop">Workshop (Bengkel Teknikal)</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Lawatan Industri">Lawatan Industri</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                {/* DATE PICKER FOR ACTIVITY */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tarikh Aktiviti (Date Picker) *</span>
                  </label>
                  <input
                    type="date"
                    value={newAct.date}
                    onChange={(e) => setNewAct({ ...newAct, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-code"
                    required
                  />
                  {newAct.date && (
                    <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[11px] font-mono-code text-purple-300 flex items-center justify-between">
                      <span><strong>HARI:</strong> {formatMalayDate(newAct.date).dayName}</span>
                      <span><strong>TARIKH:</strong> {formatMalayDate(newAct.date).dayNumber}</span>
                      <span><strong>BULAN:</strong> {formatMalayDate(newAct.date).monthName}</span>
                      <span><strong>TAHUN:</strong> {formatMalayDate(newAct.date).year}</span>
                    </div>
                  )}
                </div>

                {/* TOTAL PESERTA */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Jumlah Kehadiran / Peserta (Total Peserta) *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newAct.attendeesCount}
                    onChange={(e) => setNewAct({ ...newAct, attendeesCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-code"
                    required
                  />
                </div>

                {/* OUTPUT / HASIL PROJEK */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Output / Hasil Impak Projek *</span>
                  </label>
                  <input
                    type="text"
                    value={newAct.highlightText}
                    onChange={(e) => setNewAct({ ...newAct, highlightText: e.target.value })}
                    placeholder="cth: 12 Prototaip Model AI Berjaya Dilatih"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* BIDANG PENYELIDIKAN AI (DROPDOWN) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Bidang Minat Penyelidikan AI (Dropdown)</span>
                  </label>
                  <select
                    value={newAct.aiField}
                    onChange={(e) => setNewAct({ ...newAct, aiField: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {AI_RESEARCH_FIELDS.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lokasi Aktiviti</span>
                  </label>
                  <input
                    type="text"
                    value={newAct.location}
                    onChange={(e) => setNewAct({ ...newAct, location: e.target.value })}
                    placeholder="cth: Makmal Al-Khawarizmi & Google Meet"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 1 TO 4 PICTURES UPLOAD SECTION */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono-code flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      <span>GALERI GAMBAR PROGRAM (1 HINGGA 4 GAMBAR):</span>
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono-code">Upload terus atau tampal pautan URL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Picture 1: Cover Image (Required) */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-purple-300 block font-mono-code">
                        Gambar 1 (Cover Utama) *
                      </span>
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={newAct.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                      <label className="w-full py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> Tukar Cover
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setNewAct({ ...newAct, coverImage: url }))}
                        />
                      </label>
                    </div>

                    {/* Picture 2 (Gallery Slot 2) */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block font-mono-code">
                        Gambar 2 (Sesi Bengkel)
                      </span>
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        {newAct.gallerySlot2 ? (
                          <img src={newAct.gallerySlot2} alt="Slot 2" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">
                            Tiada Gambar
                          </div>
                        )}
                      </div>
                      <label className="w-full py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> Upload Slot 2
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setNewAct({ ...newAct, gallerySlot2: url }))}
                        />
                      </label>
                    </div>

                    {/* Picture 3 (Gallery Slot 3) */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block font-mono-code">
                        Gambar 3 (Penyampaian Sijil)
                      </span>
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        {newAct.gallerySlot3 ? (
                          <img src={newAct.gallerySlot3} alt="Slot 3" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">
                            Tiada Gambar
                          </div>
                        )}
                      </div>
                      <label className="w-full py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> Upload Slot 3
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setNewAct({ ...newAct, gallerySlot3: url }))}
                        />
                      </label>
                    </div>

                    {/* Picture 4 (Gallery Slot 4) */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block font-mono-code">
                        Gambar 4 (Kumpulan Peserta)
                      </span>
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        {newAct.gallerySlot4 ? (
                          <img src={newAct.gallerySlot4} alt="Slot 4" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">
                            Tiada Gambar
                          </div>
                        )}
                      </div>
                      <label className="w-full py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> Upload Slot 4
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setNewAct({ ...newAct, gallerySlot4: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Ringkasan Aktiviti *</label>
                <textarea
                  rows={3}
                  value={newAct.summary}
                  onChange={(e) => setNewAct({ ...newAct, summary: e.target.value })}
                  placeholder="Terangkan secara ringkas objektif, pengisian bengkel, dan penglibatan mahasiswa..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-space shadow-lg shadow-purple-600/30 transition-all"
                >
                  <Save className="w-4 h-4" /> SIMPAN REKOD AKTIVITI KE ARKIB
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-space">
                    Senarai Emel Pelanggan Notis & Buletin
                  </h4>
                  <p className="text-xs text-slate-400">
                    Pelanggan hanya akan menerima hebahan mengikut kategori topik yang dilanggan.
                  </p>
                </div>
                <button
                  onClick={onOpenEmailStudio}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-space flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Hantar Emel Notis
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono-code border-b border-slate-800">
                    <tr>
                      <th className="p-3">Emel Pelanggan</th>
                      <th className="p-3">Topik Minat Langganan</th>
                      <th className="p-3">Tarikh Langganan</th>
                      <th className="p-3 text-right">Peraturan Penghantaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono-code text-cyan-300 font-bold">{sub.email}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[10px] font-mono-code font-bold">
                            {sub.preferredTopic}
                          </span>
                        </td>
                        <td className="p-3 font-mono-code text-slate-400">{sub.subscribedAt}</td>
                        <td className="p-3 text-right text-[10px] text-slate-400 font-mono-code">
                          {sub.preferredTopic.includes('Semua') ? 'Terima Semua Emel' : `Hanya emel bertopik ${sub.preferredTopic}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CLOUDFLARE SYNC & BACKUP */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <strong className="block font-bold mb-1">⚡ Cloudflare D1 Multi-Table Schema</strong>
                Pangkalan data Cloudflare D1 kini menyokong jadual <strong>advisors</strong>, <strong>committee_members</strong>, <strong>announcements</strong>, <strong>club_registrations</strong>, dan <strong>notice_subscribers</strong>.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 font-mono-code">
                  CONTOH SEED SQL UNTUK AHLI BERDAFTAR & PENASIHAT:
                </label>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono-code text-cyan-300 overflow-x-auto max-h-48">
{`-- Skrip Cloudflare D1 Database
CREATE TABLE IF NOT EXISTS club_registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  student_id TEXT UNIQUE,
  email TEXT,
  phone_number TEXT,
  program TEXT,
  semester TEXT,
  ai_interest TEXT,
  membership_id TEXT,
  status TEXT DEFAULT 'Baru',
  assigned_pic TEXT DEFAULT 'Belum Ditetapkan',
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ingin pulihkan data kepada asal?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Kembalikan semua data kepada asal?')) {
                      onResetData();
                      showNotify('Data dikembalikan ke asal.');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-xs font-mono-code"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Data Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
