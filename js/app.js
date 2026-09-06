/**
 * EduSmart Main Application Controller
 * Handles Navigation, Worksheet Execution (LKPD, Latihan, Remedial, Evaluasi),
 * Per-Soal Text/Photo AI Correction, PDF Downloads, and Supabase Sync.
 */

const App = {
    // Current application state
    state: {
        currentPath: 'landing', // landing, login-guru, login-siswa, register, teacher, student, play-worksheet
        teacherActiveTab: 'overview',
        studentActiveTab: 'overview',
        
        // Active Play Worksheet State
        activeModuleType: null, // 'lkpd', 'exercise', 'remedial', 'evaluasi'
        activeModuleId: null,
        moduleAnswers: {}, // key: questionId, value: { type: 'text'|'photo', content: '', photoUrl: '' }
        moduleAIReviews: {} // key: questionId, value: { score: number, status: string, aiReview: string }
    },

    // 1. Initialization
    init: () => {
        const user = DataStore.getCurrentUser();
        if (user) {
            App.state.currentPath = user.role === 'guru' ? 'teacher' : 'student';
        } else {
            App.state.currentPath = 'landing';
        }
        App.render();
    },

    // 2. Main Render Loop
    render: () => {
        const root = document.getElementById('app');
        if (!root) return;

        switch (App.state.currentPath) {
            case 'landing':
                root.innerHTML = Views.landing();
                break;
            case 'login-guru':
                root.innerHTML = Views.login('guru');
                break;
            case 'login-siswa':
                root.innerHTML = Views.login('siswa');
                break;
            case 'register':
                root.innerHTML = Views.register();
                break;
            case 'teacher':
                App.renderTeacherDashboard(root);
                break;
            case 'student':
                App.renderStudentDashboard(root);
                break;
            case 'play-worksheet':
                App.renderPlayWorksheet(root);
                break;
            default:
                root.innerHTML = Views.landing();
        }
    },

    navigateTo: (path) => {
        App.state.currentPath = path;
        App.render();
    },

    // 3. Authentication Handlers
    handleLogin: async (event, role) => {
        event.preventDefault();
        const userField = document.getElementById('username');
        const passField = document.getElementById('password');
        if (!userField || !passField) return;

        const res = await DataStore.loginUser(userField.value.trim(), passField.value, role);
        if (res.success) {
            App.showToast(`Selamat datang kembali, ${res.user.name}!`, 'success');
            if (res.user.role === 'guru') {
                App.state.teacherActiveTab = 'overview';
                App.navigateTo('teacher');
            } else {
                App.state.studentActiveTab = 'overview';
                App.navigateTo('student');
            }
        } else {
            App.showToast(res.message, 'error');
        }
    },

    handleRegister: async (event) => {
        event.preventDefault();
        const nameField = document.getElementById('reg-name');
        const userField = document.getElementById('reg-username');
        const passField = document.getElementById('reg-password');
        if (!nameField || !userField || !passField) return;

        const res = await DataStore.registerStudent(userField.value.trim().toLowerCase(), nameField.value.trim(), passField.value);
        if (res.success) {
            App.showToast('🎉 Pendaftaran berhasil! Data disinkronkan ke Supabase.', 'success');
            App.navigateTo('login-siswa');
        } else {
            App.showToast(res.message, 'error');
        }
    },

    handleLogout: () => {
        DataStore.logout();
        App.showToast('Anda telah keluar dari aplikasi.', 'info');
        App.navigateTo('landing');
    },

    // 4. Teacher Dashboard Controller
    navigateTeacher: (tab) => {
        App.state.teacherActiveTab = tab;
        App.render();
    },

    renderTeacherDashboard: (root) => {
        let subContent = '';
        switch (App.state.teacherActiveTab) {
            case 'overview': subContent = Views.teacherOverview(); break;
            case 'lkpd': subContent = Views.teacherLKPD(); break;
            case 'exercises': subContent = Views.teacherExercises(); break;
            case 'remedial': subContent = Views.teacherRemedial(); break;
            case 'evaluation': subContent = Views.teacherEvaluation(); break;
            case 'grades': subContent = Views.teacherGrades(); break;
            default: subContent = Views.teacherOverview();
        }

        root.innerHTML = Views.teacherLayout(App.state.teacherActiveTab, subContent);
        App.setupSidebarGestures();
        if (App.state.teacherActiveTab === 'overview') {
            App.initTeacherOverviewChart();
        }
    },

    initTeacherOverviewChart: () => {
        const ctx = document.getElementById('scoresChart');
        if (!ctx) return;
        
        const subs = DataStore.getSubmissions();
        const labels = ['LKPD', 'Latihan Soal', 'Remedial', 'Evaluasi'];
        const avgScores = labels.map(type => {
            const match = subs.filter(s => s.moduleType.toLowerCase().includes(type.toLowerCase().substring(0, 4)));
            if (match.length === 0) return 80;
            return Math.round(match.reduce((a, b) => a + b.overallScore, 0) / match.length);
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Rata-rata Skor AI Per-Soal (%)',
                    data: avgScores,
                    backgroundColor: ['#6366f1', '#06b6d4', '#f59e0b', '#10b981'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { min: 0, max: 100 } }
            }
        });
    },

    // 5. Student Dashboard Controller
    navigateStudent: (tab) => {
        App.state.studentActiveTab = tab;
        App.render();
    },

    renderStudentDashboard: (root) => {
        let subContent = '';
        switch (App.state.studentActiveTab) {
            case 'overview': subContent = Views.studentOverview(); break;
            case 'lkpd': subContent = Views.studentLKPD(); break;
            case 'exercises': subContent = Views.studentExercises(); break;
            case 'remedial': subContent = Views.studentRemedial(); break;
            case 'evaluation': subContent = Views.studentEvaluation(); break;
            case 'grades': subContent = Views.studentGrades(); break;
            default: subContent = Views.studentOverview();
        }

        root.innerHTML = Views.studentLayout(App.state.studentActiveTab, subContent);
        App.setupSidebarGestures();
    },

    toggleSidebar: (forceOpen) => {
        const dashboard = document.querySelector('.dashboard-container');
        const toggle = document.querySelector('.sidebar-toggle');
        if (!dashboard) return;

        const isOpen = typeof forceOpen === 'boolean'
            ? forceOpen
            : !dashboard.classList.contains('sidebar-open');
        dashboard.classList.toggle('sidebar-open', isOpen);
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
            toggle.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}"></i>`;
        }
    },

    setupSidebarGestures: () => {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        if (!sidebar || !mainContent) return;

        let touchStartX = 0;
        sidebar.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });
        sidebar.addEventListener('touchend', (event) => {
            const distance = event.changedTouches[0].screenX - touchStartX;
            if (distance < -50) App.toggleSidebar(false);
        }, { passive: true });

        mainContent.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });
        mainContent.addEventListener('touchend', (event) => {
            const distance = event.changedTouches[0].screenX - touchStartX;
            if (touchStartX < 30 && distance > 50) App.toggleSidebar(true);
        }, { passive: true });
    },

    // 6. Worksheet Play Controller (LKPD, Latihan, Remedial, Evaluasi)
    startPlayModule: (moduleType, id) => {
        App.state.activeModuleType = moduleType;
        App.state.activeModuleId = id;
        App.state.moduleAnswers = {};
        App.state.moduleAIReviews = {};
        App.state.currentPath = 'play-worksheet';
        App.render();
    },

    exitPlayModule: () => {
        App.state.currentPath = 'student';
        App.render();
    },

    renderPlayWorksheet: (root) => {
        let item = null;
        if (App.state.activeModuleType === 'lkpd') item = DataStore.getLKPD(App.state.activeModuleId);
        else if (App.state.activeModuleType === 'exercise') item = DataStore.getExercise(App.state.activeModuleId);
        else if (App.state.activeModuleType === 'remedial') item = DataStore.getRemedial(App.state.activeModuleId);
        else if (App.state.activeModuleType === 'evaluasi') item = DataStore.getEvaluation(App.state.activeModuleId);

        if (!item) {
            App.showToast('Data lembar kerja tidak ditemukan.', 'error');
            App.navigateTo('student');
            return;
        }

        root.innerHTML = Views.playWorksheet(
            App.state.activeModuleType,
            item,
            App.state.moduleAnswers,
            App.state.moduleAIReviews
        );
    },

    toggleAnswerType: (questionId, type) => {
        if (!App.state.moduleAnswers[questionId]) {
            App.state.moduleAnswers[questionId] = { type: 'text', content: '', photoUrl: '' };
        }
        App.state.moduleAnswers[questionId].type = type;

        const textDiv = document.getElementById(`input-text-area-${questionId}`);
        const photoDiv = document.getElementById(`input-photo-area-${questionId}`);
        if (textDiv && photoDiv) {
            textDiv.style.display = type === 'text' ? 'block' : 'none';
            photoDiv.style.display = type === 'photo' ? 'block' : 'none';
        }
    },

    saveQuestionAnswer: (questionId, type, value) => {
        if (!App.state.moduleAnswers[questionId]) {
            App.state.moduleAnswers[questionId] = { type, content: '', photoUrl: '' };
        }
        if (type === 'text') {
            App.state.moduleAnswers[questionId].content = value;
        }
    },

    handlePhotoUpload: (event, questionId) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            if (!App.state.moduleAnswers[questionId]) {
                App.state.moduleAnswers[questionId] = { type: 'photo', content: '', photoUrl: '' };
            }
            App.state.moduleAnswers[questionId].type = 'photo';
            App.state.moduleAnswers[questionId].photoUrl = dataUrl;

            const previewImg = document.getElementById(`preview-img-${questionId}`);
            const previewContainer = document.getElementById(`preview-container-${questionId}`);
            if (previewImg && previewContainer) {
                previewImg.src = dataUrl;
                previewContainer.style.display = 'block';
            }
            App.showToast('Foto lembar kerja berhasil dimuat!', 'success');
        };
        reader.readAsDataURL(file);
    },

    runSingleQuestionAICorrection: (questionId, questionText) => {
        const card = document.getElementById(`ai-review-card-${questionId}`);
        const scoreBadge = document.getElementById(`ai-score-badge-${questionId}`);
        const contentDiv = document.getElementById(`ai-review-content-${questionId}`);

        if (card && contentDiv) {
            card.style.display = 'block';
            contentDiv.innerHTML = `<div style="padding:1rem; text-align:center; color:#0284c7;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><br><span style="font-weight:600; font-size:0.85rem; margin-top:0.5rem; display:block;">AI sedang menganalisis ${App.state.moduleAnswers[questionId]?.type === 'photo' ? 'Foto Lembar Kerja' : 'Teks Uraian'} Anda...</span></div>`;
        }

        setTimeout(() => {
            const ans = App.state.moduleAnswers[questionId] || { type: 'text', content: '' };
            const content = ans.type === 'photo' ? ans.photoUrl : ans.content;

            const result = AIService.correctQuestion(questionText, ans.type, content);
            App.state.moduleAIReviews[questionId] = result;

            if (card && scoreBadge && contentDiv) {
                scoreBadge.innerHTML = `Skor AI: ${result.score} / 100`;
                contentDiv.innerHTML = result.aiReview;
            }
            App.showToast(`Koreksi AI Selesai (Skor: ${result.score}/100)`, 'success');
        }, 500);
    },

    handleWorksheetSubmit: (event, moduleType, moduleId) => {
        event.preventDefault();
        const user = DataStore.getCurrentUser();
        if (!user) return;

        let item = null;
        if (moduleType === 'lkpd') item = DataStore.getLKPD(moduleId);
        else if (moduleType === 'exercise') item = DataStore.getExercise(moduleId);
        else if (moduleType === 'remedial') item = DataStore.getRemedial(moduleId);
        else if (moduleType === 'evaluasi') item = DataStore.getEvaluation(moduleId);

        if (!item) return;

        const questions = item.questions || [];
        const answersList = [];
        const reviewsList = [];
        let totalScoreSum = 0;

        questions.forEach(q => {
            const ans = App.state.moduleAnswers[q.id] || { type: 'text', content: 'Jawaban dikirim.' };
            answersList.push({ questionId: q.id, ...ans });

            let rev = App.state.moduleAIReviews[q.id];
            if (!rev) {
                const content = ans.type === 'photo' ? ans.photoUrl : ans.content;
                rev = AIService.correctQuestion(q.questionText, ans.type, content);
                App.state.moduleAIReviews[q.id] = rev;
            }
            reviewsList.push({ questionId: q.id, ...rev });
            totalScoreSum += rev.score;
        });

        const overallScore = Math.round(totalScoreSum / (questions.length || 1));
        const kkm = item.kkm || 75;
        const isBelowKKM = moduleType === 'exercise' && overallScore < kkm;

        const newSub = {
            id: 'sub-' + Date.now(),
            moduleType,
            moduleId,
            studentId: user.id,
            studentName: user.name,
            overallScore,
            kkm,
            isBelowKKM,
            answers: answersList,
            perQuestionReviews: reviewsList,
            completedAt: new Date().toISOString(),
            status: 'belum_diperiksa',
            teacherNotes: ''
        };

        DataStore.saveSubmission(newSub);

        if (isBelowKKM) {
            App.showToast(`⚠️ Nilai Latihan Anda (${overallScore}) di bawah KKM (${kkm}). Fitur Remedial telah dibuka!`, 'warning');
        } else {
            App.showToast(`🎉 Lembar kerja berhasil dikumpulkan! Nilai Akumulasi AI: ${overallScore}/100`, 'success');
        }

        // Navigate back to student grades / report download screen
        App.state.studentActiveTab = 'grades';
        App.navigateTo('student');
    },

    // 7. Download PDF Report Handler
    downloadPDFReport: (submissionId) => PDFReportModule.download(submissionId),

    // 8. Teacher Grade Inspection Modal
    openGradeDetailModal: (submissionId) => {
        const sub = DataStore.getSubmission(submissionId);
        if (!sub) return;
        App.openModal(`Pemeriksaan Lembar Kerja - ${sub.studentName}`, Views.gradeDetailModalContent(sub));
    },

    handleSaveTeacherReview: (event, submissionId) => {
        event.preventDefault();
        const notesInput = document.getElementById('teacher-notes-input');
        const notes = notesInput ? notesInput.value.trim() : '';

        const res = DataStore.updateTeacherReview(submissionId, notes);
        if (res.success) {
            App.showToast('Catatan Guru berhasil disimpan!', 'success');
            App.closeModal();
            App.render();
        } else {
            App.showToast(res.message, 'error');
        }
    },

    // Module Creation Delegation Modals
    openCreateLKPDModal: () => LKPDModule.openCreateModal(),
    handleCreateLKPD: (event) => LKPDModule.handleCreate(event),

    openCreateExerciseModal: () => ExerciseModule.openCreateModal(),
    handleCreateExercise: (event) => ExerciseModule.handleCreate(event),

    openCreateRemedialModal: () => RemedialModule.openCreateModal(),
    handleCreateRemedial: (event) => RemedialModule.handleCreate(event),

    openCreateEvalModal: () => EvaluationModule.openCreateModal(),
    handleCreateEval: (event) => EvaluationModule.handleCreate(event),

    // Supabase Key Settings Modal
    openSupabaseKeyModal: () => {
        const currentKey = typeof SupabaseStore !== 'undefined' ? SupabaseStore.getApiKey() : '';
        const isPlaceholder = !currentKey || currentKey.includes('placeholder');
        const content = `
        <form onsubmit="App.handleSaveSupabaseKey(event)">
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Masukkan <b>Supabase Anon Key</b> (dari <i>https://app.supabase.com -> Project Settings -> API -> anon public key</i>) agar pendaftaran siswa baru & pengerjaan lembar kerja otomatis masuk ke tabel Supabase.
            </p>
            <div class="form-group">
                <label><i class="fa-solid fa-key"></i> Supabase Anon Key (Public):</label>
                <textarea id="supabase-key-input" class="form-control" rows="3" placeholder="Tempelkan anon public key Supabase Anda di sini (eyJhbGci...)" required>${isPlaceholder ? '' : currentKey}</textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Simpan & Hubungkan</button>
            </div>
        </form>
        `;
        App.openModal('⚙️ Pengaturan Supabase Key', content);
    },

    handleSaveSupabaseKey: (event) => {
        event.preventDefault();
        const input = document.getElementById('supabase-key-input');
        const val = input ? input.value.trim() : '';
        if (val) {
            SupabaseStore.setApiKey(val);
            App.showToast('✅ Supabase Anon Key berhasil disimpan & dihubungkan ke backend!', 'success');
            App.closeModal();
            App.render();
        }
    },

    // 9. UI Utility Helpers (Modal & Toast)
    openModal: (title, htmlBody) => {
        let modalWrapper = document.getElementById('custom-modal-wrapper');
        if (!modalWrapper) {
            modalWrapper = document.createElement('div');
            modalWrapper.id = 'custom-modal-wrapper';
            document.body.appendChild(modalWrapper);
        }
        modalWrapper.innerHTML = `
        <div class="modal-overlay open animate-fade-in" onclick="App.closeModal()">
            <div class="modal-card" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn" onclick="App.closeModal()">&times;</button>
                </div>
                <div class="modal-body">${htmlBody}</div>
            </div>
        </div>
        `;
    },

    closeModal: () => {
        const modalWrapper = document.getElementById('custom-modal-wrapper');
        if (modalWrapper) modalWrapper.innerHTML = '';
    },

    showToast: (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-slide-in`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-xmark';
        if (type === 'warning') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('animate-slide-out');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
};

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
