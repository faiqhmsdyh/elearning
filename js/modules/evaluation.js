/**
 * EduSmart Module: Evaluasi Ujian
 */

const EvaluationModule = {
    renderStudentView: () => {
        const user = DataStore.getCurrentUser();
        const filter = App.state.studentSubjectFilter || '';
        const evals = DataStore.getEvaluations().filter(item => !filter || item.subjectId === filter);
        const subs = DataStore.getStudentSubmissions(user.id);

        return `
        <div>
            <h2><i class="fa-solid fa-award"></i> 4. Evaluasi Ujian Akhir</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Modul evaluasi ujian akhir berbasis pengiriman Teks/Foto & Koreksi AI Per-Soal.</p>
            <select class="form-control" style="max-width:280px; margin-bottom:1.25rem;" onchange="App.setStudentSubjectFilter(this.value)">
                <option value="">Semua Mata Pelajaran</option>
                ${DataStore.getSubjects().map(subject => `<option value="${subject.id}" ${filter === subject.id ? 'selected' : ''}>${subject.name}</option>`).join('')}
            </select>

            <div class="grid-cards">
                ${evals.map(ev => {
                    const sub = subs.find(s => s.moduleId === ev.id && s.moduleType === 'evaluasi');
                    return `
                    <div class="content-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <span class="badge badge-primary">${DataStore.getSubjectName(ev.subjectId)}</span>
                            ${sub ? `<span class="badge badge-success">Skor Evaluasi: ${sub.overallScore}</span>` : `<span class="badge badge-secondary">${ev.duration} Menit</span>`}
                        </div>
                        <h3 style="margin: 0.75rem 0 0.5rem 0;">${ev.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">${ev.description}</p>

                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <button class="btn btn-primary" onclick="App.startPlayModule('evaluasi', '${ev.id}')">
                                <i class="fa-solid fa-graduation-cap"></i> ${sub ? 'Kerjakan Ulang Evaluasi' : 'Mulai Evaluasi'}
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
        const evals = DataStore.getEvaluations().filter(item => !subjectId || item.subjectId === subjectId);
        return `
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h2><i class="fa-solid fa-award"></i> Manajemen Evaluasi Ujian</h2>
                    <p style="color:var(--text-muted);">Ujian evaluasi akhir komprehensif.</p>
                </div>
                <button class="btn btn-primary" onclick="EvaluationModule.openCreateModal()">
                    <i class="fa-solid fa-plus"></i> Buat Ujian Evaluasi
                </button>
            </div>

            <div class="grid-cards">
                ${evals.map(ev => `
                <div class="content-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <span class="badge badge-primary">${DataStore.getSubjectName(ev.subjectId)}</span>
                        <span class="badge badge-secondary">${ev.duration} Menit</span>
                    </div>
                    <h3 style="margin: 0.75rem 0 0.5rem 0;">${ev.title}</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">${ev.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    openCreateModal: () => {
        const content = `
        <form onsubmit="EvaluationModule.handleCreate(event)">
            <div class="form-group">
                <label>Mata Pelajaran</label>
                <select id="eval-subj" class="form-control" required>
                    <option value="${DataStore.getTeacherSubjectId()}" selected>${DataStore.getTeacherSubjectName()}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Judul Ujian Evaluasi</label>
                <input type="text" id="eval-title" class="form-control" placeholder="Contoh: Evaluasi Akhir Semester" required>
            </div>
            <div class="form-group">
                <label>Durasi (Menit)</label>
                <input type="number" id="eval-duration" class="form-control" value="30" required>
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea id="eval-desc" class="form-control" rows="2" placeholder="Petunjuk evaluasi..." required></textarea>
            </div>
            ${App.questionBuilderFields('eval')}
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan Evaluasi</button>
            </div>
        </form>
        `;
        App.openModal('Buat Ujian Evaluasi Baru', content);
    },

    handleCreate: (event) => {
        event.preventDefault();
        const subj = document.getElementById('eval-subj').value;
        const title = document.getElementById('eval-title').value.trim();
        const duration = document.getElementById('eval-duration').value;
        const desc = document.getElementById('eval-desc').value.trim();
        const question = App.getQuestionFormData('eval', 'eval-q1');
        if (question.questionType === 'pilihan-ganda' && (question.options.length < 2 || !question.correctAnswer)) {
            App.showToast('Isi minimal dua opsi dan pilih kunci jawaban.', 'error');
            return;
        }

        DataStore.addEvaluation(subj, title, desc, duration, [question]);
        App.showToast('Ujian Evaluasi berhasil ditambahkan!', 'success');
        App.closeModal();
        App.render();
    }
};
