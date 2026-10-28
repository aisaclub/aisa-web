export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  level: 'advisor' | 'mt' | 'head' | 'exco';
  department: 'Penasihat' | 'Majlis Tertinggi' | 'Biro AI & Sains Data' | 'Biro Multimedia & Web' | 'Biro Perhubungan & Tajaan' | 'Biro Pembangunan Modal Insan';
  photoUrl: string;
  bio: string;
  aiSpecialty: string;
  linkedin?: string;
  github?: string;
  email: string;
  yearProgram: string;
}

export interface LecturerAdvisor {
  id: string;
  name: string;
  title: string;
  faculty: string;
  room: string;
  email: string;
  photoUrl: string;
  researchArea: string;
  consultationHours: string;
  googleScholar?: string;
}

export const AI_RESEARCH_FIELDS = [
  'Autonomous Agents & Large Language Models (LLM)',
  'Computer Vision & Deep Learning (Image / Detection)',
  'Smart Agriculture & Agrotech AI (IoT, Dron AI, Kesihatan Tanaman)',
  'Network Security & AI-driven Cyber Defense',
  'Enterprise Information Systems & Cloud AI',
  'Reinforcement Learning & Edge AI / Robotics',
  'Data Engineering & Predictive Analytics',
  'Natural Language Processing (NLP) Bahasa Melayu & Dialek',
  'AI Ethics, Governance & Model Safety',
  'UI/UX & Web Development for AI Apps',
] as const;

export type AIResearchField = (typeof AI_RESEARCH_FIELDS)[number];

export interface Announcement {
  id: string;
  title: string;
  category: 'Pertandingan' | 'Bengkel' | 'Hebahan' | 'Mesyuarat' | 'Notis Penting';
  description: string;
  date: string;
  deadline?: string;
  bannerUrl: string;
  bannerUrl2?: string; // Optional 2nd image/infographic
  location?: string;
  eventTime?: string;
  registrationLink?: string;
  isUrgent?: boolean;
  status: 'Open' | 'Closed' | 'Coming Soon';
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  category: 'Hackathon' | 'Workshop' | 'Lawatan Industri' | 'Seminar';
  summary: string;
  coverImage: string;
  gallery: string[]; // up to 3 additional images (total 1-4 pictures)
  attendeesCount: number;
  highlightText: string;
  aiField?: string;
  location?: string;
}

export interface ClubRegistration {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  program: string;
  semester: string;
  aiInterest: string;
  registeredAt: string;
  membershipId: string;
  status: 'Baru' | 'Disemak' | 'Lulus' | 'Perlu Dihubungi' | 'Aktif';
  assignedPic?: string; // Exco bertugas yang ambil tahu pasal permohonan ini
  excoNotes?: string;   // Catatan Exco
}

export interface NoticeSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferredTopic: string;
}

export type WebThemeMode = 'cyber_dark' | 'soft_light' | 'uitm_royal';

export type EmailDesignStyle =
  | 'minimalist'       // 1. Swiss Clean Minimalist
  | 'glassmorphism'    // 2. Frosted Aurora Glass
  | 'skeuomorphism'    // 3. Tactile Physical Smartcard
  | 'neobrutalism'     // 4. Vibrant Neo-Brutalist Pop
  | 'uitm_royal'       // 5. UiTM Royal Purple & Corporate Gold
  | 'cyber_clean'      // 6. Cyber Titanium AI Lab
  | 'editorial_serif'  // 7. Editorial Executive Monograph
  | 'claymorphism'     // 8. 3D Soft Claymorphism
  | 'ticket_pass'      // 9. Perforated Summit Ticket Pass
  | 'emerald_agrotech' // 10. Botanical Smart Agrotech AI
  | 'sunset_gradient'  // 11. Luminous Solar Sunset
  | 'retro_terminal';  // 12. Paper Terminal Data Matrix

export interface StyleMeta {
  id: EmailDesignStyle;
  num: number;
  name: string;
  category: 'Akademik & Rasmi' | 'Moden & Kaca' | 'Kreatif & Pop' | 'Teknologi & Lab';
  tagline: string;
  palette: string;
  badgeBg: string;
}

export const EMAIL_STYLES_META: StyleMeta[] = [
  { id: 'minimalist', num: 1, name: 'Swiss Minimalist', category: 'Akademik & Rasmi', tagline: 'Putih Bersih Kontras Tinggi', palette: '#ffffff, #0f172a', badgeBg: 'bg-slate-100 text-slate-800' },
  { id: 'glassmorphism', num: 2, name: 'Frosted Glass', category: 'Moden & Kaca', tagline: 'Kaca Kabur & Cahaya Sian', palette: '#f8fafc, #06b6d4', badgeBg: 'bg-cyan-50 text-cyan-700' },
  { id: 'skeuomorphism', num: 3, name: 'Tactile Smartcard', category: 'Moden & Kaca', tagline: 'Cip Emas Fizikal & Lanyard', palette: '#fefce8, #d97706', badgeBg: 'bg-amber-100 text-amber-800' },
  { id: 'neobrutalism', num: 4, name: 'Neo-Brutalism', category: 'Kreatif & Pop', tagline: 'Border Hitam 3px & Kuning Terang', palette: '#fef08a, #000000', badgeBg: 'bg-yellow-300 text-black' },
  { id: 'uitm_royal', num: 5, name: 'UiTM Royal & Emas', category: 'Akademik & Rasmi', tagline: 'Ungu Diraja & Emas Rasmi', palette: '#3b0764, #d97706', badgeBg: 'bg-purple-100 text-purple-900' },
  { id: 'cyber_clean', num: 6, name: 'Cyber Titanium', category: 'Teknologi & Lab', tagline: 'Grid AI Precision & Cyan', palette: '#f0fdfa, #0891b2', badgeBg: 'bg-teal-50 text-teal-700' },
  { id: 'editorial_serif', num: 7, name: 'Editorial Forbes Tech', category: 'Akademik & Rasmi', tagline: 'Tipografi Serif Monograf Gading', palette: '#fffdfa, #831843', badgeBg: 'bg-stone-100 text-stone-900' },
  { id: 'claymorphism', num: 8, name: '3D Soft Clay', category: 'Kreatif & Pop', tagline: 'Gelembung 3D Pastel Lembut', palette: '#f5f3ff, #8b5cf6', badgeBg: 'bg-purple-50 text-purple-700' },
  { id: 'ticket_pass', num: 9, name: 'Hackathon Boarding Pass', category: 'Kreatif & Pop', tagline: 'Kupon Bertebuk & Kod Bar', palette: '#f8fafc, #2563eb', badgeBg: 'bg-blue-50 text-blue-800' },
  { id: 'emerald_agrotech', num: 10, name: 'Botanical Agrotech AI', category: 'Teknologi & Lab', tagline: 'Hijau Pudina & Dron Pertanian FPA', palette: '#ecfdf5, #059669', badgeBg: 'bg-emerald-50 text-emerald-800' },
  { id: 'sunset_gradient', num: 11, name: 'Solar Sunset Mesh', category: 'Moden & Kaca', tagline: 'Gradien Panas Pic, Mawar & Emas', palette: '#fff7ed, #ea580c', badgeBg: 'bg-orange-50 text-orange-800' },
  { id: 'retro_terminal', num: 12, name: 'Paper Terminal Matrix', category: 'Teknologi & Lab', tagline: 'Lembaran Data Matriks Monospace', palette: '#fcfbf7, #15803d', badgeBg: 'bg-lime-50 text-lime-900' },
];

export interface CustomEmailCampaign {
  id: string;
  title: string;
  subject: string;
  templateStyle: EmailDesignStyle;
  senderRole: string; // cth: 'Setiausaha Kehormat AISA', 'Exco Akademik'
  eventDate?: string;
  eventTime?: string;
  location?: string;
  agendaItems: string[];
  mainMessage: string;
  actionButtonText: string;
  actionButtonUrl: string;
  sentAt?: string;
  recipientCount?: number;
}
