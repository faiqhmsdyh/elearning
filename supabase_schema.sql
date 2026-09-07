-- ============================================================================
-- EDUSMART E-LEARNING DATABASE SCHEMA & SEED DATA (SUPABASE POSTGRESQL)
-- Project URL: https://tsuciepqhkdetvqyfkqk.supabase.co
-- Execute this script in your Supabase SQL Editor (https://app.supabase.com)
-- ============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('guru', 'siswa')),
    subject_id TEXT,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subject_id TEXT;

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 3. LKPD (Lembar Kerja Peserta Didik) TABLE
CREATE TABLE IF NOT EXISTS public.lkpd (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXERCISES (Latihan Soal dengan KKM) TABLE
CREATE TABLE IF NOT EXISTS public.exercises (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    kkm INT DEFAULT 75,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REMEDIAL TABLE
CREATE TABLE IF NOT EXISTS public.remedial (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVALUATIONS (Evaluasi Ujian) TABLE
CREATE TABLE IF NOT EXISTS public.evaluations (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration INT DEFAULT 30,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    module_type TEXT NOT NULL CHECK (module_type IN ('lkpd', 'exercise', 'remedial', 'evaluasi')),
    module_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    overall_score INT DEFAULT 0,
    teacher_score INT,
    kkm INT DEFAULT 75,
    is_below_kkm BOOLEAN DEFAULT FALSE,
    answers JSONB DEFAULT '[]'::jsonb,
    per_question_reviews JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'belum_diperiksa' CHECK (status IN ('belum_diperiksa', 'selesai_diperiksa')),
    teacher_notes TEXT DEFAULT '',
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS teacher_score INT;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS PERMISSIONS
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public lkpd" ON public.lkpd FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public exercises" ON public.exercises FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public remedial" ON public.remedial FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public evaluations" ON public.evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- INITIAL SEED DATA (POPULATE ALL TABLES)
-- ============================================================================

INSERT INTO public.users (id, username, name, role, password) VALUES
('usr-1', 'guru', 'Bpk. Hermawan, S.Pd.', 'guru', 'password123'),
('usr-2', 'siswa', 'Rian Hidayat', 'siswa', 'password123'),
('usr-3', 'siti', 'Siti Rahma', 'siswa', 'password123'),
('usr-4', 'budi', 'Budi Santoso', 'siswa', 'password123'),
('usr-5', 'anisa', 'Anisa Putri', 'siswa', 'password123')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, subject_id, title, description, kkm, questions) VALUES
('ex-mtk-1', 'subj-math', 'Latihan Matematika: Persamaan Linear Satu Variabel', 'Latihan dasar persamaan linear satu variabel untuk siswa.', 75, '[{"id":"qex-mtk-1-1","questionText":"Tentukan nilai x dari persamaan 3x + 5 = 20 dan jelaskan langkah pengerjaannya.","sampleAnswer":"3x = 15, sehingga x = 5."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subjects (id, name) VALUES
('subj-math', 'Matematika Aljabar'),
('subj-science', 'Ilmu Pengetahuan Alam (IPA)'),
('subj-english', 'Bahasa Inggris')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lkpd (id, subject_id, title, description, questions) VALUES
('lkpd-1', 'subj-math', 'LKPD 1: Eksplorasi Model Aljabar dan Persamaan Linear', 'Lembar Kerja Eksplorasi Mandiri.', '[{"id":"qlkpd-1-1","questionText":"Jelaskan perbedaan antara variabel, koefisien, dan konstanta pada bentuk aljabar 4x² - 7x + 12!"},{"id":"qlkpd-1-2","questionText":"Tuliskan bentuk aljabar dari 5 karung beras seharga Rp x dikurangi diskon Rp 50.000!"}]'::jsonb),
('lkpd-2', 'subj-science', 'LKPD 2: Pengamatan Organ & Enzim Pencernaan Manusia', 'LKPD Praktikum Biologi.', '[{"id":"qlkpd-2-1","questionText":"Sebutkan 3 enzim utama yang dihasilkan organ lambung!"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, subject_id, title, description, kkm, questions) VALUES
('ex-1', 'subj-math', 'Latihan Soal 1: Operasi Suku Aljabar & Substitusi', 'Latihan Pemahaman Konsep Matematika (KKM: 75).', 75, '[{"id":"qex-1-1","questionText":"Sederhanakanlah bentuk aljabar berikut: (6a + 8b - 3) + (2a - 5b + 9)."}]'::jsonb),
('ex-2', 'subj-science', 'Latihan Soal 2: Sistem Pencernaan & Nutrisi Tubuh', 'Latihan Harian IPA Biologi (KKM: 75).', 75, '[{"id":"qex-2-1","questionText":"Jelaskan alur pencernaan karbohidrat mulai dari organ mulut hingga usus halus!"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.remedial (id, exercise_id, subject_id, title, description, questions) VALUES
('rem-ex-1', 'ex-1', 'subj-math', 'Program Remedial 1: Penguatan Konsep Suku Aljabar', 'Soal Remedial Penguatan khusus nilai < KKM (75).', '[{"id":"qrem-1-1","questionText":"Sederhanakan bentuk (4x + 3y) - (2x - 5y)."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.evaluations (id, subject_id, title, description, duration, questions) VALUES
('eval-1', 'subj-math', 'Evaluasi Akhir BAB 1: Aljabar & Matematika Terapan', 'Ujian Evaluasi Akhir Semester.', 30, '[{"id":"qeval-1-1","questionText":"Jabarkan bentuk perkalian (2x + 3)(x - 4)!"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.submissions (id, module_type, module_id, student_id, student_name, overall_score, kkm, is_below_kkm, answers, per_question_reviews, status, teacher_notes) VALUES
('sub-demo-1', 'exercise', 'ex-1', 'usr-4', 'Budi Santoso', 60, 75, true, '[{"questionId":"qex-1-1","type":"text","content":"6a + 2b + 6"}]'::jsonb, '[{"score":40,"aiReview":"Robot AI: Suku b salah."}]'::jsonb, 'selesai_diperiksa', 'Budi, perhatikan tanda minus ya! Silakan kerjakan Remedial.'),
('sub-demo-2', 'lkpd', 'lkpd-1', 'usr-3', 'Siti Rahma', 95, 75, false, '[{"questionId":"qlkpd-1-1","type":"text","content":"Variabel x, koefisien 4 dan -7, konstanta 12."}]'::jsonb, '[{"score":95,"aiReview":"Robot AI: Sangat tepat!"}]'::jsonb, 'selesai_diperiksa', 'Luar biasa Siti!')
ON CONFLICT (id) DO NOTHING;
