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

export interface Announcement {
  id: string;
  title: string;
  category: 'Pertandingan' | 'Bengkel' | 'Hebahan' | 'Mesyuarat' | 'Notis Penting';
  description: string;
  date: string;
  deadline?: string;
  bannerUrl: string;
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
  gallery: string[];
  attendeesCount: number;
  highlightText: string;
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
