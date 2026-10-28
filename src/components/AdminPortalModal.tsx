import React, { useState } from 'react';
import { CommitteeMember, Announcement, Activity, ClubRegistration, NoticeSubscriber, LecturerAdvisor } from '../types';
import { X, Save, User, Bell, History, Database, Check, Users, Mail, Send, Download, Sparkles, RefreshCw, GraduationCap } from 'lucide-react';

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
  initialEditMember,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'registrations' | 'announcement' | 'activity' | 'subscribers' | 'cloudflare'>('profile');

  // Profile Edit State
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialEditMember ? initialEditMember.id : members[0]?.id || ''
  );
  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const [profileForm, setProfileForm] = useState<CommitteeMember>(() => {
    return initialEditMember || currentMember || ({} as CommitteeMember);
  });

  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
    const target = members.find((m) => m.id === id);
    if (target) {
      setProfileForm({ ...target });
    }
  };

  // Announcement Form State
  const [newAnn, setNewAnn] = useState<Partial<Announcement>>({
    title: '',
    category: 'Pertandingan',
    description: '',
    date: new Date().toISOString().split('T')[0],
    deadline: '30 Nov 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    registrationLink: 'https://forms.gle/',
    isUrgent: false,
    status: 'Open',
  });

  // Activity Form State
  const [newAct, setNewAct] = useState<Partial<Activity>>({
    title: '',
    date: '10 Nov 2026',
    category: 'Workshop',
    summary: '',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'
    ],
    attendeesCount: 80,
    highlightText: '100% Peserta Berjaya Selesaikan Model'
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMember(profileForm);
    showNotify('✅ Profil Exco berjaya dikemas kini! Carta Organisasi telah diperbaharui.');
  };

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
      bannerUrl: newAnn.bannerUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      registrationLink: newAnn.registrationLink,
      isUrgent: newAnn.isUrgent,
      status: (newAnn.status as Announcement['status']) || 'Open',
    };
    onAddAnnouncement(annItem);
    showNotify('🎉 Hebahan & Notis baru berjaya dimuat naik ke laman web!');
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAct.title || !newAct.summary) return;
    const actItem: Activity = {
      id: `act-${Date.now()}`,
      title: newAct.title || 'Aktiviti Baru',
      date: newAct.date || 'Tarikh Acara',
      category: (newAct.category as Activity['category']) || 'Workshop',
      summary: newAct.summary || '',
      coverImage: newAct.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      gallery: newAct.gallery || [],
      attendeesCount: newAct.attendeesCount || 50,
      highlightText: newAct.highlightText || 'Pencapaian Berjaya Dicatat'
    };
    onAddActivity(actItem);
    showNotify('🏆 Rekod aktiviti lepas berjaya ditambah ke arkib!');
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
      r.registeredAt
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white font-space">
                PORTAL PENGURUSAN EXCO & ADMIN AISA
              </h3>
              <p className="text-xs text-slate-400">
                Pusat kemas kini carta organisasi, pendaftaran ahli, reminder emel & pangkalan data.
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Kemas Kini Profil Exco (Carta)
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'registrations'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Ahli Berdaftar ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'announcement'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Tambah Hebahan
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Tambah Aktiviti
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subscribers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Langganan Notis ({subscribers.length})
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
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
          {/* TAB 1: EXCO PROFILE UPDATE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-300 block mb-2 font-mono-code">
                  PILIH NAMA EXCO UNTUK DIKEMAS KINI:
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => handleSelectMember(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.role} - {m.name} ({m.department})
                    </option>
                  ))}
                </select>
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

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">URL Gambar Profil</label>
                  <input
                    type="url"
                    value={profileForm.photoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
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

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Bidang Minat Penyelidikan AI</label>
                  <input
                    type="text"
                    value={profileForm.aiSpecialty}
                    onChange={(e) => setProfileForm({ ...profileForm, aiSpecialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
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

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-space shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Save className="w-4 h-4" /> SIMPAN PERUBAHAN KE CARTA ORGANISASI
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTERED MEMBERS (JOIN US DATA) */}
          {activeTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30">
                <div>
                  <h4 className="text-sm font-bold text-white font-space flex items-center gap-2">
                    <span>Pengurusan Ahli & Konsol Emel Mesyuarat</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      {registrations.length} Pelajar Berdaftar
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Data masuk secara langsung daripada borang web tanpa sebarang Google Form. Exco boleh semak, tetapkan PIC, dan hantar emel mesyuarat.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenEmailStudio}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-space transition-all shadow-lg shadow-purple-600/30 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> Buka Email Studio (Blast Mesyuarat)
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
                      <th className="p-3">Status Permohonan</th>
                      <th className="p-3">Exco PIC</th>
                      <th className="p-3 text-right">Tindakan Emel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono-code text-cyan-400 font-bold">{reg.membershipId}</td>
                        <td className="p-3">
                          <strong className="text-white block">{reg.fullName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono-code">{reg.studentId} • {reg.email}</span>
                        </td>
                        <td className="p-3 font-mono-code text-slate-300">{reg.phoneNumber}</td>
                        <td className="p-3 text-slate-300">
                          <span>{reg.program}</span>
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
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => onTriggerEmailToMember(reg, 'welcome')}
                            className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 text-[10px] font-mono-code font-bold transition-colors"
                            title="Emel ID & Welcome"
                          >
                            Emel ID
                          </button>
                          <button
                            onClick={() => onTriggerEmailToMember(reg, 'meeting')}
                            className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-200 text-[10px] font-mono-code font-bold transition-colors"
                            title="Auto Reminder Mesyuarat"
                          >
                            Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENT */}
          {activeTab === 'announcement' && (
            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tajuk Hebahan / Pertandingan</label>
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

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tarikh Tutup / Deadline</label>
                  <input
                    type="text"
                    value={newAnn.deadline}
                    onChange={(e) => setNewAnn({ ...newAnn, deadline: e.target.value })}
                    placeholder="cth: 15 Nov 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Pautan Google Form / Web Pendaftaran</label>
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
                <label className="text-xs font-bold text-slate-400 block mb-1">Penerangan Penuh Hebahan</label>
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

          {/* TAB 4: ACTIVITY */}
          {activeTab === 'activity' && (
            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tajuk Aktiviti</label>
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
                  <label className="text-xs font-bold text-slate-400 block mb-1">Tarikh Aktiviti</label>
                  <input
                    type="text"
                    value={newAct.date}
                    onChange={(e) => setNewAct({ ...newAct, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Highlight / Pencapaian Utama</label>
                  <input
                    type="text"
                    value={newAct.highlightText}
                    onChange={(e) => setNewAct({ ...newAct, highlightText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Ringkasan Aktiviti</label>
                <textarea
                  rows={3}
                  value={newAct.summary}
                  onChange={(e) => setNewAct({ ...newAct, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-space shadow-lg shadow-purple-600/30 transition-all"
                >
                  <Save className="w-4 h-4" /> SIMPAN REKOD AKTIVITI
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-space">
                Senarai Emel Pelanggan Notis & Buletin
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono-code border-b border-slate-800">
                    <tr>
                      <th className="p-3">Emel Pelanggan</th>
                      <th className="p-3">Topik Diminati</th>
                      <th className="p-3">Tarikh Langganan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono-code text-cyan-300 font-bold">{sub.email}</td>
                        <td className="p-3 text-slate-300">{sub.preferredTopic}</td>
                        <td className="p-3 font-mono-code text-slate-400">{sub.subscribedAt}</td>
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
                Pangkalan data Cloudflare D1 kini menyokong jadual <strong>advisors</strong>, <strong>committee_members</strong>, <strong>announcements</strong>, <strong>club_registrations</strong>, dan <strong>subscribers</strong>.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 font-mono-code">
                  CONTOH SEED SQL UNTUK AHLI BERDAFTAR & PENASIHAT:
                </label>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono-code text-cyan-300 overflow-x-auto max-h-48">
{`-- Skrip Cloudflare D1 Database
CREATE TABLE IF NOT EXISTS advisors (
  id TEXT PRIMARY KEY,
  name TEXT,
  title TEXT,
  faculty TEXT,
  room TEXT,
  email TEXT,
  research_area TEXT,
  consultation_hours TEXT
);

CREATE TABLE IF NOT EXISTS club_registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  student_id TEXT,
  email TEXT,
  phone_number TEXT,
  program TEXT,
  semester TEXT,
  ai_interest TEXT,
  membership_id TEXT,
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
