-- ==========================================================
-- SKEMA PENUH PANGKALAN DATA CLOUDFLARE D1 (MASTER SCHEMA)
-- Artificial Intelligence Student Association (AISA)
-- UiTM Cawangan Melaka Kampus Jasin (FSKM & FPA)
-- Database Name : aisaclub
-- Database ID   : 76d5c84e-e67e-48b8-89dc-03745574c676
-- Binding       : DB
-- ==========================================================

-- 1. JADUAL PENDAFTARAN AHLI KELAB (CLUB REGISTRATIONS)
CREATE TABLE IF NOT EXISTS club_registrations (
    id                      TEXT PRIMARY KEY,
    full_name               TEXT NOT NULL,
    student_id              TEXT NOT NULL UNIQUE,
    email                   TEXT NOT NULL,
    whatsapp_number         TEXT NOT NULL,
    program                 TEXT NOT NULL,
    semester                TEXT NOT NULL,
    ai_interest             TEXT NOT NULL,
    membership_id           TEXT NOT NULL UNIQUE,
    status                  TEXT DEFAULT 'Baru',
    assigned_pic            TEXT DEFAULT 'Belum Ditetapkan',
    exco_notes              TEXT,
    registered_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    faculty                 TEXT DEFAULT 'FSKM',
    campus                  TEXT DEFAULT 'UiTM Melaka Kampus Jasin',
    t_shirt_size            TEXT DEFAULT 'L',
    github_url              TEXT,
    linkedin_url            TEXT,
    dietary_preference      TEXT DEFAULT 'Biasa',
    emergency_contact_name  TEXT,
    emergency_contact_phone TEXT,
    is_verified             BOOLEAN DEFAULT 0,
    membership_card_url     TEXT
);

-- 2. JADUAL HEBAHAN & PERTANDINGAN (ANNOUNCEMENTS)
CREATE TABLE IF NOT EXISTS announcements (
    id                      TEXT PRIMARY KEY,
    title                   TEXT NOT NULL,
    category                TEXT NOT NULL,
    description             TEXT NOT NULL,
    date                    DATE NOT NULL,
    deadline                TEXT,
    banner_url              TEXT NOT NULL,
    registration_link       TEXT DEFAULT '#join-us',
    is_urgent               BOOLEAN DEFAULT 0,
    status                  TEXT DEFAULT 'Open',
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    banner_url2             TEXT,
    event_time              TEXT,
    location                TEXT,
    speaker_name            TEXT,
    speaker_title           TEXT,
    organizer               TEXT DEFAULT 'AISA UiTM Jasin',
    entry_fee               TEXT DEFAULT 'Percuma',
    target_audience         TEXT DEFAULT 'Semua Mahasiswa UiTM',
    prerequisite            TEXT,
    e_certificate_provided  BOOLEAN DEFAULT 1,
    merit_cop_provided      BOOLEAN DEFAULT 1
);

-- 3. JADUAL AKTIVITI LEPAS & ARKIB (ACTIVITIES)
CREATE TABLE IF NOT EXISTS activities (
    id                      TEXT PRIMARY KEY,
    title                   TEXT NOT NULL,
    event_date              TEXT NOT NULL,
    category                TEXT NOT NULL,
    summary                 TEXT NOT NULL,
    cover_image             TEXT NOT NULL,
    gallery                 TEXT,
    attendees_count         INTEGER DEFAULT 0,
    highlight_text          TEXT,
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    ai_field                TEXT,
    location                TEXT,
    organizer_department    TEXT DEFAULT 'Biro AI & Sains Data',
    budget_spent            REAL DEFAULT 0.0,
    sponsor_names           TEXT,
    impact_rating           REAL DEFAULT 4.8,
    documentation_drive_link TEXT,
    speaker_or_trainer      TEXT
);

-- 4. JADUAL JAWATANKUASA EXCO (COMMITTEE MEMBERS)
CREATE TABLE IF NOT EXISTS committee_members (
    id                      TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    role                    TEXT NOT NULL,
    level                   TEXT NOT NULL,
    department              TEXT NOT NULL,
    photo_url               TEXT NOT NULL,
    bio                     TEXT,
    ai_specialty            TEXT,
    year_program            TEXT,
    linkedin_url            TEXT,
    github_url              TEXT,
    email                   TEXT,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    matrix_id               TEXT,
    phone_number            TEXT,
    term_session            TEXT DEFAULT '2025/2026',
    tenure_status           TEXT DEFAULT 'Aktif',
    portfolio_projects      TEXT
);

-- 5. JADUAL PENSYARAH PENASIHAT (ADVISORS)
CREATE TABLE IF NOT EXISTS advisors (
    id                      TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    title                   TEXT NOT NULL,
    faculty                 TEXT NOT NULL,
    room                    TEXT NOT NULL,
    email                   TEXT NOT NULL UNIQUE,
    photo_url               TEXT NOT NULL,
    research_area           TEXT NOT NULL,
    consultation_hours      TEXT,
    google_scholar          TEXT,
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    staff_id                TEXT,
    phone_office            TEXT,
    scopus_id               TEXT,
    orcid_id                TEXT,
    position_level          TEXT DEFAULT 'Pensyarah Kanan'
);

-- 6. JADUAL LOG EMEL & NOTIFIKASI (EMAIL LOGS)
CREATE TABLE IF NOT EXISTS email_logs (
    id                      TEXT PRIMARY KEY,
    recipient_email         TEXT NOT NULL,
    recipient_name          TEXT NOT NULL,
    template_type           TEXT NOT NULL,
    subject                 TEXT NOT NULL,
    sent_by                 TEXT DEFAULT 'Sistem Automasi AISA',
    sent_at                 DATETIME DEFAULT CURRENT_TIMESTAMP,
    status                  TEXT DEFAULT 'Delivered',
    campaign_id             TEXT,
    email_style             TEXT DEFAULT 'minimalist',
    opened_at               DATETIME,
    error_message           TEXT
);

-- 7. JADUAL LANGGANAN NOTIS (NOTICE SUBSCRIBERS)
CREATE TABLE IF NOT EXISTS notice_subscribers (
    id                      TEXT PRIMARY KEY,
    email                   TEXT NOT NULL UNIQUE,
    preferred_topic         TEXT DEFAULT 'Semua Hebahan & Mesyuarat',
    subscribed_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active               BOOLEAN DEFAULT 1,
    subscriber_name         TEXT,
    frequency_preference    TEXT DEFAULT 'Segera'
);
