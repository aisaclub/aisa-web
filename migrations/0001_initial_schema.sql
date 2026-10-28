-- ==============================================================================
-- Cloudflare D1 Migration: 0001_initial_schema.sql
-- Database Serverless SQLite untuk AISA UiTM Melaka Kampus Jasin
-- ==============================================================================

-- 1. Jadual Pensyarah Penasihat (Lecturer Advisors)
CREATE TABLE IF NOT EXISTS advisors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    faculty TEXT NOT NULL,
    room TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT NOT NULL,
    research_area TEXT NOT NULL,
    consultation_hours TEXT,
    google_scholar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Jadual Jawatankuasa & Barisan Exco Pelajar (Committee Members)
CREATE TABLE IF NOT EXISTS committee_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    level TEXT NOT NULL, -- 'advisor', 'mt', 'head', 'exco'
    department TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    bio TEXT,
    ai_specialty TEXT,
    year_program TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    email TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Jadual Pendaftaran Ahli Kelab (Club Registrations - Native Web Form)
CREATE TABLE IF NOT EXISTS club_registrations (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    student_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    program TEXT NOT NULL,
    semester TEXT NOT NULL,
    ai_interest TEXT NOT NULL,
    membership_id TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'Baru', -- 'Baru', 'Disemak', 'Lulus', 'Perlu Dihubungi'
    assigned_pic TEXT, -- Nama Exco PIC yang pantau
    exco_notes TEXT,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Jadual Langganan Notis & Buletin (Notice Subscribers)
CREATE TABLE IF NOT EXISTS notice_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    preferred_topic TEXT DEFAULT 'Semua Hebahan & Mesyuarat',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Jadual Hebahan & Pertandingan (Announcements & Events)
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    deadline TEXT,
    banner_url TEXT NOT NULL,
    registration_link TEXT DEFAULT '#join-us',
    is_urgent BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Jadual Aktiviti & Arkib Pencapaian (Past Activities)
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    gallery TEXT, -- JSON Array format
    attendees_count INTEGER DEFAULT 0,
    highlight_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Log Penghantaran Emel & Broadcast Notis (Email Notification Logs)
CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    template_type TEXT NOT NULL, -- 'welcome', 'meeting', 'notice', 'subscribe_confirm'
    subject TEXT NOT NULL,
    sent_by TEXT DEFAULT 'Sistem Automasi AISA',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Delivered'
);
