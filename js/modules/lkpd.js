/**
 * EduSmart Module: LKPD (Lembar Kerja Peserta Didik)
 */

const LKPDModule = {
    // Views
    renderStudentView: () => {
        const user = DataStore.getCurrentUser();
        const lkpds = DataStore.getLKPDs();
        const subs = DataStore.getStudentSubmissions(user.id);

        return `
        <div>
            <h2><i class="fa-solid fa-file-signature"></i> 1. LKPD (Lembar Kerja Peserta Didik)</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Kirimkan jawaban Anda berupa <b>Teks</b> atau <b>Unggah Foto</b>. AI akan mengoreksi tiap soal secara langsung.</p>

            <div class="grid-cards">
                ${lkpds.map(l => {
                    const sub = subs.find(s => s.moduleId === l.id && s.moduleType === 'lkpd');
                    return `
                    <div class="content-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <span class="badge badge-primary">${DataStore.getSubjectName(l.subjectId)}</span>
                            ${sub ? `<span class="badge badge-success">Skor: ${sub.overallScore}</span>` : '<span class="badge badge-secondary">Belum Diisi</span>'}
                        </div>
                        <h3 style="margin: 0.75rem 0 0.5rem 0;">${l.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">${l.description}</p>
                        
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <button class="btn btn-primary" onclick="App.startPlayModule('lkpd', '${l.id}')">
                                <i class="fa-solid fa-pen-nib"></i> ${sub ? 'Kerjakan Ulang LKPD' : 'Mulai Pengerjaan LKPD'}
                            </button>
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
        const lkpds = DataStore.getLKPDs();
        return `
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h2><i class="fa-solid fa-file-signature"></i> Manajemen LKPD (Lembar Kerja Peserta Didik)</h2>
                    <p style="color:var(--text-muted);">Buat dan kelola lembar kerja eksplorasi mandiri siswa.</p>
                </div>
                <button class="btn btn-primary" onclick="LKPDModule.openCreateModal()">
                    <i class="fa-solid fa-plus"></i> Buat LKPD Baru
                </button>
            </div>

            <div class="grid-cards">
                ${lkpds.map(l => `
                <div class="content-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <span class="badge badge-primary">${DataStore.getSubjectName(l.subjectId)}</span>
                        <span class="badge badge-info">${l.questions.length} Soal</span>
                    </div>
                    <h3 style="margin: 0.75rem 0 0.5rem 0;">${l.title}</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">${l.description}</p>
                    <div style="font-size:0.8rem; color:var(--primary-color); font-weight:600;">
                        <i class="fa-solid fa-robot"></i> Menggunakan Koreksi AI Per-Soal (Teks & Foto)
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    // Creation Modal
    openCreateModal: () => {
        const content = `
        <form onsubmit="LKPDModule.handleCreate(event)">
            <div class="form-group">
                <label>Mata Pelajaran</label>
                <select id="lkpd-subj" class="form-control" required>
                    <option value="subj-math">Matematika</option>
                    <option value="subj-science">Ilmu Pengetahuan Alam (IPA)</option>
                    <option value="subj-english">Bahasa Inggris</option>
                </select>
            </div>
            <div class="form-group">
                <label>Judul LKPD</label>
                <input type="text" id="lkpd-title" class="form-control" placeholder="Contoh: LKPD 3: Model Persamaan" required>
            </div>
            <div class="form-group">
                <label>Deskripsi/Petunjuk</label>
                <textarea id="lkpd-desc" class="form-control" rows="2" placeholder="Petunjuk pengerjaan..." required></textarea>
            </div>
            <div class="form-group">
                <label>Pertanyaan Soal #1</label>
                <textarea id="lkpd-q1" class="form-control" rows="2" placeholder="Tuliskan pertanyaan soal #1..." required></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan LKPD</button>
            </div>
        </form>
        `;
        App.openModal('Buat Paket LKPD Baru', content);
    },

    handleCreate: (event) => {
        event.preventDefault();
        const subj = document.getElementById('lkpd-subj').value;
        const title = document.getElementById('lkpd-title').value.trim();
        const desc = document.getElementById('lkpd-desc').value.trim();
        const q1 = document.getElementById('lkpd-q1').value.trim();

        DataStore.addLKPD(subj, title, desc, [{ questionText: q1 }]);
        App.showToast('LKPD Baru berhasil dibuat!', 'success');
        App.closeModal();
        App.render();
    }
};
