import React, { useState } from 'react';
import { CommitteeMember, LecturerAdvisor } from '../types';
import { User, Mail, Edit3, Sparkles, Network, LayoutGrid, ChevronRight, GraduationCap, Building2, Clock } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface OrgTreeChartProps {
  members: CommitteeMember[];
  advisorsList?: LecturerAdvisor[];
  isAdmin: boolean;
  onEditMember: (member: CommitteeMember) => void;
}

export const OrgTreeChart: React.FC<OrgTreeChartProps> = ({ members, advisorsList = [], isAdmin, onEditMember }) => {
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>('All');

  // Segregate by levels
  const advisors = members.filter((m) => m.level === 'advisor');
  const mtMembers = members.filter((m) => m.level === 'mt');
  const headAndExcos = members.filter((m) => m.level === 'head' || m.level === 'exco');

  // Unique departments for filter
  const departments = ['All', ...new Set(members.map((m) => m.department))];

  const filteredMembers =
    activeDeptFilter === 'All'
      ? members
      : members.filter((m) => m.department === activeDeptFilter);

  const MemberCard = ({ member, size = 'normal' }: { member: CommitteeMember; size?: 'normal' | 'large' }) => {
    return (
      <div
        onClick={() => setSelectedMember(member)}
        className={`group relative cursor-pointer glass-panel rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/20 text-center flex flex-col items-center ${
          size === 'large' ? 'w-72 border-indigo-500/40 glow-indigo' : 'w-64 border-slate-800'
        }`}
      >
        {/* Glow indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Member Avatar */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-lg group-hover:rotate-2 transition-transform">
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name
                )}&background=1e1b4b&color=818cf8`;
              }}
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-slate-900 border border-indigo-500/40 text-cyan-300 whitespace-nowrap shadow">
            {member.level.toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {member.name}
        </h4>
        <p className="text-xs font-semibold text-indigo-400 mb-1">{member.role}</p>
        <p className="text-[11px] text-slate-400 mb-2 font-mono-code">{member.yearProgram}</p>

        {/* AI Specialty Badge */}
        <div className="w-full mt-auto pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[10px] text-slate-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="truncate max-w-[190px]">{member.aiSpecialty}</span>
        </div>

        {/* Admin Quick Edit Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMember(member);
            }}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/40 text-[10px] text-indigo-300 font-bold"
          >
            <Edit3 className="w-3 h-3" /> Edit Profil Ini
          </button>
        )}
      </div>
    );
  };

  return (
    <section id="organization" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono-code font-semibold mb-3">
              <Network className="w-3.5 h-3.5" /> HIERARKI & CARTA ORGANISASI
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-space tracking-tight">
              Peneraju AISA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">UiTM Melaka</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
              Struktur Majlis Tertinggi & Barisan Exco sesi 2026/2027 Kampus Jasin. Setiap profil dipautkan terus dengan kepakaran kecerdasan buatan masing-masing.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'tree'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Pokok Hierarki (Tree)
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid Direktori
            </button>
          </div>
        </div>

        {/* TREE VIEW */}
        {viewMode === 'tree' && (
          <div className="relative overflow-x-auto pb-12 pt-4">
            <div className="min-w-[900px] flex flex-col items-center">
              {/* Level 1: Penasihat Pensyarah */}
              <div className="mb-10 flex flex-col items-center relative w-full">
                <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400 font-bold mb-3 flex items-center gap-1.5 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  <GraduationCap className="w-4 h-4 text-cyan-400" /> [BARISAN PENSYARAH PENASIHAT KPPIM UiTM JASIN]
                </span>
                
                {advisorsList && advisorsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                    {advisorsList.map((adv) => (
                      <div
                        key={adv.id}
                        className="glass-panel rounded-2xl p-4 border border-indigo-500/40 glow-indigo text-left flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={adv.photoUrl}
                            alt={adv.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-cyan-400/40 shadow-md shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-mono-code font-bold text-cyan-300 block">
                              {adv.title}
                            </span>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {adv.name}
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-slate-800 pt-2 mb-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{adv.room}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{adv.consultationHours}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{adv.researchArea}</span>
                          </div>
                        </div>

                        <a
                          href={`mailto:${adv.email}`}
                          className="w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-400/30 text-indigo-200 text-[10px] font-mono-code font-bold text-center block transition-colors"
                        >
                          Hubungi Pensyarah ({adv.email})
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center gap-6">
                    {advisors.map((advisor) => (
                      <MemberCard key={advisor.id} member={advisor} size="large" />
                    ))}
                  </div>
                )}
                {/* Vertical Stem Line */}
                <div className="w-0.5 h-12 bg-gradient-to-b from-indigo-500 to-purple-500 my-4" />
              </div>

              {/* Level 2: Majlis Tertinggi (MT) */}
              <div className="mb-12 flex flex-col items-center relative w-full">
                <span className="text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-3">
                  [LEVEL 2: MAJLIS TERTINGGI (MT)]
                </span>

                {/* Horizontal branch line */}
                <div className="w-[80%] max-w-4xl h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
                  {mtMembers.map((mt) => (
                    <MemberCard key={mt.id} member={mt} />
                  ))}
                </div>

                {/* Vertical Stem Line */}
                <div className="w-0.5 h-12 bg-gradient-to-b from-purple-500 to-cyan-500 mt-6" />
              </div>

              {/* Level 3 & 4: Ketua Biro & Exco */}
              <div className="flex flex-col items-center w-full">
                <span className="text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-3">
                  [LEVEL 3 & 4: KETUA BIRO & BARISAN EXCO]
                </span>

                {/* Horizontal branch line */}
                <div className="w-[90%] max-w-5xl h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-6" />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
                  {headAndExcos.map((exco) => (
                    <MemberCard key={exco.id} member={exco} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div>
            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDeptFilter(dept)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeDeptFilter === dept
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* MEMBER DETAIL MODAL */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-xl mb-4">
                  <img
                    src={selectedMember.photoUrl}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 mb-2">
                  {selectedMember.department}
                </span>

                <h3 className="text-xl font-bold text-white mb-0.5">{selectedMember.name}</h3>
                <p className="text-sm font-semibold text-indigo-400 mb-1">{selectedMember.role}</p>
                <p className="text-xs text-slate-400 font-mono-code mb-4">{selectedMember.yearProgram}</p>

                {/* Bio */}
                <div className="w-full bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left mb-4">
                  <span className="text-[10px] font-mono-code text-slate-400 block mb-1">PROFIL & BIO:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedMember.bio}</p>
                </div>

                {/* AI Specialty */}
                <div className="w-full bg-indigo-950/30 p-3 rounded-2xl border border-indigo-500/20 text-left mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono-code text-indigo-300 block">BIDANG MINAT AI:</span>
                    <span className="text-xs font-bold text-white">{selectedMember.aiSpecialty}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                  {selectedMember.github && (
                    <a
                      href={selectedMember.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Emel Pelajar"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      onEditMember(selectedMember);
                      setSelectedMember(null);
                    }}
                    className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-space transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> KEMAS KINI MAKLUMAT EXCO INI
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
