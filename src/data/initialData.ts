import { CommitteeMember, LecturerAdvisor, Announcement, Activity, ClubRegistration, NoticeSubscriber } from '../types';

export const initialAdvisors: LecturerAdvisor[] = [
  {
    id: 'adv-1',
    name: 'Dr. Ahmad Faizal bin Zakaria',
    title: 'Ketua Penasihat Persatuan (Advisory Board Lead)',
    faculty: 'Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM)',
    room: 'Bilik Pensyarah A3-14, Blok Pentadbiran KPPIM',
    email: 'faizal@uitm.edu.my',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    researchArea: 'Computer Vision, Deep Learning & Medical Imaging AI',
    consultationHours: 'Selasa & Khamis (10:00 AM - 1:00 PM)',
    googleScholar: 'https://scholar.google.com'
  },
  {
    id: 'adv-2',
    name: 'Ts. Dr. Noor Haslina binti Md Said',
    title: 'Penasihat Penyelidikan & Geran AI',
    faculty: 'KPPIM UiTM Melaka Kampus Jasin',
    room: 'Bilik Pensyarah B2-08, Bangunan Makmal Komputer',
    email: 'haslina@uitm.edu.my',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    researchArea: 'Natural Language Processing (NLP) & GenAI Governance',
    consultationHours: 'Isnin & Rabu (2:00 PM - 4:30 PM)',
    googleScholar: 'https://scholar.google.com'
  },
  {
    id: 'adv-3',
    name: 'Ts. Mohd Hafiz bin Mansor',
    title: 'Penasihat Inovasi & Hubungan Industri',
    faculty: 'KPPIM UiTM Melaka Kampus Jasin',
    room: 'Bilik Pensyarah C1-03, Pusat Robotik & AI',
    email: 'hafiz_m@uitm.edu.my',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    researchArea: 'Edge AI, Autonomous Robotics & IoT Systems',
    consultationHours: 'Rabu & Jumaat (9:30 AM - 12:00 PM)',
    googleScholar: 'https://scholar.google.com'
  }
];

export const initialMembers: CommitteeMember[] = [
  // 1. Penasihat (Level: advisor)
  {
    id: 'penasihat-1',
    name: 'Dr. Ahmad Faizal bin Zakaria',
    role: 'Ketua Penasihat Persatuan',
    level: 'advisor',
    department: 'Penasihat',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Pensyarah Kanan KPPIM UiTM Jasin dengan kepakaran dalam Computer Vision & Ethical AI.',
    aiSpecialty: 'Computer Vision & Deep Learning',
    linkedin: 'https://linkedin.com',
    email: 'faizal@uitm.edu.my',
    yearProgram: 'Pensyarah Kanan (KPPIM)'
  },
  // 2. Majlis Tertinggi (Level: mt)
  {
    id: 'mt-ydp',
    name: 'Muhammad Faris Danial',
    role: 'Yang di-Pertua (President)',
    level: 'mt',
    department: 'Majlis Tertinggi',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    bio: 'Peminat tegar Large Language Models (LLM) & pengasas inisiatif AI Lab Jasin.',
    aiSpecialty: 'NLP & Autonomous Agents',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    email: 'faris.aisa@student.uitm.edu.my',
    yearProgram: 'CS251 - AI (Sem 5)'
  },
  {
    id: 'mt-tydp',
    name: 'Nur Aisyah binti Ridzwan',
    role: 'Timbalan Yang di-Pertua (VP)',
    level: 'mt',
    department: 'Majlis Tertinggi',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Aktif dalam pertandingan Data Science dan pengurusan program universiti.',
    aiSpecialty: 'Data Engineering & Predictive Analytics',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    email: 'aisyah.aisa@student.uitm.edu.my',
    yearProgram: 'CS251 - AI (Sem 5)'
  },
  {
    id: 'mt-su',
    name: 'Wan Amirul Hakim',
    role: 'Setiausaha Kehormat',
    level: 'mt',
    department: 'Majlis Tertinggi',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Mengurus dokumentasi, perhubungan FSKM dan rekod persatuan.',
    aiSpecialty: 'AI Ethics & Prompt Engineering',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    email: 'amirul.aisa@student.uitm.edu.my',
    yearProgram: 'CS245 - CS (Sem 4)'
  },
  {
    id: 'mt-bendahari',
    name: 'Siti Sarah binti Kamarudin',
    role: 'Bendahari Kehormat',
    level: 'mt',
    department: 'Majlis Tertinggi',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Mengurus kewangan, tajaan korporat dan bajet program berimpak tinggi.',
    aiSpecialty: 'FinTech AI & Algorithmic Trading',
    linkedin: 'https://linkedin.com',
    email: 'sarah.aisa@student.uitm.edu.my',
    yearProgram: 'CS251 - AI (Sem 4)'
  },
  // 3. Ketua Biro & Exco (Level: head & exco)
  {
    id: 'biro-ai-head',
    name: 'Harith Iskandar',
    role: 'Ketua Biro AI & Sains Data',
    level: 'head',
    department: 'Biro AI & Sains Data',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Mengetuai bengkel teknikal PyTorch, TensorFlow & pembangunan model pelajar.',
    aiSpecialty: 'Reinforcement Learning & Edge AI',
    github: 'https://github.com',
    email: 'harith.ai@student.uitm.edu.my',
    yearProgram: 'CS251 - AI (Sem 5)'
  },
  {
    id: 'biro-ai-exco1',
    name: 'Khairul Anuar',
    role: 'Exco R&D Model',
    level: 'exco',
    department: 'Biro AI & Sains Data',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bio: 'Penyelidik pelatih dalam optimisasi transformer dan multi-modal AI.',
    aiSpecialty: 'Transformer Architecture & Fine-tuning',
    github: 'https://github.com',
    email: 'khairul.exco@student.uitm.edu.my',
    yearProgram: 'CS251 - AI (Sem 3)'
  },
  {
    id: 'biro-media-head',
    name: 'Alia Maisarah',
    role: 'Ketua Biro Multimedia & Web',
    level: 'head',
    department: 'Biro Multimedia & Web',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    bio: 'Pereka UI/UX digital dan peneraju kempen media sosial AISA Jasin.',
    aiSpecialty: 'Generative Media & UI/UX Design',
    linkedin: 'https://linkedin.com',
    email: 'alia.media@student.uitm.edu.my',
    yearProgram: 'CS245 - CS (Sem 4)'
  },
  {
    id: 'biro-media-exco1',
    name: 'Danial Zikri',
    role: 'Exco Web & Sistem Cloud',
    level: 'exco',
    department: 'Biro Multimedia & Web',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bio: 'Pembangun laman web rasmi AISA & peminat Cloudflare Workers / Edge computing.',
    aiSpecialty: 'Full-Stack Edge & Cloud Architectures',
    github: 'https://github.com',
    email: 'danial.cloud@student.uitm.edu.my',
    yearProgram: 'CS251 - AI (Sem 3)'
  },
  {
    id: 'biro-hub-head',
    name: 'Zahra Imanina',
    role: 'Ketua Biro Perhubungan & Tajaan',
    level: 'head',
    department: 'Biro Perhubungan & Tajaan',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Merapatkan hubungan antara pelajar AISA dengan syarikat teknologi terkemuka.',
    aiSpecialty: 'Industry Partnerships & AI Pitching',
    linkedin: 'https://linkedin.com',
    email: 'zahra.pr@student.uitm.edu.my',
    yearProgram: 'CS245 - CS (Sem 5)'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'AISA National AI Hackathon 2026: Kampus Jasin Edition',
    category: 'Pertandingan',
    description: 'Pertandingan membina ejen AI pintar selama 48 jam bertempat di Makmal AI Kampus Jasin. Hadiah keseluruhan bernilai RM 10,000!',
    date: '2026-11-15',
    deadline: '10 Nov 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    registrationLink: '#join-us',
    isUrgent: true,
    status: 'Open'
  },
  {
    id: 'ann-2',
    title: 'Hands-on Bootcamp: Deploying DeepSeek & Llama Models on Edge',
    category: 'Bengkel',
    description: 'Bengkel intensif 1 hari bersama pakar industri mengenai teknik kuantisasi dan penempatan model bahasa besar di peranti tepi.',
    date: '2026-11-02',
    deadline: '31 Okt 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    registrationLink: '#join-us',
    status: 'Open'
  },
  {
    id: 'ann-3',
    title: 'Pendaftaran Ahli Baru Sesi 2026/2027 Kini Dibuka!',
    category: 'Hebahan',
    description: 'Sertai keluarga besar Artificial Intelligence Student Association UiTM Melaka! Akses eksklusif ke projek makmal, pementoran & networking industri.',
    date: '2026-10-25',
    deadline: '15 Nov 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    registrationLink: '#join-us',
    status: 'Open'
  },
  {
    id: 'ann-4',
    title: 'Pengumuman Calon Temuduga Biro Pembangunan & R&D',
    category: 'Notis Penting',
    description: 'Semakan senarai pendek calon temuduga bagi mengisi kekosongan jawatan Exco Biro Teknikal di Dewan Seminar Al-Khawarizmi.',
    date: '2026-10-20',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    status: 'Closed'
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'AISA GenAI Summit & Exhibition 2025',
    date: '12 Ogos 2025',
    category: 'Seminar',
    summary: 'Pameran lebih 30 projek AI tahun akhir pelajar CS251 diiringi perkongsian daripada jurutera Google Cloud & AWS.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ],
    attendeesCount: 250,
    highlightText: '30+ Prototaip AI Berjaya Dipamerkan Kepada Industri'
  },
  {
    id: 'act-2',
    title: 'Lawatan Industri ke NVIDIA AI Innovation Centre',
    date: '24 Mei 2025',
    category: 'Lawatan Industri',
    summary: 'Rombongan 40 pelajar AISA ke pusat superkomputer AI bagi mendalami ekosistem CUDA dan GPU cluster terkini.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    attendeesCount: 42,
    highlightText: 'Eksplorasi Superkomputer DGX Cloud'
  },
  {
    id: 'act-3',
    title: 'Jasin Codefest & AI Hackathon',
    date: '18 Januari 2025',
    category: 'Hackathon',
    summary: 'Hackathon 36-jam tanpa henti membina penyelesaian Smart Campus untuk UiTM Cawangan Melaka menggunakan VLM (Vision Language Model).',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    attendeesCount: 120,
    highlightText: '3 Pasukan AISA Merangkul Juara'
  }
];

export const initialRegistrations: ClubRegistration[] = [
  {
    id: 'reg-1',
    fullName: 'Ahmad Faiz bin Roslan',
    studentId: '2023456789',
    email: '2023456789@isiswa.uitm.edu.my',
    phoneNumber: '011-23456789',
    program: 'CS251 (Sarjana Muda Sains Komputer - Kepintaran Buatan)',
    semester: 'Semester 3',
    aiInterest: 'Computer Vision & Deep Learning',
    registeredAt: '2026-10-26 14:30',
    membershipId: 'AISA-2026-0042',
    status: 'Aktif'
  },
  {
    id: 'reg-2',
    fullName: 'Nurul Huda binti Salleh',
    studentId: '2024123456',
    email: '2024123456@isiswa.uitm.edu.my',
    phoneNumber: '013-9876543',
    program: 'CS245 (Sarjana Muda Sains Komputer)',
    semester: 'Semester 2',
    aiInterest: 'NLP & Large Language Models',
    registeredAt: '2026-10-27 10:15',
    membershipId: 'AISA-2026-0043',
    status: 'Aktif'
  }
];

export const initialSubscribers: NoticeSubscriber[] = [
  {
    id: 'sub-1',
    email: 'student.uitm@isiswa.uitm.edu.my',
    subscribedAt: '2026-10-28',
    preferredTopic: 'Pertandingan & Hackathon'
  },
  {
    id: 'sub-2',
    email: 'aiml.club@gmail.com',
    subscribedAt: '2026-10-28',
    preferredTopic: 'Semua Hebahan & Bengkel'
  }
];
