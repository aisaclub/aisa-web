import React, { useState, useEffect } from 'react';
import { initialMembers, initialAnnouncements, initialActivities, initialAdvisors, initialRegistrations, initialSubscribers } from './data/initialData';
import { CommitteeMember, Announcement, Activity, LecturerAdvisor, ClubRegistration, NoticeSubscriber, CustomEmailCampaign, WebThemeMode } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OrgTreeChart } from './components/OrgTreeChart';
import { HebahanSection } from './components/HebahanSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { JoinUsSection } from './components/JoinUsSection';
import { AIGame } from './components/AIGame';
import { TeaserVideoModal } from './components/TeaserVideoModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { EmailTemplateModal } from './components/EmailTemplateModal';
import { ExcoEmailStudioModal } from './components/ExcoEmailStudioModal';
import { Footer } from './components/Footer';
import { Gamepad2, PlayCircle, ShieldCheck, Database, RefreshCw } from 'lucide-react';

const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('192.168.')
);

// DB Row Normalizers
function mapMember(m: any): CommitteeMember {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    level: m.level || 'exco',
    department: m.department || 'Biro AI & Sains Data',
    photoUrl: m.photo_url || m.photoUrl || '',
    bio: m.bio || '',
    aiSpecialty: m.ai_specialty || m.aiSpecialty || '',
    linkedin: m.linkedin_url || m.linkedin || '',
    github: m.github_url || m.github || '',
    email: m.email || '',
    yearProgram: m.year_program || m.yearProgram || '',
  };
}

function mapAdvisor(a: any): LecturerAdvisor {
  return {
    id: a.id,
    name: a.name,
    title: a.title,
    faculty: a.faculty || 'KPPIM UiTM Jasin',
    room: a.room || '',
    email: a.email || '',
    photoUrl: a.photo_url || a.photoUrl || '',
    researchArea: a.research_area || a.researchArea || '',
    consultationHours: a.consultation_hours || a.consultationHours || '',
    googleScholar: a.google_scholar || a.googleScholar || '',
  };
}

function mapAnnouncement(ann: any): Announcement {
  return {
    id: ann.id,
    title: ann.title,
    category: ann.category || 'Hebahan',
    description: ann.description,
    date: ann.date,
    deadline: ann.deadline || undefined,
    bannerUrl: ann.banner_url || ann.bannerUrl || '',
    bannerUrl2: ann.banner_url2 || ann.bannerUrl2 || undefined,
    location: ann.location || undefined,
    eventTime: ann.event_time || ann.eventTime || undefined,
    registrationLink: ann.registration_link || ann.registrationLink || '#join-us',
    isUrgent: Boolean(ann.is_urgent ?? ann.isUrgent),
    status: ann.status || 'Open',
  };
}

function mapActivity(act: any): Activity {
  let galleryArray: string[] = [];
  if (Array.isArray(act.gallery)) {
    galleryArray = act.gallery;
  } else if (typeof act.gallery === 'string') {
    try {
      galleryArray = JSON.parse(act.gallery);
    } catch {
      galleryArray = [];
    }
  }
  return {
    id: act.id,
    title: act.title,
    date: act.event_date || act.date || '',
    category: act.category || 'Workshop',
    summary: act.summary || '',
    coverImage: act.cover_image || act.coverImage || '',
    gallery: galleryArray,
    attendeesCount: Number(act.attendees_count || act.attendeesCount || 0),
    highlightText: act.highlight_text || act.highlightText || '',
    aiField: act.ai_field || act.aiField || undefined,
    location: act.location || undefined,
  };
}

function mapRegistration(reg: any): ClubRegistration {
  return {
    id: reg.id,
    fullName: reg.full_name || reg.fullName || '',
    studentId: reg.student_id || reg.studentId || '',
    email: reg.email || '',
    phoneNumber: reg.whatsapp_number || reg.phone_number || reg.phoneNumber || '',
    program: reg.program || '',
    semester: reg.semester || '',
    aiInterest: reg.ai_interest || reg.aiInterest || '',
    membershipId: reg.membership_id || reg.membershipId || '',
    status: reg.status || 'Baru',
    assignedPic: reg.assigned_pic || reg.assignedPic || 'Belum Ditetapkan',
    registeredAt: reg.registered_at || reg.registeredAt || '',
    excoNotes: reg.exco_notes || reg.excoNotes || '',
  };
}

function mapSubscriber(sub: any): NoticeSubscriber {
  return {
    id: sub.id,
    email: sub.email,
    subscribedAt: sub.subscribed_at || sub.subscribedAt || '',
    preferredTopic: sub.preferred_topic || sub.preferredTopic || 'Semua Hebahan & Mesyuarat',
  };
}

export function App() {
  // 1. Data State: In production, 100% sourced from Cloudflare D1. In local dev, can fallback to initial data if offline.
  const [members, setMembers] = useState<CommitteeMember[]>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('aisa_members');
      return saved ? JSON.parse(saved) : initialMembers;
    }
    return [];
  });

  const [advisors, setAdvisors] = useState<LecturerAdvisor[]>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('aisa_advisors');
      return saved ? JSON.parse(saved) : initialAdvisors;
    }
    return [];
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('aisa_announcements');
      return saved ? JSON.parse(saved) : initialAnnouncements;
    }
    return [];
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('aisa_activities');
      return saved ? JSON.parse(saved) : initialActivities;
    }
    return [];
  });

  const [registrations, setRegistrations] = useState<ClubRegistration[]>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('aisa_registrations');
      return saved ? JSON.parse(saved) : initialRegistrations;
    }
    return [];
  });

  const [subscribers, setSubscribers] = useState<NoticeSubscriber[]>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('aisa_subscribers');
      return saved ? JSON.parse(saved) : initialSubscribers;
    }
    return [];
  });

  const [isD1Connected, setIsD1Connected] = useState<boolean>(false);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(!isLocal);

  // Function to fetch live data from Cloudflare D1
  const fetchD1Data = async () => {
    setIsLoadingDb(true);
    try {
      const [resMembers, resAdvisors, resAnnouncements, resActivities, resRegistrations, resSubscribers] = await Promise.all([
        fetch('/api/members').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/advisors').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/announcements').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/activities').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/register').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/subscribe').then((r) => r.ok ? r.json() : []).catch(() => []),
      ]);

      let hasD1Data = false;

      if (Array.isArray(resMembers) && resMembers.length > 0) {
        setMembers(resMembers.map(mapMember));
        hasD1Data = true;
      } else if (isLocal && members.length === 0) {
        setMembers(initialMembers);
      }

      if (Array.isArray(resAdvisors) && resAdvisors.length > 0) {
        setAdvisors(resAdvisors.map(mapAdvisor));
        hasD1Data = true;
      } else if (isLocal && advisors.length === 0) {
        setAdvisors(initialAdvisors);
      }

      if (Array.isArray(resAnnouncements) && resAnnouncements.length > 0) {
        setAnnouncements(resAnnouncements.map(mapAnnouncement));
        hasD1Data = true;
      } else if (isLocal && announcements.length === 0) {
        setAnnouncements(initialAnnouncements);
      }

      if (Array.isArray(resActivities) && resActivities.length > 0) {
        setActivities(resActivities.map(mapActivity));
        hasD1Data = true;
      } else if (isLocal && activities.length === 0) {
        setActivities(initialActivities);
      }

      if (Array.isArray(resRegistrations)) {
        setRegistrations(resRegistrations.map(mapRegistration));
        if (resRegistrations.length > 0) hasD1Data = true;
      } else if (isLocal && registrations.length === 0) {
        setRegistrations(initialRegistrations);
      }

      if (Array.isArray(resSubscribers)) {
        setSubscribers(resSubscribers.map(mapSubscriber));
        if (resSubscribers.length > 0) hasD1Data = true;
      } else if (isLocal && subscribers.length === 0) {
        setSubscribers(initialSubscribers);
      }

      setIsD1Connected(hasD1Data || !isLocal);
    } catch (err) {
      console.error('Gagal berhubung dengan pangkalan data Cloudflare D1:', err);
      if (isLocal) {
        // Fallback to local data only on localhost
        setMembers(initialMembers);
        setAdvisors(initialAdvisors);
        setAnnouncements(initialAnnouncements);
        setActivities(initialActivities);
        setRegistrations(initialRegistrations);
        setSubscribers(initialSubscribers);
      }
    } finally {
      setIsLoadingDb(false);
    }
  };

  // Mount Effect: Always fetch live Cloudflare D1 data
  useEffect(() => {
    fetchD1Data();
  }, []);

  // Theme Mode State (3 Modes: cyber_dark, soft_light, uitm_royal)
  const [themeMode, setThemeMode] = useState<WebThemeMode>(() => {
    return (localStorage.getItem('aisa_theme_mode') as WebThemeMode) || 'cyber_dark';
  });

  useEffect(() => {
    localStorage.setItem('aisa_theme_mode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
    if (themeMode === 'soft_light') {
      document.body.className = 'theme-soft_light bg-[#f8fafc] text-slate-800';
    } else if (themeMode === 'uitm_royal') {
      document.body.className = 'theme-uitm_royal bg-[#120722] text-[#fdfaf3]';
    } else {
      document.body.className = 'bg-[#0b0f19] text-[#e2e8f0]';
    }
  }, [themeMode]);

  // 2. Modals and Admin State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('aisa_is_admin') === 'true';
  });
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isEmailStudioOpen, setIsEmailStudioOpen] = useState(false);
  const [editTargetMember, setEditTargetMember] = useState<CommitteeMember | null>(null);

  // Email Template Viewer State
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    name: string;
    email: string;
    studentId: string;
    membershipId: string;
    templateType: 'welcome' | 'meeting' | 'notice';
  }>({
    isOpen: false,
    name: 'Ahmad Faiz bin Roslan',
    email: '2023456789@isiswa.uitm.edu.my',
    studentId: '2023456789',
    membershipId: 'AISA-2026-0042',
    templateType: 'welcome',
  });

  // Local storage caching only on localhost
  useEffect(() => {
    if (isLocal) {
      localStorage.setItem('aisa_members', JSON.stringify(members));
      localStorage.setItem('aisa_advisors', JSON.stringify(advisors));
      localStorage.setItem('aisa_announcements', JSON.stringify(announcements));
      localStorage.setItem('aisa_activities', JSON.stringify(activities));
      localStorage.setItem('aisa_registrations', JSON.stringify(registrations));
      localStorage.setItem('aisa_subscribers', JSON.stringify(subscribers));
    }
  }, [members, advisors, announcements, activities, registrations, subscribers]);

  useEffect(() => {
    localStorage.setItem('aisa_is_admin', isAdmin.toString());
  }, [isAdmin]);

  // Handlers
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      const pass = prompt('Masukkan Kod Laluan Exco/Admin (Demo passcode: aisa2026):', 'aisa2026');
      if (pass === 'aisa2026' || pass === 'admin') {
        setIsAdmin(true);
        setIsAdminPortalOpen(true);
      } else if (pass !== null) {
        alert('Kod laluan salah. Sila guna "aisa2026" untuk demo!');
      }
    }
  };

  // Direct Cloudflare D1 Mutations
  const handleUpdateMember = async (updated: CommitteeMember) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    try {
      await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Gagal mengemas kini ahli ke Cloudflare D1:', err);
    }
  };

  const handleAddAnnouncement = async (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
    try {
      await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      });
    } catch (err) {
      console.error('Gagal menambah hebahan ke Cloudflare D1:', err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('Adakah anda pasti mahu memadamkan hebahan ini daripada pangkalan data?')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      try {
        await fetch(`/api/announcements?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Gagal memadam hebahan daripada Cloudflare D1:', err);
      }
    }
  };

  const handleAddActivity = async (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAct),
      });
    } catch (err) {
      console.error('Gagal menambah aktiviti ke Cloudflare D1:', err);
    }
  };

  const handleRegisterMember = (newReg: ClubRegistration) => {
    setRegistrations((prev) => [newReg, ...prev]);
  };

  const handleSubscribeNotice = (newSub: NoticeSubscriber) => {
    setSubscribers((prev) => [newSub, ...prev]);
  };

  const handleUpdateRegStatus = async (id: string, status: ClubRegistration['status'], assignedPic?: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, assignedPic: assignedPic || r.assignedPic } : r))
    );
    try {
      await fetch('/api/register', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, assignedPic }),
      });
    } catch (err) {
      console.error('Gagal mengemas kini status ke Cloudflare D1:', err);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/register?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Gagal memadam pendaftaran daripada Cloudflare D1:', err);
    }
  };

  const handleResetData = () => {
    if (isLocal) {
      setMembers(initialMembers);
      setAdvisors(initialAdvisors);
      setAnnouncements(initialAnnouncements);
      setActivities(initialActivities);
      setRegistrations(initialRegistrations);
      setSubscribers(initialSubscribers);
      localStorage.removeItem('aisa_members');
      localStorage.removeItem('aisa_advisors');
      localStorage.removeItem('aisa_announcements');
      localStorage.removeItem('aisa_activities');
      localStorage.removeItem('aisa_registrations');
      localStorage.removeItem('aisa_subscribers');
    } else {
      // In production, refresh straight from Cloudflare D1
      fetchD1Data();
    }
  };

  const handleOpenEditMember = (member: CommitteeMember) => {
    setEditTargetMember(member);
    setIsAdminPortalOpen(true);
  };

  const handleTriggerEmailFromAdmin = (reg: ClubRegistration, template: 'welcome' | 'meeting' | 'notice') => {
    setEmailModal({
      isOpen: true,
      name: reg.fullName,
      email: reg.email,
      studentId: reg.studentId,
      membershipId: reg.membershipId,
      templateType: template,
    });
  };

  return (
    <div className={`min-h-screen theme-${themeMode} bg-[#070913] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* Top Banner if in Admin Mode */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-slate-950 font-bold font-mono-code text-[11px] py-1 px-4 text-center flex items-center justify-center gap-2 shadow-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>
            [MOD ADMIN & EXCO DIAKTIFKAN] Klik mana-mana kad Exco untuk kemas kini info terus!
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-black/30 text-white px-2 py-0.5 rounded-full text-[10px]">
            <Database className="w-3 h-3 text-emerald-300" />
            {isD1Connected ? 'Cloudflare D1 SQL (aisaclub) Live' : 'Menyambung D1...'}
          </span>
          <button
            onClick={() => setIsAdminPortalOpen(true)}
            className="ml-2 underline hover:text-white font-black"
          >
            Buka Portal
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenVideo={() => setIsVideoOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenGame={() => setIsGameOpen(true)}
          onOpenVideo={() => setIsVideoOpen(true)}
        />

        <OrgTreeChart
          members={members}
          advisorsList={advisors}
          isAdmin={isAdmin}
          onEditMember={handleOpenEditMember}
        />

        <HebahanSection
          announcements={announcements}
          isAdmin={isAdmin}
          onAddNew={() => {
            setEditTargetMember(null);
            setIsAdminPortalOpen(true);
          }}
          onDelete={handleDeleteAnnouncement}
        />

        <ActivitiesSection
          activities={activities}
          isAdmin={isAdmin}
          onAddNew={() => {
            setEditTargetMember(null);
            setIsAdminPortalOpen(true);
          }}
        />

        <JoinUsSection
          onRegister={handleRegisterMember}
          onSubscribeNotice={handleSubscribeNotice}
          onPreviewEmail={(reg) => {
            setEmailModal({
              isOpen: true,
              name: reg.fullName,
              email: reg.email,
              studentId: reg.studentId,
              membershipId: reg.membershipId,
              templateType: 'welcome',
            });
          }}
        />
      </main>

      {/* Floating Action Quick Access (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5">
        <button
          onClick={() => setIsGameOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-110 active:scale-95 text-white shadow-xl shadow-indigo-600/30 transition-transform group flex items-center gap-2"
          title="Main Cyber Mini-Game AISA"
        >
          <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline text-xs font-bold font-space">Game AI</span>
        </button>

        <button
          onClick={() => setIsVideoOpen(true)}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:scale-110 active:scale-95 text-cyan-400 shadow-xl transition-all group flex items-center gap-2"
          title="Tonton 15s Club Teaser"
        >
          <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline text-xs font-bold font-space text-slate-200">Teaser 15s</span>
        </button>
      </div>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* Modals */}
      <AIGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      <TeaserVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => {
          setIsAdminPortalOpen(false);
          setEditTargetMember(null);
        }}
        members={members}
        registrations={registrations}
        subscribers={subscribers}
        advisors={advisors}
        onUpdateMember={handleUpdateMember}
        onAddAnnouncement={handleAddAnnouncement}
        onAddActivity={handleAddActivity}
        onResetData={handleResetData}
        onTriggerEmailToMember={handleTriggerEmailFromAdmin}
        onOpenEmailStudio={() => setIsEmailStudioOpen(true)}
        onUpdateRegStatus={handleUpdateRegStatus}
        onDeleteRegistration={handleDeleteRegistration}
        initialEditMember={editTargetMember}
      />

      <EmailTemplateModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal((prev) => ({ ...prev, isOpen: false }))}
        recipientName={emailModal.name}
        recipientEmail={emailModal.email}
        studentId={emailModal.studentId}
        membershipId={emailModal.membershipId}
        templateType={emailModal.templateType}
      />

      <ExcoEmailStudioModal
        isOpen={isEmailStudioOpen}
        onClose={() => setIsEmailStudioOpen(false)}
        registrations={registrations}
        subscribers={subscribers}
        onLogCampaign={(camp) => {
          console.log('Campaign broadcasted:', camp);
        }}
      />
    </div>
  );
}

export default App;
