/**
 * EduSmart Module: PDF Report & Printable Document Generator
 */

const PDFReportModule = {
    renderPrintableDocument: (submission) => {
        const dateStr = new Date(submission.completedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const module = submission.moduleType === 'lkpd' ? DataStore.getLKPD(submission.moduleId)
            : submission.moduleType === 'exercise' ? DataStore.getExercise(submission.moduleId)
            : submission.moduleType === 'remedial' ? DataStore.getRemedial(submission.moduleId)
            : DataStore.getEvaluation(submission.moduleId);
        const questions = module?.questions || [];
        const isReviewed = submission.status === 'selesai_diperiksa';

        return `
        <div class="print-document">
            <!-- Header Document -->
            <div style="text-align:center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h1 style="font-size:1.6rem; font-weight:800; margin:0; text-transform:uppercase;">EDUSMART E-LEARNING ACADEMY</h1>
                <h2 style="font-size:1.2rem; font-weight:700; margin:0.25rem 0 0 0; color:#333;">LAPORAN HASIL PENGERJAAN</h2>
            </div>

            <!-- Student Info Metadata -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:0.9rem;">
                <tr>
                    <td style="width:18%; font-weight:700; padding:4px 0;">Nama Siswa</td>
                    <td style="width:2%;">:</td>
                    <td style="width:30%; font-weight:700; color:#1e293b;">${submission.studentName}</td>
                    <td style="width:18%; font-weight:700; padding:4px 0;">Modul Ujian</td>
                    <td style="width:2%;">:</td>
                    <td style="width:30%; text-transform:uppercase; font-weight:700;">${submission.moduleType}</td>
                </tr>
                <tr>
                    <td style="font-weight:700; padding:4px 0;">Tanggal Pengerjaan</td>
                    <td>:</td>
                    <td>${dateStr}</td>
                    <td style="font-weight:700; padding:4px 0;">Nilai Guru</td>
                    <td>:</td>
                    <td><strong style="font-size:1.2rem;">${isReviewed ? `${submission.teacherScore ?? submission.overallScore} / 100` : 'Menunggu pemeriksaan'}</strong></td>
                </tr>
                <tr>
                    <td style="font-weight:700; padding:4px 0;">Status KKM</td>
                    <td>:</td>
                    <td colspan="4">
                        <strong style="font-size:0.95rem;">
                            ${isReviewed ? (submission.isBelowKKM ? 'DI BAWAH KKM (Rujukan Remedial)' : 'TUNTAS KKM') : 'MENUNGGU PEMERIKSAAN GURU'}
                        </strong>
                    </td>
                </tr>
            </table>

            <!-- Questions & AI Correction Table -->
            <h3 style="font-size:1.1rem; font-weight:800; border-bottom:1px solid #ddd; padding-bottom:0.35rem; margin-bottom:1rem;">
                Rincian Soal & Jawaban Siswa
            </h3>

            ${(submission.answers || []).map((ans, idx) => {
                const rev = (submission.perQuestionReviews || []).find(r => r.questionId === ans.questionId) || {};
                const question = questions.find(item => item.id === ans.questionId);
                return `
                <div style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem; page-break-inside: avoid;">
                    <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.5rem; color:#1e293b;">
                        <span>Soal #${idx + 1}</span>
                        ${isReviewed && rev.score !== undefined ? `<span>Analisis tambahan: ${rev.score}/100</span>` : ''}
                    </div>

                    ${question?.questionText ? `<div style="font-weight:600; margin-bottom:0.75rem;">${question.questionText}</div>` : ''}

                    <div style="font-weight:600; margin-bottom:0.75rem; color:#334155;">
                        Status Jawaban Siswa: 
                        <span style="border:1px solid #999; padding:2px 8px; font-size:0.8rem;">
                            ${ans.type === 'photo' ? 'Unggah Foto Lembar Kerja' : (question?.questionType === 'pilihan-ganda' ? 'Pilihan Ganda' : 'Uraian')}
                        </span>
                    </div>

                    ${ans.type === 'text' ? `
                    <div style="border:1px solid #ccc; padding:0.75rem; font-size:0.85rem; margin-bottom:0.75rem; color:#222;">
                        <b>Jawaban Siswa:</b><br>${ans.content || '-'}
                    </div>
                    ` : `
                    <div style="border:1px solid #ccc; padding:0.75rem; font-size:0.85rem; margin-bottom:0.75rem;">
                        <b>Lampiran Foto Lembar Kerja Siswa:</b><br>
                        ${ans.photoUrl ? `<img src="${ans.photoUrl}" style="max-height:160px; margin-top:6px; border:1px solid #999;">` : '(Foto Berkas)'}
                    </div>
                    `}

                    ${isReviewed && rev.aiReview ? `<div style="border:1px solid #bbb; padding:0.75rem; font-size:0.85rem; color:#222;"><b>Analisis:</b><br>${rev.aiReview}</div>` : ''}
                </div>
                `;
            }).join('')}

            <!-- Teacher Notes Box -->
            <div style="margin-top:1.5rem; border:1px solid #999; padding:1rem;">
                <h4 style="margin:0 0 0.5rem 0; font-size:0.95rem;">Catatan Guru Pengajar:</h4>
                <p style="margin:0; font-size:0.85rem; color:#222;">
                    ${submission.teacherNotes || 'Belum ada catatan tambahan dari Guru.'}
                </p>
            </div>

            <!-- Signatures Footer -->
            <div style="margin-top: 3rem; display:flex; justify-content:space-between; text-align:center; font-size:0.85rem; page-break-inside:avoid;">
                <div style="width:40%;">
                    <p>Siswa Peserta Didik,</p>
                    <br><br><br>
                    <p style="font-weight:700; text-decoration:underline;">(${submission.studentName})</p>
                </div>
                <div style="width:40%;">
                    <p>Guru Pengampu,</p>
                    <br><br><br>
                    <p style="font-weight:700; text-decoration:underline;">(Bpk. Hermawan, S.Pd.)</p>
                </div>
            </div>
        </div>
        `;
    },

    download: (submissionId) => {
        const sub = DataStore.getSubmission(submissionId);
        if (!sub) {
            App.showToast('Data lembar pengerjaan tidak ditemukan untuk dicetak.', 'error');
            return;
        }

        const printHTML = PDFReportModule.renderPrintableDocument(sub);
        
        const printWindow = window.open('', '_blank', 'width=850,height=900');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Laporan Hasil - ${sub.studentName} (${sub.moduleType.toUpperCase()})</title>
                    <style>
                        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; margin: 2rem; color: #1e293b; }
                        @media print {
                            body { margin: 0; padding: 1rem; }
                            .print-document { page-break-after: always; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-actions">
                        <button type="button" onclick="window.print()">Cetak / Simpan PDF</button>
                    </div>
                    ${printHTML}
                    <style>
                        .print-actions { text-align: right; margin-bottom: 1rem; }
                        .print-actions button { border: 1px solid #333; padding: 0.7rem 1rem; background: #fff; color: #111; font: 600 14px Arial, sans-serif; cursor: pointer; }
                        @media print { .print-actions { display: none; } }
                    </style>
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            App.showToast('Harap izinkan popup browser untuk mengunduh PDF.', 'info');
        }
    }
};
