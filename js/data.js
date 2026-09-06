/**
 * EduSmart Data & Storage Management
 * Populate rich seed data for LKPD, Latihan Soal, Remedial, Evaluasi, and Submissions.
 */

const KEYS = {
    USERS: 'edusmart_users',
    SUBJECTS: 'edusmart_subjects',
    MATERIALS: 'edusmart_materials',
    LKPD: 'edusmart_lkpd',
    EXERCISES: 'edusmart_exercises',
    REMEDIAL: 'edusmart_remedial',
    EVALUATION: 'edusmart_evaluation',
    SUBMISSIONS: 'edusmart_submissions',
    CURRENT_USER: 'edusmart_current_user'
};

// Rich Seed Data
const MOCK_DATA = {
    users: [
        { id: 'usr-1', username: 'guru', name: 'Bpk. Hermawan, S.Pd.', role: 'guru', password: 'password123' },
        { id: 'usr-2', username: 'siswa', name: 'Rian Hidayat', role: 'siswa', password: 'password123' },
        { id: 'usr-3', username: 'siti', name: 'Siti Rahma', role: 'siswa', password: 'password123' },
        { id: 'usr-4', username: 'budi', name: 'Budi Santoso', role: 'siswa', password: 'password123' },
        { id: 'usr-5', username: 'anisa', name: 'Anisa Putri', role: 'siswa', password: 'password123' },
        { id: 'usr-6', username: 'doni', name: 'Doni Pratama', role: 'siswa', password: 'password123' }
    ],
    subjects: [
        { id: 'subj-math', name: 'Matematika Aljabar' },
        { id: 'subj-science', name: 'Ilmu Pengetahuan Alam (IPA)' },
        { id: 'subj-english', name: 'Bahasa Inggris' }
    ],
    // 1. LKPD (Lembar Kerja Peserta Didik)
    lkpd: [
        {
            id: 'lkpd-1',
            subjectId: 'subj-math',
            title: 'LKPD 1: Eksplorasi Model Aljabar dan Persamaan Linear',
            description: 'Lembar Kerja Eksplorasi Mandiri. Kerjakan soal dengan Teks Uraian atau Unggah Foto lembar kerja tulisan tangan Anda.',
            questions: [
                {
                    id: 'qlkpd-1-1',
                    questionText: 'Jelaskan perbedaan antara variabel, koefisien, dan konstanta pada bentuk aljabar 4x² - 7x + 12! Berikan contoh penerapannya dalam kehidupan sehari-hari.',
                    sampleAnswer: 'Variabel = huruf (x), Koefisien = angka pengali (4 dan -7), Konstanta = nilai tetap (12).'
                },
                {
                    id: 'qlkpd-1-2',
                    questionText: 'Seorang pedagang membeli 5 karung beras seharga Rp x per karung, lalu mendapatkan potongan diskon Rp 50.000. Tuliskan bentuk aljabar pembayaran dan foto lembar kerja corat-coret Anda!',
                    sampleAnswer: 'Bentuk Aljabar = 5x - 50.000'
                }
            ]
        },
        {
            id: 'lkpd-2',
            subjectId: 'subj-science',
            title: 'LKPD 2: Pengamatan Organ & Enzim Pencernaan Manusia',
            description: 'LKPD Praktikum Biologi. Amati organ pencernaan dan tuliskan penjelasan lengkap atau unggah foto hasil ringkasan.',
            questions: [
                {
                    id: 'qlkpd-2-1',
                    questionText: 'Sebutkan 3 enzim utama yang dihasilkan organ lambung beserta fungsi masing-masing dalam mencerna zat makanan!',
                    sampleAnswer: 'Pepsin (memecah protein), Renin (menggumpalkan susu), HCl (membunuh kuman dan mengaktifkan pepsin).'
                },
                {
                    id: 'qlkpd-2-2',
                    questionText: 'Uraikan perbedaan mekanisme antara pencernaan mekanik dan pencernaan kimiawi yang terjadi pada organ mulut!',
                    sampleAnswer: 'Pencernaan mekanik dikunyah oleh gigi, pencernaan kimiawi dibantu enzim ptialin ludah.'
                }
            ]
        },
        {
            id: 'lkpd-3',
            subjectId: 'subj-science',
            title: 'LKPD 3: Analisis Hukum Gerak Newton & Gaya Fisika',
            description: 'LKPD Fisika Terapan. Selesaikan analisis fenomena gerak dan tunjukkan rumus perhitungan dalam foto/teks.',
            questions: [
                {
                    id: 'qlkpd-3-1',
                    questionText: 'Jelaskan bunyi Hukum I Newton (Inersia) dan berikan contoh mengapa penumpang mobil terdorong ke depan saat pengereman mendadak!',
                    sampleAnswer: 'Benda cenderung mempertahankan keadaan diam/bergerak lurus beraturan jika gaya total sama dengan nol.'
                }
            ]
        }
    ],
    // 2. Latihan Soal (with KKM criteria)
    exercises: [
        {
            id: 'ex-1',
            subjectId: 'subj-math',
            title: 'Latihan Soal 1: Operasi Suku Aljabar & Substitusi',
            description: 'Latihan Pemahaman Konsep Matematika (KKM: 75). Nilai di bawah KKM otomatis merujuk ke Modul Remedial.',
            kkm: 75,
            questions: [
                {
                    id: 'qex-1-1',
                    questionText: 'Sederhanakanlah bentuk aljabar berikut: (6a + 8b - 3) + (2a - 5b + 9). Jelaskan langkah pengelompokan suku sejenisnya!',
                    sampleAnswer: 'Kelompokkan suku sejenis: (6a + 2a) + (8b - 5b) + (-3 + 9) = 8a + 3b + 6'
                },
                {
                    id: 'qex-1-2',
                    questionText: 'Jika nilai x = 4 dan y = -2, tentukan nilai dari ekspresi 3x² - 2y + 5! Ketik jawaban teks atau foto lembar pengerjaan Anda.',
                    sampleAnswer: 'Substitusi: 3(4)² - 2(-2) + 5 = 48 + 4 + 5 = 57'
                }
            ]
        },
        {
            id: 'ex-2',
            subjectId: 'subj-science',
            title: 'Latihan Soal 2: Sistem Pencernaan & Nutrisi Tubuh',
            description: 'Latihan Harian IPA Biologi (KKM: 75). Koreksi AI instan per-soal.',
            kkm: 75,
            questions: [
                {
                    id: 'qex-2-1',
                    questionText: 'Jelaskan alur pencernaan karbohidrat mulai dari organ mulut hingga diserap oleh pembuluh darah di usus halus!',
                    sampleAnswer: 'Mulut (enzim ptialin) -> Usus halus (enzim amilase pankreas) -> diserap vili usus halus.'
                },
                {
                    id: 'qex-2-2',
                    questionText: 'Apa dampak biologis bagi tubuh jika fungsi usus besar mengalami gangguan peradangan (kolitis)? Jelaskan secara mendalam.',
                    sampleAnswer: 'Penyerapan air terganggu, menyebabkan kotoran cair (diare) dan risiko dehidrasi.'
                }
            ]
        },
        {
            id: 'ex-3',
            subjectId: 'subj-science',
            title: 'Latihan Soal 3: Gaya Terapan & Pesawat Sederhana',
            description: 'Latihan Fisika Terapan (KKM: 80). Uji perhitungan keuntungan mekanis.',
            kkm: 80,
            questions: [
                {
                    id: 'qex-3-1',
                    questionText: 'Sebuah tuas memiliki lengan beban 50 cm dan lengan kuas 200 cm. Hitunglah keuntungan mekanis tuas tersebut dan sertakan gambar/foto corat-coret Anda!',
                    sampleAnswer: 'Keuntungan Mekanis (KM) = Lengan Kuasa / Lengan Beban = 200 / 50 = 4.'
                }
            ]
        }
    ],
    // 3. Remedial (Unlocked automatically when Exercise score < KKM)
    remedial: [
        {
            id: 'rem-ex-1',
            exerciseId: 'ex-1',
            subjectId: 'subj-math',
            title: 'Program Remedial 1: Penguatan Konsep Suku Aljabar',
            description: 'Soal Remedial Penguatan khusus siswa yang nilai Latihan Soal 1 di bawah KKM (75). Kerjakan ulang untuk tuntas KKM.',
            questions: [
                {
                    id: 'qrem-1-1',
                    questionText: 'Remedial Soal 1: Sederhanakan bentuk (4x + 3y) - (2x - 5y). Ingat perhatikan tanda minus di depan kurung!',
                    sampleAnswer: '4x - 2x + 3y - (-5y) = 2x + 8y'
                },
                {
                    id: 'qrem-1-2',
                    questionText: 'Remedial Soal 2: Hitunglah nilai dari 2a + 3b jika nilai a = 3 dan b = 4. Tunjukkan jalan perhitungan Anda.',
                    sampleAnswer: '2(3) + 3(4) = 6 + 12 = 18'
                }
            ]
        },
        {
            id: 'rem-ex-2',
            exerciseId: 'ex-2',
            subjectId: 'subj-science',
            title: 'Program Remedial 2: Penguatan Organ & Enzim Pencernaan',
            description: 'Soal Remedial IPA Biologi khusus siswa dengan nilai di bawah KKM 75.',
            questions: [
                {
                    id: 'qrem-2-1',
                    questionText: 'Remedial Soal 1: Tulislah urutan kronologis organ pencernaan makanan dari mulut hingga sisa makanan dibuang melalui anus!',
                    sampleAnswer: 'Mulut -> Kerongkongan -> Lambung -> Usus Halus -> Usus Besar -> Anus.'
                }
            ]
        }
    ],
    // 4. Evaluasi Ujian Akhir
    evaluation: [
        {
            id: 'eval-1',
            subjectId: 'subj-math',
            title: 'Evaluasi Akhir BAB 1: Aljabar & Matematika Terapan',
            description: 'Ujian Evaluasi Akhir Semester. Kerjakan seluruh soal uraian dengan jujur dan lengkap.',
            duration: 30,
            questions: [
                {
                    id: 'qeval-1-1',
                    questionText: 'Jabarkan dan sederhanakan bentuk perkalian aljabar berikut: (2x + 3)(x - 4)!',
                    sampleAnswer: '2x² - 8x + 3x - 12 = 2x² - 5x - 12'
                },
                {
                    id: 'qeval-1-2',
                    questionText: 'Sebuah taman berbentuk persegi panjang memiliki panjang (3x + 2) meter dan lebar (x - 1) meter. Tentukan rumus keliling taman tersebut!',
                    sampleAnswer: 'Keliling = 2(P + L) = 2(3x + 2 + x - 1) = 2(4x + 1) = 8x + 2 meter'
                }
            ]
        },
        {
            id: 'eval-2',
            subjectId: 'subj-science',
            title: 'Evaluasi Akhir BAB 2: Biologi Pencernaan & Nutrisi Manusia',
            description: 'Evaluasi Komprehensif IPA Biologi.',
            duration: 40,
            questions: [
                {
                    id: 'qeval-2-1',
                    questionText: 'Jelaskan perbedaan fungsi antara usus halus dan usus besar dalam penyerapan nutrisi dan air!',
                    sampleAnswer: 'Usus halus menyerap sari nutrisi, usus besar menyerap air dan membusukkan sisa makanan.'
                }
            ]
        }
    ],
    // 5. Populated Submissions (Sample data in table)
    submissions: [
        {
            id: 'sub-demo-1',
            moduleType: 'exercise',
            moduleId: 'ex-1',
            studentId: 'usr-4',
            studentName: 'Budi Santoso',
            overallScore: 60,
            kkm: 75,
            isBelowKKM: true,
            answers: [
                { questionId: 'qex-1-1', type: 'text', content: '6a + 2b + 6 (Koreksi: ada kekeliruan pengurangan 8b - 5b)' },
                { questionId: 'qex-1-2', type: 'text', content: '3(4)^2 - 2(-2) + 5 = 48 + 4 + 5 = 57 (Benar)' }
            ],
            perQuestionReviews: [
                {
                    questionId: 'qex-1-1',
                    score: 40,
                    aiReview: '🤖 <b>Koreksi AI:</b> Pengelompokan suku b kurang teliti. (8b - 5b) seharusnya bernilai +3b, bukan +2b. Skor: 40/100.'
                },
                {
                    questionId: 'qex-1-2',
                    score: 80,
                    aiReview: '🤖 <b>Koreksi AI:</b> Perhitungan substitusi nilai x = 4 dan y = -2 sudah sangat akurat. Skor: 80/100.'
                }
            ],
            completedAt: '2026-08-25T14:20:00Z',
            status: 'selesai_diperiksa',
            teacherNotes: 'Budi, perhatikan tanda positif/negatif pada suku sejenis ya! Silakan ambil Modul Remedial yang telah terbuka.'
        },
        {
            id: 'sub-demo-2',
            moduleType: 'lkpd',
            moduleId: 'lkpd-1',
            studentId: 'usr-3',
            studentName: 'Siti Rahma',
            overallScore: 95,
            kkm: 75,
            isBelowKKM: false,
            answers: [
                { questionId: 'qlkpd-1-1', type: 'text', content: 'Variabel adalah simbol huruf (x). Koefisien angka pengali (4 dan -7). Konstanta nilai tetap (12). Contoh: menghitung harga belanjaan.' },
                { questionId: 'qlkpd-1-2', type: 'photo', photoUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&auto=format&fit=crop&q=60' }
            ],
            perQuestionReviews: [
                {
                    questionId: 'qlkpd-1-1',
                    score: 95,
                    aiReview: '🤖 <b>Koreksi AI:</b> Penjelasan sangat komprehensif dan tepat. Penggunaan contoh nyata sangat baik. Skor: 95/100.'
                },
                {
                    questionId: 'qlkpd-1-2',
                    score: 95,
                    aiReview: '🤖 <b>Koreksi AI (Analisis Foto):</b> Tulisan tangan matematika terdeteksi sangat rapi. Langkah perumusan 5x - 50.000 sempurna. Skor: 95/100.'
                }
            ],
            completedAt: '2026-08-26T10:15:00Z',
            status: 'selesai_diperiksa',
            teacherNotes: 'Sangat luar biasa, Siti! Struktur aljabar dan foto corat-coret Anda sangat lengkap dan rapi.'
        },
        {
            id: 'sub-demo-3',
            moduleType: 'exercise',
            moduleId: 'ex-2',
            studentId: 'usr-2',
            studentName: 'Rian Hidayat',
            overallScore: 88,
            kkm: 75,
            isBelowKKM: false,
            answers: [
                { questionId: 'qex-2-1', type: 'text', content: 'Pencernaan karbohidrat dimulai di mulut dengan enzim ptialin mengubah amilum jadi maltosa, lalu di usus halus dipecah amilase dan diserap vili.' },
                { questionId: 'qex-2-2', type: 'text', content: 'Usus besar menyerap air. Jika radang, penyerapan air terganggu sehingga diare.' }
            ],
            perQuestionReviews: [
                {
                    questionId: 'qex-2-1',
                    score: 90,
                    aiReview: '🤖 <b>Koreksi AI:</b> Alur organ dan peranan enzim ptialin serta amilase dijelaskan secara tepat. Skor: 90/100.'
                },
                {
                    questionId: 'qex-2-2',
                    score: 86,
                    aiReview: '🤖 <b>Koreksi AI:</b> Analisis gangguan fungsi usus besar tepat dan sistematis. Skor: 86/100.'
                }
            ],
            completedAt: '2026-08-27T09:30:00Z',
            status: 'belum_diperiksa',
            teacherNotes: ''
        },
        {
            id: 'sub-demo-4',
            moduleType: 'remedial',
            moduleId: 'rem-ex-1',
            studentId: 'usr-4',
            studentName: 'Budi Santoso',
            overallScore: 85,
            kkm: 75,
            isBelowKKM: false,
            answers: [
                { questionId: 'qrem-1-1', type: 'text', content: '4x - 2x + 3y - (-5y) = 2x + 8y (Benar)' },
                { questionId: 'qrem-1-2', type: 'text', content: '2(3) + 3(4) = 6 + 12 = 18 (Benar)' }
            ],
            perQuestionReviews: [
                {
                    questionId: 'qrem-1-1',
                    score: 85,
                    aiReview: '🤖 <b>Koreksi AI (Remedial):</b> Bagus! Budi telah memahami perubahan tanda minus (-) pada suku 5y menjadi +5y. Skor: 85/100.'
                },
                {
                    questionId: 'qrem-1-2',
                    score: 85,
                    aiReview: '🤖 <b>Koreksi AI (Remedial):</b> Substitusi nilai a dan b tepat. Skor: 85/100.'
                }
            ],
            completedAt: '2026-08-28T11:00:00Z',
            status: 'selesai_diperiksa',
            teacherNotes: 'Kerja bagus Budi! Nilai Remedial Anda kini telah TUNTAS KKM (85 >= 75).'
        }
    ]
};

// LocalStorage Helper wrapper
const db = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading localStorage key', key, e);
            return null;
        }
    },
    set: (key, val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error('Error writing localStorage key', key, e);
        }
    }
};

// Data Initializer (Force update seed data so user sees populated tables instantly)
function initializeData() {
    db.set(KEYS.USERS, MOCK_DATA.users);
    db.set(KEYS.SUBJECTS, MOCK_DATA.subjects);
    db.set(KEYS.LKPD, MOCK_DATA.lkpd);
    db.set(KEYS.EXERCISES, MOCK_DATA.exercises);
    db.set(KEYS.REMEDIAL, MOCK_DATA.remedial);
    db.set(KEYS.EVALUATION, MOCK_DATA.evaluation);
    db.set(KEYS.SUBMISSIONS, MOCK_DATA.submissions);
}

initializeData();

/**
 * DataStore Interface API
 */
const DataStore = {
    // Auth & Users
    loginUser: (username, password) => {
        const users = db.get(KEYS.USERS) || [];
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (user) {
            db.set(KEYS.CURRENT_USER, user);
            if (typeof SupabaseStore !== 'undefined') SupabaseStore.syncUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'Username atau password salah!' };
    },
    
    registerStudent: async (username, name, password) => {
        const users = db.get(KEYS.USERS) || [];
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username sudah digunakan!' };
        }
        const newStudent = { id: 'usr-' + Date.now(), username, name, role: 'siswa', password };
        users.push(newStudent);
        db.set(KEYS.USERS, users);
        if (typeof SupabaseStore !== 'undefined') {
            await SupabaseStore.syncUser(newStudent);
        }
        return { success: true, user: newStudent };
    },
    
    getCurrentUser: () => db.get(KEYS.CURRENT_USER),
    logout: () => localStorage.removeItem(KEYS.CURRENT_USER),
    getStudents: () => (db.get(KEYS.USERS) || []).filter(u => u.role === 'siswa'),

    // Subjects
    getSubjects: () => db.get(KEYS.SUBJECTS) || [],
    getSubjectName: (id) => {
        const s = (db.get(KEYS.SUBJECTS) || []).find(sub => sub.id === id);
        return s ? s.name : 'Umum';
    },

    // 1. LKPD
    getLKPDs: () => db.get(KEYS.LKPD) || [],
    getLKPD: (id) => (db.get(KEYS.LKPD) || []).find(l => l.id === id),
    addLKPD: (subjectId, title, description, questions) => {
        const list = db.get(KEYS.LKPD) || [];
        const item = {
            id: 'lkpd-' + Date.now(),
            subjectId,
            title,
            description,
            questions: questions.map((q, idx) => ({ id: `qlkpd-${Date.now()}-${idx}`, ...q }))
        };
        list.unshift(item);
        db.set(KEYS.LKPD, list);
        return item;
    },

    // 2. Latihan Soal
    getExercises: () => db.get(KEYS.EXERCISES) || [],
    getExercise: (id) => (db.get(KEYS.EXERCISES) || []).find(e => e.id === id),
    addExercise: (subjectId, title, description, kkm, questions) => {
        const list = db.get(KEYS.EXERCISES) || [];
        const item = {
            id: 'ex-' + Date.now(),
            subjectId,
            title,
            description,
            kkm: parseInt(kkm) || 75,
            questions: questions.map((q, idx) => ({ id: `qex-${Date.now()}-${idx}`, ...q }))
        };
        list.unshift(item);
        db.set(KEYS.EXERCISES, list);
        return item;
    },

    // 3. Remedial
    getRemedials: () => db.get(KEYS.REMEDIAL) || [],
    getRemedial: (id) => (db.get(KEYS.REMEDIAL) || []).find(r => r.id === id),
    getRemedialForExercise: (exerciseId) => (db.get(KEYS.REMEDIAL) || []).find(r => r.exerciseId === exerciseId),
    addRemedial: (exerciseId, subjectId, title, description, questions) => {
        const list = db.get(KEYS.REMEDIAL) || [];
        const item = {
            id: 'rem-' + Date.now(),
            exerciseId,
            subjectId,
            title,
            description,
            questions: questions.map((q, idx) => ({ id: `qrem-${Date.now()}-${idx}`, ...q }))
        };
        list.unshift(item);
        db.set(KEYS.REMEDIAL, list);
        return item;
    },

    isRemedialUnlockedForStudent: (studentId, exerciseId) => {
        const subs = db.get(KEYS.SUBMISSIONS) || [];
        const sub = subs.find(s => s.studentId === studentId && s.moduleId === exerciseId && s.moduleType === 'exercise');
        if (!sub) return false;
        const exercise = DataStore.getExercise(exerciseId);
        const kkm = exercise ? exercise.kkm : 75;
        return sub.overallScore < kkm;
    },

    // 4. Evaluasi
    getEvaluations: () => db.get(KEYS.EVALUATION) || [],
    getEvaluation: (id) => (db.get(KEYS.EVALUATION) || []).find(e => e.id === id),
    addEvaluation: (subjectId, title, description, duration, questions) => {
        const list = db.get(KEYS.EVALUATION) || [];
        const item = {
            id: 'eval-' + Date.now(),
            subjectId,
            title,
            description,
            duration: parseInt(duration) || 30,
            questions: questions.map((q, idx) => ({ id: `qeval-${Date.now()}-${idx}`, ...q }))
        };
        list.unshift(item);
        db.set(KEYS.EVALUATION, list);
        return item;
    },

    // Submissions Management
    getSubmissions: () => db.get(KEYS.SUBMISSIONS) || [],
    getSubmission: (id) => (db.get(KEYS.SUBMISSIONS) || []).find(s => s.id === id),
    getStudentSubmissions: (studentId) => (db.get(KEYS.SUBMISSIONS) || []).filter(s => s.studentId === studentId),
    
    saveSubmission: (submission) => {
        const list = db.get(KEYS.SUBMISSIONS) || [];
        const index = list.findIndex(s => s.id === submission.id);
        if (index >= 0) {
            list[index] = submission;
        } else {
            list.unshift(submission);
        }
        db.set(KEYS.SUBMISSIONS, list);
        if (typeof SupabaseStore !== 'undefined') SupabaseStore.syncSubmission(submission);
        return submission;
    },

    updateTeacherReview: (submissionId, notes) => {
        const list = db.get(KEYS.SUBMISSIONS) || [];
        const sub = list.find(s => s.id === submissionId);
        if (sub) {
            sub.status = 'selesai_diperiksa';
            sub.teacherNotes = notes;
            db.set(KEYS.SUBMISSIONS, list);
            if (typeof SupabaseStore !== 'undefined') SupabaseStore.syncSubmission(sub);
            return { success: true };
        }
        return { success: false, message: 'Data pengerjaan tidak ditemukan!' };
    }
};
