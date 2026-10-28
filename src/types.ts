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

export type EmailDesignStyle =
  | 'minimalist'      // Clean Light Minimalist Academic
  | 'glassmorphism'   // Frosted Glass Cyber Glow
  | 'skeuomorphism'   // Tactile Physical ID Badge with metallic chip
  | 'neobrutalism'    // High-Contrast Bold Border Neo-Brutalist
  | 'uitm_royal'      // UiTM Royal Purple & Corporate Gold Official Memo
  | 'cyber_clean';    // Clean Titanium Silver & Electric Cyan

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
