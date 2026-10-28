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
import { Gamepad2, PlayCircle, ShieldCheck } from 'lucide-react';

export function App() {
  // 1. Data State with LocalStorage Persistence
  const [members, setMembers] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem('aisa_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [advisors, setAdvisors] = useState<LecturerAdvisor[]>(() => {
    const saved = localStorage.getItem('aisa_advisors');
    return saved ? JSON.parse(saved) : initialAdvisors;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('aisa_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('aisa_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [registrations, setRegistrations] = useState<ClubRegistration[]>(() => {
    const saved = localStorage.getItem('aisa_registrations');
    return saved ? JSON.parse(saved) : initialRegistrations;
  });

  const [subscribers, setSubscribers] = useState<NoticeSubscriber[]>(() => {
    const saved = localStorage.getItem('aisa_subscribers');
    return saved ? JSON.parse(saved) : initialSubscribers;
  });

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

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aisa_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('aisa_advisors', JSON.stringify(advisors));
  }, [advisors]);

  useEffect(() => {
    localStorage.setItem('aisa_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('aisa_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('aisa_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('aisa_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

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

  const handleUpdateMember = (updated: CommitteeMember) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Adakah anda pasti mahu memadamkan hebahan ini?')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleRegisterMember = (newReg: ClubRegistration) => {
    setRegistrations((prev) => [newReg, ...prev]);
  };

  const handleSubscribeNotice = (newSub: NoticeSubscriber) => {
    setSubscribers((prev) => [newSub, ...prev]);
  };

  const handleUpdateRegStatus = (id: string, status: ClubRegistration['status'], assignedPic?: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, assignedPic: assignedPic || r.assignedPic } : r))
    );
  };

  const handleDeleteRegistration = async (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/register?id=${id}`, { method: 'DELETE' });
    } catch {
      // Handled silently
    }
  };

  const handleResetData = () => {
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
            [MOD ADMIN & EXCO DIAKTIFKAN] Anda boleh klik mana-mana kad Exco untuk kemas kini info terus!
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
