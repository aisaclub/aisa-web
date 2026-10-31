import React, { useState } from 'react';
import { CommitteeMember, LecturerAdvisor } from '../types';
import { Mail, Edit3, Sparkles, Network, LayoutGrid, GraduationCap, Building2, Clock, X } from 'lucide-react';
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
        className={`group relative cursor-pointer bg-white rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:border-purple-400 hover:shadow-lg text-center flex flex-col items-center border border-slate-200 shadow-xs ${
          size === 'large' ? 'w-72 border-purple-200' : 'w-64'
        }`}
      >
        {/* Active status indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Member Avatar */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 shadow-sm group-hover:rotate-1 transition-transform">
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover rounded-[14px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name
                )}&background=f3e8ff&color=581c87&bold=true`;
              }}
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-white border border-purple-200 text-purple-900 whitespace-nowrap shadow-xs">
            {member.level.toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-800 transition-colors line-clamp-1">
          {member.name}
        </h4>
        <p className="text-xs font-semibold text-purple-700 mb-1">{member.role}</p>
        <p className="text-[11px] text-slate-500 mb-2 font-mono-code">{member.yearProgram}</p>

        {/* AI Specialty Badge */}
        <div className="w-full mt-auto pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-slate-600">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="truncate max-w-[190px]">{member.aiSpecialty}</span>
        </div>

        {/* Admin Quick Edit Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMember(member);
            }}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[10px] text-purple-900 font-bold"
          >
            <Edit3 className="w-3 h-3" /> Edit Profil Ini
          </button>
        )}
      </div>
    );
  };

  return (
    <section id="organization" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-mono-code font-bold mb-3">
              <Network className="w-3.5 h-3.5 text-purple-700" /> CARTA ORGANISASI EXCO 2026/2027
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-space tracking-tight">
              Peneraju Kepimpinan <span className="text-purple-800">AISA UiTM Jasin</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl">
              Struktur Majlis Tertinggi & Barisan Exco sesi 2026/2027 Kampus Jasin. Setiap profil dipautkan terus dengan kepakaran kecerdasan buatan masing-masing.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Pokok Hierarki (Tree)
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
                <span className="text-xs font-mono-code uppercase tracking-wider text-purple-900 font-bold mb-4 flex items-center gap-1.5 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                  <GraduationCap className="w-4 h-4 text-purple-800" /> [BARISAN PENSYARAH PENASIHAT KPPIM UiTM JASIN]
                </span>
                
                {advisorsList && advisorsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                    {advisorsList.map((adv) => (
                      <div
                        key={adv.id}
                        className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm hover:shadow-md text-left flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={adv.photoUrl}
                            alt={adv.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-purple-200 shadow-xs shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                adv.name
                              )}&background=f3e8ff&color=581c87&bold=true`;
                            }}
                          />
                          <div>
                            <span className="text-[10px] font-mono-code font-bold text-purple-800 block">
                              {adv.title}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {adv.name}
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                            <span className="truncate">{adv.room}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">{adv.consultationHours}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{adv.researchArea}</span>
                          </div>
                        </div>

                        <a
                          href={`mailto:${adv.email}`}
                          className="w-full py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-[10px] font-mono-code font-bold text-center block transition-colors"
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
                <div className="w-0.5 h-10 bg-purple-300 my-4" />
              </div>

              {/* Level 2: Majlis Tertinggi (MT) */}
              <div className="mb-12 flex flex-col items-center relative w-full">
                <span className="text-xs font-mono-code uppercase tracking-wider text-slate-500 font-bold mb-3">
                  [LEVEL 2: MAJLIS TERTINGGI (MT)]
                </span>

                {/* Horizontal branch line */}
                <div className="w-[80%] max-w-4xl h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
                  {mtMembers.map((mt) => (
                    <MemberCard key={mt.id} member={mt} />
                  ))}
                </div>

                {/* Vertical Stem Line */}
                <div className="w-0.5 h-10 bg-purple-300 mt-6" />
              </div>

              {/* Level 3 & 4: Ketua Biro & Exco */}
              <div className="flex flex-col items-center w-full">
                <span className="text-xs font-mono-code uppercase tracking-wider text-slate-500 font-bold mb-3">
                  [LEVEL 3 & 4: KETUA BIRO & BARISAN EXCO]
                </span>

                {/* Horizontal branch line */}
                <div className="w-[90%] max-w-5xl h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-6" />

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
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeDeptFilter === dept
                      ? 'bg-purple-800 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:text-purple-800 hover:border-purple-300'
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
          <div
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          >
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 shadow-md mb-4">
                  <img
                    src={selectedMember.photoUrl}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover rounded-[20px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedMember.name
                      )}&background=f3e8ff&color=581c87&bold=true`;
                    }}
                  />
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-purple-50 text-purple-900 border border-purple-200 mb-2">
                  {selectedMember.department}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mb-0.5">{selectedMember.name}</h3>
                <p className="text-sm font-semibold text-purple-800 mb-1">{selectedMember.role}</p>
                <p className="text-xs text-slate-500 font-mono-code mb-4">{selectedMember.yearProgram}</p>

                {/* Bio */}
                <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left mb-4">
                  <span className="text-[10px] font-mono-code text-slate-500 block mb-1">PROFIL & BIO:</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedMember.bio}</p>
                </div>

                {/* AI Specialty */}
                <div className="w-full bg-purple-50/60 p-3 rounded-2xl border border-purple-200 text-left mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono-code text-purple-900 block font-bold">BIDANG MINAT AI:</span>
                    <span className="text-xs font-bold text-slate-900">{selectedMember.aiSpecialty}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-purple-800 text-slate-600 hover:text-white transition-colors"
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
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-purple-800 text-slate-600 hover:text-white transition-colors"
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
                    className="mt-6 w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold font-space transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
