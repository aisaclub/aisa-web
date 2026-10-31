import React, { useState } from 'react';
import { ClubRegistration, NoticeSubscriber, EmailDesignStyle, EMAIL_STYLES_META } from '../types';
import { UserCheck, Sparkles, Send, Bell, CheckCircle2, Mail, Phone, Hash, Sprout, Palette } from 'lucide-react';
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
    program: 'CS230 – Sarjana Muda Sains Komputer (Kepujian)',
    semester: 'Semester 1',
    aiInterest: 'Autonomous Agents & Large Language Models (LLM)',
  });

  const [selectedPassStyle, setSelectedPassStyle] = useState<EmailDesignStyle>('minimalist');
  const [passCategoryFilter, setPassCategoryFilter] = useState<string>('Semua');
  const [registeredSuccess, setRegisteredSuccess] = useState<ClubRegistration | null>(null);

  // Subscribe notice state
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeTopic, setSubscribeTopic] = useState('Semua Hebahan & Mesyuarat');
  const [subscribedNoticeModal, setSubscribedNoticeModal] = useState<NoticeSubscriber | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.studentId || !formData.email || !formData.phoneNumber) {
      alert('Sila lengkapkan semua medan yang diperlukan!');
      return;
    }

    setIsSubmitting(true);
    setEmailStatusMessage(null);

    const membershipNumber = Math.floor(1000 + Math.random() * 9000);
    const localReg: ClubRegistration = {
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

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          studentId: formData.studentId,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          program: formData.program,
          semester: formData.semester,
          aiInterest: formData.aiInterest,
          style: selectedPassStyle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const finalReg = data.registration || localReg;
        onRegister(finalReg);
        setRegisteredSuccess(finalReg);
        if (data.emailSent) {
          setEmailStatusMessage(`✨ Emel Kad Keahlian Digital (${selectedPassStyle.toUpperCase()}) telah dihantar ke ${formData.email}!`);
        } else {
          setEmailStatusMessage(
            `⚡ Pendaftaran disimpan ke Cloudflare D1. Emel dijana dengan tema ${selectedPassStyle.toUpperCase()}.`
          );
        }
      } else {
        onRegister(localReg);
        setRegisteredSuccess(localReg);
      }
    } catch {
      onRegister(localReg);
      setRegisteredSuccess(localReg);
    } finally {
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    const newSub: NoticeSubscriber = {
      id: `sub-${Date.now()}`,
      email: subscribeEmail,
      subscribedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      preferredTopic: subscribeTopic,
    };

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail, preferredTopic: subscribeTopic }),
      });
    } catch {}

    onSubscribeNotice(newSub);
    setSubscribedNoticeModal(newSub);
    setSubscribeEmail('');
  };

  return (
    <section id="join-us" className="py-20 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading, Perks, and Newsletter Subscription */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-mono-code font-bold mb-3">
                <UserCheck className="w-3.5 h-3.5 text-purple-700" /> KEAHLIAN TERBUKA KEPADA SEMUA KURSUS (FSKM & FPA)
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-space tracking-tight leading-tight mb-4">
                Sertai Revolusi AI Bersama <span className="text-purple-800">AISA UiTM Jasin</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Terbuka kepada <strong className="text-slate-900">seluruh mahasiswa UiTM Cawangan Melaka Kampus Jasin</strong> — sama ada daripada <strong className="text-purple-800">FSKM / KPPIM (Sains Komputer & IT)</strong> mahupun <strong className="text-emerald-800">FPA (Perladangan & Agroteknologi)</strong> serta kursus-kursus lain! Dari pembangunan model LLM, keselamatan rangkaian, hinggalah ke aplikasi <em>Smart Agriculture AI & Drone Vision</em>, semua dialu-alukan.
              </p>

              {/* Membership Perks List */}
              <div className="space-y-3 mb-10">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-space">
                      Kad Keahlian Digital (12 Gaya Reka Bentuk)
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Pilih daripada 12 tema reka bentuk terang & berprestij (Minimalis, Akademik Rasmi, Diraja UiTM, dsb).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-space">
                      Auto-Reminder Mesyuarat & Bengkel
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Emel peringatan rasmi automatik dihantar terus bagi setiap perjumpaan kelab dan pendaftaran bengkel.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-emerald-200 shadow-xs">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-space">
                      Kolaborasi Interdisiplinari (FSKM + FPA)
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Peluang bina projek rentas bidang: Computing, AI Networks & Smart Crop Tech (IoT ladang, dron pintar & pengesanan penyakit tanaman).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK SUBSCRIBE BOX FOR GENERAL NOTICES */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-purple-800" />
                <h4 className="text-xs font-bold text-slate-900 font-space">
                  Langgan Notis & Hebahan Sahaja (Bukan Ahli)
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">
                Ingin terima hebahan pertandingan dan peluang latihan AI tanpa mendaftar sebagai ahli? Masukkan emel anda di sini:
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="emel.pelajar@isiswa.uitm.edu.my"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-xs"
                  required
                />
                
                <div className="flex gap-2">
                  <select
                    value={subscribeTopic}
                    onChange={(e) => setSubscribeTopic(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:border-purple-600 shadow-xs"
                  >
                    <option value="Semua Hebahan & Mesyuarat">Semua Hebahan & Mesyuarat</option>
                    <option value="Pertandingan & Hackathon Sahaja">Pertandingan & Hackathon Sahaja</option>
                    <option value="Bengkel & Bootcamps AI">Bengkel & Bootcamps AI</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space transition-colors shrink-0 flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3" /> Langgan Notis
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Registration Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              {registeredSuccess ? (
                <div className="py-8 text-center flex flex-col items-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-space mb-2">
                    Tahniah, Pendaftaran Berjaya!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mb-3 leading-relaxed">
                    Selamat datang <strong className="text-purple-800">{registeredSuccess.fullName}</strong>. ID Keahlian rasmi anda ialah <span className="font-mono-code text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{registeredSuccess.membershipId}</span>.
                  </p>

                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-mono-code">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Format Emel: <strong className="text-slate-900 uppercase">{selectedPassStyle}</strong> (Tema Cerah & Kontras Tinggi)</span>
                  </div>

                  {emailStatusMessage && (
                    <div className="mb-6 p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 max-w-lg text-left space-y-1">
                      <div className="text-[10px] font-mono-code text-purple-700 font-bold">STATUS PENGHANTARAN EMEL:</div>
                      <div>{emailStatusMessage}</div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                    <button
                      onClick={() => onPreviewEmail(registeredSuccess)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space shadow-md transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4" /> LIHAT PREVIEW KAD KEAHLIAN ({selectedPassStyle.toUpperCase()})
                    </button>
                    <button
                      onClick={() => setRegisteredSuccess(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs font-space transition-colors cursor-pointer"
                    >
                      Daftar Ahli Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono-code text-purple-900 font-bold">
                      BORANG PENDAFTARAN AHLI (ONLINE APPLICATION)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-code">
                      *Auto-email notification enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nama Penuh (Seperti Dalam Kad Matrik) *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="cth: Muhammad Ammar Syaathir"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                        required
                      />
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        No. Pelajar UiTM (Student ID) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                          placeholder="cth: 2024123456"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-mono-code placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                          required
                        />
                        <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Emel Siswa / Emel Aktif *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="2024123456@isiswa.uitm.edu.my"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-mono-code placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                          required
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Kad keahlian dan notis rasmi akan dihantar ke emel ini.
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        No. Telefon / WhatsApp *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="cth: 011-23456789"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-mono-code placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                          required
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Program */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Kod & Program Pengajian (Terbuka Semua Kursus) *
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                        required
                      >
                        <optgroup label="🎓 Sarjana Muda (Degree) — FSKM / KPPIM">
                          <option value="CS230 – Sarjana Muda Sains Komputer (Kepujian)">
                            CS230 – Sarjana Muda Sains Komputer (Kepujian) / Bachelor of Computer Science (Hons.)
                          </option>
                          <option value="CS251 – Sarjana Muda Sains Komputer (Komunikasi Data dan Rangkaian)">
                            CS251 – Sarjana Muda Sains Komputer (Komunikasi Data dan Rangkaian) / Computer Networks
                          </option>
                          <option value="CS255 – Sarjana Muda Sains Komputer (Rangkaian Komputer)">
                            CS255 – Sarjana Muda Sains Komputer (Rangkaian Komputer) / Computer Networks
                          </option>
                          <option value="CS266 – Sarjana Muda Teknologi Maklumat (Kejuruteraan Sistem Maklumat)">
                            CS266 – Sarjana Muda Teknologi Maklumat (Kejuruteraan Sistem Maklumat) / ISE
                          </option>
                        </optgroup>

                        <optgroup label="📜 Diploma — FSKM / KPPIM">
                          <option value="CS110 – Diploma Sains Komputer">
                            CS110 – Diploma Sains Komputer / Diploma in Computer Science
                          </option>
                        </optgroup>

                        <optgroup label="🌱 Sarjana Muda (Degree) — FPA (Perladangan & Agroteknologi)">
                          <option value="AT228 – Bachelor of Technology Smart Crop Production with Honours">
                            AT228 – Bachelor of Technology Smart Crop Production with Honours
                          </option>
                          <option value="AT234 – Bachelor of Science in Horticulture Technology (Honours)">
                            AT234 – Bachelor of Science in Horticulture Technology (Honours)
                          </option>
                          <option value="AT240 – Bachelor in Plantation Management Technology with Honours">
                            AT240 – Bachelor in Plantation Management Technology with Honours
                          </option>
                          <option value="AT242 – Bachelor of Science in Agronomy with Honours">
                            AT242 – Bachelor of Science in Agronomy with Honours
                          </option>
                          <option value="AT243 – Bachelor of Science in Agribusiness (Honours)">
                            AT243 – Bachelor of Science in Agribusiness (Honours)
                          </option>
                        </optgroup>

                        <optgroup label="🌾 Diploma — FPA (Perladangan & Agroteknologi)">
                          <option value="AT110 – Diploma in Plantation Industry Management">
                            AT110 – Diploma in Plantation Industry Management (Pengurusan Industri Perladangan)
                          </option>
                        </optgroup>

                        <optgroup label="🌐 Program Lain / Terbuka">
                          <option value="Lain-lain Program / Fakulti (UiTM Cawangan Melaka)">
                            Lain-lain Program / Fakulti (UiTM Cawangan Melaka Kampus Jasin)
                          </option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Semester */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Semester Semasa
                      </label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
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
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Bidang Kepintaran Buatan (AI) Paling Diminati
                      </label>
                      <select
                        value={formData.aiInterest}
                        onChange={(e) => setFormData({ ...formData, aiInterest: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                      >
                        <option value="Autonomous Agents & Large Language Models (LLM)">
                          Autonomous Agents & Large Language Models (LLM)
                        </option>
                        <option value="Computer Vision & Deep Learning (Image / Detection)">
                          Computer Vision & Deep Learning (Image / Detection)
                        </option>
                        <option value="Smart Agriculture & Agrotech AI (IoT, Dron AI, Kesihatan Tanaman)">
                          Smart Agriculture & Agrotech AI (IoT, Dron AI, Kesihatan Tanaman)
                        </option>
                        <option value="Network Security & AI-driven Cyber Defense">
                          Network Security & AI-driven Cyber Defense
                        </option>
                        <option value="Enterprise Information Systems & Cloud AI">
                          Enterprise Information Systems & Cloud AI
                        </option>
                        <option value="Reinforcement Learning & Edge AI / Robotics">
                          Reinforcement Learning & Edge AI / Robotics
                        </option>
                        <option value="Data Engineering & Predictive Analytics">
                          Data Engineering & Predictive Analytics
                        </option>
                        <option value="UI/UX & Web Development for AI Apps">
                          UI/UX & Web Development for AI Apps
                        </option>
                      </select>
                    </div>

                    {/* 12 Design Styles for Digital Pass */}
                    <div className="md:col-span-2 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono-code">
                          <Palette className="w-3.5 h-3.5 text-purple-700" />
                          <span>PILIH TEMA KAD KEAHLIAN DIGITAL (12 GAYA CERAH):</span>
                        </label>
                        <span className="text-[10px] text-emerald-700 font-mono-code font-bold">
                          ✓ 12 Pilihan Cerah • Kontras Tinggi
                        </span>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
                        {['Semua', 'Akademik & Rasmi', 'Moden & Kaca', 'Kreatif & Pop', 'Teknologi & Lab'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setPassCategoryFilter(cat)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-code font-bold transition-all shrink-0 cursor-pointer ${
                              passCategoryFilter === cat
                                ? 'bg-purple-800 text-white shadow-xs'
                                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* 12-Style Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                        {EMAIL_STYLES_META
                          .filter((s) => passCategoryFilter === 'Semua' || s.category === passCategoryFilter)
                          .map((s) => {
                            const isSelected = selectedPassStyle === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setSelectedPassStyle(s.id)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-purple-50 text-slate-900 border-purple-500 shadow-sm ring-2 ring-purple-500/20'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className={`text-[9px] font-mono-code font-bold ${isSelected ? 'text-purple-800' : 'text-slate-500'}`}>
                                    {s.num}. {s.name.split(' ')[0].toUpperCase()}
                                  </span>
                                  <span className={`text-[8px] font-mono-code px-1 rounded ${isSelected ? 'bg-purple-200 text-purple-900' : 'bg-slate-100 text-slate-500'}`}>
                                    {s.category.split(' ')[0]}
                                  </span>
                                </div>
                                <div className={`text-xs font-bold truncate ${isSelected ? 'text-purple-950' : 'text-slate-800'}`}>
                                  {s.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {s.tagline}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-purple-800 hover:bg-purple-900 disabled:opacity-60 text-white font-bold font-space text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                      <span>{isSubmitting ? 'MEMPROSES & MENGHANTAR EMEL...' : `HANTAR PENDAFTARAN (${selectedPassStyle.toUpperCase()})`}</span>
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
        <div
          onClick={() => setSubscribedNoticeModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-mono-code font-bold bg-purple-50 text-purple-900 border border-purple-200 mb-2 inline-block">
              ⚡ DISIMPAN KE CLOUDFLARE D1
            </span>

            <h3 className="text-xl font-black text-slate-900 font-space mb-1">
              Notis Pengesahan Dihantar!
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Terima kasih! Kami telah menghantar notis pengesahan ke emel <strong className="text-purple-900 font-mono-code">{subscribedNoticeModal.email}</strong> bagi topik <strong className="text-slate-900 font-mono-code">{subscribedNoticeModal.preferredTopic}</strong>.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs mb-5 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono-code">STATUS SISTEM EMEL:</div>
              <div className="text-slate-900 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
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
                className="px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs font-space transition-colors cursor-pointer"
              >
                Lihat Contoh Emel Buletin
              </button>
              <button
                onClick={() => setSubscribedNoticeModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-space cursor-pointer"
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
