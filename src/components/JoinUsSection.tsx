import React, { useState } from 'react';
import { ClubRegistration, NoticeSubscriber } from '../types';
import { UserCheck, Sparkles, Send, Bell, CheckCircle2, ShieldCheck, Mail, Phone, Hash, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JoinUsSectionProps {
  onRegister: (registration: ClubRegistration) => void;
  onSubscribeNotice: (subscriber: NoticeSubscriber) => void;
  onPreviewEmail: (reg: ClubRegistration) => void;
}

export const JoinUsSection: React.FC<JoinUsSectionProps> = ({
  onRegister,
  onSubscribeNotice,
  onPreviewEmail,
}) => {
  // Join form state
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phoneNumber: '',
    program: 'CS251 - Sarjana Muda Sains Komputer (Kepintaran Buatan)',
    semester: 'Semester 1',
    aiInterest: 'Autonomous Agents & LLMs',
  });

  const [registeredSuccess, setRegisteredSuccess] = useState<ClubRegistration | null>(null);

  // Subscribe notice state
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeTopic, setSubscribeTopic] = useState('Semua Hebahan & Mesyuarat');
  const [subscribedNoticeModal, setSubscribedNoticeModal] = useState<NoticeSubscriber | null>(null);

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.studentId || !formData.email || !formData.phoneNumber) {
      alert('Sila lengkapkan semua medan yang diperlukan!');
      return;
    }

    const membershipNumber = Math.floor(1000 + Math.random() * 9000);
    const newReg: ClubRegistration = {
      id: `reg-${Date.now()}`,
      fullName: formData.fullName,
      studentId: formData.studentId,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      program: formData.program,
      semester: formData.semester,
      aiInterest: formData.aiInterest,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      membershipId: `AISA-2026-${membershipNumber}`,
      status: 'Aktif',
    };

    onRegister(newReg);
    setRegisteredSuccess(newReg);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06b6d4', '#a855f7', '#10b981'],
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    const newSub: NoticeSubscriber = {
      id: `sub-${Date.now()}`,
      email: subscribeEmail,
      subscribedAt: new Date().toISOString().split('T')[0],
      preferredTopic: subscribeTopic,
    };

    onSubscribeNotice(newSub);
    setSubscribedNoticeModal(newSub);
    setSubscribeEmail('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7, x: 0.3 },
      colors: ['#2563eb', '#7c3aed', '#10b981'],
    });
  };

  return (
    <section id="join-us" className="py-24 relative overflow-hidden bg-slate-950/70 border-t border-slate-900">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading, Perks, and Newsletter Subscription */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code font-semibold mb-3">
                <UserCheck className="w-3.5 h-3.5" /> PENDAFTARAN KEAHLIAN SESI 2026/2027
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-space tracking-tight leading-tight mb-4">
                Sertai Revolusi AI Bersama{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                  AISA UiTM Jasin
                </span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                Terbuka kepada semua mahasiswa KPPIM/FSKM UiTM Melaka Kampus Jasin. Dapatkan akses ke makmal superkomputer, bimbingan terus pensyarah penasihat, latihan hackathon intensif, dan sistem notis peringatan mesyuarat automatik ke emel anda!
              </p>

              {/* Membership Perks List */}
              <div className="space-y-3 mb-10">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-space">
                      Kad Keahlian Digital Rasmi
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Diberikan ID Keahlian rasmi yang diiktiraf fakulti dan pautan automatik ke Discord rasmi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-space">
                      Auto-Reminder Mesyuarat & Bengkel
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Emel peringatan bertema cyber automatik dihantar terus bagi setiap perjumpaan rasmi dan pendaftaran bengkel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK SUBSCRIBE BOX FOR GENERAL NOTICES */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white font-space">
                  Langgan Notis & Hebahan Sahaja (Bukan Ahli)
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Ingin terima hebahan pertandingan dan peluang latihan AI tanpa mendaftar sebagai ahli? Masukkan emel anda di sini:
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="emel.pelajar@isiswa.uitm.edu.my"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
                
                <div className="flex gap-2">
                  <select
                    value={subscribeTopic}
                    onChange={(e) => setSubscribeTopic(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Semua Hebahan & Mesyuarat">Semua Hebahan & Mesyuarat</option>
                    <option value="Pertandingan & Hackathon Sahaja">Pertandingan & Hackathon Sahaja</option>
                    <option value="Bengkel & Bootcamps AI">Bengkel & Bootcamps AI</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-space transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Langgan Notis
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Registration Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl relative">
              {registeredSuccess ? (
                <div className="py-8 text-center flex flex-col items-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white font-space mb-2">
                    Tahniah, Pendaftaran Berjaya!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">
                    Selamat datang <strong className="text-cyan-400">{registeredSuccess.fullName}</strong>. ID Keahlian rasmi anda ialah <span className="font-mono-code text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">{registeredSuccess.membershipId}</span>.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                    <button
                      onClick={() => onPreviewEmail(registeredSuccess)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs font-space shadow-lg shadow-indigo-600/30 transition-all"
                    >
                      <Mail className="w-4 h-4" /> LIHAT PREVIEW EMEL PENGESAHAN & PERINGATAN
                    </button>
                    <button
                      onClick={() => setRegisteredSuccess(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs font-space transition-colors"
                    >
                      Daftar Ahli Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono-code text-indigo-400 font-bold">
                      BORANG PENDAFTARAN AHLI (ONLINE APPLICATION)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code">
                      *Auto-email notification enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nama Penuh (Seperti Dalam Kad Matrik) *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="cth: Muhammad Ammar Syaathir"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        No. Pelajar UiTM (Student ID) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                          placeholder="cth: 2024123456"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white font-mono-code placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                        <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Emel Siswa / Emel Aktif *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="2024123456@isiswa.uitm.edu.my"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white font-mono-code placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Emel ini akan menerima jemputan mesyuarat automatik.
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        No. Telefon / WhatsApp *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="cth: 011-23456789"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white font-mono-code placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Program */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Kod & Program Pengajian (KPPIM)
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="CS251 - Sarjana Muda Sains Komputer (Kepintaran Buatan)">
                          CS251 - Sarjana Muda Sains Komputer (Kepintaran Buatan)
                        </option>
                        <option value="CS245 - Sarjana Muda Sains Komputer">
                          CS245 - Sarjana Muda Sains Komputer
                        </option>
                        <option value="CS240 - Sarjana Muda Teknologi Maklumat">
                          CS240 - Sarjana Muda Teknologi Maklumat
                        </option>
                        <option value="CS110 - Diploma Sains Komputer">
                          CS110 - Diploma Sains Komputer
                        </option>
                        <option value="Program Lain (KPPIM)">Program Lain (KPPIM)</option>
                      </select>
                    </div>

                    {/* Semester */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Semester Semasa
                      </label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6+">Semester 6+</option>
                      </select>
                    </div>

                    {/* AI Interest */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Bidang Kepintaran Buatan (AI) Paling Diminati
                      </label>
                      <select
                        value={formData.aiInterest}
                        onChange={(e) => setFormData({ ...formData, aiInterest: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Autonomous Agents & Large Language Models (LLM)">
                          Autonomous Agents & Large Language Models (LLM)
                        </option>
                        <option value="Computer Vision & Deep Learning">
                          Computer Vision & Deep Learning
                        </option>
                        <option value="Reinforcement Learning & Edge AI">
                          Reinforcement Learning & Edge AI
                        </option>
                        <option value="Data Engineering & Predictive Analytics">
                          Data Engineering & Predictive Analytics
                        </option>
                        <option value="UI/UX & Web Development for AI Apps">
                          UI/UX & Web Development for AI Apps
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold font-space text-sm shadow-xl shadow-indigo-600/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>HANTAR PERMOHONAN & TERIMA ID KEAHLIAN DIGITAL</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pengesahan Langganan Notis */}
      {subscribedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-mono-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2 inline-block">
              ⚡ DISIMPAN KE CLOUDFLARE D1
            </span>

            <h3 className="text-xl font-black text-white font-space mb-1">
              Notis Pengesahan Dihantar!
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Terima kasih! Kami telah menghantar notis pengesahan ke emel <strong className="text-cyan-400 font-mono-code">{subscribedNoticeModal.email}</strong> bagi topik <strong className="text-white font-mono-code">{subscribedNoticeModal.preferredTopic}</strong>.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs mb-5 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono-code">STATUS SISTEM EMEL:</div>
              <div className="text-white flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Salinan notis dihantar & direkod dalam email_logs</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  const subscriberModal = subscribedNoticeModal;
                  setSubscribedNoticeModal(null);
                  onPreviewEmail({
                    id: subscriberModal.id,
                    fullName: 'Pelanggan Buletin AISA',
                    studentId: 'Pelanggan Luar / Mahasiswa',
                    email: subscriberModal.email,
                    phoneNumber: '-',
                    program: 'Langganan Notis Sahaja',
                    semester: '-',
                    aiInterest: subscriberModal.preferredTopic,
                    registeredAt: subscriberModal.subscribedAt,
                    membershipId: 'SUBSCRIBER-ACTIVE',
                    status: 'Aktif',
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-space transition-colors"
              >
                Lihat Contoh Emel Buletin
              </button>
              <button
                onClick={() => setSubscribedNoticeModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-space"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
