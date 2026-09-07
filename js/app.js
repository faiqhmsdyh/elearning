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
        studentSubjectFilter: '',
        
        // Active Play Worksheet State
        activeModuleType: null, // 'lkpd', 'exercise', 'remedial', 'evaluasi'
        activeModuleId: null,
        moduleAnswers: {}, // key: questionId, value: { type: 'text'|'photo', content: '', photoUrl: '' }
        moduleAIReviews: {} // key: questionId, value: { score: number, status: string, aiReview: string }
    },

    // 1. Initialization
    init: async () => {
        if (typeof DataStore.loadRemoteModules === 'function') await DataStore.loadRemoteModules();
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
                root.innerHTML = Views.register('siswa');
                break;
            case 'register-guru':
                root.innerHTML = Views.register('guru');
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

    handleRegister: async (event, role = 'siswa') => {
        event.preventDefault();
        const nameField = document.getElementById('reg-name');
        const userField = document.getElementById('reg-username');
        const passField = document.getElementById('reg-password');
        const subjectField = document.getElementById('reg-subject');
        if (!nameField || !userField || !passField) return;

        const subjectId = role === 'guru' ? subjectField?.value : null;
        const res = await DataStore.registerStudent(userField.value.trim().toLowerCase(), nameField.value.trim(), passField.value, role, subjectId);
        if (res.success) {
            App.showToast('🎉 Pendaftaran berhasil! Data disinkronkan ke Supabase.', 'success');
            App.navigateTo(role === 'guru' ? 'login-guru' : 'login-siswa');
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

    setStudentSubjectFilter: (subjectId) => {
        App.state.studentSubjectFilter = subjectId;
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

    toggleQuestionType: (prefix, index) => {
        const type = document.getElementById(`${prefix}-type-${index}`)?.value;
        const fields = document.querySelector(`.multiple-choice-fields-${prefix}-${index}`);
        if (fields) fields.style.display = type === 'pilihan-ganda' ? 'block' : 'none';
    },

    questionBuilderItem: (prefix, index) => `
        <div class="question-builder-item" data-question-index="${index}" style="border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); margin-bottom:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <strong>Soal #${index}</strong>
                <button type="button" class="btn btn-secondary btn-sm" onclick="App.removeQuestionField('${prefix}', ${index})" ${index === 1 ? 'style="display:none"' : ''}>Hapus</button>
            </div>
            <div class="form-group">
            <label for="${prefix}-type-${index}">Bentuk Soal</label>
            <select id="${prefix}-type-${index}" class="form-control" onchange="App.toggleQuestionType('${prefix}', ${index})" required>
                <option value="uraian">Uraian</option>
                <option value="pilihan-ganda">Pilihan Ganda</option>
            </select>
            </div>
            <div class="form-group">
                <label for="${prefix}-q${index}">Pertanyaan Soal #${index}</label>
                <textarea id="${prefix}-q${index}" class="form-control" rows="2" placeholder="Tuliskan pertanyaan soal #${index}..." required></textarea>
            </div>
        <div class="multiple-choice-fields-${prefix}-${index}" style="display:none; padding:0.75rem; background:var(--bg-main); border-radius:var(--radius-md);">
            <label>Opsi Jawaban</label>
            ${['a', 'b', 'c', 'd'].map(letter => `<input type="text" id="${prefix}-option-${index}-${letter}" class="form-control" style="margin-top:0.5rem;" placeholder="Opsi ${letter.toUpperCase()}">`).join('')}
            <label for="${prefix}-correct-${index}" style="display:block; margin-top:0.75rem;">Kunci Jawaban</label>
            <select id="${prefix}-correct-${index}" class="form-control" style="margin-top:0.5rem;">
                <option value="">Pilih kunci jawaban</option>
                <option value="a">Opsi A</option>
                <option value="b">Opsi B</option>
                <option value="c">Opsi C</option>
                <option value="d">Opsi D</option>
            </select>
        </div>
        </div>`,

    questionBuilderFields: (prefix) => `
        <div id="${prefix}-questions" class="question-builder-${prefix}">
            ${App.questionBuilderItem(prefix, 1)}
        </div>
        <button type="button" class="btn btn-outline" style="margin-bottom:1rem;" onclick="App.addQuestionField('${prefix}')">
            <i class="fa-solid fa-plus"></i> Tambah Soal
        </button>`,

    addQuestionField: (prefix) => {
        const container = document.getElementById(`${prefix}-questions`);
        if (!container) return;
        const index = container.querySelectorAll('.question-builder-item').length + 1;
        container.insertAdjacentHTML('beforeend', App.questionBuilderItem(prefix, index));
    },

    removeQuestionField: (prefix, index) => {
        const item = document.querySelector(`#${prefix}-questions [data-question-index="${index}"]`);
        if (item) item.remove();
    },

    getQuestionFormData: (prefix) => {
        return [...document.querySelectorAll(`#${prefix}-questions .question-builder-item`)].map(item => {
            const index = item.dataset.questionIndex;
            const type = document.getElementById(`${prefix}-type-${index}`)?.value || 'uraian';
            const questionText = document.getElementById(`${prefix}-q${index}`)?.value.trim() || '';
            const options = ['a', 'b', 'c', 'd']
                .map(letter => document.getElementById(`${prefix}-option-${index}-${letter}`)?.value.trim() || '')
                .filter(Boolean);
            const correctAnswer = document.getElementById(`${prefix}-correct-${index}`)?.value || '';
            return { questionText, questionType: type, options, correctAnswer };
        });
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
        App.showToast('Koreksi AI tersedia setelah Guru memeriksa dan memberi nilai.', 'info');
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

        questions.forEach(q => {
            const ans = App.state.moduleAnswers[q.id] || { type: 'text', content: 'Jawaban dikirim.' };
            answersList.push({ questionId: q.id, ...ans });

        });

        const overallScore = null;
        const kkm = item.kkm || 75;
        const isBelowKKM = false;

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
            teacherScore: null,
            teacherNotes: ''
        };

        DataStore.saveSubmission(newSub);

        App.showToast('🎉 Lembar kerja berhasil dikumpulkan dan menunggu pemeriksaan Guru.', 'success');

        // Navigate back to student grades / report download screen
        App.state.studentActiveTab = 'grades';
        App.navigateTo('student');
    },

    // 7. Download PDF Report Handler
    downloadPDFReport: (submissionId) => PDFReportModule.download(submissionId),

    openStudentAIReviewModal: (submissionId) => {
        const sub = DataStore.getSubmission(submissionId);
        if (!sub || sub.studentId !== DataStore.getCurrentUser()?.id) return;
        if (sub.status !== 'selesai_diperiksa') {
            App.showToast('Tunggu sampai Guru selesai memeriksa.', 'info');
            return;
        }

        if (!sub.perQuestionReviews || sub.perQuestionReviews.length === 0) {
            const item = sub.moduleType === 'lkpd' ? DataStore.getLKPD(sub.moduleId)
                : sub.moduleType === 'exercise' ? DataStore.getExercise(sub.moduleId)
                : sub.moduleType === 'remedial' ? DataStore.getRemedial(sub.moduleId)
                : DataStore.getEvaluation(sub.moduleId);
            const questions = item?.questions || [];
            sub.perQuestionReviews = (sub.answers || []).map(answer => {
                const question = questions.find(q => q.id === answer.questionId);
                const content = answer.type === 'photo' ? answer.photoUrl : answer.content;
                return { questionId: answer.questionId, ...AIService.correctQuestion(question?.questionText || '', answer.type, content) };
            });
            DataStore.saveSubmission(sub);
        }

        App.openModal(`Koreksi AI - ${sub.studentName}`, Views.studentAIReviewModalContent(sub));
    },

    // 8. Teacher Grade Inspection Modal
    openGradeDetailModal: (submissionId) => {
        const sub = DataStore.getSubmission(submissionId);
        if (!sub) return;
        App.openModal(`Pemeriksaan Lembar Kerja - ${sub.studentName}`, Views.gradeDetailModalContent(sub));
    },

    handleSaveTeacherReview: (event, submissionId) => {
        event.preventDefault();
        const notesInput = document.getElementById('teacher-notes-input');
        const scoreInput = document.getElementById('teacher-score-input');
        const notes = notesInput ? notesInput.value.trim() : '';
        const score = scoreInput ? Number(scoreInput.value) : NaN;

        if (!Number.isInteger(score) || score < 0 || score > 100) {
            App.showToast('Pilih salah satu kategori penilaian Guru.', 'error');
            return;
        }

        const res = DataStore.updateTeacherReview(submissionId, notes, score);
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
