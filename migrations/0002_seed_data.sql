-- ==============================================================================
-- Cloudflare D1 Seed Data: 0002_seed_data.sql
-- ==============================================================================

-- 1. Seed Pensyarah Penasihat
INSERT OR IGNORE INTO advisors (id, name, title, faculty, room, email, photo_url, research_area, consultation_hours) VALUES
('adv-1', 'Dr. Ahmad Faizal bin Zakaria', 'Ketua Penasihat Persatuan (Advisory Board Lead)', 'KPPIM UiTM Jasin', 'Bilik A3-14, Blok Pentadbiran KPPIM', 'faizal@uitm.edu.my', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Computer Vision, Deep Learning & Medical Imaging AI', 'Selasa & Khamis (10:00 AM - 1:00 PM)'),
('adv-2', 'Ts. Dr. Noor Haslina binti Md Said', 'Penasihat Penyelidikan & Geran AI', 'KPPIM UiTM Melaka Kampus Jasin', 'Bilik B2-08, Bangunan Makmal Komputer', 'haslina@uitm.edu.my', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Natural Language Processing (NLP) & GenAI Governance', 'Isnin & Rabu (2:00 PM - 4:30 PM)'),
('adv-3', 'Ts. Mohd Hafiz bin Mansor', 'Penasihat Inovasi & Hubungan Industri', 'KPPIM UiTM Melaka Kampus Jasin', 'Bilik C1-03, Pusat Robotik & AI', 'hafiz_m@uitm.edu.my', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Edge AI, Autonomous Robotics & IoT Systems', 'Rabu & Jumaat (9:30 AM - 12:00 PM)');

-- 2. Seed Jawatankuasa Majlis Tertinggi
INSERT OR IGNORE INTO committee_members (id, name, role, level, department, photo_url, bio, ai_specialty, year_program, email) VALUES
('mt-ydp', 'Muhammad Faris Danial', 'Yang di-Pertua (President)', 'mt', 'Majlis Tertinggi', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'Peminat tegar Large Language Models (LLM) & pengasas inisiatif AI Lab Jasin.', 'NLP & Autonomous Agents', 'CS251 - AI (Sem 5)', 'faris.aisa@student.uitm.edu.my'),
('mt-tydp', 'Nur Aisyah binti Ridzwan', 'Timbalan Yang di-Pertua (VP)', 'mt', 'Majlis Tertinggi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Aktif dalam pertandingan Data Science dan pengurusan program universiti.', 'Data Engineering & Predictive Analytics', 'CS251 - AI (Sem 5)', 'aisyah.aisa@student.uitm.edu.my'),
('mt-su', 'Wan Amirul Hakim', 'Setiausaha Kehormat', 'mt', 'Majlis Tertinggi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Mengurus dokumentasi, perhubungan FSKM dan rekod persatuan.', 'AI Ethics & Prompt Engineering', 'CS245 - CS (Sem 4)', 'amirul.aisa@student.uitm.edu.my'),
('mt-bendahari', 'Siti Sarah binti Kamarudin', 'Bendahari Kehormat', 'mt', 'Majlis Tertinggi', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Mengurus kewangan, tajaan korporat dan bajet program berimpak tinggi.', 'FinTech AI & Algorithmic Trading', 'CS251 - AI (Sem 4)', 'sarah.aisa@student.uitm.edu.my');

-- 3. Seed Pendaftaran Ahli (FSKM & FPA)
INSERT OR IGNORE INTO club_registrations (id, full_name, student_id, email, phone_number, program, semester, ai_interest, membership_id, status, assigned_pic) VALUES
('reg-1', 'Ahmad Faiz bin Roslan', '2023456789', '2023456789@isiswa.uitm.edu.my', '011-23456789', 'CS230 – Sarjana Muda Sains Komputer (Kepujian)', 'Semester 4', 'Autonomous Agents & Large Language Models (LLM)', 'AISA-2026-0042', 'Lulus', 'Muhammad Faris (YDP)'),
('reg-2', 'Nurul Huda binti Salleh', '2024123456', '2024123456@isiswa.uitm.edu.my', '013-9876543', 'CS251 – Sarjana Muda Sains Komputer (Komunikasi Data dan Rangkaian)', 'Semester 3', 'Network Security & AI-driven Cyber Defense', 'AISA-2026-0043', 'Disemak', 'Nur Aisyah (TYDP)'),
('reg-3', 'Muhammad Luqman bin Johari', '2024789123', '2024789123@isiswa.uitm.edu.my', '019-3344556', 'AT228 – Bachelor of Technology Smart Crop Production with Honours', 'Semester 3', 'Smart Agriculture & Agrotech AI (IoT, Dron AI, Kesihatan Tanaman)', 'AISA-2026-0044', 'Lulus', 'Muhammad Faris (YDP)'),
('reg-4', 'Siti Sarah binti Azman', '2025112233', '2025112233@isiswa.uitm.edu.my', '012-7788990', 'CS266 – Sarjana Muda Teknologi Maklumat (Kejuruteraan Sistem Maklumat)', 'Semester 2', 'Enterprise Information Systems & Cloud AI', 'AISA-2026-0045', 'Baru', 'Belum Ditugaskan'),
('reg-5', 'Danial Haziq bin Mustaffa', '2025445566', '2025445566@isiswa.uitm.edu.my', '017-6655443', 'CS110 – Diploma Sains Komputer', 'Semester 2', 'Computer Vision & Deep Learning (Image / Detection)', 'AISA-2026-0046', 'Lulus', 'Wan Amirul (SU)'),
('reg-6', 'Farah Nadia binti Kamaruzzaman', '2025889900', '2025889900@isiswa.uitm.edu.my', '014-2233445', 'AT110 – Diploma in Plantation Industry Management', 'Semester 3', 'Smart Agriculture & Agrotech AI (IoT, Dron AI, Kesihatan Tanaman)', 'AISA-2026-0047', 'Baru', 'Belum Ditugaskan');

-- 4. Seed Pelanggan Notis
INSERT OR IGNORE INTO notice_subscribers (id, email, preferred_topic) VALUES
('sub-1', 'pelajar.uitm@isiswa.uitm.edu.my', 'Semua Hebahan & Mesyuarat'),
('sub-2', 'fskm.jasin.student@gmail.com', 'Pertandingan & Hackathon');
