/**
 * EduSmart Module: Latihan Soal (with KKM)
 */

const ExerciseModule = {
    renderStudentView: () => {
        const user = DataStore.getCurrentUser();
        const exercises = DataStore.getExercises();
        const subs = DataStore.getStudentSubmissions(user.id);

        return `
        <div>
            <h2><i class="fa-solid fa-list-check"></i> 2. Latihan Soal (dengan KKM)</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Jika nilai akhir Anda berada di bawah KKM, sistem akan merujuk Anda ke <b>Modul Remedial</b>.</p>

            <div class="grid-cards">
                ${exercises.map(e => {
                    const sub = subs.find(s => s.moduleId === e.id && s.moduleType === 'exercise');
                    const kkm = e.kkm || 75;
                    const isBelowKKM = sub && sub.overallScore < kkm;

                    return `
                    <div class="content-card" style="${isBelowKKM ? 'border:2px solid var(--danger-color);' : ''}">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <span class="badge badge-secondary">${DataStore.getSubjectName(e.subjectId)}</span>
                            <span class="badge badge-warning" style="font-weight:700;">KKM: ${kkm}</span>
                        </div>
                        <h3 style="margin: 0.75rem 0 0.5rem 0;">${e.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">${e.description}</p>
                        
                        ${sub ? `
                        <div style="margin-bottom:1rem; padding:0.75rem; background:var(--bg-main); border-radius:var(--radius-md);">
                            <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
                                <span>Nilai Anda:</span>
                                <span style="color:${isBelowKKM ? 'var(--danger-color)' : 'var(--success-color)'}; font-size:1.1rem">${sub.overallScore} / 100</span>
                            </div>
                            ${isBelowKKM ? `
                            <div style="color:var(--danger-color); font-size:0.8rem; font-weight:600;">
                                ⚠️ Nilai di bawah KKM (${sub.overallScore} &lt; ${kkm}). Remedial Otomatis Terbuka!
                            </div>
                            ` : `
                            <div style="color:var(--success-color); font-size:0.8rem; font-weight:600;">
                                ✅ Selamat! Anda Tuntas KKM (${sub.overallScore} &ge; ${kkm}).
                            </div>
                            `}
                        </div>
                        ` : ''}

                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <button class="btn btn-primary" onclick="App.startPlayModule('exercise', '${e.id}')">
                                <i class="fa-solid fa-pen-to-square"></i> ${sub ? 'Kerjakan Ulang' : 'Mulai Latihan'}
                            </button>
                            ${isBelowKKM ? `
                            <button class="btn btn-warning" onclick="App.navigateStudent('remedial')">
                                <i class="fa-solid fa-wrench"></i> Buka Remedial
                            </button>
                            ` : ''}
                            ${sub ? `
                            <button class="btn btn-outline" onclick="App.downloadPDFReport('${sub.id}')">
                                <i class="fa-solid fa-download"></i> PDF
                            </button>` : ''}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    },

    renderTeacherView: () => {
        const exercises = DataStore.getExercises();
        return `
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h2><i class="fa-solid fa-list-check"></i> Manajemen Latihan Soal & KKM</h2>
                    <p style="color:var(--text-muted);">Tentukan KKM untuk masing-masing latihan soal. Siswa bernilai &lt; KKM akan dirujuk ke Remedial.</p>
                </div>
                <button class="btn btn-primary" onclick="ExerciseModule.openCreateModal()">
                    <i class="fa-solid fa-plus"></i> Buat Latihan Soal
                </button>
            </div>

            <div class="grid-cards">
                ${exercises.map(e => `
                <div class="content-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <span class="badge badge-secondary">${DataStore.getSubjectName(e.subjectId)}</span>
                        <span class="badge badge-warning" style="font-weight:700;">KKM: ${e.kkm || 75}</span>
                    </div>
                    <h3 style="margin: 0.75rem 0 0.5rem 0;">${e.title}</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">${e.description}</p>
                    <div style="font-size:0.8rem; color:var(--danger-color); font-weight:600;">
                        <i class="fa-solid fa-triangle-exclamation"></i> Terkoneksi Otomatis ke Modul Remedial (Nilai &lt; ${e.kkm || 75})
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    openCreateModal: () => {
        const content = `
        <form onsubmit="ExerciseModule.handleCreate(event)">
            <div class="form-group">
                <label>Mata Pelajaran</label>
                <select id="ex-subj" class="form-control" required>
                    <option value="subj-math">Matematika</option>
                    <option value="subj-science">Ilmu Pengetahuan Alam (IPA)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Judul Latihan Soal</label>
                <input type="text" id="ex-title" class="form-control" placeholder="Contoh: Latihan Operasi Aljabar" required>
            </div>
            <div class="form-group">
                <label>Nilai KKM (Kriteria Ketuntasan Minimal)</label>
                <input type="number" id="ex-kkm" class="form-control" value="75" min="50" max="100" required>
            </div>
            <div class="form-group">
                <label>Deskripsi Latihan</label>
                <textarea id="ex-desc" class="form-control" rows="2" placeholder="Keterangan latihan..." required></textarea>
            </div>
            <div class="form-group">
                <label>Pertanyaan Soal #1</label>
                <textarea id="ex-q1" class="form-control" rows="2" placeholder="Tuliskan pertanyaan latihan..." required></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan Latihan Soal</button>
            </div>
        </form>
        `;
        App.openModal('Buat Latihan Soal Baru', content);
    },

    handleCreate: (event) => {
        event.preventDefault();
        const subj = document.getElementById('ex-subj').value;
        const title = document.getElementById('ex-title').value.trim();
        const kkm = document.getElementById('ex-kkm').value;
        const desc = document.getElementById('ex-desc').value.trim();
        const q1 = document.getElementById('ex-q1').value.trim();

        DataStore.addExercise(subj, title, desc, kkm, [{ questionText: q1 }]);
        App.showToast('Latihan Soal berhasil ditambahkan!', 'success');
        App.closeModal();
        App.render();
    }
};
