/**
 * EduSmart HTML View Templates Generator
 * Produces semantic, fully-structured HTML string templates for all screens.
 */

const Views = {
    // Media Rendering Helper
    renderQuestionMedia: (q) => {
        if (!q.type || q.type === 'text') return '';
        
        if (q.type === 'image') {
            // Render beautiful SVG Stomach diagram
            return `
            <div class="media-container image-media animate-fade-in" style="margin-bottom: 1.5rem;">
                <svg viewBox="0 0 400 300" style="max-height: 250px; width: 100%; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: #fdfbf7;">
                    <!-- Stomach SVG representation -->
                    <defs>
                        <linearGradient id="stomachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#fda4af;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="acidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#a7f3d0;stop-opacity:0.6" />
                            <stop offset="100%" style="stop-color:#059669;stop-opacity:0.9" />
                        </linearGradient>
                    </defs>
                    <!-- Background shapes / grid -->
                    <circle cx="200" cy="150" r="140" fill="#f8fafc" stroke="#f1f5f9" stroke-width="2"/>
                    
                    <!-- Esophagus -->
                    <path d="M 170 20 L 170 100 L 195 100 L 195 20" fill="#fecdd3" stroke="#fda4af" stroke-width="2"/>
                    <path d="M 170 50 Q 182.5 52 195 50" fill="none" stroke="#fda4af" stroke-width="2"/>
                    
                    <!-- Stomach Body -->
                    <path d="M 170 100 Q 120 120 110 170 Q 100 230 170 260 Q 230 280 270 240 Q 300 200 280 150 Q 260 110 195 100" fill="url(#stomachGrad)" stroke="#e11d48" stroke-width="3"/>
                    
                    <!-- Stomach Acid/Content inside -->
                    <path d="M 120 180 Q 110 220 170 250 Q 230 270 265 235 Q 275 210 270 190 Q 195 195 120 180" fill="url(#acidGrad)"/>
                    
                    <!-- Labels -->
                    <line x1="182" y1="50" x2="300" y2="50" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1.5"/>
                    <circle cx="182" cy="50" r="3" fill="#64748b"/>
                    <text x="310" y="55" font-size="11" font-weight="700" fill="#1e293b">Kerongkongan</text>
                    
                    <line x1="200" y1="140" x2="300" y2="120" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1.5"/>
                    <circle cx="200" cy="140" r="3" fill="#64748b"/>
                    <text x="310" y="125" font-size="11" font-weight="700" fill="#1e293b">Lambung (Organ Utama)</text>
                    
                    <line x1="190" y1="220" x2="300" y2="220" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1.5"/>
                    <circle cx="190" cy="220" r="3" fill="#64748b"/>
                    <text x="310" y="225" font-size="11" font-weight="700" fill="#1e293b">Pencernaan Kimiawi (Pepsin/HCl)</text>
                    
                    <!-- Title -->
                    <text x="20" y="35" font-size="13" font-weight="800" fill="#6366f1">DIAGRAM ORGAN LAMBUNG MANUSIA</text>
                </svg>
            </div>
            `;
        }
        
        if (q.type === 'video') {
            return `
            <div class="media-container video-media animate-fade-in" style="margin-bottom: 1.5rem;">
                <video src="${q.mediaUrl}" controls playsinline style="width: 100%; max-height: 250px; border-radius: var(--radius-md); border: 1.5px solid var(--border-color); background: #000;"></video>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem; display:flex; align-items:center; gap:0.25rem;">
                    <i class="fa-solid fa-circle-info"></i> Tonton video di atas sebelum menjawab pertanyaan di bawah.
                </div>
            </div>
            `;
        }
        
        if (q.type === 'game') {
            return `
            <div class="media-container game-media animate-fade-in" style="margin-bottom: 1.5rem; background-color:var(--bg-main); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                <div class="game-dashboard" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <div style="font-size:0.9rem; font-weight:600;">🎮 Game Ketangkasan: <span id="game-status-label" class="badge badge-warning" style="font-size:0.75rem; padding:0.2rem 0.5rem">Belum Dimulai</span></div>
                    <div style="font-size:0.95rem; font-weight:700;">Skor Lompatan: <span id="game-score" style="color:var(--primary-color); font-size:1.1rem;">0</span> / 3</div>
                </div>
                <div class="game-canvas-wrapper" style="position:relative; width:100%; max-width:600px; margin: 0 auto; overflow:hidden; border-radius:var(--radius-md);">
                    <canvas id="game-canvas" width="600" height="160" style="width: 100%; height: 160px; display: block; background: #e0f2fe; cursor: pointer;"></canvas>
                    
                    <!-- Game Overlay screen -->
                    <div id="game-overlay" style="position:absolute; inset:0; background:rgba(15,23,42,0.8); display:flex; align-items:center; justify-content:center; flex-direction:column; text-align:center; color:#fff; padding:1rem; transition:var(--transition-base);">
                        <h4 style="font-size:1.2rem; font-weight:800; margin-bottom:0.25rem;">Mini-Game: EduJumper!</h4>
                        <p style="font-size:0.8rem; opacity:0.8; margin-bottom:1rem;">Ketuk Canvas / pencet SPACEBAR untuk melompat.<br>Lompati 3 balok rintangan untuk berhasil.</p>
                        <button type="button" class="btn btn-primary" onclick="App.startInteractiveGame()" style="padding: 0.5rem 1rem; font-size:0.85rem">
                            <i class="fa-solid fa-play"></i> Mulai Main Game
                        </button>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem;">
                    <span style="font-size:0.75rem; color:var(--text-muted);">
                        💡 Lompat saat balok mendekati karakter kotak ungu Anda!
                    </span>
                    <button type="button" class="btn btn-secondary" id="btn-restart-game" style="padding: 0.35rem 0.75rem; font-size:0.75rem; display:none;" onclick="App.restartInteractiveGame()">
                        <i class="fa-solid fa-rotate-right"></i> Main Ulang Game
                    </button>
                </div>
            </div>
            `;
        }
        
        return '';
    },

    // 1. Landing Page
    landing: () => {
        return `
        <div class="landing-container animate-fade-in">
            <div class="landing-header">
                <div class="logo-brand"><i class="fa-solid fa-graduation-cap"></i> EduSmart</div>
                <p>Platform Pembelajaran Digital dengan Evaluasi & Review Berbasis AI</p>
            </div>
            <div class="role-cards">
                <!-- Siswa Card -->
                <div class="role-card student-role" onclick="App.navigateTo('login-siswa')">
                    <div class="role-icon">
                        <i class="fa-solid fa-user-graduate animate-float"></i>
                    </div>
                    <h3>Portal Siswa</h3>
                    <p>Membaca Materi (LKP), menguji diri dengan Latihan Soal, mengikuti Kuis resmi, dan dapatkan Review AI instan.</p>
                </div>
                
                <!-- Guru Card -->
                <div class="role-card admin-role" onclick="App.navigateTo('login-guru')">
                    <div class="role-icon">
                        <i class="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <h3>Portal Guru / Admin</h3>
                    <p>Kelola materi ajar, buat bank soal latihan & kuis, pantau statistik performa kelas, dan periksa lembar jawaban.</p>
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
            ? 'Masuk untuk mengelola ruang kelas digital Anda.' 
            : 'Masuk untuk mengakses materi dan memulai latihan.';
        
        return `
        <div class="auth-container">
            <div class="auth-card animate-fade-in">
                <div class="back-to-home" onclick="App.navigateTo('landing')">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
                </div>
                <div class="auth-header">
                    <div class="logo-brand"><i class="fa-solid fa-graduation-cap"></i> EduSmart</div>
                    <h2>${title}</h2>
                    <p>${desc}</p>
                </div>
                
                <form id="auth-form" onsubmit="App.handleLogin(event, '${role}')">
                    <div class="form-group">
                        <label class="form-label" for="username">Username</label>
                        <div class="input-group">
                            <input type="text" id="username" class="form-input" placeholder="Masukkan username" required autocomplete="username">
                            <i class="fa-solid fa-user"></i>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="password">Password</label>
                        <div class="input-group">
                            <input type="password" id="password" class="form-input" placeholder="Masukkan password" required autocomplete="current-password">
                            <i class="fa-solid fa-lock"></i>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        Masuk <i class="fa-solid fa-arrow-right-to-bracket"></i>
                    </button>
                </form>
                
                ${!isGuru ? `
                <div class="auth-footer">
                    Belum punya akun? <a href="#" onclick="App.navigateTo('register')">Daftar Sekarang</a>
                </div>
                ` : `
                <div class="auth-footer" style="background-color: var(--bg-main); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
                    💡 Akun uji coba bawaan:<br>
                    <strong>Username:</strong> guru | <strong>Password:</strong> password123
                </div>
                `}
            </div>
        </div>
        `;
    },

    // 3. Register Page (For Students)
    register: () => {
        return `
        <div class="auth-container">
            <div class="auth-card animate-fade-in">
                <div class="back-to-home" onclick="App.navigateTo('login-siswa')">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Login
                </div>
                <div class="auth-header">
                    <div class="logo-brand"><i class="fa-solid fa-graduation-cap"></i> EduSmart</div>
                    <h2>Daftar Akun Siswa</h2>
                    <p>Buat akun gratis untuk mulai belajar sekarang.</p>
                </div>
                
                <form id="register-form" onsubmit="App.handleRegister(event)">
                    <div class="form-group">
                        <label class="form-label" for="reg-name">Nama Lengkap</label>
                        <div class="input-group">
                            <input type="text" id="reg-name" class="form-input" placeholder="Nama lengkap Anda" required>
                            <i class="fa-solid fa-id-card"></i>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="reg-username">Username Baru</label>
                        <div class="input-group">
                            <input type="text" id="reg-username" class="form-input" placeholder="Buat username unik" required>
                            <i class="fa-solid fa-user"></i>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="reg-password">Password</label>
                        <div class="input-group">
                            <input type="password" id="reg-password" class="form-input" placeholder="Minimal 6 karakter" required>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        Daftar Akun <i class="fa-solid fa-user-plus"></i>
                    </button>
                </form>
            </div>
        </div>
        `;
    },

    // 4. Guru Dashboard Layout wrapper
    teacherLayout: (activeTab, subContent) => {
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
                    <div class="user-avatar">${user.name ? user.name[0] : 'G'}</div>
                    <div class="user-info">
                        <span class="user-name">${user.name || 'Guru'}</span>
                        <span class="user-role">Guru / Administrator</span>
                    </div>
                </div>
                
                <ul class="sidebar-menu">
                    <li class="menu-item ${activeTab === 'overview' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('overview')">
                            <i class="fa-solid fa-chart-line"></i> Ringkasan
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'materials' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('materials')">
                            <i class="fa-solid fa-book-open"></i> Kelola LKP / Materi
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'exercises' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('exercises')">
                            <i class="fa-solid fa-clipboard-question"></i> Kelola Latihan Soal
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'quizzes' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('quizzes')">
                            <i class="fa-solid fa-hourglass-half"></i> Kelola Kuis Ujian
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'grades' ? 'active' : ''}">
                        <a onclick="App.navigateTeacher('grades')">
                            <i class="fa-solid fa-square-poll-horizontal"></i> Nilai & Review AI
                        </a>
                    </li>
                </ul>
                
                <div class="sidebar-footer">
                    <button class="logout-btn" onclick="App.handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Keluar Portal
                    </button>
                </div>
            </aside>
            
            <!-- Main Content Area -->
            <main class="main-content">
                <header class="top-navbar">
                    <div class="navbar-title">
                        <h1>EduSmart Guru Panel</h1>
                    </div>
                    <div class="navbar-actions">
                        <div class="nav-notification">
                            <i class="fa-regular fa-bell"></i>
                            <span class="notification-badge">2</span>
                        </div>
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

    // 5. Guru Subview: Overview
    teacherOverview: () => {
        const studentsCount = DataStore.getStudents().length;
        const materialsCount = DataStore.getMaterials().length;
        const quizzesCount = DataStore.getQuizzes().length;
        const subs = DataStore.getSubmissions();
        const avgScore = subs.length 
            ? Math.round(subs.reduce((acc, curr) => acc + curr.score, 0) / subs.length) 
            : 0;

        return `
        <div>
            <h2>Dashboard Ringkasan</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Selamat datang kembali! Berikut statistik pembelajaran terkini.</p>
            
            <!-- Widget Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Total Siswa</h4>
                        <p>${studentsCount}</p>
                    </div>
                    <div class="stat-icon primary">
                        <i class="fa-solid fa-users"></i>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Materi / LKP</h4>
                        <p>${materialsCount}</p>
                    </div>
                    <div class="stat-icon secondary">
                        <i class="fa-solid fa-book-open"></i>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Kuis Aktif</h4>
                        <p>${quizzesCount}</p>
                    </div>
                    <div class="stat-icon warning">
                        <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Rata-Rata Nilai</h4>
                        <p>${avgScore}%</p>
                    </div>
                    <div class="stat-icon success">
                        <i class="fa-solid fa-chart-line"></i>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-row">
                <!-- Chart Section -->
                <div class="content-card">
                    <div class="card-header-flex">
                        <h3>Statistik Grafik Hasil Ujian</h3>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Nilai Kuis (%)</span>
                    </div>
                    <div style="position: relative; height:280px; width:100%">
                        <canvas id="scoresChart"></canvas>
                    </div>
                </div>
                
                <!-- Recent Activities Section -->
                <div class="content-card">
                    <div class="card-header-flex">
                        <h3>Aktivitas Terkini</h3>
                    </div>
                    <ul class="custom-list">
                        ${subs.length === 0 ? '<li class="list-item">Belum ada aktivitas.</li>' : 
                          subs.slice(0, 4).map(sub => `
                            <li class="list-item">
                                <div class="list-item-info">
                                    <div class="list-item-icon">
                                        <i class="fa-solid fa-circle-check"></i>
                                    </div>
                                    <div class="list-item-text">
                                        <h5>${sub.studentName}</h5>
                                        <p>Menyelesaikan Kuis, Skor: <strong>${sub.score}</strong></p>
                                    </div>
                                </div>
                                <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(sub.completedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </li>
                          `).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `;
    },

    // 6. Guru Subview: Kelola Materi / LKP
    teacherMaterials: () => {
        const mats = DataStore.getMaterials();
        const subjs = DataStore.getSubjects();
        
        return `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                    <h2>Kelola Lembar Kerja (LKP) & Materi</h2>
                    <p style="color: var(--text-muted);">Buat, publikasi, dan kelola dokumen pembelajaran siswa.</p>
                </div>
                <button class="btn btn-primary" onclick="App.openModal('material-modal')">
                    <i class="fa-solid fa-plus"></i> Tambah LKP/Materi
                </button>
            </div>
            
            <div class="content-card">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Mata Pelajaran</th>
                                <th>Judul Materi</th>
                                <th>Deskripsi Ringkas</th>
                                <th>Penulis</th>
                                <th>Pembaca</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mats.length === 0 ? `<tr><td colspan="6" style="text-align: center;">Belum ada materi. Silakan buat materi baru.</td></tr>` : 
                              mats.map(m => `
                                <tr>
                                    <td><span class="badge badge-primary">${DataStore.getSubjectName(m.subjectId)}</span></td>
                                    <td style="font-weight: 600;">${m.title}</td>
                                    <td style="color: var(--text-muted); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.description}</td>
                                    <td>${m.author}</td>
                                    <td><i class="fa-solid fa-eye"></i> ${m.readBy.length} Siswa</td>
                                    <td>
                                        <button class="btn btn-danger" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="App.deleteMaterial('${m.id}')">
                                            <i class="fa-solid fa-trash"></i> Hapus
                                        </button>
                                    </td>
                                </tr>
                              `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal Box for Adding Material -->
            <div id="material-modal" class="modal-overlay">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>Tambah Materi / LKPD Baru</h3>
                        <button class="modal-close-btn" onclick="App.closeModal('material-modal')">&times;</button>
                    </div>
                    <form onsubmit="App.handleCreateMaterial(event)">
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="form-label" for="mat-subj">Mata Pelajaran</label>
                                <select id="mat-subj" class="form-select" required>
                                    ${subjs.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="mat-title">Judul Materi</label>
                                <input type="text" id="mat-title" class="form-input font-semibold" placeholder="Contoh: Pengenalan Fotosintesis" required style="padding-left: 1rem;">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="mat-desc">Deskripsi Singkat</label>
                                <input type="text" id="mat-desc" class="form-input" placeholder="Ringkasan 1 kalimat" required style="padding-left: 1rem;">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="mat-content">Konten Pembelajaran (HTML didukung)</label>
                                <textarea id="mat-content" class="form-textarea" placeholder="Tuliskan materi ajar di sini..." required></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="App.closeModal('material-modal')">Batal</button>
                            <button type="submit" class="btn btn-primary">Simpan & Publikasikan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    },

    // 7. Guru Subview: Kelola Latihan Soal
    teacherExercises: () => {
        const exs = DataStore.getExercises();
        const subjs = DataStore.getSubjects();
        
        return `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                    <h2>Kelola Bank Latihan Soal</h2>
                    <p style="color: var(--text-muted);">Buat bahan latihan belajar mandiri dengan feedback instan untuk siswa.</p>
                </div>
                <button class="btn btn-primary" onclick="App.openCreateExerciseModal()">
                    <i class="fa-solid fa-plus"></i> Tambah Paket Latihan
                </button>
            </div>
            
            <div class="content-card">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Mata Pelajaran</th>
                                <th>Paket Latihan</th>
                                <th>Deskripsi</th>
                                <th>Jumlah Soal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${exs.length === 0 ? `<tr><td colspan="5" style="text-align: center;">Belum ada paket latihan.</td></tr>` : 
                              exs.map(e => `
                                <tr>
                                    <td><span class="badge badge-primary">${DataStore.getSubjectName(e.subjectId)}</span></td>
                                    <td style="font-weight: 600;">${e.title}</td>
                                    <td style="color: var(--text-muted);">${e.description}</td>
                                    <td><strong>${e.questions.length} Butir Soal</strong></td>
                                    <td>
                                        <button class="btn btn-danger" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="App.deleteExercise('${e.id}')">
                                            <i class="fa-solid fa-trash"></i> Hapus
                                        </button>
                                    </td>
                                </tr>
                              `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal Box for Adding Exercise -->
            <div id="exercise-modal" class="modal-overlay">
                <div class="modal-card" style="max-width: 750px;">
                    <div class="modal-header">
                        <h3>Buat Paket Latihan Soal</h3>
                        <button class="modal-close-btn" onclick="App.closeModal('exercise-modal')">&times;</button>
                    </div>
                    <form onsubmit="App.handleCreateExercise(event)">
                        <div class="modal-body" style="max-height: 60vh;">
                            <div class="form-group">
                                <label class="form-label" for="ex-subj">Mata Pelajaran</label>
                                <select id="ex-subj" class="form-select" required>
                                    ${subjs.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="ex-title">Nama Paket Latihan</label>
                                <input type="text" id="ex-title" class="form-input" placeholder="Contoh: Latihan Asam Basa" required style="padding-left:1rem;">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="ex-desc">Deskripsi</label>
                                <input type="text" id="ex-desc" class="form-input" placeholder="Ringkasan latihan" required style="padding-left:1rem;">
                            </div>
                            
                            <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid var(--border-color);">
                            
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                                <h4>Daftar Soal</h4>
                                <button type="button" class="btn btn-secondary" style="padding: 0.4rem 0.85rem; font-size:0.85rem" onclick="App.addQuestionFieldToCreator('ex-questions-list')">
                                    <i class="fa-solid fa-plus"></i> Tambah Soal
                                </button>
                            </div>
                            
                            <div id="ex-questions-list" class="questions-creator-list">
                                <!-- Dynamic Questions will be inserted here -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="App.closeModal('exercise-modal')">Batal</button>
                            <button type="submit" class="btn btn-primary">Simpan Latihan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    },

    // 8. Guru Subview: Kelola Kuis Ujian
    teacherQuizzes: () => {
        const qzs = DataStore.getQuizzes();
        const subjs = DataStore.getSubjects();
        
        return `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                    <h2>Kelola Kuis / Ujian Resmi</h2>
                    <p style="color: var(--text-muted);">Buat ujian formal dengan batas waktu. Nilai diujikan resmi masuk ke buku rapor.</p>
                </div>
                <button class="btn btn-primary" onclick="App.openCreateQuizModal()">
                    <i class="fa-solid fa-plus"></i> Tambah Kuis Ujian
                </button>
            </div>
            
            <div class="content-card">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Mata Pelajaran</th>
                                <th>Judul Kuis</th>
                                <th>Durasi Waktu</th>
                                <th>Jumlah Soal</th>
                                <th>Peserta Ujian</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${qzs.length === 0 ? `<tr><td colspan="6" style="text-align: center;">Belum ada kuis ujian.</td></tr>` : 
                              qzs.map(q => {
                                  const subsCount = DataStore.getQuizSubmissions(q.id).length;
                                  return `
                                    <tr>
                                        <td><span class="badge badge-primary">${DataStore.getSubjectName(q.subjectId)}</span></td>
                                        <td style="font-weight: 600;">${q.title}</td>
                                        <td><i class="fa-regular fa-clock"></i> ${q.duration} Menit</td>
                                        <td><strong>${q.questions.length} Butir Soal</strong></td>
                                        <td><span class="badge badge-success">${subsCount} Dikerjakan</span></td>
                                        <td>
                                            <button class="btn btn-danger" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="App.deleteQuiz('${q.id}')">
                                                <i class="fa-solid fa-trash"></i> Hapus
                                            </button>
                                        </td>
                                    </tr>
                                  `;
                              }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal Box for Adding Quiz -->
            <div id="quiz-modal" class="modal-overlay">
                <div class="modal-card" style="max-width: 750px;">
                    <div class="modal-header">
                        <h3>Buat Kuis Ujian Baru</h3>
                        <button class="modal-close-btn" onclick="App.closeModal('quiz-modal')">&times;</button>
                    </div>
                    <form onsubmit="App.handleCreateQuiz(event)">
                        <div class="modal-body" style="max-height: 60vh;">
                            <div class="form-group">
                                <label class="form-label" for="qz-subj">Mata Pelajaran</label>
                                <select id="qz-subj" class="form-select" required>
                                    ${subjs.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group" style="display: grid; grid-template-columns: 3fr 1fr; gap: 1rem;">
                                <div>
                                    <label class="form-label" for="qz-title">Nama Kuis / Ujian</label>
                                    <input type="text" id="qz-title" class="form-input" placeholder="Contoh: Ulangan Tengah Semester" required style="padding-left:1rem;">
                                </div>
                                <div>
                                    <label class="form-label" for="qz-duration">Durasi (Menit)</label>
                                    <input type="number" id="qz-duration" class="form-input" min="1" max="180" value="15" required style="padding-left:1rem;">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="qz-desc">Deskripsi / Petunjuk Ujian</label>
                                <input type="text" id="qz-desc" class="form-input" placeholder="Petunjuk pengerjaan kuis" required style="padding-left:1rem;">
                            </div>
                            
                            <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid var(--border-color);">
                            
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                                <h4>Soal Ujian Pilihan Ganda</h4>
                                <button type="button" class="btn btn-secondary" style="padding: 0.4rem 0.85rem; font-size:0.85rem" onclick="App.addQuestionFieldToCreator('qz-questions-list')">
                                    <i class="fa-solid fa-plus"></i> Tambah Soal Ujian
                                </button>
                            </div>
                            
                            <div id="qz-questions-list" class="questions-creator-list">
                                <!-- Dynamic Quiz Questions will be inserted here -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="App.closeModal('quiz-modal')">Batal</button>
                            <button type="submit" class="btn btn-primary">Publikasikan Kuis</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    },

    // Question Form Component used dynamically inside add-question modal
    questionCreatorItemTemplate: (index) => {
        return `
        <div class="question-creator-item animate-fade-in" data-index="${index}">
            <div class="remove-question-btn" onclick="this.closest('.question-creator-item').remove()">
                <i class="fa-solid fa-circle-xmark"></i> Hapus Soal #${index + 1}
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 3fr 1fr; gap:1rem;">
                <div>
                    <label class="form-label">Teks Pertanyaan #${index + 1}</label>
                    <input type="text" class="form-input q-question-text" placeholder="Masukkan teks pertanyaan" required style="padding-left:1rem;">
                </div>
                <div>
                    <label class="form-label">Tipe Soal</label>
                    <select class="form-select q-type-select" style="padding-left:0.5rem;" onchange="App.toggleCreatorMediaField(this)">
                        <option value="text">Teks Saja</option>
                        <option value="image">Gambar (Diagram)</option>
                        <option value="video">Video (Sematkan Link)</option>
                        <option value="game">Game Lompat</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group media-field-group" style="display:none;">
                <label class="form-label">Link Media Video / ID Gambar</label>
                <input type="text" class="form-input q-media-url" placeholder="Contoh link mp4: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" style="padding-left:1rem;">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
                <div class="form-group" style="margin-bottom:0">
                    <label class="form-label">Pilihan A</label>
                    <input type="text" class="form-input q-opt-0" placeholder="Jawaban A" required style="padding-left:1rem;" value="Pilihan A">
                </div>
                <div class="form-group" style="margin-bottom:0">
                    <label class="form-label">Pilihan B</label>
                    <input type="text" class="form-input q-opt-1" placeholder="Jawaban B" required style="padding-left:1rem;" value="Pilihan B">
                </div>
                <div class="form-group" style="margin-bottom:0">
                    <label class="form-label">Pilihan C</label>
                    <input type="text" class="form-input q-opt-2" placeholder="Jawaban C" required style="padding-left:1rem;" value="Pilihan C">
                </div>
                <div class="form-group" style="margin-bottom:0">
                    <label class="form-label">Pilihan D</label>
                    <input type="text" class="form-input q-opt-3" placeholder="Jawaban D" required style="padding-left:1rem;" value="Pilihan D">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                <div class="form-group" style="margin-bottom:0">
                    <label class="form-label">Kunci Jawaban Benar</label>
                    <select class="form-select q-correct-idx" required>
                        <option value="0">Pilihan A</option>
                        <option value="1" selected>Pilihan B</option>
                        <option value="2">Pilihan C</option>
                        <option value="3">Pilihan D</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:0">
                    <label class="form-label">Penjelasan / Bahasan Jawaban (Opsional)</label>
                    <input type="text" class="form-input q-explanation" placeholder="Masukkan penjelasan konsep jawaban benar" style="padding-left:1rem;">
                </div>
            </div>
        </div>
        `;
    },

    // 9. Guru Subview: Nilai & Review AI
    teacherGrades: () => {
        const subs = DataStore.getSubmissions();
        
        return `
        <div>
            <h2>Buku Nilai & Analisis Review AI</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Periksa hasil pengerjaan kuis siswa, berikan catatan umpan balik, dan rilis laporan AI.</p>
            
            <div class="content-card">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Siswa</th>
                                <th>Kuis / Ujian</th>
                                <th>Selesai Pada</th>
                                <th>Skor</th>
                                <th>Status Periksa</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subs.length === 0 ? `<tr><td colspan="6" style="text-align: center;">Belum ada siswa yang mengumpulkan kuis.</td></tr>` : 
                              subs.map(s => {
                                  const quiz = DataStore.getQuiz(s.quizId) || {};
                                  const isChecked = s.status === 'selesai_diperiksa';
                                  
                                  return `
                                    <tr>
                                        <td style="font-weight: 600;">${s.studentName}</td>
                                        <td>${quiz.title || 'Kuis Dihapus'}</td>
                                        <td style="font-size: 0.85rem; color: var(--text-muted);">
                                            ${new Date(s.completedAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>
                                            <span class="badge ${s.score >= 75 ? 'badge-success' : s.score >= 50 ? 'badge-warning' : 'badge-danger'}" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
                                                ${s.score} / 100
                                            </span>
                                        </td>
                                        <td>
                                            ${isChecked ? `
                                                <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Selesai Diperiksa</span>
                                            ` : `
                                                <span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Belum Diperiksa</span>
                                            `}
                                        </td>
                                        <td>
                                            ${isChecked ? `
                                                <button class="btn btn-secondary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="App.openGradeDetailModal('${s.id}')">
                                                    <i class="fa-solid fa-magnifying-glass-chart"></i> Detail & Edit Catatan
                                                </button>
                                            ` : `
                                                <button class="btn btn-primary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem; background-color:var(--primary-color);" onclick="App.openGradeDetailModal('${s.id}')">
                                                    <i class="fa-solid fa-file-signature"></i> Periksa & Nilai
                                                </button>
                                            `}
                                        </td>
                                    </tr>
                                  `;
                              }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal Detail Jawaban & AI Review -->
            <div id="grade-detail-modal" class="modal-overlay">
                <div class="modal-card" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3>Lembar Ujian & Evaluasi Guru</h3>
                        <button class="modal-close-btn" onclick="App.closeModal('grade-detail-modal')">&times;</button>
                    </div>
                    <div class="modal-body" id="grade-detail-body">
                        <!-- Loaded Dynamically -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.closeModal('grade-detail-modal')">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Modal Content for Grade Detail View (AI Review + Student Answers + Teacher Notes Form)
    gradeDetailModalContent: (sub, quiz) => {
        const isChecked = sub.status === 'selesai_diperiksa';
        
        return `
        <div class="animate-fade-in">
            <div style="background-color: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Nama Siswa</h5>
                    <p style="font-weight:700; font-size:1.1rem;">${sub.studentName}</p>
                </div>
                <div>
                    <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Kuis / Ujian</h5>
                    <p style="font-weight:700; font-size:1.1rem;">${quiz.title}</p>
                </div>
                <div>
                    <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Skor Ujian</h5>
                    <p style="font-weight:800; font-size:1.4rem; color:var(--primary-color)">${sub.score} / 100</p>
                </div>
                <div>
                    <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Tanggal Pengumpulan</h5>
                    <p style="font-weight:600;">${new Date(sub.completedAt).toLocaleString('id-ID')}</p>
                </div>
            </div>

            <!-- Form Catatan Guru & Ulasan Rilis -->
            <div style="background-color:#f0fdf4; border: 1.5px solid #a7f3d0; padding:1.25rem; border-radius:var(--radius-md); margin-bottom:2rem;">
                <h4 style="color:#065f46; font-size:1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
                    <i class="fa-solid fa-comment-medical"></i> Evaluasi Guru & Konfirmasi Rilis AI
                </h4>
                <p style="font-size:0.8rem; color:#047857; margin-bottom:1rem;">
                    Siswa tidak dapat melihat hasil analisis Review AI sebelum Anda memberikan Catatan Guru dan mengklik tombol Rilis di bawah ini.
                </p>
                
                <form id="teacher-notes-form" onsubmit="App.handleSaveTeacherReview(event, '${sub.id}')">
                    <div class="form-group" style="margin-bottom:1rem">
                        <label class="form-label" style="color:#065f46" for="teacher-notes-input">Catatan Guru (Koreksi & Masukan)</label>
                        <textarea id="teacher-notes-input" class="form-textarea" placeholder="Tulis masukan belajar untuk siswa..." required style="background:#fff; border-color:#cbd5e1; color:var(--text-main); font-style:normal">${sub.teacherNotes || ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-success btn-block" style="background-color:var(--success-color); box-shadow:0 4px 10px rgba(16,185,129,0.2)">
                        <i class="fa-solid fa-file-shield"></i> ${isChecked ? 'Perbarui Catatan & Simpan' : 'Selesai Periksa & Kirim Hasil Ulasan AI'}
                    </button>
                </form>
            </div>
            
            <div class="ai-review-card" style="margin-bottom: 2rem;">
                <span class="ai-badge" style="margin-bottom:1rem;">
                    <i class="fa-solid fa-robot"></i> DRAFT Laporan Analisis AI (Otomatis)
                </span>
                <div class="ai-review-content" style="color: #4c1d95; opacity: 0.85;">
                    ${sub.aiReview}
                </div>
            </div>
            
            <h4 style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem">
                Analisis Kunci Jawaban Siswa
            </h4>
            <div style="display:flex; flex-direction:column; gap:1rem;">
                ${quiz.questions.map((q, idx) => {
                    const studentAnsIdx = sub.answers[idx];
                    const correctAnsIdx = q.correctIndex;
                    const isCorrect = studentAnsIdx === correctAnsIdx;
                    
                    return `
                    <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-md); background-color: ${isCorrect ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)'}">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight:700; color:var(--text-muted)">Soal #${idx + 1} (${q.type || 'text'})</span>
                            <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
                                ${isCorrect ? 'Benar' : 'Salah'}
                            </span>
                        </div>
                        <p style="font-weight:600; margin-bottom:0.75rem;">${q.question}</p>
                        <div style="font-size:0.85rem; color:var(--text-muted)">
                            <div style="margin-bottom:0.25rem;">
                                ❌ Jawaban Siswa: <span style="font-weight:700; color:${isCorrect ? 'var(--success-color)' : 'var(--danger-color)'}">${studentAnsIdx === -1 ? 'Dilewati' : String.fromCharCode(65 + studentAnsIdx) + '. ' + q.options[studentAnsIdx]}</span>
                            </div>
                            <div>
                                ✅ Kunci Jawaban: <span style="font-weight:700; color:var(--success-color)">${String.fromCharCode(65 + correctAnsIdx)}. ${q.options[correctAnsIdx]}</span>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    },

    // 10. Siswa Dashboard Layout Wrapper
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
                        <span class="user-role">Siswa</span>
                    </div>
                </div>
                
                <ul class="sidebar-menu">
                    <li class="menu-item ${activeTab === 'overview' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('overview')">
                            <i class="fa-solid fa-house"></i> Dashboard
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'materials' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('materials')">
                            <i class="fa-solid fa-book"></i> LKP / Materi Ajar
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'exercises' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('exercises')">
                            <i class="fa-solid fa-clipboard-question"></i> Latihan Mandiri
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'quizzes' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('quizzes')">
                            <i class="fa-solid fa-hourglass-half"></i> Kuis Ujian
                        </a>
                    </li>
                    <li class="menu-item ${activeTab === 'grades' ? 'active' : ''}">
                        <a onclick="App.navigateStudent('grades')">
                            <i class="fa-solid fa-square-poll-vertical"></i> Nilai & Review AI
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
                    <div class="navbar-actions">
                        <div class="nav-notification">
                            <i class="fa-regular fa-bell"></i>
                            <span class="notification-badge" style="background-color: var(--primary-color);">1</span>
                        </div>
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

    // 11. Siswa Subview: Overview
    studentOverview: () => {
        const user = DataStore.getCurrentUser();
        const mats = DataStore.getMaterials();
        const readCount = mats.filter(m => m.readBy.includes(user.id)).length;
        const totalMats = mats.length;
        const progressPercent = totalMats ? Math.round((readCount / totalMats) * 100) : 0;
        
        const subs = DataStore.getStudentSubmissions(user.id);
        const avgScore = subs.length ? Math.round(subs.reduce((acc, curr) => acc + curr.score, 0) / subs.length) : 0;
        
        return `
        <div>
            <div style="background-color: var(--primary-color); color: var(--text-white); padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; overflow: hidden; position: relative;">
                <div style="z-index: 10; max-width: 60%">
                    <h2 style="font-size:1.8rem; font-weight:800; margin-bottom:0.5rem">Semangat Belajar, ${user.name}! 🚀</h2>
                    <p style="font-size:0.95rem; opacity: 0.9;">Tingkatkan prestasimu hari ini dengan menyelesaikan materi pembelajaran, mengambil latihan soal, dan periksa ulasan asisten AI.</p>
                </div>
                <div class="animate-float" style="font-size: 5.5rem; opacity: 0.15; position: absolute; right: 2rem; top: 1rem; pointer-events: none;">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Materi Selesai Dibaca</h4>
                        <p>${readCount} / ${totalMats}</p>
                        <div style="width:100%; background-color:var(--border-color); height:6px; border-radius:3px; margin-top:8px; overflow:hidden;">
                            <div style="width:${progressPercent}%; background-color:var(--primary-color); height:100%;"></div>
                        </div>
                    </div>
                    <div class="stat-icon primary">
                        <i class="fa-solid fa-book-open"></i>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Kuis Diikuti</h4>
                        <p>${subs.length}</p>
                    </div>
                    <div class="stat-icon secondary">
                        <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Rata-Rata Nilai Kuis</h4>
                        <p>${avgScore}%</p>
                    </div>
                    <div class="stat-icon success">
                        <i class="fa-solid fa-award"></i>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-row">
                <!-- AI Recommendations -->
                <div class="content-card">
                    <div class="card-header-flex">
                        <h3>🤖 Rekomendasi Belajar AI</h3>
                    </div>
                    <div class="ai-review-card" style="border: 1px solid #c084fc; background: linear-gradient(to right bottom, #faf5ff, #f3e8ff);">
                        <div class="ai-typing-effect">
                            <h4>Halo ${user.name}! Berikut fokus belajarmu hari ini:</h4>
                            ${subs.length === 0 ? `
                                <p>Selamat datang di EduSmart! Cobalah ikuti <strong>"Kuis Interaktif: Visual & Ketangkasan Game"</strong> untuk merasakan pengalaman belajar baru dengan gambar, video, dan mini-game.</p>
                            ` : `
                                <p>Berdasarkan analisis hasil kuis terakhirmu dengan rata-rata nilai <strong>${avgScore}%</strong>, sistem merekomendasikan:</p>
                                <ul>
                                    <li>Lakukan latihan soal secara berkala pada mata pelajaran yang memiliki nilai terendah.</li>
                                    <li>Perhatikan detail visual pada soal diagram organ pencernaan.</li>
                                </ul>
                            `}
                        </div>
                    </div>
                </div>
                
                <!-- Recent Quiz Scores -->
                <div class="content-card">
                    <div class="card-header-flex">
                        <h3>Riwayat Skor</h3>
                    </div>
                    <ul class="custom-list">
                        ${subs.length === 0 ? '<li class="list-item">Belum ada ujian yang diselesaikan.</li>' : 
                          subs.slice(0, 3).map(sub => {
                              const quiz = DataStore.getQuiz(sub.quizId) || {};
                              return `
                                <li class="list-item">
                                    <div class="list-item-info">
                                        <div class="list-item-icon" style="background-color: var(--success-light); color: var(--success-color)">
                                            <i class="fa-solid fa-circle-check"></i>
                                        </div>
                                        <div class="list-item-text">
                                            <h5>${quiz.title || 'Kuis'}</h5>
                                            <p>Skor: <strong>${sub.score} / 100</strong></p>
                                        </div>
                                    </div>
                                    <button class="btn btn-secondary" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;" onclick="App.navigateStudent('grades')">Review AI</button>
                                </li>
                              `;
                          }).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `;
    },

    // 12. Siswa Subview: Daftar LKP / Materi Ajar
    studentMaterials: () => {
        const user = DataStore.getCurrentUser();
        const mats = DataStore.getMaterials();
        
        return `
        <div>
            <h2>Bahan Ajar & Lembar Kerja Peserta Didik (LKPD)</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Silakan baca materi di bawah ini untuk mempersiapkan diri sebelum kuis.</p>
            
            <div class="learning-grid">
                ${mats.length === 0 ? `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">Belum ada materi pelajaran yang dipublikasikan oleh Guru.</div>` : 
                  mats.map(m => {
                      const isRead = m.readBy.includes(user.id);
                      return `
                        <div class="learning-card">
                            <div class="card-banner">
                                <span class="card-banner-subject">${DataStore.getSubjectName(m.subjectId)}</span>
                            </div>
                            <div class="learning-card-body">
                                <h4>${m.title}</h4>
                                <p>${m.description}</p>
                                <button class="btn btn-primary" onclick="App.openReadMaterial('${m.id}')" style="margin-top: auto; font-size: 0.9rem; padding: 0.6rem;">
                                    Buka & Baca Materi
                                </button>
                            </div>
                            <div class="learning-card-footer">
                                <span>Oleh: ${m.author}</span>
                                ${isRead ? `
                                    <span class="read-status"><i class="fa-solid fa-circle-check"></i> Selesai</span>
                                ` : `
                                    <span style="color: var(--text-muted); font-weight:600;"><i class="fa-regular fa-circle"></i> Belum dibaca</span>
                                `}
                            </div>
                        </div>
                      `;
                  }).join('')}
            </div>
            
            <!-- Modal Membaca Materi -->
            <div id="read-material-modal" class="modal-overlay">
                <div class="modal-card" style="max-width: 800px; width:95%">
                    <div class="modal-header">
                        <span id="read-subj-badge" class="badge badge-primary">Subjek</span>
                        <button class="modal-close-btn" onclick="App.closeModal('read-material-modal')">&times;</button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh;">
                        <h2 id="read-title" style="margin-bottom: 0.5rem; font-size: 1.8rem;">Judul</h2>
                        <div id="read-author" style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1.5rem">Oleh: Guru</div>
                        <div id="read-content" class="material-body">
                            Konten...
                        </div>
                    </div>
                    <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size: 0.85rem; color: var(--text-muted)">EduSmart e-Learning</span>
                        <div style="display:flex; gap:0.5rem">
                            <button type="button" class="btn btn-secondary" onclick="App.closeModal('read-material-modal')">Tutup</button>
                            <button type="button" id="btn-mark-read" class="btn btn-success">
                                <i class="fa-solid fa-circle-check"></i> Tandai Selesai Dibaca
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // 13. Siswa Subview: Daftar Latihan Soal
    studentExercises: () => {
        const exs = DataStore.getExercises();
        
        return `
        <div>
            <h2>Latihan Soal Mandiri</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Uji kemampuan Anda berulang kali dengan kunci jawaban & penjelasan instan.</p>
            
            <div class="learning-grid">
                ${exs.length === 0 ? `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">Belum ada latihan soal tersedia saat ini.</div>` : 
                  exs.map(e => `
                    <div class="learning-card">
                        <div class="card-banner" style="background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)">
                            <span class="card-banner-subject">${DataStore.getSubjectName(e.subjectId)}</span>
                        </div>
                        <div class="learning-card-body">
                            <h4>${e.title}</h4>
                            <p>${e.description}</p>
                            <button class="btn btn-primary" onclick="App.startExercise('${e.id}')" style="margin-top: auto; font-size: 0.9rem; padding: 0.6rem; background-color: var(--secondary-color)">
                                Mulai Latihan <i class="fa-solid fa-circle-play"></i>
                            </button>
                        </div>
                        <div class="learning-card-footer">
                            <span>Kuis Mandiri</span>
                            <span style="font-weight: 600; color: var(--secondary-color)">${e.questions.length} Soal</span>
                        </div>
                    </div>
                  `).join('')}
            </div>
        </div>
        `;
    },

    // 14. Siswa Subview: Daftar Kuis Ujian Resmi
    studentQuizzes: () => {
        const qzs = DataStore.getQuizzes();
        const user = DataStore.getCurrentUser();
        const subs = DataStore.getStudentSubmissions(user.id);
        
        return `
        <div>
            <h2>Kuis & Ujian Resmi</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Ujian terjadwal dengan batas waktu pengerjaan. Nilai terekam otomatis di sistem guru.</p>
            
            <div class="learning-grid">
                ${qzs.length === 0 ? `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">Belum ada kuis ujian resmi.</div>` : 
                  qzs.map(q => {
                      const submission = subs.find(s => s.quizId === q.id);
                      
                      return `
                        <div class="learning-card">
                            <div class="card-banner" style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%)">
                                <span class="card-banner-subject">${DataStore.getSubjectName(q.subjectId)}</span>
                            </div>
                            <div class="learning-card-body">
                                <h4>${q.title}</h4>
                                <p>${q.description}</p>
                                
                                ${submission ? `
                                    <div style="background-color: var(--success-light); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center; margin-top: auto; color: var(--success-color); font-weight:700; font-size:0.9rem">
                                        Sudah Dikerjakan (Skor: ${submission.score})
                                    </div>
                                ` : `
                                    <button class="btn btn-success" onclick="App.startQuiz('${q.id}')" style="margin-top: auto; font-size: 0.9rem; padding: 0.6rem; width:100%">
                                        Mulai Ujian <i class="fa-solid fa-pencil"></i>
                                    </button>
                                `}
                            </div>
                            <div class="learning-card-footer">
                                <span><i class="fa-regular fa-clock"></i> ${q.duration} Menit</span>
                                <span style="font-weight: 600; color: var(--success-color)">${q.questions.length} Soal</span>
                            </div>
                        </div>
                      `;
                  }).join('')}
            </div>
        </div>
        `;
    },

    // 15. Siswa Subview: Riwayat Nilai & Laporan AI
    studentGrades: () => {
        const user = DataStore.getCurrentUser();
        const subs = DataStore.getStudentSubmissions(user.id);
        
        return `
        <div>
            <h2>Buku Nilai Siswa & Review AI</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Lihat ulasan mendalam, penjelasan kesalahan, dan tips belajar pribadi dari Asisten AI.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem;">
                <!-- Left panel: List of completed quizzes -->
                <div class="content-card" style="padding: 1rem;">
                    <h3 style="margin-bottom: 1rem; font-size: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Daftar Ujian Anda</h3>
                    <ul class="custom-list" id="student-subs-list">
                        ${subs.length === 0 ? '<li class="list-item">Belum ada kuis yang dikerjakan.</li>' : 
                          subs.map(s => {
                              const quiz = DataStore.getQuiz(s.quizId) || {};
                              const isChecked = s.status === 'selesai_diperiksa';
                              return `
                                <li class="list-item" style="cursor: pointer; ${isChecked ? 'border-left: 4px solid var(--success-color);' : 'border-left: 4px solid var(--warning-color);'}" onclick="App.showStudentSubmissionDetails('${s.id}')">
                                    <div class="list-item-info">
                                        <div class="list-item-icon">
                                            <i class="fa-solid fa-file-invoice"></i>
                                        </div>
                                        <div class="list-item-text">
                                            <h5 style="font-size:0.85rem">${quiz.title || 'Kuis'}</h5>
                                            <p>Skor: <strong>${s.score}</strong> | ${new Date(s.completedAt).toLocaleDateString('id-ID')}</p>
                                            <span style="font-size:0.65rem; font-weight:700; color:${isChecked ? 'var(--success-color)' : 'var(--warning-color)'}">
                                                ${isChecked ? '● Selesai Diperiksa' : '○ Menunggu Diperiksa'}
                                            </span>
                                        </div>
                                    </div>
                                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted)"></i>
                                </li>
                              `;
                          }).join('')}
                    </ul>
                </div>
                
                <!-- Right panel: Interactive AI Review detail -->
                <div class="content-card" id="student-ai-review-panel">
                    <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                        <i class="fa-solid fa-robot" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                        <h4>Pilih Ujian di Sebelah Kiri</h4>
                        <p style="font-size:0.85rem">Pilih riwayat kuis Anda untuk menampilkan rincian jawaban, evaluasi guru, dan ulasan AI Tutor.</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Detailed Review for a selected student submission (shown inside the student's dashboard)
    studentSubmissionDetail: (sub, quiz) => {
        const isChecked = sub.status === 'selesai_diperiksa';
        
        if (!isChecked) {
            return `
            <div class="animate-fade-in" style="text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                <div style="font-size: 3.5rem; color: var(--warning-color); margin-bottom: 1.5rem; animation: pulseBorder 2s infinite;">
                    <i class="fa-regular fa-clock"></i>
                </div>
                <h3 style="color: var(--text-main); font-weight: 800; margin-bottom: 0.5rem;">Kuis Sedang Diperiksa</h3>
                <p style="font-size:0.9rem; line-height: 1.5;">Ujian <strong>${quiz.title}</strong> berhasil dikirim dengan skor awal: <strong>${sub.score} / 100</strong>.</p>
                <p style="font-size:0.85rem; margin-top:1rem; padding:0.75rem; background-color:var(--bg-main); border-radius:var(--radius-sm); border: 1px dashed var(--border-color);">
                    💡 Catatan perbaikan dari Guru serta Analisis AI Tutor sedang ditangguhkan. Fitur ini akan aktif setelah Guru selesai memeriksa lembar ujian ini.
                </p>
            </div>
            `;
        }
        
        return `
        <div class="animate-fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem; margin-bottom:1.5rem">
                <h3>Hasil Ujian: ${quiz.title}</h3>
                <span class="badge badge-success" style="font-size:0.9rem; padding:0.4rem 0.80rem; font-weight:700">Skor: ${sub.score} / 100</span>
            </div>
            
            <!-- Box Catatan Guru -->
            <div class="teacher-notes-box" style="background-color: #f0fdf4; border-left: 4px solid var(--success-color); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; border: 1.5px solid #d1fae5;">
                <h5 style="color:#065f46; font-size:0.8rem; text-transform:uppercase; font-weight:700; margin-bottom:0.35rem;"><i class="fa-solid fa-comment-dots"></i> Catatan Koreksi Guru</h5>
                <p style="font-style: italic; color: #047857; font-size:0.95rem; line-height:1.5;">"${sub.teacherNotes || 'Bagus! Pelajari kembali materi yang salah.'}"</p>
            </div>
            
            <!-- AI Review Panel -->
            <div class="ai-review-card" style="margin-bottom: 2rem;">
                <span class="ai-badge" style="margin-bottom:1rem;">
                    <i class="fa-solid fa-robot"></i> Laporan Analisis AI Tutor
                </span>
                <div class="ai-review-content" style="color: #4c1d95;">
                    ${sub.aiReview}
                </div>
            </div>
            
            <h4 style="margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px dashed var(--border-color);">Kunci Jawaban & Koreksi Soal</h4>
            <div style="display:flex; flex-direction:column; gap:1rem;">
                ${quiz.questions.map((q, idx) => {
                    const studentAnsIdx = sub.answers[idx];
                    const correctAnsIdx = q.correctIndex;
                    const isCorrect = studentAnsIdx === correctAnsIdx;
                    
                    return `
                    <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-md); background-color: ${isCorrect ? 'rgba(16, 185, 129, 0.01)' : 'rgba(239, 68, 68, 0.01)'}">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem">
                            <span style="font-weight:700; font-size:0.85rem; color:var(--text-muted)">Soal ${idx + 1} (${q.type || 'text'})</span>
                            <span style="font-size:0.75rem; font-weight:600; color: ${isCorrect ? 'var(--success-color)' : 'var(--danger-color)'}">
                                ${isCorrect ? '✅ Benar' : '❌ Salah'}
                            </span>
                        </div>
                        <p style="font-weight:600; font-size:0.95rem; margin-bottom:0.75rem">${q.question}</p>
                        <div style="font-size:0.85rem; padding-left:0.5rem">
                            <div style="margin-bottom:0.2rem">Jawaban Anda: <strong style="color:${isCorrect ? 'var(--success-color)' : 'var(--danger-color)'}">${studentAnsIdx === -1 ? 'Dilewati' : String.fromCharCode(65 + studentAnsIdx) + '. ' + q.options[studentAnsIdx]}</strong></div>
                            ${!isCorrect ? `<div>Kunci Jawaban: <strong style="color:var(--success-color)">${String.fromCharCode(65 + correctAnsIdx)}. ${q.options[correctAnsIdx]}</strong></div>` : ''}
                        </div>
                        ${q.explanation ? `
                            <div style="background-color: var(--bg-main); font-size: 0.8rem; padding: 0.5rem; border-radius:var(--radius-sm); margin-top: 0.75rem; border-left:3px solid var(--primary-color)">
                                <strong>Bahasan:</strong> ${q.explanation}
                            </div>
                        ` : ''}
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    },

    // 16. Practice Exam Interface (Latihan Soal)
    exercisePlay: (exercise, qIndex, answers, showFeedback) => {
        const q = exercise.questions[qIndex];
        const total = exercise.questions.length;
        const studentAnswerIdx = answers[qIndex];
        
        return `
        <div class="animate-fade-in" style="max-width:900px; margin: 0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
                <div>
                    <h2 style="font-size:1.4rem;">${exercise.title}</h2>
                    <p style="color:var(--text-muted); font-size:0.85rem;"><i class="fa-solid fa-clipboard-question"></i> Mode Latihan Belajar Mandiri</p>
                </div>
                <button class="btn btn-secondary" onclick="App.confirmExitPlayMode()">
                    <i class="fa-solid fa-xmark"></i> Keluar Latihan
                </button>
            </div>
            
            <div class="exam-layout">
                <!-- Left panel: Question -->
                <div class="question-panel">
                    <div class="question-header">
                        <span class="question-number">Pertanyaan ${qIndex + 1} dari ${total}</span>
                        <span class="badge badge-primary">Latihan Mandiri</span>
                    </div>
                    
                    <!-- Render media content (diagram/video/game) -->
                    ${Views.renderQuestionMedia(q)}
                    
                    <div class="question-text">
                        ${q.question}
                    </div>
                    
                    <div class="options-list">
                        ${q.options.map((opt, oIdx) => {
                            let optionClass = '';
                            if (studentAnswerIdx === oIdx) {
                                optionClass = 'selected';
                            }
                            
                            if (showFeedback) {
                                if (oIdx === q.correctIndex) {
                                    optionClass = 'correct';
                                } else if (studentAnswerIdx === oIdx) {
                                    optionClass = 'wrong';
                                }
                            }
                            
                            const clickHandler = showFeedback ? '' : `onclick="App.selectExerciseOption(${oIdx})"`;
                            
                            return `
                            <div class="option-item ${optionClass}" ${clickHandler}>
                                <div class="option-prefix">${String.fromCharCode(65 + oIdx)}</div>
                                <div>${opt}</div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                    
                    ${showFeedback && q.explanation ? `
                        <div class="practice-explanation animate-fade-in">
                            <strong><i class="fa-solid fa-circle-info"></i> Pembahasan Soal:</strong>
                            <p>${q.explanation}</p>
                        </div>
                    ` : ''}
                    
                    <!-- Action Buttons -->
                    <div style="display:flex; justify-content:space-between; margin-top:1.5rem">
                        <button class="btn btn-secondary" onclick="App.prevExerciseQuestion()" ${qIndex === 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-arrow-left"></i> Sebelumnya
                        </button>
                        
                        ${!showFeedback && studentAnswerIdx !== undefined ? `
                            <button class="btn btn-success" onclick="App.checkExerciseAnswer()">
                                Periksa Jawaban <i class="fa-solid fa-circle-check"></i>
                            </button>
                        ` : ''}
                        
                        ${showFeedback || studentAnswerIdx === undefined ? `
                            ${qIndex + 1 < total ? `
                                <button class="btn btn-primary" onclick="App.nextExerciseQuestion()">
                                    Lanjut <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            ` : `
                                <button class="btn btn-success" onclick="App.finishExercise()">
                                    Selesai Latihan <i class="fa-solid fa-flag-checkered"></i>
                                </button>
                            `}
                        ` : ''}
                    </div>
                </div>
                
                <!-- Right panel: Navigation Grid -->
                <div class="nav-panel">
                    <h4>Navigasi Soal</h4>
                    <div class="question-grid">
                        ${exercise.questions.map((_, idx) => {
                            let statusClass = '';
                            if (answers[idx] !== undefined) {
                                statusClass = 'answered';
                            }
                            if (idx === qIndex) {
                                statusClass += ' active';
                            }
                            return `
                            <button class="q-grid-btn ${statusClass}" onclick="App.jumpToExerciseQuestion(${idx})">
                                ${idx + 1}
                            </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // 17. Quiz Exam Interface (Ujian Resmi)
    quizPlay: (quiz, qIndex, answers, timeLeftString) => {
        const q = quiz.questions[qIndex];
        const total = quiz.questions.length;
        const studentAnswerIdx = answers[qIndex];
        
        return `
        <div class="animate-fade-in" style="max-width:900px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
                <div>
                    <h2 style="font-size:1.4rem;">${quiz.title}</h2>
                    <p style="color:var(--text-muted); font-size:0.85rem;"><i class="fa-solid fa-clock"></i> Kuis Ujian Resmi - Waktu Berjalan</p>
                </div>
                <div class="exam-timer" id="quiz-countdown">
                    <i class="fa-regular fa-clock animate-float"></i> ${timeLeftString}
                </div>
            </div>
            
            <div class="exam-layout">
                <!-- Left panel: Question -->
                <div class="question-panel">
                    <div class="question-header">
                        <span class="question-number">Soal ${qIndex + 1} dari ${total}</span>
                        <span class="badge badge-danger">Ujian Resmi</span>
                    </div>
                    
                    <!-- Render media content (diagram/video/game) -->
                    ${Views.renderQuestionMedia(q)}
                    
                    <div class="question-text">
                        ${q.question}
                    </div>
                    
                    <div class="options-list">
                        ${q.options.map((opt, oIdx) => {
                            const isGame = q.type === 'game';
                            const optionClass = studentAnswerIdx === oIdx ? 'selected' : '';
                            const clickHandler = isGame ? `style="opacity:0.8; cursor:not-allowed;" title="Harap mainkan game di atas untuk menjawab!"` : `onclick="App.selectQuizOption(${oIdx})"`;
                            
                            return `
                            <div class="option-item ${optionClass}" ${clickHandler}>
                                <div class="option-prefix">${String.fromCharCode(65 + oIdx)}</div>
                                <div>${opt}</div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="display:flex; justify-content:space-between; margin-top:2rem">
                        <button class="btn btn-secondary" onclick="App.prevQuizQuestion()" ${qIndex === 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-arrow-left"></i> Sebelumnya
                        </button>
                        
                        ${qIndex + 1 < total ? `
                            <button class="btn btn-primary" onclick="App.nextQuizQuestion()">
                                Selanjutnya <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        ` : `
                            <button class="btn btn-success" onclick="App.confirmSubmitQuiz()">
                                Kumpulkan Jawaban <i class="fa-solid fa-file-export"></i>
                            </button>
                        `}
                    </div>
                </div>
                
                <!-- Right panel: Navigation Grid -->
                <div class="nav-panel">
                    <h4>Daftar Lembar</h4>
                    <div class="question-grid" style="margin-bottom: 1.5rem;">
                        ${quiz.questions.map((_, idx) => {
                            let statusClass = answers[idx] !== undefined ? 'answered' : '';
                            if (idx === qIndex) {
                                statusClass += ' active';
                            }
                            return `
                            <button class="q-grid-btn ${statusClass}" onclick="App.jumpToQuizQuestion(${idx})">
                                ${idx + 1}
                            </button>
                            `;
                        }).join('')}
                    </div>
                    <button class="btn btn-success btn-block" onclick="App.confirmSubmitQuiz()">
                        Kumpul Sekarang
                    </button>
                </div>
            </div>
        </div>
        `;
    },

    // 18. Quiz Results (Clean Scorecard, NO instant AI Review)
    quizResult: (quiz, score, correctCount, totalCount, submissionId) => {
        return `
        <div class="animate-fade-in" style="max-width: 650px; margin: 0 auto; padding-bottom: 3rem;">
            <div class="results-card" style="padding: 2.5rem 2rem;">
                <div style="font-size: 3.5rem; color: var(--primary-color); margin-bottom: 1rem;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2>Ujian Berhasil Dikirim!</h2>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Jawaban Anda telah aman disimpan dalam database local platform.</p>
                
                <!-- Score Circle -->
                <div class="score-circle">
                    <span class="score-number">${score}</span>
                    <span class="score-label">SKOR ANDA</span>
                </div>
                
                <!-- Stats Box -->
                <div class="results-stats" style="margin-bottom: 1.5rem;">
                    <div class="result-stat-item">
                        <h6>Total Soal</h6>
                        <p>${totalCount}</p>
                    </div>
                    <div class="result-stat-item" style="color: var(--success-color)">
                        <h6>Benar</h6>
                        <p>${correctCount}</p>
                    </div>
                    <div class="result-stat-item" style="color: var(--danger-color)">
                        <h6>Salah/Kosong</h6>
                        <p>${totalCount - correctCount}</p>
                    </div>
                </div>

                <!-- Delayed AI / Teacher Notice Box -->
                <div style="background-color: var(--bg-main); border:1.5px dashed var(--border-color); padding: 1.25rem; border-radius: var(--radius-md); font-size:0.85rem; color:var(--text-muted); text-align:left; margin-bottom: 2rem; line-height:1.5;">
                    <p style="font-weight:700; color:var(--text-main); margin-bottom:0.35rem; display:flex; align-items:center; gap:0.35rem;">
                        <i class="fa-solid fa-user-clock" style="color:var(--warning-color)"></i> Menunggu Evaluasi Guru
                    </p>
                    Ulasan analisis **AI Tutor** dan **kunci jawaban lengkap** ditangguhkan sementara demi keamanan akademis. Silakan minta Guru Anda untuk memeriksa ujian ini di Portal Guru. Ulasan AI dan catatan Guru akan langsung rilis di tab <strong>"Nilai & Review AI"</strong> Anda setelah diperiksa.
                </div>
                
                <div style="display:flex; justify-content:center; gap: 1rem;">
                    <button class="btn btn-secondary" onclick="App.navigateStudent('overview')">
                        <i class="fa-solid fa-house"></i> Ke Beranda
                    </button>
                    <button class="btn btn-primary" onclick="App.navigateStudent('grades')">
                        <i class="fa-solid fa-square-poll-vertical"></i> Buka Buku Nilai <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }
};
