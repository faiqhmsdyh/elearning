/**
 * EduSmart HTML View Templates Generator
 * Produces semantic, fully-structured HTML string templates for all screens.
 * Supports LKPD, Latihan Soal (KKM), Remedial, Evaluasi, Per-Soal AI Correction, and Printable PDF Reports.
 */

const Views = {
    // 1. Landing Page
    landing: () => {
        return `
        <div class="landing-container animate-fade-in">
            <div class="landing-header">
                <div class="logo-brand"><i class="fa-solid fa-graduation-cap"></i> EduSmart</div>
                <p>Platform E-Learning Interaktif: LKPD, Latihan Soal, Remedial KKM, & Evaluasi Berbasis Koreksi AI Per-Soal</p>
            </div>
            <div class="role-cards">
                <!-- Siswa Card -->
                <div class="role-card student-role" onclick="App.navigateTo('login-siswa')">
                    <div class="role-icon">
                        <i class="fa-solid fa-user-graduate animate-float"></i>
                    </div>
                    <h3>Portal Siswa</h3>
                    <p>Kerjakan LKPD, Latihan Soal, Remedial, dan Evaluasi dengan pengiriman Teks/Foto & Koreksi AI Per-Soal yang bisa di-download.</p>
                </div>
                
                <!-- Guru Card -->
                <div class="role-card admin-role" onclick="App.navigateTo('login-guru')">
                    <div class="role-icon">
                        <i class="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <h3>Portal Guru / Admin</h3>
                    <p>Kelola LKPD, atur KKM Latihan Soal, siapkan program Remedial, buat Evaluasi, dan periksa lembar kerja siswa.</p>
                </div>
            </div>
            <div style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500;">
                EduSmart E-Learning &copy; 2026. All rights reserved.
            </div>
        </div>
        `;
    },

    // 2. Login Page
    login: (role) => {
        const isGuru = role === 'guru';
        const title = isGuru ? 'Login Guru / Admin' : 'Login Portal Siswa';
        const desc = isGuru 
            ? 'Masuk untuk mengelola LKPD, Latihan, Remedial & Evaluasi.' 
            : 'Masuk untuk mengumpulkan lembar kerja dan periksa koreksi AI.';
        
        return `
        <div class="auth-container">
            <div class="auth-card animate-fade-in">
                <div class="back-to-home" onclick="App.navigateTo('landing')">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
                </div>
                
                <div class="auth-header">
                    <div class="auth-icon ${isGuru ? 'guru' : 'siswa'}">
                        <i class="fa-solid ${isGuru ? 'fa-chalkboard-user' : 'fa-user-graduate'}"></i>
                    </div>
                    <h2>${title}</h2>
                    <p>${desc}</p>
                </div>
                
                <form onsubmit="App.handleLogin(event, '${role}')" class="auth-form">
                    <div class="form-group">
                        <label for="username"><i class="fa-solid fa-user"></i> Username</label>
                        <input type="text" id="username" class="form-control" placeholder="Contoh: ${isGuru ? 'guru' : 'siswa'}" required autocomplete="username">
                    </div>
                    
                    <div class="form-group">
                        <label for="password"><i class="fa-solid fa-lock"></i> Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Masukkan password Anda" required autocomplete="current-password">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        Masuk ke Portal <i class="fa-solid fa-right-to-bracket"></i>
                    </button>
                </form>
                
                ${!isGuru ? `
                <div class="auth-footer">
                    Belum punya akun? <a onclick="App.navigateTo('register')" class="auth-link">Daftar Akun Siswa Baru</a>
                </div>
                ` : ''}
            </div>
        </div>
        `;
    },

    // 3. Register Page
    register: () => {
        return `
        <div class="auth-container">
            <div class="auth-card animate-fade-in">
                <div class="back-to-home" onclick="App.navigateTo('login-siswa')">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Login
                </div>
                
                <div class="auth-header">
                    <div class="auth-icon siswa">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <h2>Pendaftaran Siswa Baru</h2>
                    <p>Buat akun siswa untuk mengakses LKPD & Latihan Soal.</p>
                </div>
                
                <form onsubmit="App.handleRegister(event)" class="auth-form">
                    <div class="form-group">
                        <label for="reg-name"><i class="fa-solid fa-address-card"></i> Nama Lengkap</label>
                        <input type="text" id="reg-name" class="form-control" placeholder="Contoh: Ahmad Rizky" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-username"><i class="fa-solid fa-user"></i> Username</label>
                        <input type="text" id="reg-username" class="form-control" placeholder="Pilih username unik" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-password"><i class="fa-solid fa-lock"></i> Password</label>
                        <input type="password" id="reg-password" class="form-control" placeholder="Minimal 6 karakter" required minlength="6">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        Daftar Sekarang <i class="fa-solid fa-user-check"></i>
                    </button>
                </form>
            </div>
        </div>
        `;
    },

    // 4. Guru Dashboard Layout Wrapper
    teacherLayout: (activeTab, subContent) => {
        const user = DataStore.getCurrentUser() || {};
        return `
        <div class="dashboard-container">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-brand">
                        <i class="fa-solid fa-graduation-cap"></i> EduSmart <span style="font-size:0.7rem; background:rgba(255,255,255,0.2); padding:2px 6px; border-radius:4px;">GURU</span>
                    </div>
                </div>
                
                <div class="sidebar-user">
                    <div class="user-avatar" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
                        ${user.name ? user.name[0] : 'G'}
                    </div>
                    <div class="user-info">
                        <span class="user-name">${user.name || 'Guru'}</span>
                        <span class="user-role">Guru / Pengajar</span>
                    </div>
                </div>
                
                <ul class="sidebar-menu">
                    <li class="menu-item ${activeTab === 'overview' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('overview')">
                            <i class="fa-solid fa-chart-pie"></i> Overview Performa
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'lkpd' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('lkpd')">
                            <i class="fa-solid fa-file-signature"></i> Kelola LKPD
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'exercises' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('exercises')">
                            <i class="fa-solid fa-list-check"></i> Latihan Soal & KKM
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'remedial' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('remedial')">
                            <i class="fa-solid fa-wrench"></i> Program Remedial
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'evaluation' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('evaluation')">
                            <i class="fa-solid fa-award"></i> Evaluasi Ujian
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'grades' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('grades')">
                            <i class="fa-solid fa-square-poll-vertical"></i> Periksa & Catatan
                        </a>
                    </li>
                </ul>
                
                <div class="sidebar-footer">
                    <button class="logout-btn" onclick="App.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Keluar
                    </button>
                </div>
            </aside>
            
            <!-- Main Content Area -->
            <main class="main-content">
                <header class="top-navbar">
                    <div class="navbar-title">
                        <h1>Panel Manajemen Pembelajaran Guru</h1>
                    </div>
                    <div class="navbar-actions" style="display:flex; align-items:center; gap:0.75rem;">
                        <button class="btn btn-outline btn-sm" onclick="App.openSupabaseKeyModal()" style="font-size:0.8rem;">
                            <i class="fa-solid fa-key"></i> Key Supabase
                        </button>
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted)">
                            <i class="fa-solid fa-database"></i> Supabase: Connected
                        </div>
                    </div>
                </header>
                
                <div class="content-body animate-fade-in">
                    ${subContent}
                </div>
            </main>
        </div>
        `;
    },

    // 5. Guru Subview: Overview
    teacherOverview: () => {
        const lkpds = DataStore.getLKPDs();
        const exercises = DataStore.getExercises();
        const remedials = DataStore.getRemedials();
        const evaluations = DataStore.getEvaluations();
        const subs = DataStore.getSubmissions();
        const students = DataStore.getStudents();

        return `
        <div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Total Siswa Terdaftar</h4>
                        <p>${students.length} Siswa</p>
                    </div>
                    <div class="stat-icon primary"><i class="fa-solid fa-users"></i></div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Total LKPD & Latihan</h4>
                        <p>${lkpds.length + exercises.length} Paket</p>
                    </div>
                    <div class="stat-icon secondary"><i class="fa-solid fa-book"></i></div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Remedial Terdaftar</h4>
                        <p>${remedials.length} Modul</p>
                    </div>
                    <div class="stat-icon warning"><i class="fa-solid fa-wrench"></i></div>
                </div>

                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Lembar Kerja Dikumpulkan</h4>
                        <p>${subs.length} Lembar</p>
                    </div>
                    <div class="stat-icon success"><i class="fa-solid fa-paper-plane"></i></div>
                </div>
            </div>

            <div class="content-card" style="margin-top: 1.5rem;">
                <h3><i class="fa-solid fa-chart-bar"></i> Performa Nilai Rata-rata Modul Siswa</h3>
                <div style="height: 260px; margin-top: 1rem;">
                    <canvas id="scoresChart"></canvas>
                </div>
            </div>
        </div>
        `;
    },

    // 6. Guru Subview: LKPD Management
    teacherLKPD: () => LKPDModule.renderTeacherView(),

    // 7. Guru Subview: Exercises & KKM Management
    teacherExercises: () => ExerciseModule.renderTeacherView(),

    // 8. Guru Subview: Remedial Management
    teacherRemedial: () => RemedialModule.renderTeacherView(),

    // 9. Guru Subview: Evaluation Management
    teacherEvaluation: () => EvaluationModule.renderTeacherView(),

    // 10. Guru Subview: Grades & Teacher Notes
    teacherGrades: () => {
        const subs = DataStore.getSubmissions();
        return `
        <div>
            <h2><i class="fa-solid fa-square-poll-vertical"></i> Periksa Hasil & Catatan Guru</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Periksa jawaban siswa (Teks/Foto), baca hasil Koreksi AI Per-Soal, dan berikan catatan umpan balik.</p>

            <div class="content-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            <th>Siswa</th>
                            <th>Modul</th>
                            <th>Skor AI</th>
                            <th>Status Koreksi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subs.map(s => `
                        <tr>
                            <td>${new Date(s.completedAt).toLocaleDateString('id-ID')}</td>
                            <td><strong>${s.studentName}</strong></td>
                            <td><span class="badge badge-info">${s.moduleType.toUpperCase()}</span></td>
                            <td><strong style="color:var(--primary-color); font-size:1.1rem">${s.overallScore}</strong> / 100</td>
                            <td>
                                ${s.status === 'selesai_diperiksa' 
                                    ? '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Selesai Diperiksa</span>' 
                                    : '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Belum Diperiksa</span>'}
                            </td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="App.openGradeDetailModal('${s.id}')">
                                    <i class="fa-solid fa-pen-to-square"></i> Periksa & Catat
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="App.downloadPDFReport('${s.id}')">
                                    <i class="fa-solid fa-download"></i> PDF
                                </button>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    },

    // 11. Siswa Dashboard Layout Wrapper
    studentLayout: (activeTab, subContent) => {
        const user = DataStore.getCurrentUser() || {};
        return `
        <div class="dashboard-container">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-brand">
                        <i class="fa-solid fa-graduation-cap"></i> EduSmart
                    </div>
                </div>
                
                <div class="sidebar-user">
                    <div class="user-avatar" style="background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);">
                        ${user.name ? user.name[0] : 'S'}
                    </div>
                    <div class="user-info">
                        <span class="user-name">${user.name || 'Siswa'}</span>
                        <span class="user-role">Siswa Portal</span>
                    </div>
                </div>
                
                <ul class="sidebar-menu">
                    <li class="menu-item ${activeTab === 'overview' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('overview')">
                            <i class="fa-solid fa-house"></i> Dashboard
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'lkpd' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('lkpd')">
                            <i class="fa-solid fa-file-signature"></i> 1. LKPD
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'exercises' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('exercises')">
                            <i class="fa-solid fa-list-check"></i> 2. Latihan Soal
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'remedial' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('remedial')">
                            <i class="fa-solid fa-wrench"></i> 3. Remedial (KKM)
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'evaluation' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('evaluation')">
                            <i class="fa-solid fa-award"></i> 4. Evaluasi Ujian
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'grades' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('grades')">
                            <i class="fa-solid fa-square-poll-vertical"></i> Hasil & Download PDF
                        </a>
                    </li>
                </ul>
                
                <div class="sidebar-footer">
                    <button class="logout-btn" onclick="App.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Keluar
                    </button>
                </div>
            </aside>
            
            <!-- Main Content Area -->
            <main class="main-content">
                <header class="top-navbar">
                    <div class="navbar-title">
                        <h1>EduSmart Student Room</h1>
                    </div>
                    <div class="navbar-actions" style="display:flex; align-items:center; gap:0.75rem;">
                        <button class="btn btn-outline btn-sm" onclick="App.openSupabaseKeyModal()" style="font-size:0.8rem;">
                            <i class="fa-solid fa-key"></i> Key Supabase
                        </button>
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted)">
                            <i class="fa-solid fa-calendar-days"></i> ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>
                
                <div class="content-body animate-fade-in">
                    ${subContent}
                </div>
            </main>
        </div>
        `;
    },

    // 12. Siswa Subview: Overview
    studentOverview: () => {
        const user = DataStore.getCurrentUser();
        const lkpds = DataStore.getLKPDs();
        const exercises = DataStore.getExercises();
        const subs = DataStore.getStudentSubmissions(user.id);
        
        return `
        <div>
            <div style="background-color: var(--primary-color); color: var(--text-white); padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; overflow: hidden; position: relative;">
                <div style="z-index: 10; max-width: 65%">
                    <h2 style="font-size:1.8rem; font-weight:800; margin-bottom:0.5rem">Selamat Datang, ${user.name}! 🚀</h2>
                    <p style="font-size:0.95rem; opacity: 0.9;">Kerjakan LKPD, Latihan Soal, Remedial jika di bawah KKM, dan Evaluasi. Dapatkan Koreksi AI tiap soal dan unduh hasilnya dalam format PDF!</p>
                </div>
                <div class="animate-float" style="font-size: 5.5rem; opacity: 0.15; position: absolute; right: 2rem; top: 1rem; pointer-events: none;">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card" onclick="App.navigateStudent('lkpd')" style="cursor:pointer">
                    <div class="stat-details">
                        <h4>1. LKPD Mandiri</h4>
                        <p>${lkpds.length} Paket Available</p>
                    </div>
                    <div class="stat-icon primary"><i class="fa-solid fa-file-signature"></i></div>
                </div>
                
                <div class="stat-card" onclick="App.navigateStudent('exercises')" style="cursor:pointer">
                    <div class="stat-details">
                        <h4>2. Latihan Soal (KKM)</h4>
                        <p>${exercises.length} Paket Available</p>
                    </div>
                    <div class="stat-icon secondary"><i class="fa-solid fa-list-check"></i></div>
                </div>
                
                <div class="stat-card" onclick="App.navigateStudent('remedial')" style="cursor:pointer">
                    <div class="stat-details">
                        <h4>3. Program Remedial</h4>
                        <p>Akses Otomatis saat &lt; KKM</p>
                    </div>
                    <div class="stat-icon warning"><i class="fa-solid fa-wrench"></i></div>
                </div>

                <div class="stat-card" onclick="App.navigateStudent('grades')" style="cursor:pointer">
                    <div class="stat-details">
                        <h4>Lembar Diselesaikan</h4>
                        <p>${subs.length} Disimpan & PDF</p>
                    </div>
                    <div class="stat-icon success"><i class="fa-solid fa-download"></i></div>
                </div>
            </div>
        </div>
        `;
    },

    // 13. Siswa Subview: LKPD List
    studentLKPD: () => LKPDModule.renderStudentView(),

    // 14. Siswa Subview: Latihan Soal List (with KKM)
    studentExercises: () => ExerciseModule.renderStudentView(),

    // 15. Siswa Subview: Remedial
    studentRemedial: () => RemedialModule.renderStudentView(),

    // 16. Siswa Subview: Evaluation
    studentEvaluation: () => EvaluationModule.renderStudentView(),

    // 17. Siswa Subview: Grades & PDF Downloads List
    studentGrades: () => {
        const user = DataStore.getCurrentUser();
        const subs = DataStore.getStudentSubmissions(user.id);

        return `
        <div>
            <h2><i class="fa-solid fa-square-poll-vertical"></i> Riwayat Nilai & Download PDF</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Daftar seluruh lembar kerja LKPD, Latihan Soal, Remedial, dan Evaluasi yang telah diselesaikan.</p>

            <div class="content-card">
                ${subs.length === 0 ? `
                <div style="text-align:center; padding:3rem; color:var(--text-muted)">
                    Belum ada lembar kerja yang dikumpulkan. Silakan kerjakan LKPD atau Latihan Soal terlebih dahulu.
                </div>
                ` : `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Tgl Selesai</th>
                            <th>Modul</th>
                            <th>Skor AI Per-Soal</th>
                            <th>Status Koreksi Guru</th>
                            <th>Download PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subs.map(s => `
                        <tr>
                            <td>${new Date(s.completedAt).toLocaleDateString('id-ID')}</td>
                            <td><span class="badge badge-info">${s.moduleType.toUpperCase()}</span></td>
                            <td><strong style="color:var(--primary-color); font-size:1.1rem">${s.overallScore}</strong> / 100</td>
                            <td>
                                ${s.status === 'selesai_diperiksa' 
                                    ? '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Selesai Diperiksa</span>' 
                                    : '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Belum Diperiksa</span>'}
                            </td>
                            <td>
                                <button class="btn btn-outline btn-sm" onclick="App.downloadPDFReport('${s.id}')">
                                    <i class="fa-solid fa-file-pdf"></i> Download PDF
                                </button>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                `}
            </div>
        </div>
        `;
    },

    // 18. Interactive Worksheet Play Screen (LKPD / Latihan / Remedial / Evaluasi)
    playWorksheet: (moduleType, item, answersState = {}, aiReviewsState = {}) => {
        const questions = item.questions || [];
        const isExercise = moduleType === 'exercise';
        const kkm = item.kkm || 75;

        return `
        <div class="play-container animate-fade-in" style="max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem;">
            <!-- Header Nav -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; background:var(--bg-card); padding:1rem 1.5rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
                <div>
                    <span class="badge badge-primary">${moduleType.toUpperCase()}</span>
                    ${isExercise ? `<span class="badge badge-warning">KKM: ${kkm}</span>` : ''}
                    <h2 style="font-size:1.4rem; font-weight:800; margin-top:0.25rem;">${item.title}</h2>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="App.exitPlayModule()">
                    <i class="fa-solid fa-xmark"></i> Keluar
                </button>
            </div>

            <!-- Questions Form -->
            <form onsubmit="App.handleWorksheetSubmit(event, '${moduleType}', '${item.id}')">
                ${questions.map((q, idx) => {
                    const ans = answersState[q.id] || { type: 'text', content: '', photoUrl: '' };
                    const review = aiReviewsState[q.id];

                    return `
                    <div class="content-card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--primary-color);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                            <span style="font-weight:800; font-size:1.1rem; color:var(--primary-color);">Soal Nomor #${idx + 1}</span>
                            <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-robot"></i> Koreksi AI Per-Soal</span>
                        </div>

                        <!-- Question Text -->
                        <div style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:1.25rem; line-height:1.5;">
                            ${q.questionText}
                        </div>

                        <!-- Answer Input Method Tabs -->
                        <div style="margin-bottom: 1rem;">
                            <label style="font-size:0.85rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:0.5rem;">
                                Pilih Bentuk Pengiriman Jawaban:
                            </label>
                            <div class="tab-options" style="display:flex; gap:0.5rem;">
                                <button type="button" class="btn btn-sm ${ans.type === 'text' ? 'btn-primary' : 'btn-outline'}" 
                                        onclick="App.toggleAnswerType('${q.id}', 'text')">
                                    <i class="fa-solid fa-font"></i> Jawaban Teks Uraian
                                </button>
                                <button type="button" class="btn btn-sm ${ans.type === 'photo' ? 'btn-primary' : 'btn-outline'}" 
                                        onclick="App.toggleAnswerType('${q.id}', 'photo')">
                                    <i class="fa-solid fa-camera"></i> Unggah / Ambil Foto
                                </button>
                            </div>
                        </div>

                        <!-- Text Answer Area -->
                        <div id="input-text-area-${q.id}" style="display: ${ans.type === 'text' ? 'block' : 'none'};">
                            <textarea class="form-control" rows="4" id="ans-text-${q.id}" 
                                      placeholder="Ketik uraian jawaban Anda secara rinci di sini..." 
                                      oninput="App.saveQuestionAnswer('${q.id}', 'text', this.value)">${ans.content || ''}</textarea>
                        </div>

                        <!-- Photo Answer Area -->
                        <div id="input-photo-area-${q.id}" style="display: ${ans.type === 'photo' ? 'block' : 'none'};">
                            <div class="photo-dropzone" style="border:2px dashed var(--primary-color); padding:1.5rem; text-align:center; border-radius:var(--radius-md); background:#f8fafc;">
                                <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; color:var(--primary-color); margin-bottom:0.5rem;"></i>
                                <p style="font-size:0.85rem; font-weight:600; margin-bottom:0.75rem;">Pilih berkas foto lembar tulisan tangan atau ambil gambar</p>
                                <input type="file" id="ans-file-${q.id}" accept="image/*" class="form-control" style="max-width:320px; margin:0 auto;" 
                                       onchange="App.handlePhotoUpload(event, '${q.id}')">
                                
                                <div id="preview-container-${q.id}" style="margin-top:1rem; display:${ans.photoUrl ? 'block' : 'none'};">
                                    <img id="preview-img-${q.id}" src="${ans.photoUrl || ''}" alt="Preview Jawaban" style="max-height:220px; border-radius:var(--radius-md); border:1px solid var(--border-color); box-shadow:var(--shadow-sm);">
                                </div>
                            </div>
                        </div>

                        <!-- Per-Question Instant AI Correction Button -->
                        <div style="margin-top: 1.25rem; display:flex; justify-content:flex-end;">
                            <button type="button" class="btn btn-secondary btn-sm" style="background:linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color:#fff; border:none; box-shadow:0 4px 10px rgba(99,102,241,0.25);" onclick="App.runSingleQuestionAICorrection('${q.id}', '${q.questionText.replace(/'/g, "\\'")}')">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Minta Koreksi AI Soal Ini
                            </button>
                        </div>

                        <!-- Per-Question AI Review Display Card -->
                        <div id="ai-review-card-${q.id}" class="ai-question-card animate-fade-in" style="margin-top:1.25rem; display:${review ? 'block' : 'none'}; border-radius:var(--radius-md); padding:1.25rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid #bae6fd; padding-bottom:0.5rem;">
                                <div style="display:flex; align-items:center; gap:0.5rem;">
                                    <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.9rem;">
                                        <i class="fa-solid fa-robot"></i>
                                    </div>
                                    <span style="font-weight:800; color:#0369a1; font-size:0.95rem;">Analisis & Koreksi AI (Soal #${idx + 1})</span>
                                </div>
                                <span id="ai-score-badge-${q.id}" class="badge badge-kkm-success" style="font-size:0.9rem; font-weight:800; padding:0.35rem 0.85rem;">
                                    Skor: ${review ? review.score : 0} / 100
                                </span>
                            </div>
                            <div id="ai-review-content-${q.id}" style="font-size:0.9rem; color:#0c4a6e; line-height:1.65;">
                                ${review ? review.aiReview : ''}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}

                <!-- Submit All Form Button -->
                <div style="margin-top:2rem; text-align:center;">
                    <button type="submit" class="btn btn-primary btn-block" style="padding:1rem; font-size:1.1rem; font-weight:700;">
                        <i class="fa-solid fa-paper-plane"></i> Simpan & Kumpulkan Seluruh Lembar Kerja
                    </button>
                </div>
            </form>
        </div>
        `;
    },

    // 19. Printable PDF Report Template (Print & PDF Generation)
    printableReport: (submission) => PDFReportModule.renderPrintableDocument(submission),

    // 20. Teacher Grade Detail & Notes Modal
    gradeDetailModalContent: (sub) => {
        return `
        <div style="max-height: 80vh; overflow-y: auto; padding: 0.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div>
                    <h3 style="font-weight:800;">Lembar Pengerjaan: ${sub.studentName}</h3>
                    <span class="badge badge-info">${sub.moduleType.toUpperCase()}</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.8rem; color:var(--text-muted)">Skor AI Per-Soal:</div>
                    <div style="font-size:1.4rem; font-weight:800; color:var(--primary-color)">${sub.overallScore} / 100</div>
                </div>
            </div>

            <div style="margin-bottom:1.5rem;">
                <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.5rem;">Hasil Jawaban Siswa & Koreksi AI:</h4>
                ${(sub.answers || []).map((a, i) => {
                    const rev = (sub.perQuestionReviews || [])[i] || {};
                    return `
                    <div style="background:var(--bg-main); padding:0.75rem; border-radius:var(--radius-md); margin-bottom:0.75rem; border:1px solid var(--border-color);">
                        <div style="font-size:0.85rem; font-weight:700; margin-bottom:0.25rem;">Soal #${i + 1} (${a.type === 'photo' ? 'Foto' : 'Teks'}) - Skor AI: ${rev.score || 0}</div>
                        ${a.type === 'text' ? `<div style="font-size:0.85rem; margin-bottom:0.5rem;"><b>Teks Jawaban:</b> ${a.content}</div>` : ''}
                        ${a.type === 'photo' ? `<img src="${a.photoUrl}" style="max-height:140px; border-radius:4px; display:block; margin-bottom:0.5rem;">` : ''}
                        <div style="font-size:0.8rem; color:#0369a1; background:#f0f9ff; padding:0.5rem; border-radius:4px;">${rev.aiReview || ''}</div>
                    </div>
                    `;
                }).join('')}
            </div>

            <form onsubmit="App.handleSaveTeacherReview(event, '${sub.id}')">
                <div class="form-group">
                    <label for="teacher-notes-input"><i class="fa-solid fa-pen-nib"></i> Catatan & Umpan Balik Guru:</label>
                    <textarea id="teacher-notes-input" class="form-control" rows="3" placeholder="Tuliskan apresiasi, koreksi manual, atau pesan tindak lanjut...">${sub.teacherNotes || ''}</textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-check"></i> Simpan Catatan & Tandai Selesai
                    </button>
                </div>
            </form>
        </div>
        `;
    }
};
