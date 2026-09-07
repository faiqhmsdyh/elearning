/**
 * EduSmart Module: Remedial (Active when Exercise score < KKM)
 */

const RemedialModule = {
    renderStudentView: () => {
        const user = DataStore.getCurrentUser();
        const filter = App.state.studentSubjectFilter || '';
        const remedials = DataStore.getRemedials();
        const exercises = DataStore.getExercises().filter(item => !filter || item.subjectId === filter);
        const subs = DataStore.getStudentSubmissions(user.id);

        const activeRemedialList = [];

        exercises.forEach(ex => {
            const sub = subs.find(s => s.moduleId === ex.id && s.moduleType === 'exercise');
            if (sub && sub.overallScore < (ex.kkm || 75)) {
                const rem = remedials.find(r => r.exerciseId === ex.id) || remedials[0];
                if (rem) {
                    activeRemedialList.push({ exercise: ex, remedial: rem, sub });
                }
            }
        });

        return `
        <div>
            <h2><i class="fa-solid fa-wrench"></i> 3. Program Remedial (Khusus Nilai &lt; KKM)</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Remedial terbuka secara otomatis jika nilai Latihan Soal Anda tidak mencapai KKM.</p>
            <select class="form-control" style="max-width:280px; margin-bottom:1.25rem;" onchange="App.setStudentSubjectFilter(this.value)">
                <option value="">Semua Mata Pelajaran</option>
                ${DataStore.getSubjects().map(subject => `<option value="${subject.id}" ${filter === subject.id ? 'selected' : ''}>${subject.name}</option>`).join('')}
            </select>

            ${activeRemedialList.length === 0 ? `
            <div class="content-card text-center" style="padding: 3rem 1.5rem;">
                <div style="font-size: 3.5rem; color: var(--success-color); margin-bottom: 1rem;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3>Tidak Ada Program Remedial yang Wajib Diketahui!</h3>
                <p style="color:var(--text-muted); max-width:500px; margin:0.5rem auto 1.5rem auto;">
                    Seluruh nilai Latihan Soal Anda saat ini sudah mencapai/melebihi KKM, atau Anda belum mengambil latihan soal.
                </p>
                <button class="btn btn-primary" onclick="App.navigateStudent('exercises')">
                    <i class="fa-solid fa-list-check"></i> Lihat Latihan Soal
                </button>
            </div>
            ` : `
            <div class="grid-cards">
                ${activeRemedialList.map(item => {
                    const remSub = subs.find(s => s.moduleId === item.remedial.id && s.moduleType === 'remedial');
                    return `
                    <div class="content-card" style="border:2px solid var(--warning-color);">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <span class="badge badge-warning">Remedial Wajib</span>
                            <span class="badge badge-danger">Nilai Latihan: ${item.sub.overallScore} (KKM: ${item.exercise.kkm || 75})</span>
                        </div>
                        <h3 style="margin: 0.75rem 0 0.5rem 0;">${item.remedial.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">${item.remedial.description}</p>
                        
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <button class="btn btn-warning" onclick="App.startPlayModule('remedial', '${item.remedial.id}')">
                                <i class="fa-solid fa-play"></i> ${remSub ? 'Kerjakan Ulang Remedial' : 'Mulai Kerjakan Remedial'}
                            </button>
                            ${remSub ? `
                            <button class="btn btn-outline" onclick="App.downloadPDFReport('${remSub.id}')">
                                <i class="fa-solid fa-download"></i> PDF Remedial
                            </button>` : ''}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            `}
        </div>
        `;
    },

    renderTeacherView: () => {
        const subjectId = DataStore.getTeacherSubjectId();
        const remedials = DataStore.getRemedials().filter(item => !subjectId || item.subjectId === subjectId);
        return `
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h2><i class="fa-solid fa-wrench"></i> Program Remedial</h2>
                    <p style="color:var(--text-muted);">Paket soal penguatan yang dibuka khusus bagi siswa dengan nilai di bawah KKM.</p>
                </div>
                <button class="btn btn-primary" onclick="RemedialModule.openCreateModal()">
                    <i class="fa-solid fa-plus"></i> Buat Paket Remedial
                </button>
            </div>

            <div class="grid-cards">
                ${remedials.map(r => `
                <div class="content-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <span class="badge badge-warning">Remedial Active</span>
                        <span class="badge badge-info">${r.questions.length} Soal</span>
                    </div>
                    <h3 style="margin: 0.75rem 0 0.5rem 0;">${r.title}</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">${r.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    openCreateModal: () => {
        const exercises = DataStore.getExercises();
        const content = `
        <form onsubmit="RemedialModule.handleCreate(event)">
            <div class="form-group">
                <label>Pilih Latihan Soal Acuan</label>
                <select id="rem-ex-id" class="form-control" required>
                    ${exercises.map(e => `<option value="${e.id}">${e.title} (KKM: ${e.kkm || 75})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Judul Program Remedial</label>
                <input type="text" id="rem-title" class="form-control" placeholder="Contoh: Remedial Aljabar Dasar" required>
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea id="rem-desc" class="form-control" rows="2" placeholder="Petunjuk remedial..." required></textarea>
            </div>
            ${App.questionBuilderFields('rem')}
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan Remedial</button>
            </div>
        </form>
        `;
        App.openModal('Buat Paket Remedial Baru', content);
    },

    handleCreate: (event) => {
        event.preventDefault();
        const exId = document.getElementById('rem-ex-id').value;
        const title = document.getElementById('rem-title').value.trim();
        const desc = document.getElementById('rem-desc').value.trim();
        const question = App.getQuestionFormData('rem', 'rem-q1');
        if (question.questionType === 'pilihan-ganda' && (question.options.length < 2 || !question.correctAnswer)) {
            App.showToast('Isi minimal dua opsi dan pilih kunci jawaban.', 'error');
            return;
        }

        const ex = DataStore.getExercise(exId);
        DataStore.addRemedial(exId, ex ? ex.subjectId : 'subj-math', title, desc, [question]);
        App.showToast('Paket Remedial berhasil disimpan!', 'success');
        App.closeModal();
        App.render();
    }
};
