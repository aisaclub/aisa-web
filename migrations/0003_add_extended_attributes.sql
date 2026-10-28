-- ==========================================================
-- Migration 0003: Penambahan Atribut Lanjutan (Extended Attributes)
-- Pangkalan Data Cloudflare D1: aisaclub
-- UiTM Cawangan Melaka Kampus Jasin
-- ==========================================================

-- 1. Penambahan Atribut untuk club_registrations
ALTER TABLE club_registrations ADD COLUMN faculty TEXT DEFAULT 'FSKM';
ALTER TABLE club_registrations ADD COLUMN campus TEXT DEFAULT 'UiTM Melaka Kampus Jasin';
ALTER TABLE club_registrations ADD COLUMN t_shirt_size TEXT DEFAULT 'L';
ALTER TABLE club_registrations ADD COLUMN github_url TEXT;
ALTER TABLE club_registrations ADD COLUMN linkedin_url TEXT;
ALTER TABLE club_registrations ADD COLUMN dietary_preference TEXT DEFAULT 'Biasa';
ALTER TABLE club_registrations ADD COLUMN emergency_contact_name TEXT;
ALTER TABLE club_registrations ADD COLUMN emergency_contact_phone TEXT;
ALTER TABLE club_registrations ADD COLUMN is_verified BOOLEAN DEFAULT 0;
ALTER TABLE club_registrations ADD COLUMN membership_card_url TEXT;

-- 2. Penambahan Atribut untuk announcements
ALTER TABLE announcements ADD COLUMN speaker_name TEXT;
ALTER TABLE announcements ADD COLUMN speaker_title TEXT;
ALTER TABLE announcements ADD COLUMN organizer TEXT DEFAULT 'AISA UiTM Jasin';
ALTER TABLE announcements ADD COLUMN entry_fee TEXT DEFAULT 'Percuma';
ALTER TABLE announcements ADD COLUMN target_audience TEXT DEFAULT 'Semua Mahasiswa UiTM';
ALTER TABLE announcements ADD COLUMN prerequisite TEXT;
ALTER TABLE announcements ADD COLUMN e_certificate_provided BOOLEAN DEFAULT 1;
ALTER TABLE announcements ADD COLUMN merit_cop_provided BOOLEAN DEFAULT 1;

-- 3. Penambahan Atribut untuk activities
ALTER TABLE activities ADD COLUMN organizer_department TEXT DEFAULT 'Biro AI & Sains Data';
ALTER TABLE activities ADD COLUMN budget_spent REAL DEFAULT 0.0;
ALTER TABLE activities ADD COLUMN sponsor_names TEXT;
ALTER TABLE activities ADD COLUMN impact_rating REAL DEFAULT 4.8;
ALTER TABLE activities ADD COLUMN documentation_drive_link TEXT;
ALTER TABLE activities ADD COLUMN speaker_or_trainer TEXT;

-- 4. Penambahan Atribut untuk committee_members
ALTER TABLE committee_members ADD COLUMN matrix_id TEXT;
ALTER TABLE committee_members ADD COLUMN phone_number TEXT;
ALTER TABLE committee_members ADD COLUMN term_session TEXT DEFAULT '2025/2026';
ALTER TABLE committee_members ADD COLUMN tenure_status TEXT DEFAULT 'Aktif';
ALTER TABLE committee_members ADD COLUMN portfolio_projects TEXT;

-- 5. Penambahan Atribut untuk advisors
ALTER TABLE advisors ADD COLUMN staff_id TEXT;
ALTER TABLE advisors ADD COLUMN phone_office TEXT;
ALTER TABLE advisors ADD COLUMN scopus_id TEXT;
ALTER TABLE advisors ADD COLUMN orcid_id TEXT;
ALTER TABLE advisors ADD COLUMN position_level TEXT DEFAULT 'Pensyarah Kanan';

-- 6. Penambahan Atribut untuk email_logs
ALTER TABLE email_logs ADD COLUMN campaign_id TEXT;
ALTER TABLE email_logs ADD COLUMN email_style TEXT DEFAULT 'minimalist';
ALTER TABLE email_logs ADD COLUMN opened_at DATETIME;
ALTER TABLE email_logs ADD COLUMN error_message TEXT;

-- 7. Penambahan Atribut untuk notice_subscribers
ALTER TABLE notice_subscribers ADD COLUMN subscriber_name TEXT;
ALTER TABLE notice_subscribers ADD COLUMN frequency_preference TEXT DEFAULT 'Segera';
ALTER TABLE notice_subscribers ADD COLUMN is_active BOOLEAN DEFAULT 1;
