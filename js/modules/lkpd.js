/**
 * EduSmart Module: LKPD (Lembar Kerja Peserta Didik)
 */

const LKPDModule = {
    // Views
    renderStudentView: () => {
        const user = DataStore.getCurrentUser();
        const filter = App.state.studentSubjectFilter || '';
        const lkpds = DataStore.getLKPDs().filter(item => !filter || item.subjectId === filter);
        const subs = DataStore.getStudentSubmissions(user.id);

        return `
        <div>
            <h2><i class="fa-solid fa-file-signature"></i> 1. LKPD (Lembar Kerja Peserta Didik)</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Kirimkan jawaban Anda berupa <b>Teks</b> atau <b>Unggah Foto</b>. AI akan mengoreksi tiap soal secara langsung.</p>
            <select class="form-control" style="max-width:280px; margin-bottom:1.25rem;" onchange="App.setStudentSubjectFilter(this.value)">
                <option value="">Semua Mata Pelajaran</option>
                ${DataStore.getSubjects().map(subject => `<option value="${subject.id}" ${filter === subject.id ? 'selected' : ''}>${subject.name}</option>`).join('')}
            </select>

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
        const subjectId = DataStore.getTeacherSubjectId();
        const lkpds = DataStore.getLKPDs().filter(item => !subjectId || item.subjectId === subjectId);
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
                    <option value="${DataStore.getTeacherSubjectId()}" selected>${DataStore.getTeacherSubjectName()}</option>
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
            ${App.questionBuilderFields('lkpd')}
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
        const questions = App.getQuestionFormData('lkpd');
        if (questions.some(question => !question.questionText || (question.questionType === 'pilihan-ganda' && (question.options.length < 2 || !question.correctAnswer)))) {
            App.showToast('Isi minimal dua opsi dan pilih kunci jawaban.', 'error');
            return;
        }

        DataStore.addLKPD(subj, title, desc, questions);
        App.showToast('LKPD Baru berhasil dibuat!', 'success');
        App.closeModal();
        App.render();
    }
};
