-- ==========================================================
-- Skema Lengkap Pangkalan Data Cloudflare D1
-- AISA (Artificial Intelligence Student Association)
-- UiTM Cawangan Melaka Kampus Jasin
-- Database: aisaclub (ID: 76d5c84e-e67e-48b8-89dc-03745574c676)
-- ==========================================================

-- 1. Jadual Pensyarah Penasihat (Lecturer Advisors)
CREATE TABLE IF NOT EXISTS advisors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,           -- cth: 'Ketua Penasihat', 'Penasihat Teknikal AI'
    faculty TEXT NOT NULL,         -- 'KPPIM UiTM Jasin'
    room TEXT NOT NULL,            -- 'Bilik A3-14'
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT NOT NULL,
    research_area TEXT NOT NULL,   -- 'Computer Vision & Deep Learning'
    consultation_hours TEXT,       -- 'Selasa & Khamis (10:00 AM - 1:00 PM)'
    google_scholar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Jadual Jawatankuasa & Barisan Exco Pelajar (Committee Members)
CREATE TABLE IF NOT EXISTS committee_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,            -- cth: 'Yang di-Pertua', 'Exco Multimedia'
    level TEXT NOT NULL,           -- 'advisor', 'mt', 'head', 'exco'
    department TEXT NOT NULL,      -- 'Majlis Tertinggi', 'Biro AI & Sains Data'
    photo_url TEXT NOT NULL,
    bio TEXT,
    ai_specialty TEXT,             -- 'NLP & Autonomous Agents'
    year_program TEXT,             -- 'CS251 - AI (Sem 5)'
    linkedin_url TEXT,
    github_url TEXT,
    email TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Jadual Pendaftaran Ahli Baru (Join Us / Club Registrations)
CREATE TABLE IF NOT EXISTS club_registrations (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    student_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,           -- emel siswa cth: 2024123456@isiswa.uitm.edu.my
    phone_number TEXT NOT NULL,    -- no whatsapp untuk perhubungan
    program TEXT NOT NULL,         -- cth: 'CS251 AI'
    semester TEXT NOT NULL,
    ai_interest TEXT NOT NULL,
    membership_id TEXT NOT NULL UNIQUE, -- cth: 'AISA-2026-1042'
    status TEXT DEFAULT 'Baru',    -- 'Baru', 'Disemak', 'Lulus', 'Perlu Dihubungi'
    assigned_pic TEXT DEFAULT 'Belum Ditetapkan',
    exco_notes TEXT,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Jadual Langganan Notis & Hebahan (Notice Subscribers)
CREATE TABLE IF NOT EXISTS notice_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    preferred_topic TEXT DEFAULT 'Semua Hebahan & Mesyuarat',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Jadual Hebahan & Pertandingan (Announcements & Competitions)
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,        -- 'Pertandingan', 'Bengkel', 'Hebahan', 'Notis Penting', 'Mesyuarat'
    description TEXT NOT NULL,
    date DATE NOT NULL,
    deadline TEXT,
    event_time TEXT,
    location TEXT,
    banner_url TEXT NOT NULL,
    banner_url2 TEXT,
    registration_link TEXT,
    is_urgent BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Jadual Aktiviti Lepas & Arkib Pencapaian (Past Activities)
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    category TEXT NOT NULL,        -- 'Hackathon', 'Workshop', 'Lawatan Industri', 'Seminar'
    summary TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    gallery TEXT,                  -- JSON string array gambar galeri (1-4 gambar)
    attendees_count INTEGER DEFAULT 0,
    highlight_text TEXT,
    ai_field TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Log Penghantaran Emel & Peringatan Mesyuarat (Email Notification Logs)
CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    template_type TEXT NOT NULL,   -- 'welcome', 'meeting', 'notice'
    subject TEXT NOT NULL,
    sent_by TEXT DEFAULT 'Sistem Automasi AISA',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Delivered'
);

-- ==========================================================
-- CONTOH ARAHAN SQL: LIHAT DATA / BERSIHKAN DATA / ALTER TABLE
-- ==========================================================

-- A. CARA LIHAT DATA (QUERY INSERTED DATA)
-- SELECT * FROM club_registrations ORDER BY registered_at DESC;
-- SELECT * FROM email_logs ORDER BY sent_at DESC;
-- SELECT * FROM announcements;
-- SELECT * FROM notice_subscribers;

-- B. CARA BERSIHKAN SEMUA DATA (CLEAN / WIPE DATA)
-- DELETE FROM club_registrations;
-- DELETE FROM email_logs;
-- DELETE FROM notice_subscribers;
-- DELETE FROM announcements;
-- DELETE FROM activities;

-- C. CONTOH ARAHAN ALTER TABLE (MENAMBAH KOLUM BARU JIKA PERLU)
-- ALTER TABLE club_registrations ADD COLUMN assigned_pic TEXT DEFAULT 'Belum Ditetapkan';
-- ALTER TABLE club_registrations ADD COLUMN exco_notes TEXT;
-- ALTER TABLE announcements ADD COLUMN banner_url2 TEXT;
-- ALTER TABLE announcements ADD COLUMN event_time TEXT;
-- ALTER TABLE announcements ADD COLUMN location TEXT;
-- ALTER TABLE activities ADD COLUMN ai_field TEXT;
-- ALTER TABLE activities ADD COLUMN location TEXT;
-- ALTER TABLE email_logs ADD COLUMN sent_by TEXT DEFAULT 'Sistem Automasi AISA';
