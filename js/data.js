/**
 * EduSmart Data & Storage Management
 * Handles local storage persistence and mock data initialization.
 */

// Storage Keys Constants
const KEYS = {
    USERS: 'edusmart_users',
    SUBJECTS: 'edusmart_subjects',
    MATERIALS: 'edusmart_materials',
    EXERCISES: 'edusmart_exercises',
    QUIZZES: 'edusmart_quizzes',
    SUBMISSIONS: 'edusmart_submissions',
    CURRENT_USER: 'edusmart_current_user',
    STUDENTS: 'edusmart_students'
};

// Default Mock Data
const MOCK_DATA = {
    // Users: Admin/Guru and Students
    users: [
        { id: 'usr-1', username: 'guru', name: 'Bpk. Hermawan, S.Pd.', role: 'guru', password: 'password123' },
        { id: 'usr-2', username: 'siswa', name: 'Rian Hidayat', role: 'siswa', password: 'password123' },
        { id: 'usr-3', username: 'siti', name: 'Siti Rahma', role: 'siswa', password: 'password123' },
        { id: 'usr-4', username: 'budi', name: 'Budi Santoso', role: 'siswa', password: 'password123' }
    ],
    // Subjects
    subjects: [
        { id: 'subj-math', name: 'Matematika' },
        { id: 'subj-science', name: 'Ilmu Pengetahuan Alam (IPA)' },
        { id: 'subj-english', name: 'Bahasa Inggris' }
    ],
    // LKP / Materi (Lembar Kerja / Bahan Ajar)
    materials: [
        {
            id: 'mat-1',
            subjectId: 'subj-math',
            title: 'Pengenalan Aljabar Dasar',
            description: 'Mempelajari konsep variabel, konstanta, koefisien, dan operasi hitung aljabar sederhana.',
            content: `<h3>Pendahuluan Aljabar</h3>
            <p>Aljabar adalah cabang matematika yang menggunakan simbol-simbol (biasanya huruf seperti x, y, z) untuk mewakili bilangan atau nilai yang belum diketahui. Ini membantu kita memecahkan masalah matematika yang kompleks secara lebih mudah.</p>
            
            <h3>Unsur-unsur Aljabar</h3>
            <p>Perhatikan bentuk aljabar berikut: <strong>3x + 5</strong></p>
            <ul>
                <li><strong>Variabel:</strong> Simbol/huruf yang mewakili suatu nilai. Pada contoh di atas, <strong>x</strong> adalah variabelnya.</li>
                <li><strong>Koefisien:</strong> Angka yang mengalikan variabel. Angka <strong>3</strong> di depan x adalah koefisien.</li>
                <li><strong>Konstanta:</strong> Nilai tetap yang tidak memiliki variabel. Angka <strong>5</strong> adalah konstantanya.</li>
                <li><strong>Suku:</strong> Bagian dari bentuk aljabar yang dipisahkan oleh operasi penjumlahan atau pengurangan. Bentuk 3x + 5 terdiri dari dua suku, yaitu 3x dan 5.</li>
            </ul>`,
            author: 'Bpk. Hermawan, S.Pd.',
            createdAt: '2026-08-20T08:00:00Z',
            readBy: ['usr-2', 'usr-3']
        },
        {
            id: 'mat-2',
            subjectId: 'subj-science',
            title: 'Sistem Pencernaan Manusia',
            description: 'Memahami organ pencernaan utama, kelenjar pencernaan, dan proses pencernaan mekanik dan kimiawi.',
            content: `<h3>Sistem Pencernaan Manusia</h3>
            <p>Makanan yang kita makan harus dipecah menjadi molekul yang lebih kecil agar dapat diserap oleh sel-sel tubuh kita. Proses ini dilakukan oleh sistem pencernaan.</p>
            
            <h3>Organ Pencernaan Utama</h3>
            <ol>
                <li><strong>Mulut:</strong> Pencernaan dimulai di sini (mekanik dan kimiawi).</li>
                <li><strong>Kerongkongan (Esofagus):</strong> Makanan didorong ke lambung melalui gerakan <strong>peristaltik</strong>.</li>
                <li><strong>Lambung:</strong> Memecah makanan dengan asam lambung (HCl) dan enzim Pepsin.</li>
                <li><strong>Usus Halus:</strong> Di sini terjadi pencernaan kimiawi akhir dan <strong>penyerapan sari makanan</strong>.</li>
            </ol>`,
            author: 'Bpk. Hermawan, S.Pd.',
            createdAt: '2026-08-22T09:30:00Z',
            readBy: ['usr-2']
        }
    ],
    // Latihan Soal
    exercises: [
        {
            id: 'ex-1',
            subjectId: 'subj-math',
            title: 'Latihan Operasi Aljabar Sederhana',
            description: 'Uji pemahaman Anda tentang penggabungan suku-suku sejenis dalam aljabar.',
            questions: [
                {
                    id: 'qex-1-1',
                    type: 'text',
                    question: 'Sederhanakan bentuk aljabar berikut: 5x + 3y - 2x + 4y',
                    options: [
                        '7x + 7y',
                        '3x + 7y',
                        '3x - 1y',
                        '7x - y'
                    ],
                    correctIndex: 1,
                    explanation: 'Kumpulkan suku-suku yang sejenis: (5x - 2x) + (3y + 4y) = 3x + 7y.'
                },
                {
                    id: 'qex-1-2',
                    type: 'text',
                    question: 'Tentukan konstanta dari bentuk aljabar: 2x² - 5x + 9',
                    options: [
                        '2',
                        '-5',
                        '9',
                        'x'
                    ],
                    correctIndex: 2,
                    explanation: 'Konstanta adalah suku yang berdiri sendiri tanpa variabel. Pada bentuk tersebut nilainya adalah 9.'
                }
            ]
        }
    ],
    // Quizzes
    quizzes: [
        {
            id: 'quiz-1',
            subjectId: 'subj-math',
            title: 'Ujian Harian: Aljabar Dasar',
            description: 'Evaluasi formal pemahaman materi aljabar dasar. Kerjakan secara mandiri!',
            duration: 10,
            questions: [
                {
                    id: 'qqz-1-1',
                    type: 'text',
                    question: 'Nilai dari bentuk aljabar 4a - 3b jika a = 5 dan b = 2 adalah...',
                    options: ['14', '20', '6', '12'],
                    correctIndex: 0,
                    explanation: 'Substitusikan nilai a dan b: 4(5) - 3(2) = 20 - 6 = 14.'
                },
                {
                    id: 'qqz-1-2',
                    type: 'text',
                    question: 'Berapakah koefisien dari y² pada bentuk aljabar: 3x + 2y² - 5y + 1?',
                    options: ['3', '2', '-5', '1'],
                    correctIndex: 1,
                    explanation: 'Koefisien adalah angka pengali di depan variabel y² yaitu 2.'
                },
                {
                    id: 'qqz-1-3',
                    type: 'text',
                    question: 'Hasil penyederhanaan dari (3a + 2b) - (a - 5b) adalah...',
                    options: ['2a - 3b', '2a + 7b', '4a + 7b', '4a - 3b'],
                    correctIndex: 1,
                    explanation: 'Lakukan pengurangan suku sejenis: 3a - a + 2b - (-5b) = 2a + 7b.'
                }
            ]
        },
        {
            id: 'quiz-2',
            subjectId: 'subj-science',
            title: 'Kuis Interaktif: Visual & Ketangkasan Game',
            description: 'Kuis spesial yang menggabungkan soal diagram gambar, video penjelasan, dan game ketangkasan berjalan.',
            duration: 12,
            questions: [
                {
                    id: 'qqz-2-1',
                    type: 'image',
                    mediaUrl: 'diagram-lambung',
                    question: 'Perhatikan diagram organ pencernaan lambung di atas. Di lambung, proses pemecahan protein menjadi pepton dilakukan oleh asam dan enzim tertentu. Manakah enzim lambung yang berfungsi memecah protein tersebut?',
                    options: [
                        'Enzim Amilase',
                        'Enzim Pepsin',
                        'Enzim Lipase',
                        'Cairan Empedu'
                    ],
                    correctIndex: 1,
                    explanation: 'Lambung menghasilkan asam lambung (HCl) dan enzim Pepsin. Pepsin berfungsi mengubah protein menjadi senyawa pepton yang lebih sederhana.'
                },
                {
                    id: 'qqz-2-2',
                    type: 'video',
                    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    question: 'Tonton video demonstrasi proses pembakaran di atas. Mengapa api dapat padam saat udara di sekitarnya diisolasi/ditutup rapat?',
                    options: [
                        'Karena suhu api menurun secara drastis',
                        'Karena pasokan gas oksigen (O₂) habis terkonsumsi',
                        'Karena api tidak mendapatkan gas nitrogen (N₂)',
                        'Karena wadah penutup menghasilkan uap air pembakar'
                    ],
                    correctIndex: 1,
                    explanation: 'Proses pembakaran membutuhkan oksigen sebagai oksidator. Ketika wadah ditutup rapat, pasokan oksigen terhenti dan api akan padam setelah oksigen di dalam wadah habis.'
                },
                {
                    id: 'qqz-2-3',
                    type: 'game',
                    gameType: 'jumper',
                    question: 'Tantangan Fisika Ketangkasan: Mainkan game "EduJumper" di atas. Lompati rintangan balok dengan tombol SPACE atau klik layar. Lompati minimal 3 rintangan untuk membuktikan ketangkasan waktu Anda!',
                    options: [
                        'Gagal (Lompatan kurang dari 3)',
                        'Berhasil (Lompatan minimal 3 atau lebih)'
                    ],
                    correctIndex: 1,
                    explanation: 'Game EduJumper mengukur waktu reaksi (reaction time) yang merupakan konsep fisika koordinasi motorik. Lompatan minimal 3 kali membuktikan tingkat respons refleks yang baik.'
                }
            ]
        }
    ],
    // Submissions
    submissions: [
        {
            id: 'sub-1',
            quizId: 'quiz-1',
            studentId: 'usr-3',
            studentName: 'Siti Rahma',
            score: 100,
            answers: [0, 1, 1],
            completedAt: '2026-08-25T14:20:00Z',
            status: 'selesai_diperiksa',
            teacherNotes: 'Luar biasa, Siti! Semua jawaban tepat dan pemahaman konsep aljabar Anda sangat mantap. Pertahankan terus!',
            aiReview: `<h4><i class="fa-solid fa-square-poll-vertical"></i> Evaluasi Utama</h4>
            <p>Halo Siti Rahma! Selamat, Anda meraih <strong>Skor Sempurna (100/100)</strong> pada Kuis Aljabar Dasar ini. Hasil ini menunjukkan pemahaman yang luar biasa terhadap seluruh materi yang diujikan.</p>`
        },
        {
            id: 'sub-2',
            quizId: 'quiz-1',
            studentId: 'usr-4',
            studentName: 'Budi Santoso',
            score: 66,
            answers: [2, 1, 0], // Incorrect for Q1 and Q3
            completedAt: '2026-08-26T10:15:00Z',
            status: 'belum_diperiksa',
            teacherNotes: '',
            aiReview: `<h4><i class="fa-solid fa-square-poll-vertical"></i> Evaluasi Utama</h4>
            <p>Halo Budi Santoso! Anda menyelesaikan kuis dengan skor <strong>66/100</strong>. Anda sudah menguasai beberapa bagian dasar, namun terdapat kendala pada perhitungan substitusi dan pengurangan suku sejenis.</p>`
        }
    ]
};

// LocalStorage helpers
const db = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading localStorage', e);
            return null;
        }
    },
    set: (key, val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error('Error writing localStorage', e);
        }
    }
};

/**
 * Initialize Database with default mock data if not set
 */
function initializeData() {
    if (!db.get(KEYS.USERS)) {
        db.set(KEYS.USERS, MOCK_DATA.users);
    }
    if (!db.get(KEYS.SUBJECTS)) {
        db.set(KEYS.SUBJECTS, MOCK_DATA.subjects);
    }
    if (!db.get(KEYS.MATERIALS)) {
        db.set(KEYS.MATERIALS, MOCK_DATA.materials);
    }
    if (!db.get(KEYS.EXERCISES)) {
        db.set(KEYS.EXERCISES, MOCK_DATA.exercises);
    }
    
    // Always force update quizzes to include the interactive quiz for demo
    db.set(KEYS.QUIZZES, MOCK_DATA.quizzes);
    
    // Always force update submissions for demo structure compatibility
    if (!db.get(KEYS.SUBMISSIONS)) {
        db.set(KEYS.SUBMISSIONS, MOCK_DATA.submissions);
    }
}

// Ensure database is initialized
initializeData();

// Core Data API Functions
const DataStore = {
    // Auth & Users
    loginUser: (username, password) => {
        const users = db.get(KEYS.USERS) || [];
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (user) {
            db.set(KEYS.CURRENT_USER, user);
            return { success: true, user };
        }
        return { success: false, message: 'Username atau password salah!' };
    },
    
    registerStudent: (username, name, password) => {
        const users = db.get(KEYS.USERS) || [];
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username sudah digunakan!' };
        }
        
        const newStudent = {
            id: 'usr-' + Date.now(),
            username,
            name,
            role: 'siswa',
            password
        };
        
        users.push(newStudent);
        db.set(KEYS.USERS, users);
        return { success: true, user: newStudent };
    },
    
    getCurrentUser: () => {
        return db.get(KEYS.CURRENT_USER);
    },
    
    logout: () => {
        localStorage.removeItem(KEYS.CURRENT_USER);
    },
    
    getStudents: () => {
        const users = db.get(KEYS.USERS) || [];
        return users.filter(u => u.role === 'siswa');
    },

    // Subjects
    getSubjects: () => {
        return db.get(KEYS.SUBJECTS) || [];
    },
    
    getSubjectName: (id) => {
        const subjs = db.get(KEYS.SUBJECTS) || [];
        const s = subjs.find(subj => subj.id === id);
        return s ? s.name : 'Umum';
    },

    // Materials / LKP
    getMaterials: () => {
        return db.get(KEYS.MATERIALS) || [];
    },
    
    getMaterial: (id) => {
        const mats = db.get(KEYS.MATERIALS) || [];
        return mats.find(m => m.id === id);
    },
    
    addMaterial: (subjectId, title, description, content, author) => {
        const mats = db.get(KEYS.MATERIALS) || [];
        const newMat = {
            id: 'mat-' + Date.now(),
            subjectId,
            title,
            description,
            content,
            author,
            createdAt: new Date().toISOString(),
            readBy: []
        };
        mats.unshift(newMat);
        db.set(KEYS.MATERIALS, mats);
        return newMat;
    },
    
    deleteMaterial: (id) => {
        let mats = db.get(KEYS.MATERIALS) || [];
        mats = mats.filter(m => m.id !== id);
        db.set(KEYS.MATERIALS, mats);
    },
    
    markMaterialAsRead: (id, userId) => {
        const mats = db.get(KEYS.MATERIALS) || [];
        const mat = mats.find(m => m.id === id);
        if (mat && !mat.readBy.includes(userId)) {
            mat.readBy.push(userId);
            db.set(KEYS.MATERIALS, mats);
        }
    },

    // Exercises (Latihan Soal)
    getExercises: () => {
        return db.get(KEYS.EXERCISES) || [];
    },
    
    getExercise: (id) => {
        const exs = db.get(KEYS.EXERCISES) || [];
        return exs.find(e => e.id === id);
    },
    
    addExercise: (subjectId, title, description, questions) => {
        const exs = db.get(KEYS.EXERCISES) || [];
        const newEx = {
            id: 'ex-' + Date.now(),
            subjectId,
            title,
            description,
            questions: questions.map((q, idx) => ({
                id: `qex-${Date.now()}-${idx}`,
                type: q.type || 'text',
                ...q
            }))
        };
        exs.unshift(newEx);
        db.set(KEYS.EXERCISES, exs);
        return newEx;
    },
    
    deleteExercise: (id) => {
        let exs = db.get(KEYS.EXERCISES) || [];
        exs = exs.filter(e => e.id !== id);
        db.set(KEYS.EXERCISES, exs);
    },

    // Quizzes (Ujian Resmi)
    getQuizzes: () => {
        return db.get(KEYS.QUIZZES) || [];
    },
    
    getQuiz: (id) => {
        const qzs = db.get(KEYS.QUIZZES) || [];
        return qzs.find(q => q.id === id);
    },
    
    addQuiz: (subjectId, title, description, duration, questions) => {
        const qzs = db.get(KEYS.QUIZZES) || [];
        const newQuiz = {
            id: 'quiz-' + Date.now(),
            subjectId,
            title,
            description,
            duration: parseInt(duration) || 15,
            questions: questions.map((q, idx) => ({
                id: `qqz-${Date.now()}-${idx}`,
                type: q.type || 'text',
                ...q
            }))
        };
        qzs.unshift(newQuiz);
        db.set(KEYS.QUIZZES, qzs);
        return newQuiz;
    },
    
    deleteQuiz: (id) => {
        let qzs = db.get(KEYS.QUIZZES) || [];
        qzs = qzs.filter(q => q.id !== id);
        db.set(KEYS.QUIZZES, qzs);
    },

    // Submissions
    getSubmissions: () => {
        return db.get(KEYS.SUBMISSIONS) || [];
    },
    
    getSubmission: (id) => {
        const subs = db.get(KEYS.SUBMISSIONS) || [];
        return subs.find(s => s.id === id);
    },
    
    addSubmission: (quizId, studentId, studentName, score, answers, aiReview) => {
        const subs = db.get(KEYS.SUBMISSIONS) || [];
        const newSub = {
            id: 'sub-' + Date.now(),
            quizId,
            studentId,
            studentName,
            score,
            answers,
            completedAt: new Date().toISOString(),
            status: 'belum_diperiksa', // default status
            teacherNotes: '', // default empty notes
            aiReview: aiReview
        };
        subs.unshift(newSub);
        db.set(KEYS.SUBMISSIONS, subs);
        return newSub;
    },
    
    updateTeacherReview: (submissionId, notes) => {
        const subs = db.get(KEYS.SUBMISSIONS) || [];
        const s = subs.find(item => item.id === submissionId);
        if (s) {
            s.status = 'selesai_diperiksa';
            s.teacherNotes = notes;
            db.set(KEYS.SUBMISSIONS, subs);
            return { success: true };
        }
        return { success: false, message: 'Ujian tidak ditemukan!' };
    },
    
    getStudentSubmissions: (studentId) => {
        const subs = db.get(KEYS.SUBMISSIONS) || [];
        return subs.filter(s => s.studentId === studentId);
    },
    
    getQuizSubmissions: (quizId) => {
        const subs = db.get(KEYS.SUBMISSIONS) || [];
        return subs.filter(s => s.quizId === quizId);
    }
};
