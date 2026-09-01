/**
 * EduSmart Main Application Logic
 * Implements Routing, Authentication, Exam Loops, and the simulated AI Review Engine.
 */

const App = {
    // Current application state
    state: {
        currentPath: 'landing', // landing, login-guru, login-siswa, register, teacher, student
        teacherActiveTab: 'overview', // overview, materials, exercises, quizzes, grades
        studentActiveTab: 'overview', // overview, materials, exercises, quizzes, grades
        
        // Active play mode state (Exercise or Quiz)
        playMode: null, // 'exercise' or 'quiz'
        activePlayId: null,
        activeQuestionIndex: 0,
        playAnswers: {}, // key: question index, value: option index
        playTimeLeft: 0, // in seconds (for timed quizzes)
        playTimerInterval: null,
        playShowFeedback: false, // for exercise mode immediate feedback
        
        // Key handler reference for cleanup
        jumperKeydownHandler: null
    },

    // Jumping Game State
    gameState: {
        canvas: null,
        ctx: null,
        animationFrameId: null,
        isPlaying: false,
        score: 0,
        player: null,
        obstacles: [],
        gameSpeed: 4.5,
        nextObstacleTimer: 0
    },

    // 1. Initialization
    init: () => {
        const user = DataStore.getCurrentUser();
        if (user) {
            if (user.role === 'guru') {
                App.state.currentPath = 'teacher';
            } else {
                App.state.currentPath = 'student';
            }
        } else {
            App.state.currentPath = 'landing';
        }
        
        App.render();
    },

    // 2. Routing & Rendering Core
    render: () => {
        const root = document.getElementById('app');
        if (!root) return;

        // Clear any running quiz timers
        if (App.state.playTimerInterval) {
            clearInterval(App.state.playTimerInterval);
            App.state.playTimerInterval = null;
        }

        // Clean up jumper game loops & key listeners
        App.cleanupJumpingGame();

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
            case 'play-exercise':
                App.renderPlayExercise(root);
                break;
            case 'play-quiz':
                App.renderPlayQuiz(root);
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
    handleLogin: (event, role) => {
        event.preventDefault();
        const userField = document.getElementById('username');
        const passField = document.getElementById('password');
        
        if (!userField || !passField) return;

        const res = DataStore.loginUser(userField.value.trim(), passField.value);
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

    handleRegister: (event) => {
        event.preventDefault();
        const nameField = document.getElementById('reg-name');
        const userField = document.getElementById('reg-username');
        const passField = document.getElementById('reg-password');

        if (!nameField || !userField || !passField) return;

        const name = nameField.value.trim();
        const username = userField.value.trim().toLowerCase();
        const password = passField.value;

        if (password.length < 6) {
            App.showToast('Password minimal 6 karakter!', 'error');
            return;
        }

        const res = DataStore.registerStudent(username, name, password);
        if (res.success) {
            App.showToast('Pendaftaran berhasil! Silakan masuk.', 'success');
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

    // 4. Teacher Dashboard Routing & Rendering
    navigateTeacher: (tab) => {
        App.state.teacherActiveTab = tab;
        App.render();
    },

    renderTeacherDashboard: (root) => {
        let subContent = '';
        switch (App.state.teacherActiveTab) {
            case 'overview':
                subContent = Views.teacherOverview();
                break;
            case 'materials':
                subContent = Views.teacherMaterials();
                break;
            case 'exercises':
                subContent = Views.teacherExercises();
                break;
            case 'quizzes':
                subContent = Views.teacherQuizzes();
                break;
            case 'grades':
                subContent = Views.teacherGrades();
                break;
            default:
                subContent = Views.teacherOverview();
        }

        root.innerHTML = Views.teacherLayout(App.state.teacherActiveTab, subContent);
        
        if (App.state.teacherActiveTab === 'overview') {
            App.initTeacherOverviewChart();
        }
    },

    initTeacherOverviewChart: () => {
        const ctx = document.getElementById('scoresChart');
        if (!ctx) return;
        
        const subs = DataStore.getSubmissions().slice(0, 8);
        if (subs.length === 0) {
            ctx.parentNode.innerHTML = `<div style="text-align:center; padding: 5rem 0; color:var(--text-muted)">Belum ada data nilai kuis untuk digambarkan.</div>`;
            return;
        }

        const labels = subs.map(s => s.studentName).reverse();
        const data = subs.map(s => s.score).reverse();
        const quizzes = subs.map(s => {
            const q = DataStore.getQuiz(s.quizId);
            return q ? q.title : 'Kuis';
        }).reverse();

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nilai Kuis Siswa (%)',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.65)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: '#4f46e5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                return 'Ujian: ' + quizzes[context.dataIndex];
                            }
                        }
                    },
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20 }
                    }
                }
            }
        });
    },

    // Teacher Add Question type toggle
    toggleCreatorMediaField: (select) => {
        const item = select.closest('.question-creator-item');
        const mediaGroup = item.querySelector('.media-field-group');
        if (select.value === 'image' || select.value === 'video') {
            mediaGroup.style.display = 'block';
        } else {
            mediaGroup.style.display = 'none';
        }
    },

    // Teacher CRUD handlers
    deleteMaterial: (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
            DataStore.deleteMaterial(id);
            App.showToast('Materi berhasil dihapus.', 'info');
            App.render();
        }
    },

    handleCreateMaterial: (event) => {
        event.preventDefault();
        const subjectId = document.getElementById('mat-subj').value;
        const title = document.getElementById('mat-title').value.trim();
        const description = document.getElementById('mat-desc').value.trim();
        const content = document.getElementById('mat-content').value.trim();
        const user = DataStore.getCurrentUser();

        DataStore.addMaterial(subjectId, title, description, content, user.name);
        App.closeModal('material-modal');
        App.showToast('Materi pelajaran baru dipublikasikan!', 'success');
        App.render();
    },

    openCreateExerciseModal: () => {
        App.openModal('exercise-modal');
        const container = document.getElementById('ex-questions-list');
        container.innerHTML = '';
        App.addQuestionFieldToCreator('ex-questions-list');
    },

    openCreateQuizModal: () => {
        App.openModal('quiz-modal');
        const container = document.getElementById('qz-questions-list');
        container.innerHTML = '';
        App.addQuestionFieldToCreator('qz-questions-list');
    },

    addQuestionFieldToCreator: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const index = container.querySelectorAll('.question-creator-item').length;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = Views.questionCreatorItemTemplate(index);
        container.appendChild(tempDiv.firstElementChild);
    },

    collectQuestionsFromCreator: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        const questionItems = container.querySelectorAll('.question-creator-item');
        const questions = [];
        
        questionItems.forEach(item => {
            const questionText = item.querySelector('.q-question-text').value.trim();
            const type = item.querySelector('.q-type-select').value;
            const mediaUrl = item.querySelector('.q-media-url').value.trim();
            const option0 = item.querySelector('.q-opt-0').value.trim();
            const option1 = item.querySelector('.q-opt-1').value.trim();
            const option2 = item.querySelector('.q-opt-2').value.trim();
            const option3 = item.querySelector('.q-opt-3').value.trim();
            const correctIndex = parseInt(item.querySelector('.q-correct-idx').value);
            const explanation = item.querySelector('.q-explanation').value.trim();
            
            questions.push({
                question: questionText,
                type: type,
                mediaUrl: mediaUrl,
                options: [option0, option1, option2, option3],
                correctIndex: correctIndex,
                explanation: explanation
            });
        });
        
        return questions;
    },

    handleCreateExercise: (event) => {
        event.preventDefault();
        const subjectId = document.getElementById('ex-subj').value;
        const title = document.getElementById('ex-title').value.trim();
        const description = document.getElementById('ex-desc').value.trim();
        const questions = App.collectQuestionsFromCreator('ex-questions-list');
        
        if (questions.length === 0) {
            App.showToast('Minimal harus ada 1 soal!', 'error');
            return;
        }

        DataStore.addExercise(subjectId, title, description, questions);
        App.closeModal('exercise-modal');
        App.showToast('Paket latihan mandiri baru dibuat!', 'success');
        App.render();
    },

    deleteExercise: (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus paket latihan ini?')) {
            DataStore.deleteExercise(id);
            App.showToast('Paket latihan dihapus.', 'info');
            App.render();
        }
    },

    handleCreateQuiz: (event) => {
        event.preventDefault();
        const subjectId = document.getElementById('qz-subj').value;
        const title = document.getElementById('qz-title').value.trim();
        const duration = document.getElementById('qz-duration').value;
        const description = document.getElementById('qz-desc').value.trim();
        const questions = App.collectQuestionsFromCreator('qz-questions-list');
        
        if (questions.length === 0) {
            App.showToast('Kuis harus memiliki minimal 1 soal!', 'error');
            return;
        }

        DataStore.addQuiz(subjectId, title, description, duration, questions);
        App.closeModal('quiz-modal');
        App.showToast('Kuis ujian resmi dipublikasikan!', 'success');
        App.render();
    },

    deleteQuiz: (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kuis ini?')) {
            DataStore.deleteQuiz(id);
            App.showToast('Kuis ujian dihapus.', 'info');
            App.render();
        }
    },

    openGradeDetailModal: (subId) => {
        const sub = DataStore.getSubmission(subId);
        const quiz = DataStore.getQuiz(sub.quizId);
        const body = document.getElementById('grade-detail-body');
        
        if (!sub || !quiz || !body) return;
        
        body.innerHTML = Views.gradeDetailModalContent(sub, quiz);
        App.openModal('grade-detail-modal');
    },

    // Teacher saves manual notes and releases AI Review
    handleSaveTeacherReview: (event, submissionId) => {
        event.preventDefault();
        const notesInput = document.getElementById('teacher-notes-input');
        if (!notesInput) return;

        const notes = notesInput.value.trim();
        const res = DataStore.updateTeacherReview(submissionId, notes);

        if (res.success) {
            App.showToast('Hasil koreksi disimpan dan Ulasan AI dirilis ke siswa!', 'success');
            App.closeModal('grade-detail-modal');
            App.render();
        } else {
            App.showToast(res.message, 'error');
        }
    },

    // 5. Student Dashboard Routing & Rendering
    navigateStudent: (tab) => {
        App.state.studentActiveTab = tab;
        App.render();
    },

    renderStudentDashboard: (root) => {
        let subContent = '';
        switch (App.state.studentActiveTab) {
            case 'overview':
                subContent = Views.studentOverview();
                break;
            case 'materials':
                subContent = Views.studentMaterials();
                break;
            case 'exercises':
                subContent = Views.studentExercises();
                break;
            case 'quizzes':
                subContent = Views.studentQuizzes();
                break;
            case 'grades':
                subContent = Views.studentGrades();
                break;
            default:
                subContent = Views.studentOverview();
        }

        root.innerHTML = Views.studentLayout(App.state.studentActiveTab, subContent);
    },

    openReadMaterial: (id) => {
        const mat = DataStore.getMaterial(id);
        if (!mat) return;
        
        const user = DataStore.getCurrentUser();
        const subjBadge = document.getElementById('read-subj-badge');
        const title = document.getElementById('read-title');
        const author = document.getElementById('read-author');
        const content = document.getElementById('read-content');
        const btnMarkRead = document.getElementById('btn-mark-read');
        
        subjBadge.textContent = DataStore.getSubjectName(mat.subjectId);
        title.textContent = mat.title;
        author.textContent = `Ditulis oleh: ${mat.author} | Dibuat pada: ${new Date(mat.createdAt).toLocaleDateString('id-ID')}`;
        content.innerHTML = mat.content;
        
        const isAlreadyRead = mat.readBy.includes(user.id);
        if (isAlreadyRead) {
            btnMarkRead.style.display = 'none';
        } else {
            btnMarkRead.style.display = 'inline-flex';
            btnMarkRead.onclick = () => {
                DataStore.markMaterialAsRead(mat.id, user.id);
                App.showToast('Progres materi terekam: Selesai Dibaca!', 'success');
                App.closeModal('read-material-modal');
                App.render();
            };
        }
        
        App.openModal('read-material-modal');
    },

    showStudentSubmissionDetails: (subId) => {
        const sub = DataStore.getSubmission(subId);
        const quiz = DataStore.getQuiz(sub.quizId);
        const panel = document.getElementById('student-ai-review-panel');
        
        if (!sub || !quiz || !panel) return;
        
        panel.innerHTML = Views.studentSubmissionDetail(sub, quiz);

        // Streaming typing effect only if the review is checked/released by the teacher
        if (sub.status === 'selesai_diperiksa') {
            const aiContent = panel.querySelector('.ai-review-content');
            if (aiContent) {
                const text = sub.aiReview;
                App.typeWriteHTML(aiContent, text);
            }
        }
    },

    // 6. Practice Exam (Latihan Soal) Flow
    startExercise: (id) => {
        const ex = DataStore.getExercise(id);
        if (!ex) return;
        
        App.state.playMode = 'exercise';
        App.state.activePlayId = id;
        App.state.activeQuestionIndex = 0;
        App.state.playAnswers = {};
        App.state.playShowFeedback = false;
        
        App.state.currentPath = 'play-exercise';
        App.render();
    },

    renderPlayExercise: (root) => {
        const ex = DataStore.getExercise(App.state.activePlayId);
        if (!ex) return;
        
        root.innerHTML = Views.exercisePlay(
            ex, 
            App.state.activeQuestionIndex, 
            App.state.playAnswers,
            App.state.playShowFeedback
        );
        
        const q = ex.questions[App.state.activeQuestionIndex];
        if (q && q.type === 'game') {
            App.initJumpingGame();
        }
    },

    selectExerciseOption: (optIdx) => {
        if (App.state.playShowFeedback) return;
        
        App.state.playAnswers[App.state.activeQuestionIndex] = optIdx;
        App.render();
    },

    checkExerciseAnswer: () => {
        App.state.playShowFeedback = true;
        App.render();
    },

    prevExerciseQuestion: () => {
        if (App.state.activeQuestionIndex > 0) {
            App.state.activeQuestionIndex--;
            App.state.playShowFeedback = App.state.playAnswers[App.state.activeQuestionIndex] !== undefined;
            App.render();
        }
    },

    nextExerciseQuestion: () => {
        const ex = DataStore.getExercise(App.state.activePlayId);
        if (App.state.activeQuestionIndex + 1 < ex.questions.length) {
            App.state.activeQuestionIndex++;
            App.state.playShowFeedback = App.state.playAnswers[App.state.activeQuestionIndex] !== undefined;
            App.render();
        }
    },

    jumpToExerciseQuestion: (idx) => {
        App.state.activeQuestionIndex = idx;
        App.state.playShowFeedback = App.state.playAnswers[idx] !== undefined;
        App.render();
    },

    finishExercise: () => {
        App.showToast('Latihan selesai! Bagus sekali.', 'success');
        App.state.currentPath = 'student';
        App.state.studentActiveTab = 'exercises';
        App.render();
    },

    // 7. Quiz Exam (Ujian Resmi) Flow
    startQuiz: (id) => {
        const quiz = DataStore.getQuiz(id);
        if (!quiz) return;
        
        if (!confirm('Apakah Anda siap memulai kuis ini? Batas waktu akan segera berjalan.')) return;
        
        App.state.playMode = 'quiz';
        App.state.activePlayId = id;
        App.state.activeQuestionIndex = 0;
        App.state.playAnswers = {};
        
        App.state.playTimeLeft = quiz.duration * 60;
        
        App.state.currentPath = 'play-quiz';
        App.render();
        
        App.state.playTimerInterval = setInterval(() => {
            App.state.playTimeLeft--;
            if (App.state.playTimeLeft <= 0) {
                clearInterval(App.state.playTimerInterval);
                App.showToast('Waktu pengerjaan habis! Jawaban Anda dikirimkan otomatis.', 'warning');
                App.submitQuizAnswers(true);
            } else {
                App.updateQuizTimerDisplay();
            }
        }, 1000);
    },

    updateQuizTimerDisplay: () => {
        const timerContainer = document.getElementById('quiz-countdown');
        if (!timerContainer) return;
        
        const minutes = Math.floor(App.state.playTimeLeft / 60);
        const seconds = App.state.playTimeLeft % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timerContainer.innerHTML = `<i class="fa-regular fa-clock animate-float"></i> ${timeStr}`;
    },

    renderPlayQuiz: (root) => {
        const quiz = DataStore.getQuiz(App.state.activePlayId);
        if (!quiz) return;
        
        const minutes = Math.floor(App.state.playTimeLeft / 60);
        const seconds = App.state.playTimeLeft % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        root.innerHTML = Views.quizPlay(
            quiz, 
            App.state.activeQuestionIndex, 
            App.state.playAnswers,
            timeStr
        );

        const q = quiz.questions[App.state.activeQuestionIndex];
        if (q && q.type === 'game') {
            App.initJumpingGame();
        }
    },

    selectQuizOption: (optIdx) => {
        App.state.playAnswers[App.state.activeQuestionIndex] = optIdx;
        App.render();
    },

    prevQuizQuestion: () => {
        if (App.state.activeQuestionIndex > 0) {
            App.state.activeQuestionIndex--;
            App.render();
        }
    },

    nextQuizQuestion: () => {
        const quiz = DataStore.getQuiz(App.state.activePlayId);
        if (App.state.activeQuestionIndex + 1 < quiz.questions.length) {
            App.state.activeQuestionIndex++;
            App.render();
        }
    },

    jumpToQuizQuestion: (idx) => {
        App.state.activeQuestionIndex = idx;
        App.render();
    },

    confirmSubmitQuiz: () => {
        const quiz = DataStore.getQuiz(App.state.activePlayId);
        const answeredCount = Object.keys(App.state.playAnswers).length;
        const total = quiz.questions.length;
        
        let confirmMsg = 'Apakah Anda yakin ingin mengumpulkan jawaban kuis ini?';
        if (answeredCount < total) {
            confirmMsg = `⚠️ Perhatian! Anda baru menjawab ${answeredCount} dari ${total} soal. Yakin ingin mengumpulkan?`;
        }
        
        if (confirm(confirmMsg)) {
            App.submitQuizAnswers();
        }
    },

    submitQuizAnswers: (forced = false) => {
        if (App.state.playTimerInterval) {
            clearInterval(App.state.playTimerInterval);
            App.state.playTimerInterval = null;
        }

        const quiz = DataStore.getQuiz(App.state.activePlayId);
        const user = DataStore.getCurrentUser();
        const total = quiz.questions.length;
        
        let correctCount = 0;
        const answersArray = [];
        
        for (let i = 0; i < total; i++) {
            const ans = App.state.playAnswers[i];
            answersArray.push(ans === undefined ? -1 : ans);
            if (ans !== undefined && ans === quiz.questions[i].correctIndex) {
                correctCount++;
            }
        }
        
        const score = Math.round((correctCount / total) * 100);
        
        const aiReviewText = AIReviewEngine.generateReview(quiz, answersArray, score, user.name);

        const sub = DataStore.addSubmission(
            quiz.id,
            user.id,
            user.name,
            score,
            answersArray,
            aiReviewText
        );
        
        const root = document.getElementById('app');
        root.innerHTML = Views.quizResult(quiz, score, correctCount, total, sub.id);
    },

    typeWriteHTML: (element, htmlContent) => {
        element.innerHTML = '';
        
        const tokens = htmlContent.match(/<[^>]+>|[^<>\s]+|\s+/g) || [];
        let i = 0;
        
        const interval = setInterval(() => {
            if (i < tokens.length) {
                element.innerHTML += tokens[i];
                i++;
                const card = element.closest('.ai-review-card');
                if (card) card.scrollTop = card.scrollHeight;
            } else {
                clearInterval(interval);
            }
        }, 30);
    },

    confirmExitPlayMode: () => {
        if (confirm('Apakah Anda yakin ingin keluar? Progres pengerjaan saat ini tidak akan disimpan.')) {
            App.state.currentPath = 'student';
            App.render();
        }
    },

    // 8. Interactive HTML5 Canvas Jumping Game (EduJumper) Engine
    initJumpingGame: () => {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        App.gameState.canvas = canvas;
        App.gameState.ctx = ctx;
        App.gameState.isPlaying = false;
        App.gameState.score = 0;
        App.gameState.gameSpeed = 4.5;
        App.gameState.obstacles = [];
        App.gameState.nextObstacleTimer = 0;
        
        App.gameState.player = {
            x: 60,
            y: 106,
            width: 24,
            height: 24,
            vy: 0,
            gravity: 0.52,
            jumpForce: -9.8,
            isGrounded: true,
            jump: function() {
                if (this.isGrounded) {
                    this.vy = this.jumpForce;
                    this.isGrounded = false;
                }
            }
        };

        App.drawJumpingGameStatic();
        
        if (App.state.jumperKeydownHandler) {
            window.removeEventListener('keydown', App.state.jumperKeydownHandler);
        }
        
        App.state.jumperKeydownHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (App.gameState.isPlaying) {
                    App.gameState.player.jump();
                } else {
                    const overlay = document.getElementById('game-overlay');
                    if (overlay && overlay.style.display !== 'none') {
                        App.startInteractiveGame();
                    }
                }
            }
        };
        window.addEventListener('keydown', App.state.jumperKeydownHandler);
        
        canvas.onclick = (e) => {
            e.preventDefault();
            if (App.gameState.isPlaying) {
                App.gameState.player.jump();
            }
        };
    },

    cleanupJumpingGame: () => {
        App.gameState.isPlaying = false;
        if (App.gameState.animationFrameId) {
            cancelAnimationFrame(App.gameState.animationFrameId);
            App.gameState.animationFrameId = null;
        }
        if (App.state.jumperKeydownHandler) {
            window.removeEventListener('keydown', App.state.jumperKeydownHandler);
            App.state.jumperKeydownHandler = null;
        }
    },

    drawJumpingGameStatic: () => {
        const { canvas, ctx, player } = App.gameState;
        if (!canvas || !ctx) return;
        
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#059669';
        ctx.fillRect(0, 130, canvas.width, 30);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 133, canvas.width, 27);
        
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x + 14, player.y + 4, 6, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(player.x + 17, player.y + 6, 3, 3);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(100, 40, 15, 0, Math.PI * 2);
        ctx.arc(120, 35, 20, 0, Math.PI * 2);
        ctx.arc(140, 40, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(420, 50, 12, 0, Math.PI * 2);
        ctx.arc(435, 45, 16, 0, Math.PI * 2);
        ctx.arc(450, 50, 12, 0, Math.PI * 2);
        ctx.fill();
    },

    startInteractiveGame: () => {
        const overlay = document.getElementById('game-overlay');
        if (overlay) overlay.style.display = 'none';
        
        const statusLabel = document.getElementById('game-status-label');
        if (statusLabel) {
            statusLabel.textContent = 'Sedang Bermain';
            statusLabel.className = 'badge badge-primary';
        }
        
        const btnRestart = document.getElementById('btn-restart-game');
        if (btnRestart) btnRestart.style.display = 'none';

        App.gameState.isPlaying = true;
        App.gameState.score = 0;
        App.gameState.obstacles = [];
        App.gameState.nextObstacleTimer = 35;
        
        if (App.gameState.animationFrameId) {
            cancelAnimationFrame(App.gameState.animationFrameId);
        }
        
        App.runJumpingGameLoop();
    },

    restartInteractiveGame: () => {
        App.startInteractiveGame();
    },

    runJumpingGameLoop: () => {
        const { canvas, ctx, player, obstacles } = App.gameState;
        if (!canvas || !ctx || !App.gameState.isPlaying) return;
        
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(100, 40, 15, 0, Math.PI * 2);
        ctx.arc(120, 35, 20, 0, Math.PI * 2);
        ctx.arc(140, 40, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(420, 50, 12, 0, Math.PI * 2);
        ctx.arc(435, 45, 16, 0, Math.PI * 2);
        ctx.arc(450, 50, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#059669';
        ctx.fillRect(0, 130, canvas.width, 30);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 133, canvas.width, 27);
        
        player.vy += player.gravity;
        player.y += player.vy;
        
        const groundY = 130;
        if (player.y >= groundY - player.height) {
            player.y = groundY - player.height;
            player.vy = 0;
            player.isGrounded = true;
        }
        
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x + 14, player.y + 4, 6, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(player.x + 17, player.y + 6, 3, 3);
        
        App.gameState.nextObstacleTimer--;
        if (App.gameState.nextObstacleTimer <= 0) {
            obstacles.push({
                x: 610,
                y: groundY - 24,
                width: 16,
                height: 24,
                passed: false
            });
            App.gameState.nextObstacleTimer = 90 + Math.floor(Math.random() * 50);
        }
        
        let crash = false;
        
        for (let i = 0; i < obstacles.length; i++) {
            const obs = obstacles[i];
            obs.x -= App.gameState.gameSpeed;
            
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(obs.x + 4, obs.y, 3, obs.height);
            ctx.fillRect(obs.x + 10, obs.y, 3, obs.height);
            
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                crash = true;
            }
            
            if (!obs.passed && obs.x + obs.width < player.x) {
                obs.passed = true;
                App.gameState.score++;
                
                const scoreSpan = document.getElementById('game-score');
                if (scoreSpan) {
                    scoreSpan.textContent = App.gameState.score;
                }
            }
        }
        
        App.gameState.obstacles = obstacles.filter(o => o.x > -20);
        
        if (crash) {
            App.gameState.isPlaying = false;
            App.handleJumpingGameOver();
            return;
        }
        
        if (App.gameState.score >= 3) {
            const statusLabel = document.getElementById('game-status-label');
            if (statusLabel && statusLabel.textContent !== 'Target Tercapai') {
                statusLabel.textContent = 'Target Tercapai';
                statusLabel.className = 'badge badge-success';
                App.autoSelectGameAnswer(true);
            }
        }

        App.gameState.animationFrameId = requestAnimationFrame(App.runJumpingGameLoop);
    },
    
    autoSelectGameAnswer: (isSuccess) => {
        const answerIdx = isSuccess ? 1 : 0;
        App.state.playAnswers[App.state.activeQuestionIndex] = answerIdx;
        
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach((item, idx) => {
            if (idx === answerIdx) {
                item.classList.add('selected');
                item.style.borderWidth = '2px';
            } else {
                item.classList.remove('selected');
                item.style.borderWidth = '1.5px';
            }
        });
    },

    handleJumpingGameOver: () => {
        const score = App.gameState.score;
        const targetMet = score >= 3;
        
        App.autoSelectGameAnswer(targetMet);
        
        const btnRestart = document.getElementById('btn-restart-game');
        if (btnRestart) btnRestart.style.display = 'inline-flex';
        
        const statusLabel = document.getElementById('game-status-label');
        if (statusLabel) {
            if (targetMet) {
                statusLabel.textContent = 'Berhasil';
                statusLabel.className = 'badge badge-success';
                App.showToast(`Lolos! Skor Anda ${score} (Target tercapai). Jawaban otomatis terisi 'Berhasil'.`, 'success');
            } else {
                statusLabel.textContent = 'Gagal';
                statusLabel.className = 'badge badge-danger';
                App.showToast(`Game Over! Skor Anda ${score}. Target minimal 3. Jawaban otomatis terisi 'Gagal'.`, 'warning');
            }
        }
        
        const { canvas, ctx } = App.gameState;
        if (canvas && ctx) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px ' + getComputedStyle(document.body).fontFamily;
            ctx.textAlign = 'center';
            ctx.fillText('PERMAINAN BERAKHIR', canvas.width/2, 60);
            
            ctx.fillStyle = targetMet ? '#10b981' : '#f87171';
            ctx.font = 'bold 14px ' + getComputedStyle(document.body).fontFamily;
            ctx.fillText(targetMet ? `Lolos! Berhasil melewati ${score} rintangan` : `Gagal! Hanya melewati ${score} rintangan (target 3)`, canvas.width/2, 90);
            
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px ' + getComputedStyle(document.body).fontFamily;
            ctx.fillText('Tekan Space atau klik Main Ulang Game untuk mencoba lagi', canvas.width/2, 120);
        }
    },

    // 9. Modal Window Handlers
    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('open');
    },

    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('open');
    },

    // 10. Toast Notification System
    showToast: (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '<i class="fa-solid fa-circle-info"></i>';
        if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
        if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
};

/**
 * ==========================================================================
 * AI Review Logic Simulator (Asisten AI)
 * ==========================================================================
 */
const AIReviewEngine = {
    generateReview: (quiz, studentAnswers, score, name) => {
        const total = quiz.questions.length;
        let incorrectCount = 0;
        const incorrectList = [];
        
        quiz.questions.forEach((q, idx) => {
            const ans = studentAnswers[idx];
            if (ans === -1 || ans !== q.correctIndex) {
                incorrectCount++;
                incorrectList.push({
                    number: idx + 1,
                    question: q.question,
                    studentAns: ans === -1 ? 'Dilewati' : q.options[ans],
                    correctAns: q.options[q.correctIndex],
                    explanation: q.explanation || 'Konsep terkait tidak teridentifikasi detail.'
                });
            }
        });

        let introText = '';
        let strengthText = '';
        let weaknessText = '';
        let recommendationText = '';

        if (score === 100) {
            introText = `Halo <strong>${name}</strong>! Fantastis! Anda memperoleh nilai sempurna <strong>100/100</strong>. Anda benar-benar menguasai seluruh konsep dari kuis "${quiz.title}" ini.`;
            strengthText = `<h4><i class="fa-solid fa-award"></i> Analisis Kekuatan Anda</h4>
            <p>Anda menunjukkan tingkat pemahaman <strong>sangat tinggi</strong>. Seluruh soal dikerjakan dengan logika analitis yang sangat presisi tanpa ada kekeliruan perhitungan.</p>`;
            weaknessText = `<h4><i class="fa-solid fa-circle-info"></i> Bagian yang Perlu Ditingkatkan</h4>
            <p>Tidak ada kelemahan yang terdeteksi! Semua indikator materi telah terserap sempurna oleh memori jangka panjang Anda.</p>`;
            recommendationText = `<h4><i class="fa-solid fa-graduation-cap"></i> Rekomendasi Belajar AI</h4>
            <p>Lanjutkan ke tingkat materi berikutnya yang lebih menantang. Anda juga bisa mencoba membantu teman kelas yang sedang kesulitan sebagai bentuk penguatan konsep!</p>`;
        } else if (score >= 75) {
            introText = `Halo <strong>${name}</strong>. Kerja yang bagus! Anda lulus kuis "${quiz.title}" dengan nilai <strong>${score}/100</strong>. Sebagian besar materi sudah Anda pahami dengan baik.`;
            strengthText = `<h4><i class="fa-solid fa-award"></i> Analisis Kekuatan Anda</h4>
            <p>Pemahaman dasar Anda berada di atas rata-rata kelas. Anda mampu menjawab soal dengan tepat pada sebagian besar pertanyaan.</p>`;
            
            let items = incorrectList.map(item => `<li><strong>Soal #${item.number}:</strong> Salah menjawab pilihan. Konsep yang tepat: <em>${item.explanation}</em>.</li>`).join('');
            weaknessText = `<h4><i class="fa-solid fa-triangle-exclamation"></i> Diagnosis Kesalahan</h4>
            <p>Terjadi ${incorrectCount} kesalahan kecil pada:</p>
            <ul>${items}</ul>`;
            
            recommendationText = `<h4><i class="fa-solid fa-graduation-cap"></i> Rekomendasi Belajar AI</h4>
            <p>1. Tinjau kembali pembahasan soal di atas.</p>
            <p>2. Lakukan latihan mandiri satu kali lagi untuk menyempurnakan skor Anda menjadi 100%.</p>`;
        } else {
            introText = `Halo <strong>${name}</strong>. Jangan berkecil hati! Anda mendapatkan skor <strong>${score}/100</strong> pada kuis "${quiz.title}". Kuis ini mendeteksi beberapa topik penting yang perlu Anda ulas kembali.`;
            strengthText = `<h4><i class="fa-solid fa-award"></i> Analisis Kekuatan Anda</h4>
            <p>Anda berhasil menjawab dengan benar sebanyak ${total - incorrectCount} soal. Ini membuktikan Anda tetap memiliki dasar pemahaman yang bisa dikembangkan lebih jauh.</p>`;
            
            let items = incorrectList.map(item => `
                <li>
                    <strong>Soal #${item.number}:</strong> "${item.question.substring(0, 45)}..."<br>
                    ❌ Jawaban Anda: <em>${item.studentAns}</em><br>
                    ✅ Pembahasan: <span style="color:#059669">${item.explanation}</span>
                </li>
            `).join('');
            
            weaknessText = `<h4><i class="fa-solid fa-triangle-exclamation"></i> Diagnosis Kelemahan</h4>
            <p>Berikut adalah rincian konsep yang salah dan penjelasannya:</p>
            <ul style="display:flex; flex-direction:column; gap:0.5rem">${items}</ul>`;
            
            recommendationText = `<h4><i class="fa-solid fa-lightbulb"></i> Tips Belajar dari AI</h4>
            <p>1. Baca ulang LKPD/Materi pembelajaran terkait yang sudah diunggah oleh guru Anda di menu materi.</p>
            <p>2. Gunakan menu <strong>"Latihan Soal Mandiri"</strong> untuk membiasakan diri menjawab soal sejenis sebelum menempuh kuis ujian resmi berikutnya.</p>
            <p>3. Tuliskan rumus/langkah penyelesaian di kertas coretan untuk menghindari kesalahan ketelitian.</p>`;
        }

        return `
            ${introText}
            ${strengthText}
            ${weaknessText}
            ${recommendationText}
        `;
    }
};

// Start the app when content is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
