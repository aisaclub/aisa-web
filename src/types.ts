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
  title: string; // e.g. 'Ketua Penasihat', 'Penasihat Teknikal AI'
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
  category: 'Pertandingan' | 'Bengkel' | 'Hebahan' | 'Notis Penting';
  description: string;
  date: string;
  deadline?: string;
  bannerUrl: string;
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
  status: 'Aktif' | 'Menunggu Pengesahan';
}

export interface NoticeSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferredTopic: string;
}
