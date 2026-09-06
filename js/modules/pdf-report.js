/**
 * EduSmart Module: PDF Report & Printable Document Generator
 */

const PDFReportModule = {
    renderPrintableDocument: (submission) => {
        const user = DataStore.getCurrentUser();
        const dateStr = new Date(submission.completedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        return `
        <div class="print-document">
            <!-- Header Document -->
            <div style="text-align:center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h1 style="font-size:1.6rem; font-weight:800; margin:0; text-transform:uppercase;">EDUSMART E-LEARNING ACADEMY</h1>
                <h2 style="font-size:1.2rem; font-weight:700; margin:0.25rem 0 0 0; color:#333;">LEMBAR KOREKSI AI & LAPORAN HASIL PENGERJAAN</h2>
                <p style="font-size:0.85rem; color:#666; margin:0.25rem 0 0 0;">Dokumen Resmi Dikoreksi AI Per-Soal & Verified by Teacher</p>
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
                    <td style="font-weight:700; padding:4px 0;">Skor Akumulasi AI</td>
                    <td>:</td>
                    <td><strong style="font-size:1.2rem; color:#4f46e5;">${submission.overallScore} / 100</strong></td>
                </tr>
                <tr>
                    <td style="font-weight:700; padding:4px 0;">Status KKM</td>
                    <td>:</td>
                    <td colspan="4">
                        <strong style="color:${submission.isBelowKKM ? '#dc2626' : '#16a34a'}; font-size:0.95rem;">
                            ${submission.isBelowKKM ? 'DI BAWAH KKM (Rujukan Remedial Active)' : 'TUNTAS KKM'}
                        </strong>
                    </td>
                </tr>
            </table>

            <!-- Questions & AI Correction Table -->
            <h3 style="font-size:1.1rem; font-weight:800; border-bottom:1px solid #ddd; padding-bottom:0.35rem; margin-bottom:1rem;">
                Rincian Jawaban Siswa & Koreksi AI Per-Soal
            </h3>

            ${(submission.answers || []).map((ans, idx) => {
                const rev = (submission.perQuestionReviews || []).find(r => r.questionId === ans.questionId) || {};
                return `
                <div style="border: 1px solid #ccc; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; page-break-inside: avoid;">
                    <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.5rem; color:#1e293b;">
                        <span>Soal #${idx + 1}</span>
                        <span style="color:#0284c7">Skor AI: ${rev.score || 0}/100</span>
                    </div>

                    <div style="font-weight:600; margin-bottom:0.75rem; color:#334155;">
                        Status Jawaban Siswa: 
                        <span style="background:#e2e8f0; padding:2px 8px; border-radius:4px; font-size:0.8rem;">
                            ${ans.type === 'photo' ? '📷 Unggah Foto Lembar Kerja' : '📝 Teks Uraian'}
                        </span>
                    </div>

                    ${ans.type === 'text' ? `
                    <div style="background:#f8fafc; border-left:3px solid #64748b; padding:0.75rem; font-size:0.85rem; margin-bottom:0.75rem; color:#1e293b;">
                        <b>Uraian Jawaban Teks Siswa:</b><br>${ans.content || '-'}
                    </div>
                    ` : `
                    <div style="background:#f8fafc; border-left:3px solid #0284c7; padding:0.75rem; font-size:0.85rem; margin-bottom:0.75rem;">
                        <b>Lampiran Foto Lembar Kerja Siswa:</b><br>
                        ${ans.photoUrl ? `<img src="${ans.photoUrl}" style="max-height:160px; border-radius:4px; margin-top:6px; border:1px solid #cbd5e1;">` : '(Foto Berkas)'}
                    </div>
                    `}

                    <!-- AI Review Per Question -->
                    <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:4px; padding:0.75rem; font-size:0.85rem; color:#0369a1;">
                        ${rev.aiReview || 'Telah dikoreksi AI per-soal.'}
                    </div>
                </div>
                `;
            }).join('')}

            <!-- Teacher Notes Box -->
            <div style="margin-top:1.5rem; background:#fffbe8; border:1.5px solid #fde047; padding:1rem; border-radius:6px;">
                <h4 style="margin:0 0 0.5rem 0; color:#854d0e; font-size:0.95rem;">Catatan & Verifikasi Guru Pengajar:</h4>
                <p style="margin:0; font-size:0.85rem; color:#713f12;">
                    ${submission.teacherNotes || 'Belum ada catatan tambahan dari Guru. (Status: Terverifikasi Sistem)'}
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
                        .print-actions button { border: 0; border-radius: 6px; padding: 0.7rem 1rem; background: #6366f1; color: #fff; font: 600 14px Arial, sans-serif; cursor: pointer; }
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
