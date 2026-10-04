import { PRESET_STUDENT_PERSONAS } from './studentProfiles';

/**
 * EduTrack Official Document & Card Export Utility
 * Generates institutional-grade formatted printable documents and downloadable standalone files
 * with university masthead, verification QR hashes, barcodes, and authentic styling.
 * Avoids raw unstyled screenshots or plain .txt dumps.
 */

export function printOfficialIDCard(student, cardTheme = 'emerald') {
  const isFaculty = !student.rollNumber || String(student.prn || '').startsWith('FAC') || (student.standing && student.standing.includes('Professor'));
  const isFemale = student.gender === 'Female';
  const roleTitle = isFaculty ? 'FACULTY & STAFF SMART PASS' : 'OFFICIAL STUDENT IDENTITY CARD';
  const validUntil = isFaculty ? 'PERMANENT TENURE' : 'JUNE 2028';
  const idNumber = isFaculty ? student.prn || student.staffId || 'FAC-IT-101' : `#${student.rollNumber} (${student.division || 'A'})`;
  const programOrDept = isFaculty ? student.department || student.course || 'Information Technology' : `${student.course || 'IT'} · ${student.semester || 'Semester 6'}`;
  const bloodGroup = student.bloodGroup || (isFemale ? 'A+' : 'O+');
  const avatarUrl = student.avatarUrl || '/assets/student_avatar.jpg';

  const themeColors = {
    emerald: { bg: '#065f46', accent: '#10b981', light: '#ecfdf5' },
    sapphire: { bg: '#1e3a8a', accent: '#3b82f6', light: '#eff6ff' },
    obsidian: { bg: '#0f172a', accent: '#64748b', light: '#f8fafc' }
  }[cardTheme] || { bg: '#065f46', accent: '#10b981', light: '#ecfdf5' };

  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) {
    alert('Please allow popups to print official ID card.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduTrack Official ID Pass - ${student.name}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f8fafc; padding: 25px; color: #0f172a; }
    .sheet-container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { text-align: center; border-bottom: 2px solid ${themeColors.bg}; padding-bottom: 14px; margin-bottom: 25px; }
    .header h1 { font-size: 20px; font-weight: 800; color: ${themeColors.bg}; letter-spacing: -0.01em; text-transform: uppercase; }
    .header p { font-size: 12px; color: #475569; margin-top: 3px; font-weight: 500; }
    .cards-row { display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap; }
    .card-wrap { width: 340px; height: 215px; border-radius: 14px; overflow: hidden; position: relative; border: 1px solid #cbd5e1; box-shadow: 0 8px 24px rgba(0,0,0,0.12); background: #ffffff; display: flex; flex-direction: column; }
    .card-head { background: linear-gradient(135deg, ${themeColors.bg} 0%, ${themeColors.accent} 100%); color: #ffffff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; }
    .card-head-title { font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
    .card-head-sub { font-size: 8px; opacity: 0.9; }
    .card-body { padding: 12px; display: flex; gap: 12px; flex: 1; align-items: center; }
    .photo-box { width: 75px; height: 95px; border-radius: 8px; border: 2px solid #e2e8f0; overflow: hidden; flex-shrink: 0; background: #f1f5f9; }
    .photo-box img { width: 100%; height: 100%; object-fit: cover; }
    .info-col { flex: 1; }
    .student-name { font-size: 15px; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 4px; }
    .field-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 10px; }
    .field-lbl { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 8.5px; }
    .field-val { font-weight: 700; color: #1e293b; }
    .card-foot { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 6px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #64748b; font-weight: 600; }
    .back-body { padding: 14px; display: flex; flex-direction: column; justify-content: space-between; height: 100%; font-size: 9.5px; }
    .qr-row { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .qr-box { width: 50px; height: 50px; background: #0f172a; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 8px; text-align: center; font-weight: 700; }
    .instructions { font-size: 8px; color: #475569; line-height: 1.35; margin: 6px 0; }
    .sig-row { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 6px; border-top: 1px dashed #cbd5e1; }
    .sig-block { text-align: center; }
    .sig-line { font-family: 'Brush Script MT', cursive, serif; font-size: 15px; color: ${themeColors.bg}; }
    .sig-title { font-size: 7.5px; color: #64748b; font-weight: 700; text-transform: uppercase; }
    .instructions-sheet { margin-top: 30px; padding: 14px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 11px; color: #166534; }
    .instructions-sheet strong { color: #14532d; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet-container { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet-container">
    <div class="header">
      <h1>EduTrack Institute of Technology (Autonomous)</h1>
      <p>OFFICIAL RFID & SMART NFC CREDENTIAL VERIFICATION PASS · CR80 SPECIFICATION</p>
    </div>

    <div class="cards-row">
      <!-- FRONT SIDE -->
      <div class="card-wrap">
        <div class="card-head">
          <div>
            <div class="card-head-title">EDUTRACK INSTITUTE</div>
            <div class="card-head-sub">${roleTitle}</div>
          </div>
          <div style="font-size: 12px;">🛡️ RFID</div>
        </div>
        <div class="card-body">
          <div class="photo-box">
            <img src="${avatarUrl}" alt="${student.name}" onerror="this.src='/assets/student_avatar.jpg'" />
          </div>
          <div class="info-col">
            <div class="student-name">${student.name}</div>
            <div class="field-row">
              <span class="field-lbl">${isFaculty ? 'STAFF ID' : 'ROLL NUMBER'}:</span>
              <span class="field-val">${idNumber}</span>
            </div>
            <div class="field-row">
              <span class="field-lbl">PROGRAM:</span>
              <span class="field-val">${programOrDept}</span>
            </div>
            <div class="field-row">
              <span class="field-lbl">BLOOD GROUP:</span>
              <span class="field-val" style="color: #ef4444;">${bloodGroup}</span>
            </div>
            <div class="field-row">
              <span class="field-lbl">VALIDITY:</span>
              <span class="field-val" style="color: ${themeColors.bg};">${validUntil}</span>
            </div>
          </div>
        </div>
        <div class="card-foot">
          <span>PRN: ${student.prn || 'PRN-2024098101'}</span>
          <span>AUTONOMOUS BOARD</span>
        </div>
      </div>

      <!-- BACK SIDE -->
      <div class="card-wrap">
        <div class="back-body">
          <div>
            <div style="font-weight: 800; font-size: 10px; color: ${themeColors.bg}; margin-bottom: 4px;">
              CARD RETENTION & SECURITY POLICY
            </div>
            <p class="instructions">
              1. This smart pass is institutional property and must be displayed on campus.<br>
              2. Provides RFID access to Automated Turnstiles, Labs, and Library Services.<br>
              3. If found, please return to Registry Office, Academic Block A.
            </p>
          </div>

          <div class="qr-row">
            <div class="qr-box">QR<br>VERIFIED</div>
            <div>
              <div style="font-size: 8.5px; font-weight: 700; color: #0f172a;">AUTHENTICATED ENROLLMENT</div>
              <div style="font-size: 7.5px; color: #64748b;">REF: EDUTRACK-PASS-${student.rollNumber || 'FAC'}-2026</div>
              <div style="font-size: 7.5px; color: #059669; font-weight: 700;">STATUS: ACTIVE & ENROLLED</div>
            </div>
          </div>

          <div class="sig-row">
            <div class="sig-block">
              <div class="sig-line">Dr. P. R. Deshmukh</div>
              <div class="sig-title">Controller of Exams</div>
            </div>
            <div class="sig-block">
              <div class="sig-line">Krrish Sharma</div>
              <div class="sig-title">Registrar / Director</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="instructions-sheet no-print">
      <strong>Printing Guide:</strong> Select "Save as PDF" or print directly on 300 GSM photo paper / PVC plastic smart card stock. Margin is pre-configured for standard A4 landscape or portrait output.
    </div>

    <div class="no-print" style="text-align: center; margin-top: 20px;">
      <button onclick="window.print()" style="background: ${themeColors.bg}; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
        🖨️ Open Print Dialog
      </button>
      <button onclick="window.close()" style="background: #e2e8f0; color: #334155; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; margin-left: 10px;">
        Close Window
      </button>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 450);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function downloadOfficialIDCard(student, cardTheme = 'emerald') {
  const isFaculty = !student.rollNumber || String(student.prn || '').startsWith('FAC');
  const roleTitle = isFaculty ? 'Faculty Smart Pass' : 'Student Smart Pass';
  const filename = `EduTrack_${roleTitle.replace(/\s+/g, '_')}_${student.rollNumber || student.prn || '101'}.html`;

  const themeColors = {
    emerald: { bg: '#065f46', accent: '#10b981' },
    sapphire: { bg: '#1e3a8a', accent: '#3b82f6' },
    obsidian: { bg: '#0f172a', accent: '#64748b' }
  }[cardTheme] || { bg: '#065f46', accent: '#10b981' };

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EduTrack Smart ID - ${student.name}</title>
  <style>
    body { background: #0f172a; color: #ffffff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { width: 380px; height: 240px; background: linear-gradient(135deg, ${themeColors.bg} 0%, #064e3b 100%); border-radius: 16px; padding: 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); position: relative; overflow: hidden; }
    .card::before { content: ''; position: absolute; top: -50px; right: -50px; width: 140px; height: 140px; background: rgba(255,255,255,0.08); border-radius: 50%; }
    .top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px; margin-bottom: 14px; }
    .top h2 { font-size: 12px; margin: 0; letter-spacing: 1px; font-weight: 800; color: #a7f3d0; text-transform: uppercase; }
    .body { display: flex; gap: 14px; align-items: center; }
    .avatar { width: 80px; height: 95px; border-radius: 10px; background: #ffffff; overflow: hidden; border: 2px solid rgba(255,255,255,0.4); flex-shrink: 0; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .details { flex: 1; }
    .name { font-size: 17px; font-weight: 800; margin-bottom: 4px; color: #ffffff; }
    .row { font-size: 11px; margin-bottom: 3px; display: flex; justify-content: space-between; opacity: 0.9; }
    .row span:first-child { color: #a7f3d0; }
    .chip { width: 36px; height: 26px; background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); border-radius: 4px; border: 1px solid #fef3c7; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="top">
      <h2>EduTrack Institute of Technology</h2>
      <span style="font-size: 10px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 99px;">${roleTitle}</span>
    </div>
    <div class="body">
      <div class="avatar">
        <img src="${student.avatarUrl || '/assets/student_avatar.jpg'}" alt="${student.name}" onerror="this.src='/assets/student_avatar.jpg'" />
      </div>
      <div class="details">
        <div class="chip"></div>
        <div class="name">${student.name}</div>
        <div class="row"><span>${isFaculty ? 'Staff ID' : 'Roll No'}:</span> <strong>${student.rollNumber || student.prn || '101'}</strong></div>
        <div class="row"><span>Program:</span> <strong>${student.course || student.department || 'IT'}</strong></div>
        <div class="row"><span>PRN:</span> <strong>${student.prn || 'PRN-2024098101'}</strong></div>
        <div class="row"><span>Status:</span> <strong style="color: #4ade80;">Active & Verified</strong></div>
      </div>
    </div>
  </div>
  <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">Official EduTrack Digital Smart Pass · Autonomous University</p>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printOfficialDocument(doc) {
  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow popups to print official document.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.code} - ${doc.title}</title>
  <style>
    @page { size: A4 portrait; margin: 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    body { background: #ffffff; color: #0f172a; padding: 30px; font-size: 13px; line-height: 1.6; }
    .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header-logo h1 { font-size: 18px; font-weight: 800; color: #065f46; text-transform: uppercase; }
    .header-logo p { font-size: 11px; color: #64748b; margin-top: 2px; }
    .header-meta { text-align: right; font-size: 11px; color: #475569; }
    .header-meta strong { color: #0f172a; }
    .doc-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 11px; }
    .meta-item span { display: block; color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 600; }
    .meta-item strong { color: #1e293b; font-size: 12px; }
    .doc-content { white-space: pre-wrap; font-family: "Courier New", Courier, monospace; font-size: 11.5px; line-height: 1.6; background: #fafafa; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
    .footer { margin-top: 35px; border-top: 1px solid #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-logo">
      <h1>EduTrack Autonomous Institute of Technology</h1>
      <p>CENTRAL INSTITUTIONAL RESOURCE & DOCUMENTATION REPOSITORY</p>
    </div>
    <div class="header-meta">
      <div>DOCUMENT CODE: <strong>${doc.code}</strong></div>
      <div>FORMAT: <strong>OFFICIAL ${doc.format} SPECIFICATION</strong></div>
      <div>STATUS: <strong style="color: #059669;">VERIFIED & ACTIVE</strong></div>
    </div>
  </div>

  <h2 class="doc-title">${doc.title}</h2>

  <div class="meta-box">
    <div class="meta-item">
      <span>Author / Publisher</span>
      <strong>${doc.author}</strong>
    </div>
    <div class="meta-item">
      <span>Effective Date</span>
      <strong>${doc.date}</strong>
    </div>
    <div class="meta-item">
      <span>Institutional Scheme</span>
      <strong>${doc.scheme || 'Academic Year 2026–2027'}</strong>
    </div>
  </div>

  <div class="doc-content">${doc.content}</div>

  <div class="footer">
    <div>AUTHENTICATED VIA EDUTRACK REPOSITORY REVISION SYSTEM · MD5: ${Math.random().toString(36).substring(2, 12).toUpperCase()}</div>
    <div>PAGE 1 OF 1 · OFFICIAL AUTONOMOUS RECORD</div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 25px;">
    <button onclick="window.print()" style="background: #059669; color: #fff; padding: 10px 22px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print Official A4 Document
    </button>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function downloadOfficialDocument(doc) {
  const filename = `${doc.code}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_Official.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.code} - ${doc.title}</title>
  <style>
    body { background: #f1f5f9; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
    .sheet { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
    .header h1 { font-size: 20px; font-weight: 800; color: #065f46; }
    .meta { display: flex; gap: 20px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; font-size: 12px; }
    pre { white-space: pre-wrap; font-family: "Courier New", monospace; font-size: 12px; line-height: 1.6; background: #fbfcfe; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .stamp { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 14px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <h1>EduTrack Autonomous Institute of Technology</h1>
        <p style="font-size: 12px; color: #64748b;">Official Institutional Documentation Repository</p>
      </div>
      <div style="text-align: right; font-size: 12px;">
        <div>CODE: <strong>${doc.code}</strong></div>
        <div style="color: #059669; font-weight: 700;">VERIFIED RECORD</div>
      </div>
    </div>
    <h2 style="font-size: 22px; margin-bottom: 14px;">${doc.title}</h2>
    <div class="meta">
      <div><strong>Author:</strong> ${doc.author}</div>
      <div><strong>Date:</strong> ${doc.date}</div>
      <div><strong>Format:</strong> ${doc.format}</div>
      <div><strong>Scheme:</strong> ${doc.scheme || 'Scheme 2026'}</div>
    </div>
    <pre>${doc.content}</pre>
    <div class="stamp">
      <div>AUTHENTICATED VIA EDUTRACK DIGITAL INTEGRITY ENGINE</div>
      <div>CONTROLLER OF EXAMINATIONS · DEAN ACADEMICS</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and prints an official A4 Grade Transcript / Marksheet
 * Includes full subject & lab breakdown, credit points, SGPA, CGPA, university seal, and QR verification.
 */
export function printOfficialMarksheet(student) {
  const printWindow = window.open('', '_blank', 'width=950,height=850');
  if (!printWindow) {
    alert('Please allow popups to print official marksheet.');
    return;
  }

  const sName = student.name || 'Krrish Sharma';
  const roll = student.rollNumber || '101';
  const seatNo = student.seatNumber || `2024-IT-${String(roll).padStart(3, '0')}`;
  const prn = student.prn || (student.course ? `RBT24${student.course.toUpperCase()}${String(roll).padStart(3, '0')}` : `RBT24IT${String(roll).padStart(3, '0')}`);
  const program = student.course ? `B.Tech in ${student.course === 'IT' ? 'Information Technology' : student.course}` : 'B.Tech in Information Technology';
  const semester = student.semester || 'Semester 6';
  const division = student.division ? `Div ${student.division}` : 'Div A';
  const academicYear = '2026–2027';

  const defaultGrades = [
    { code: 'IT-301', name: 'Core Java & Object-Oriented Frameworks', category: 'Theory', credits: 4.0, cie: 24, ese: 70, total: 94, grade: 'O', gp: 10 },
    { code: 'IT-301L', name: 'Core Java Programming Laboratory', category: 'Practical Lab', credits: 1.0, cie: 24, ese: 24, total: 48, grade: 'O', gp: 10 },
    { code: 'IT-302', name: 'Database Management Systems & Transactions', category: 'Theory', credits: 4.0, cie: 23, ese: 65, total: 88, grade: 'A+', gp: 9 },
    { code: 'IT-302L', name: 'DBMS & SQL Query Optimization Lab', category: 'Practical Lab', credits: 1.0, cie: 23, ese: 23, total: 46, grade: 'A+', gp: 9 },
    { code: 'IT-303', name: 'Distributed Systems & Cloud Computing', category: 'Theory', credits: 4.0, cie: 24, ese: 68, total: 92, grade: 'O', gp: 10 },
    { code: 'IT-304', name: 'Computer Networks & Network Security', category: 'Theory', credits: 4.0, cie: 20, ese: 60, total: 80, grade: 'A', gp: 8 },
    { code: 'IT-305', name: 'Capstone Project Phase 1 Board Review', category: 'Project', credits: 4.0, cie: 25, ese: 68, total: 93, grade: 'O', gp: 10 }
  ];

  const rawGrades = (student.grades && student.grades.length > 0) ? student.grades : defaultGrades;
  const grades = rawGrades.map((g) => {
    const credits = Number(g.credits) || 4.0;
    const cie = Number(g.cie !== undefined ? g.cie : g.internal !== undefined ? g.internal : 22);
    const ese = Number(g.ese !== undefined ? g.ese : g.endterm !== undefined ? g.endterm : 65);
    const total = Number(g.total !== undefined ? g.total : (cie + ese));
    const gp = Number(g.gp !== undefined ? g.gp : g.gradePoint !== undefined ? g.gradePoint : (total >= 90 ? 10 : total >= 80 ? 9 : 8));
    const grade = g.grade || (gp === 10 ? 'O' : gp === 9 ? 'A+' : gp === 8 ? 'A' : 'B+');
    const creditPoints = credits * gp;
    return {
      code: g.code,
      name: g.name,
      category: g.category || (g.code.endsWith('L') ? 'Practical Lab' : g.code.includes('305') ? 'Project' : 'Theory'),
      credits,
      cie,
      ese,
      total,
      grade,
      gp,
      creditPoints
    };
  });

  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const totalCreditPoints = grades.reduce((sum, g) => sum + g.creditPoints, 0);
  const sgpa = (totalCreditPoints / totalCredits).toFixed(2);
  const cgpa = student.cgpa || (Number(sgpa) * 0.98).toFixed(2);
  const resultClass = 'FIRST CLASS WITH DISTINCTION (PASSED)';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Grade Transcript - ${sName} (${roll})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 25px; }
    .sheet-card { max-width: 860px; margin: 0 auto; background: #ffffff; padding: 32px 36px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #cbd5e1; position: relative; }
    .header { text-align: center; border-bottom: 2.5px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .univ-title { font-size: 21px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em; text-transform: uppercase; }
    .univ-sub { font-size: 10px; color: #475569; font-weight: 700; letter-spacing: 0.05em; margin-top: 3px; }
    .exam-office { font-size: 11px; color: #059669; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 5px; }
    .doc-pill { display: inline-block; background: #0f172a; color: #ffffff; padding: 4px 18px; border-radius: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; margin-top: 8px; text-transform: uppercase; }
    
    .student-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 11px; }
    .kv-item { display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 3px; }
    .kv-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 9.5px; }
    .kv-value { font-weight: 700; color: #0f172a; }

    table.grade-table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 14px; }
    table.grade-table th { background: #f1f5f9; color: #0f172a; font-weight: 800; text-transform: uppercase; font-size: 9px; padding: 7px 8px; border: 1px solid #cbd5e1; text-align: center; }
    table.grade-table td { padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; color: #1e293b; }
    table.grade-table tr:nth-child(even) { background: #fafafa; }
    .subj-col { text-align: left !important; font-weight: 600; }

    .summary-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; text-align: center; }
    .sum-box span { display: block; font-size: 9px; font-weight: 700; color: #166534; text-transform: uppercase; }
    .sum-box strong { font-size: 15px; font-weight: 900; color: #14532d; }

    .scale-legend { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 12px; margin-bottom: 18px; font-size: 9px; color: #475569; }
    .scale-legend strong { color: #0f172a; }

    .sign-row { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 18px; margin-top: 10px; border-top: 1.5px solid #cbd5e1; }
    .sign-block { text-align: center; width: 170px; }
    .signature-script { font-family: 'Brush Script MT', cursive, serif; font-size: 20px; color: #0f172a; line-height: 1; margin-bottom: 3px; }
    .sign-title { font-size: 9px; font-weight: 700; color: #475569; text-transform: uppercase; border-top: 1px solid #94a3b8; padding-top: 3px; }

    .footer-stamp { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 8.5px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 8px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet-card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet-card">
    <div class="header">
      <div class="univ-title">EduTrack Institute of Technology</div>
      <div class="univ-sub">AN AUTONOMOUS INSTITUTION AFFILIATED TO STATE UNIVERSITY · ACCREDITED NAAC GRADE A++</div>
      <div class="exam-office">Office of the Controller of Examinations</div>
      <div class="doc-pill">Official Statement of Semester Grades & Credit Transcript</div>
    </div>

    <div class="student-info-grid">
      <div class="kv-item"><span class="kv-label">Candidate Full Name:</span><span class="kv-value">${sName.toUpperCase()}</span></div>
      <div class="kv-item"><span class="kv-label">Roll Number / Div:</span><span class="kv-value">#${roll} (${division})</span></div>
      <div class="kv-item"><span class="kv-label">Examination Seat No:</span><span class="kv-value" style="font-family: monospace; color: #2563eb;">${seatNo}</span></div>
      <div class="kv-item"><span class="kv-label">PRN / Enrolment No:</span><span class="kv-value" style="font-family: monospace;">${prn}</span></div>
      <div class="kv-item"><span class="kv-label">Program & Branch:</span><span class="kv-value">${program}</span></div>
      <div class="kv-item"><span class="kv-label">Academic Session:</span><span class="kv-value">${semester} · ${academicYear}</span></div>
      <div class="kv-item"><span class="kv-label">Attendance Verification:</span><span class="kv-value" style="color: #059669;">89.5% Cleared</span></div>
      <div class="kv-item"><span class="kv-label">Autonomous Scheme:</span><span class="kv-value">CBCS Autonomous Scheme 2026</span></div>
    </div>

    <table class="grade-table">
      <thead>
        <tr>
          <th style="width: 40px;">Sr</th>
          <th style="width: 70px;">Course Code</th>
          <th class="subj-col">Course Title</th>
          <th style="width: 75px;">Category</th>
          <th style="width: 45px;">Credits</th>
          <th style="width: 45px;">CIE (25)</th>
          <th style="width: 45px;">ESE (75)</th>
          <th style="width: 45px;">Total</th>
          <th style="width: 45px;">Grade</th>
          <th style="width: 45px;">Points</th>
          <th style="width: 55px;">Credit Pts</th>
        </tr>
      </thead>
      <tbody>
        ${grades
          .map(
            (g, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td style="font-family: monospace; font-weight: 700;">${g.code}</td>
            <td class="subj-col">${g.name}</td>
            <td>${g.category}</td>
            <td>${g.credits.toFixed(1)}</td>
            <td>${g.cie}</td>
            <td>${g.ese}</td>
            <td><strong>${g.total}</strong></td>
            <td><strong style="color: ${g.gp >= 9 ? '#059669' : '#1e3a8a'};">${g.grade}</strong></td>
            <td>${g.gp}</td>
            <td><strong>${g.creditPoints.toFixed(1)}</strong></td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div class="summary-strip">
      <div class="sum-box"><span>Credits Registered</span><strong>${totalCredits.toFixed(1)}</strong></div>
      <div class="sum-box"><span>Credits Earned</span><strong>${totalCredits.toFixed(1)}</strong></div>
      <div class="sum-box"><span>SGPA (Sem 6)</span><strong style="color: #2563eb;">${sgpa}</strong></div>
      <div class="sum-box"><span>Cumulative CGPA</span><strong style="color: #059669;">${cgpa}</strong></div>
    </div>

    <div style="text-align: center; margin-bottom: 12px; font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
      Result Classification: <span style="color: #059669;">${resultClass}</span>
    </div>

    <div class="scale-legend">
      <span><strong>Grading Scale:</strong> O (90-100 · 10) | A+ (80-89 · 9) | A (70-79 · 8) | B+ (60-69 · 7) | B (55-59 · 6) | C (50-54 · 5) | P (40-49 · 4)</span>
    </div>

    <div class="sign-row">
      <div class="sign-block">
        <div style="font-size: 8.5px; color: #64748b; margin-bottom: 4px;">Date of Issue: Oct 03, 2026</div>
        <div class="sign-title">Prepared by Exam Cell</div>
      </div>
      <div class="sign-block">
        <div class="signature-script">Dr. S. K. Joshi</div>
        <div class="sign-title">Dean of Academic Affairs</div>
      </div>
      <div class="sign-block">
        <div class="signature-script">Dr. P. R. Deshmukh</div>
        <div class="sign-title">Controller of Examinations</div>
      </div>
    </div>

    <div class="footer-stamp">
      <div>DIGITALLY VERIFIED VIA EDUTRACK ACADEMIC LEDGER · HASH: #EDUTRACK-GRADE-${roll}-2026</div>
      <div>PAGE 1 OF 1 · OFFICIAL TRANSCRIPT</div>
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 25px;">
    <button onclick="window.print()" style="background: #2563eb; color: #fff; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
      🖨️ Print Marksheet / Save as PDF
    </button>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Downloads standalone HTML file of the Official Marksheet
 */
export function downloadOfficialMarksheet(student) {
  const roll = student.rollNumber || '101';
  const filename = `OfficialMarksheet_${roll}_Semester6.html`;

  const sName = student.name || 'Krrish Sharma';
  const seatNo = student.seatNumber || `2024-IT-${String(roll).padStart(3, '0')}`;
  const prn = student.prn || (student.course ? `RBT24${student.course.toUpperCase()}${String(roll).padStart(3, '0')}` : `RBT24IT${String(roll).padStart(3, '0')}`);
  const program = student.course ? `B.Tech in ${student.course === 'IT' ? 'Information Technology' : student.course}` : 'B.Tech in Information Technology';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduTrack Marksheet - ${sName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; padding: 30px; color: #0f172a; }
    .card { max-width: 820px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #cbd5e1; }
    .head { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
    h1 { font-size: 20px; font-weight: 900; margin: 0; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; font-size: 12px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
    th { background: #f1f5f9; font-weight: 800; }
    .sum { background: #f0fdf4; border: 1px solid #86efac; padding: 12px; border-radius: 8px; display: flex; justify-content: space-around; font-weight: 700; margin-bottom: 16px; }
    .foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 14px; font-size: 10px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <h1>EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</h1>
      <p style="font-size: 11px; color: #64748b; margin-top: 3px;">Affiliated to State Technological University · NAAC A++ Grade</p>
      <div style="margin-top: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase;">Official Statement of Semester Grades & Marks</div>
    </div>
    <div class="grid">
      <div><strong>Candidate:</strong> ${sName.toUpperCase()}</div>
      <div><strong>Roll No:</strong> #${roll}</div>
      <div><strong>Seat No:</strong> ${seatNo}</div>
      <div><strong>PRN:</strong> ${prn}</div>
      <div><strong>Program:</strong> ${program}</div>
      <div><strong>Semester:</strong> Semester 6 (Winter 2026)</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th style="text-align: left;">Subject</th>
          <th>Credits</th>
          <th>CIE</th>
          <th>ESE</th>
          <th>Total</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>IT-301</td><td style="text-align: left;">Core Java & OOP Frameworks</td><td>4.0</td><td>24</td><td>70</td><td>94</td><td><strong>O</strong></td></tr>
        <tr><td>IT-301L</td><td style="text-align: left;">Core Java Programming Lab</td><td>1.0</td><td>24</td><td>24</td><td>48</td><td><strong>O</strong></td></tr>
        <tr><td>IT-302</td><td style="text-align: left;">Database Management Systems</td><td>4.0</td><td>23</td><td>65</td><td>88</td><td><strong>A+</strong></td></tr>
        <tr><td>IT-302L</td><td style="text-align: left;">DBMS & SQL Query Optimization Lab</td><td>1.0</td><td>23</td><td>23</td><td>46</td><td><strong>A+</strong></td></tr>
        <tr><td>IT-303</td><td style="text-align: left;">Distributed Systems & Cloud</td><td>4.0</td><td>24</td><td>68</td><td>92</td><td><strong>O</strong></td></tr>
        <tr><td>IT-304</td><td style="text-align: left;">Computer Networks & Security</td><td>4.0</td><td>20</td><td>60</td><td>80</td><td><strong>A</strong></td></tr>
        <tr><td>IT-305</td><td style="text-align: left;">Capstone Project Phase 1</td><td>4.0</td><td>25</td><td>68</td><td>93</td><td><strong>O</strong></td></tr>
      </tbody>
    </table>
    <div class="sum">
      <div>SGPA: <span style="color: #2563eb;">9.24</span></div>
      <div>CGPA: <span style="color: #059669;">9.08</span></div>
      <div>Result: <span style="color: #059669;">FIRST CLASS WITH DISTINCTION</span></div>
    </div>
    <div class="foot">
      <div>AUTHENTICATED TRANSCRIPT · CONTROLLER OF EXAMINATIONS</div>
      <div>DATE OF ISSUE: OCT 03, 2026</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and prints an official Combined All-in-One Examination Admit Card (Hall Ticket)
 * Combines all Theory papers, Laboratory Practical/Viva sessions, and Project Defense on one single official sheet.
 */
export function printOfficialHallTicket(student, examSchedule = []) {
  const printWindow = window.open('', '_blank', 'width=980,height=850');
  if (!printWindow) {
    alert('Please allow popups to print official hall ticket.');
    return;
  }

  const sName = student.name || 'Krrish Sharma';
  const roll = student.rollNumber || '101';
  const seatNo = student.seatNumber || `2024-IT-${String(roll).padStart(3, '0')}`;
  const prn = student.prn || (student.course ? `RBT24${student.course.toUpperCase()}${String(roll).padStart(3, '0')}` : `RBT24IT${String(roll).padStart(3, '0')}`);
  const program = student.program || (student.course ? `B.Tech in ${student.course === 'IT' ? 'Information Technology' : student.course}` : 'B.Tech in Information Technology');
  const semester = student.semester || 'Semester 6';
  const division = student.division ? (String(student.division).startsWith('Div') ? student.division : `Div ${student.division}`) : 'Div A';
  const center = student.center || 'Campus Center #04 (Examination Block A & B)';
  const attPct = student.attendancePercentage !== undefined ? Number(student.attendancePercentage).toFixed(1) : '89.5';
  const avatarUrl = student.avatarUrl || '/assets/student_avatar.jpg';

  const defaultPapers = [
    { paperCode: 'IT-301', subjectName: 'Core Java & Object-Oriented Frameworks', category: 'Theory Written', date: 'Nov 10, 2026', day: 'Tuesday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall A-101', seatNo: 'Desk #14 (Block A)' },
    { paperCode: 'IT-302', subjectName: 'Database Management Systems & Transactions', category: 'Theory Written', date: 'Nov 13, 2026', day: 'Friday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall A-102', seatNo: 'Desk #14 (Block A)' },
    { paperCode: 'IT-303', subjectName: 'Distributed Systems & Cloud Computing', category: 'Theory Written', date: 'Nov 17, 2026', day: 'Tuesday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall B-201', seatNo: 'Desk #14 (Block B)' },
    { paperCode: 'IT-304', subjectName: 'Computer Networks & Network Security', category: 'Theory Written', date: 'Nov 20, 2026', day: 'Friday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall B-202', seatNo: 'Desk #14 (Block B)' },
    { paperCode: 'IT-301L', subjectName: 'Core Java Programming Laboratory Viva', category: 'Practical Lab & Viva', date: 'Nov 24, 2026', day: 'Tuesday', time: '09:00 AM - 01:00 PM', shift: 'Practical Batch 1', room: 'Computing Lab A-1', seatNo: 'Terminal #08 (Lab A-1)' },
    { paperCode: 'IT-302L', subjectName: 'DBMS & SQL Performance Laboratory Viva', category: 'Practical Lab & Viva', date: 'Nov 26, 2026', day: 'Thursday', time: '01:30 PM - 05:30 PM', shift: 'Practical Batch 2', room: 'Computing Lab A-2', seatNo: 'Terminal #08 (Lab A-2)' },
    { paperCode: 'IT-305', subjectName: 'Capstone Project Phase 1 Board Defense', category: 'Project Defense', date: 'Dec 01, 2026', day: 'Tuesday', time: '09:30 AM - 04:30 PM', shift: 'Board Review', room: 'Seminar Hall 1', seatNo: 'Project Panel 2' }
  ];

  const papers = (examSchedule && examSchedule.length > 0) ? examSchedule : defaultPapers;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Combined Hall Ticket - ${sName} (${roll})</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 20px; }
    .sheet-card { max-width: 880px; margin: 0 auto; background: #ffffff; padding: 26px 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1.5px solid #0f172a; position: relative; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
    .univ-title { font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em; text-transform: uppercase; }
    .univ-sub { font-size: 9.5px; color: #475569; font-weight: 700; letter-spacing: 0.04em; margin-top: 2px; }
    .exam-office { font-size: 10.5px; color: #2563eb; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4px; }
    .doc-pill { display: inline-block; background: #0f172a; color: #ffffff; padding: 3px 14px; border-radius: 4px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; margin-top: 6px; text-transform: uppercase; }
    
    .cred-grid { display: grid; grid-template-columns: 1fr 140px; gap: 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; }
    .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; font-size: 10.5px; }
    .kv { display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px; }
    .lbl { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 8.5px; }
    .val { font-weight: 700; color: #0f172a; }
    .photo-col { display: flex; flex-direction: column; align-items: center; justify-content: center; border-left: 1px solid #cbd5e1; padding-left: 10px; }
    .photo-box { width: 70px; height: 80px; border: 1.5px solid #64748b; border-radius: 4px; overflow: hidden; background: #e2e8f0; margin-bottom: 4px; }
    .photo-box img { width: 100%; height: 100%; object-fit: cover; }

    .banner-bar { background: #0f172a; color: #ffffff; padding: 5px 12px; border-radius: 4px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }

    table.sched-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px; }
    table.sched-table th { background: #f1f5f9; color: #0f172a; font-weight: 800; text-transform: uppercase; font-size: 8.5px; padding: 6px 6px; border: 1px solid #cbd5e1; text-align: center; }
    table.sched-table td { padding: 5px 6px; border: 1px solid #e2e8f0; text-align: center; color: #1e293b; }
    table.sched-table tr:nth-child(even) { background: #fafafa; }
    .title-col { text-align: left !important; font-weight: 600; font-size: 9.5px; }
    .tag-theory { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 1px 5px; border-radius: 3px; font-size: 8px; font-weight: 700; }
    .tag-lab { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 1px 5px; border-radius: 3px; font-size: 8px; font-weight: 700; }
    .tag-proj { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 1px 5px; border-radius: 3px; font-size: 8px; font-weight: 700; }

    .rules-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 8.5px; color: #475569; line-height: 1.35; margin-bottom: 12px; }
    .rules-box strong { color: #0f172a; }

    .sign-row { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 14px; margin-top: 6px; border-top: 1px solid #cbd5e1; }
    .sign-box { text-align: center; width: 150px; }
    .sign-box-rect { width: 100%; height: 32px; border: 1px dashed #cbd5e1; margin-bottom: 3px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #94a3b8; }
    .sig-script { font-family: 'Brush Script MT', cursive, serif; font-size: 18px; color: #0f172a; }
    .sign-lbl { font-size: 8px; font-weight: 700; color: #475569; text-transform: uppercase; border-top: 1px solid #94a3b8; padding-top: 2px; }

    .foot-stamp { margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 6px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet-card { border: 1.5px solid #0f172a; box-shadow: none; padding: 15px 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet-card">
    <div class="header">
      <div class="univ-title">EduTrack Institute of Technology (Autonomous)</div>
      <div class="univ-sub">AFFILIATED TO STATE UNIVERSITY · APPROVED BY AICTE & UGC · ACCREDITED NAAC 'A++'</div>
      <div class="exam-office">Office of the Controller of Examinations · End-Semester Examination Admit Card</div>
      <div class="doc-pill">Winter 2026 Examination Hall Ticket · All Subjects Combined</div>
    </div>

    <div class="cred-grid">
      <div class="fields">
        <div class="kv"><span class="lbl">Candidate Name:</span><span class="val">${sName.toUpperCase()}</span></div>
        <div class="kv"><span class="lbl">Roll Number / Div:</span><span class="val">#${roll} (${division})</span></div>
        <div class="kv"><span class="lbl">Seat Number:</span><span class="val" style="font-family: monospace; color: #2563eb;">${seatNo}</span></div>
        <div class="kv"><span class="lbl">PRN / Enrolment No:</span><span class="val" style="font-family: monospace;">${prn}</span></div>
        <div class="kv"><span class="lbl">Degree & Program:</span><span class="val">${program}</span></div>
        <div class="kv"><span class="lbl">Semester:</span><span class="val">${semester} (Winter 2026)</span></div>
        <div class="kv"><span class="lbl">Exam Center & Block:</span><span class="val">${center}</span></div>
        <div class="kv"><span class="lbl">Clearance Status:</span><span class="val" style="color: #059669;">✓ Verified (${attPct}% Att · Fees Paid)</span></div>
      </div>

      <div class="photo-col">
        <div class="photo-box">
          <img src="${avatarUrl}" alt="${sName}" onerror="this.src='/assets/student_avatar.jpg'" />
        </div>
        <div style="font-size: 8px; font-family: monospace; font-weight: 700; color: #0f172a;">|||| | ||||| | |||</div>
        <div style="font-size: 7px; color: #64748b; font-family: monospace;">${seatNo}</div>
      </div>
    </div>

    <div class="banner-bar">
      <span>Combined Examination Schedule (All ${papers.length} Registered Papers · Theory, Practical & Project)</span>
      <span>Autonomous CBCS Scheme 2026</span>
    </div>

    <table class="sched-table">
      <thead>
        <tr>
          <th style="width: 30px;">#</th>
          <th style="width: 65px;">Paper Code</th>
          <th class="title-col">Course Title</th>
          <th style="width: 90px;">Category</th>
          <th style="width: 80px;">Date & Day</th>
          <th style="width: 100px;">Time Slot</th>
          <th style="width: 95px;">Venue / Allotted Seat</th>
          <th style="width: 60px;">Invigilator Sign</th>
        </tr>
      </thead>
      <tbody>
        ${papers
          .map((p, idx) => {
            const isLab = (p.category && (p.category.toLowerCase().includes('lab') || p.category.toLowerCase().includes('practical'))) || (p.paperCode && p.paperCode.endsWith('L'));
            const isProj = p.category && (p.category.toLowerCase().includes('project') || p.category.toLowerCase().includes('defense'));
            const tagClass = isLab ? 'tag-lab' : isProj ? 'tag-proj' : 'tag-theory';

            return `
          <tr>
            <td>${idx + 1}</td>
            <td style="font-family: monospace; font-weight: 800;">${p.paperCode}</td>
            <td class="title-col">${p.subjectName}</td>
            <td><span class="${tagClass}">${p.category}</span></td>
            <td><strong>${p.date}</strong><br><span style="font-size: 7.5px; color: #64748b;">(${p.day})</span></td>
            <td>${p.time}</td>
            <td>${p.room || 'Exam Hall A-101'}<br><span style="font-size: 7.5px; color: #059669; font-weight: 600;">${p.seatNo || 'Desk Block A'}</span></td>
            <td style="height: 28px;"></td>
          </tr>`;
          })
          .join('')}
      </tbody>
    </table>

    <div class="rules-box">
      <strong>Important Candidate Examination Directives:</strong><br>
      1. This Admit Card is valid for all ${papers.length} registered papers listed above. Carry this along with your Institutional RFID Smart ID Card.<br>
      2. Candidates must be seated at their designated desks 20 minutes prior to session commencement.<br>
      3. Mobile phones, smartwatches, electronic transmitters, and unauthorized notes are strictly prohibited in the exam hall.<br>
      4. Invigilator must physically sign in the designated column against each paper upon desk verification.
    </div>

    <div class="sign-row">
      <div class="sign-box">
        <div class="sign-box-rect">Candidate Sign in Presence</div>
        <div class="sign-lbl">Candidate Signature</div>
      </div>
      <div class="sign-box">
        <div class="sig-script">Prof. Krrish Sharma</div>
        <div class="sign-lbl">Faculty Proctor / Head</div>
      </div>
      <div class="sign-box">
        <div class="sig-script">Dr. P. R. Deshmukh</div>
        <div class="sign-lbl">Controller of Examinations</div>
      </div>
    </div>

    <div class="foot-stamp">
      <div>AUTHENTICATED ADMIT CARD · REF: #EDUTRACK-ADMIT-${roll}-2026 · VERIFIED RECORD</div>
      <div>PAGE 1 OF 1 · ALL COMBINED SUBJECTS</div>
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="background: #0f172a; color: #fff; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
      🖨️ Print Combined Hall Ticket / Save PDF
    </button>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Downloads standalone HTML file of the Combined Hall Ticket
 */
export function downloadOfficialHallTicket(student, examSchedule = []) {
  const roll = student.rollNumber || '101';
  const filename = `HallTicket_Combined_AllSubjects_${roll}.html`;

  const sName = student.name || 'Krrish Sharma';
  const seatNo = student.seatNumber || `2024-IT-${String(roll).padStart(3, '0')}`;
  const prn = student.prn || `PRN-2024098${String(roll).padStart(3, '0')}`;
  const program = student.program || (student.course ? `B.Tech in ${student.course === 'IT' ? 'Information Technology' : student.course}` : 'B.Tech in Information Technology');

  const defaultPapers = [
    { paperCode: 'IT-301', subjectName: 'Core Java & OOP Frameworks', category: 'Theory', date: 'Nov 10, 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall A-101', seatNo: 'Desk #14 (Block A)' },
    { paperCode: 'IT-302', subjectName: 'Database Management Systems', category: 'Theory', date: 'Nov 13, 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall A-102', seatNo: 'Desk #14 (Block A)' },
    { paperCode: 'IT-303', subjectName: 'Distributed Systems & Cloud', category: 'Theory', date: 'Nov 17, 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall B-201', seatNo: 'Desk #14 (Block B)' },
    { paperCode: 'IT-304', subjectName: 'Computer Networks & Security', category: 'Theory', date: 'Nov 20, 2026', time: '10:00 AM - 01:00 PM', room: 'Exam Hall B-202', seatNo: 'Desk #14 (Block B)' },
    { paperCode: 'IT-301L', subjectName: 'Core Java Programming Lab Viva', category: 'Practical Lab', date: 'Nov 24, 2026', time: '09:00 AM - 01:00 PM', room: 'Computing Lab A-1', seatNo: 'Terminal #08' },
    { paperCode: 'IT-302L', subjectName: 'DBMS Lab Viva', category: 'Practical Lab', date: 'Nov 26, 2026', time: '01:30 PM - 05:30 PM', room: 'Computing Lab A-2', seatNo: 'Terminal #08' },
    { paperCode: 'IT-305', subjectName: 'Capstone Project Phase 1 Board', category: 'Project Defense', date: 'Dec 01, 2026', time: '09:30 AM - 04:30 PM', room: 'Seminar Hall 1', seatNo: 'Panel 2' }
  ];

  const papers = (examSchedule && examSchedule.length > 0) ? examSchedule : defaultPapers;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Combined Hall Ticket - ${sName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 30px; color: #0f172a; }
    .card { max-width: 860px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1.5px solid #0f172a; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    .head { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px; }
    h1 { font-size: 20px; font-weight: 900; margin: 0; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; font-size: 11px; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10.5px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; }
    th { background: #f1f5f9; font-weight: 800; font-size: 9px; text-transform: uppercase; }
    .foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <h1>EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</h1>
      <p style="font-size: 11px; color: #475569;">OFFICE OF THE CONTROLLER OF EXAMINATIONS · ADMIT CARD</p>
      <div style="font-weight: 800; font-size: 12px; margin-top: 4px;">WINTER 2026 END-SEMESTER EXAMINATION · ALL SUBJECTS COMBINED</div>
    </div>
    <div class="grid">
      <div><strong>Candidate:</strong> ${sName.toUpperCase()}</div>
      <div><strong>Roll No:</strong> #${roll}</div>
      <div><strong>Seat No:</strong> ${seatNo}</div>
      <div><strong>PRN:</strong> ${prn}</div>
      <div><strong>Program:</strong> ${program}</div>
      <div><strong>Clearance:</strong> ✓ All Registered Papers Cleared</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Code</th>
          <th style="text-align: left;">Subject</th>
          <th>Category</th>
          <th>Date</th>
          <th>Time</th>
          <th>Venue & Seat</th>
        </tr>
      </thead>
      <tbody>
        ${papers.map((p, idx) => `<tr><td>${idx + 1}</td><td><strong>${p.paperCode}</strong></td><td style="text-align: left;">${p.subjectName}</td><td>${p.category}</td><td>${p.date}</td><td>${p.time}</td><td>${p.room || 'Exam Hall A-101'} (${p.seatNo || 'Desk Block A'})</td></tr>`).join('')}
      </tbody>
    </table>
    <div class="foot">
      <div>OFFICIAL COMBINED EXAMINATION ADMIT CARD · ALL SUBJECTS INCLUDED</div>
      <div>CONTROLLER OF EXAMINATIONS</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and prints an official Attendance Defaulter Report (< 75% Criteria)
 */
export function printAttendanceDefaulterReport(defaulters = [], division = 'Div A', course = 'Information Technology', academicYear = 'Year 3 (TE)', semester = 'Semester 6') {
  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow popups to print defaulter report.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Attendance Defaulter Report - ${course} ${division}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 25px; font-size: 11px; }
    .card { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border: 1.5px solid #dc2626; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px; }
    h1 { font-size: 19px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
    .sub { font-size: 10px; color: #64748b; font-weight: 700; margin-top: 2px; }
    .pill { display: inline-block; background: #fee2e2; color: #b91c1c; border: 1px solid #f87171; padding: 3px 14px; border-radius: 4px; font-weight: 800; font-size: 10px; margin-top: 6px; text-transform: uppercase; }
    .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #fef2f2; padding: 10px 14px; border-radius: 6px; border: 1px solid #fecaca; margin-bottom: 16px; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10.5px; }
    th { background: #fee2e2; color: #991b1b; padding: 8px; border: 1px solid #fca5a5; font-size: 9px; text-transform: uppercase; font-weight: 800; }
    td { padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; }
    tr:nth-child(even) { background: #fff5f5; }
    .name-col { text-align: left !important; font-weight: 600; }
    .deficit { color: #dc2626; font-weight: 800; }
    .rules { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; font-size: 9.5px; color: #475569; line-height: 1.4; margin-bottom: 16px; }
    .signs { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #cbd5e1; margin-top: 12px; }
    .sign-box { text-align: center; width: 180px; }
    .script { font-family: 'Brush Script MT', cursive, serif; font-size: 18px; }
    .title { font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; border-top: 1px solid #94a3b8; padding-top: 2px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>EduTrack Institute of Technology (Autonomous)</h1>
      <div class="sub">DEPARTMENT OF ${course.toUpperCase()} · ACADEMIC AUDIT CELL</div>
      <div class="pill">Official Cumulative Attendance Defaulter Intimation (< 75.0% Criterion)</div>
    </div>

    <div class="meta">
      <div><strong>Department:</strong> ${course}</div>
      <div><strong>Academic Year:</strong> ${academicYear}</div>
      <div><strong>Semester:</strong> ${semester}</div>
      <div><strong>Division:</strong> ${division}</div>
      <div><strong>Defaulters Identified:</strong> ${defaulters.length} Candidates</div>
      <div><strong>Effective Term:</strong> Winter 2026 Phase</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Sr</th>
          <th>Roll #</th>
          <th class="name-col">Candidate Name</th>
          <th>Parent / Mobile</th>
          <th>Attended / Total</th>
          <th>Attendance %</th>
          <th>Deficit Classes</th>
          <th>Parent Alert Status</th>
        </tr>
      </thead>
      <tbody>
        ${defaulters.length === 0 ? '<tr><td colspan="8" style="padding: 20px; color: #16a34a; font-weight: 700;">No defaulters found! All students maintain ≥ 75% attendance.</td></tr>' : defaulters.map((d, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td style="font-weight: 700;">#${d.rollNumber}</td>
            <td class="name-col">${d.name}</td>
            <td>${d.phone || '+91 98200 11223'}</td>
            <td>${d.attended || 24} / ${d.totalClasses || 36}</td>
            <td class="deficit">${Number(d.percentage || d.attendancePercentage || 70).toFixed(1)}%</td>
            <td class="deficit">+${Math.max(1, Math.ceil(((0.75 * (d.totalClasses || 36)) - (d.attended || 24))))} Sessions</td>
            <td><span style="color: #b91c1c; font-weight: 700;">SMS & Call Sent</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="rules">
      <strong>Statutory Directive (Regulation 14-B of Autonomous Examination Board):</strong><br>
      As per university regulations, candidates with less than 75.0% cumulative attendance are barred from appearing in End-Semester Written and Practical Examinations. Candidates must submit medical condonation or complete required compensatory remedial sessions before Admit Card issuance.
    </div>

    <div class="signs">
      <div class="sign-box">
        <div class="script">Prof. Krrish Sharma</div>
        <div class="title">Class Teacher (${division})</div>
      </div>
      <div class="sign-box">
        <div class="script">Prof. Anjali Mehta</div>
        <div class="title">Guardian Faculty Member (GFM)</div>
      </div>
      <div class="sign-box">
        <div class="script">Dr. S. K. Joshi</div>
        <div class="title">Head of Department (HOD)</div>
      </div>
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="background: #dc2626; color: #fff; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print Defaulter Report / PDF
    </button>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generates and prints an official Academic Learner Classification & Remedial Action Report
 * Segregates Fast Learners and Slow Learners with assigned academic interventions.
 */
export function printAcademicLearnersReport(fastLearners = [], slowLearners = [], division = 'Div A', course = 'Information Technology', academicYear = 'Year 3 (TE)', semester = 'Semester 6') {
  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow popups to print academic performance report.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Academic Classification & Remedial Report - ${course} ${division}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 25px; font-size: 11px; }
    .card { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border: 1.5px solid #2563eb; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; }
    h1 { font-size: 19px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
    .pill { display: inline-block; background: #eff6ff; color: #1d4ed8; border: 1px solid #93c5fd; padding: 3px 14px; border-radius: 4px; font-weight: 800; font-size: 10px; margin-top: 6px; text-transform: uppercase; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; padding: 6px 10px; border-radius: 4px; margin: 16px 0 8px; }
    .sec-fast { background: #ecfdf5; color: #065f46; border-left: 4px solid #10b981; }
    .sec-slow { background: #fef2f2; color: #991b1b; border-left: 4px solid #ef4444; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px; }
    th { padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 8.5px; text-transform: uppercase; font-weight: 800; text-align: center; }
    td { padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; }
    .name-col { text-align: left !important; font-weight: 600; }
    .signs { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #cbd5e1; margin-top: 16px; }
    .sign-box { text-align: center; width: 180px; }
    .script { font-family: 'Brush Script MT', cursive, serif; font-size: 18px; }
    .title { font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; border-top: 1px solid #94a3b8; padding-top: 2px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>EduTrack Institute of Technology (Autonomous)</h1>
      <div style="font-size: 10px; color: #64748b; font-weight: 700;">NAAC CRITERION II · TEACHING-LEARNING & EVALUATION COMPLIANCE</div>
      <div class="pill">Student Academic Profiling: Advanced vs. Remedial Support Cohort</div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px; margin-bottom: 10px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <div><strong>Department:</strong> ${course}</div>
      <div><strong>Academic Year:</strong> ${academicYear}</div>
      <div><strong>Semester:</strong> ${semester}</div>
      <div><strong>Division:</strong> ${division}</div>
      <div><strong>Fast Learners:</strong> ${fastLearners.length} Students</div>
      <div><strong>Remedial Support:</strong> ${slowLearners.length} Students</div>
    </div>

    <!-- 1. FAST LEARNERS -->
    <div class="section-title sec-fast">🚀 Advanced Cohort (Fast Learners · ≥ 85% / High Academic Aptitude)</div>
    <table>
      <thead>
        <tr style="background: #f0fdf4;">
          <th style="width: 35px;">#</th>
          <th style="width: 55px;">Roll #</th>
          <th class="name-col">Candidate Name</th>
          <th style="width: 70px;">Score / SGPA</th>
          <th style="width: 60px;">Attendance</th>
          <th class="name-col">Enrichment Initiative & Responsibilities</th>
        </tr>
      </thead>
      <tbody>
        ${fastLearners.map((s, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>#${s.rollNumber}</strong></td>
            <td class="name-col">${s.name}</td>
            <td><strong style="color: #059669;">${s.totalPercent || 92}% (${s.sgpa || '9.2'})</strong></td>
            <td>${s.percentage || 94}%</td>
            <td class="name-col">Honors Capstone Project Lead, Competitive Programming Squad, Peer Mentor for Lab Batch</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- 2. SLOW LEARNERS / REMEDIAL -->
    <div class="section-title sec-slow">⚠️ Support Cohort (Slow Learners · Needs Academic Mentorship)</div>
    <table>
      <thead>
        <tr style="background: #fef2f2;">
          <th style="width: 35px;">#</th>
          <th style="width: 55px;">Roll #</th>
          <th class="name-col">Candidate Name</th>
          <th style="width: 70px;">Score / SGPA</th>
          <th style="width: 60px;">Attendance</th>
          <th class="name-col">Prescribed Remedial & Tutoring Intervention</th>
        </tr>
      </thead>
      <tbody>
        ${slowLearners.map((s, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>#${s.rollNumber}</strong></td>
            <td class="name-col">${s.name}</td>
            <td><strong style="color: #dc2626;">${s.totalPercent || 64}% (${s.sgpa || '6.8'})</strong></td>
            <td>${s.percentage || 71}%</td>
            <td class="name-col">Remedial Saturday Theory Clinic, Simplified Question Bank Coaching, 1-on-1 GFM Counseling</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="signs">
      <div class="sign-box">
        <div class="script">Prof. Krrish Sharma</div>
        <div class="title">Class Teacher & Evaluator</div>
      </div>
      <div class="sign-box">
        <div class="script">Prof. Anjali Mehta</div>
        <div class="title">Academic Mentor (GFM)</div>
      </div>
      <div class="sign-box">
        <div class="script">Dr. S. K. Joshi</div>
        <div class="title">Head of Department (HOD)</div>
      </div>
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="background: #2563eb; color: #fff; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print Academic Performance Report
    </button>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generates and prints an official Student Financial Fee Clearance Report
 */
export function printFeeClearanceReport(feeRecords = [], division = 'Div A', course = 'Information Technology', academicYear = 'Year 3 (TE)', semester = 'Semester 6') {
  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow popups to print fee clearance report.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fee Clearance Report - ${course} ${division}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 25px; font-size: 11px; }
    .card { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border: 1.5px solid #059669; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px; }
    h1 { font-size: 19px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
    .pill { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 3px 14px; border-radius: 4px; font-weight: 800; font-size: 10px; margin-top: 6px; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10.5px; }
    th { background: #ecfdf5; color: #065f46; padding: 8px; border: 1px solid #a7f3d0; font-size: 9px; text-transform: uppercase; font-weight: 800; }
    td { padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; }
    tr:nth-child(even) { background: #fafafa; }
    .signs { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #cbd5e1; margin-top: 16px; }
    .sign-box { text-align: center; width: 180px; }
    .script { font-family: 'Brush Script MT', cursive, serif; font-size: 18px; }
    .title { font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; border-top: 1px solid #94a3b8; padding-top: 2px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>EduTrack Institute of Technology (Autonomous)</h1>
      <div style="font-size: 10px; color: #64748b; font-weight: 700;">ACCOUNTS & FINANCE COMPLIANCE WING · TERM WINTER 2026</div>
      <div class="pill">Student Financial Clearance & Tuition Accounts Register</div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px; margin-bottom: 12px; background: #f0fdf4; padding: 8px 12px; border-radius: 6px; border: 1px solid #bbf7d0;">
      <div><strong>Department:</strong> ${course}</div>
      <div><strong>Academic Year:</strong> ${academicYear}</div>
      <div><strong>Semester:</strong> ${semester}</div>
      <div><strong>Division:</strong> ${division}</div>
      <div><strong>Total Students Audited:</strong> ${feeRecords.length}</div>
      <div><strong>Accounts Audit Date:</strong> Oct 03, 2026</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Sr</th>
          <th>Roll #</th>
          <th style="text-align: left;">Candidate Name</th>
          <th>Fee Category</th>
          <th>Accounts Receipt / Ref</th>
          <th>Payment Status</th>
          <th>Pending Dues</th>
          <th>Exam Clearance</th>
        </tr>
      </thead>
      <tbody>
        ${feeRecords.map((s, idx) => {
          const isPaid = s.feeStatus === 'paid' || !s.feeStatus;
          return `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>#${s.rollNumber}</strong></td>
            <td style="text-align: left; font-weight: 600;">${s.name}</td>
            <td>Open / General</td>
            <td style="font-family: monospace;">AC-992${s.rollNumber}</td>
            <td><strong style="color: ${isPaid ? '#059669' : '#dc2626'};">${isPaid ? '✓ Paid in Full' : '⚠️ Outstanding'}</strong></td>
            <td style="color: ${isPaid ? '#64748b' : '#dc2626'}; font-weight: ${isPaid ? 500 : 800};">${isPaid ? '₹0' : '₹28,500'}</td>
            <td><span style="font-weight: 700; color: ${isPaid ? '#059669' : '#dc2626'};">${isPaid ? '✓ Unlocked' : 'Accounts Hold'}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>

    <div class="signs">
      <div class="sign-box">
        <div class="script">Prof. Krrish Sharma</div>
        <div class="title">Class Teacher (${division})</div>
      </div>
      <div class="sign-box">
        <div class="script">Shri. V. K. Deshmukh</div>
        <div class="title">Finance & Accounts Officer</div>
      </div>
      <div class="sign-box">
        <div class="script">Dr. S. K. Joshi</div>
        <div class="title">Registrar / Director</div>
      </div>
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="background: #059669; color: #fff; padding: 10px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print Fee Clearance Report
    </button>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportAttendanceCSV(records, division = 'All', subject = 'Core Java') {
  const headers = ['Roll #', 'PRN', 'Student Name', 'Course', 'Division', 'Subject', 'Attendance %', 'Status', 'Hall Ticket Clearance'];
  const rows = records.map((s) => {
    const isEligible = s.percentage >= 75;
    return [
      s.rollNumber,
      `"${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}"`,
      `"${s.name}"`,
      `"${s.course || 'IT'}"`,
      s.division || 'A',
      `"${subject}"`,
      `${s.percentage.toFixed(1)}%`,
      isEligible ? 'Regular' : 'Defaulter',
      isEligible ? 'Eligible' : 'Blocked'
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Attendance_Register_Div_${division}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAcademicLearnersCSV(learners, division = 'All') {
  const headers = ['Roll #', 'Student Name', 'Division', 'Score %', 'CGPA', 'Category', 'Prescribed Intervention', 'GFM Mentor'];
  const rows = learners.map((s) => {
    const isFast = s.percentage >= 85;
    const isSlow = s.percentage < 60;
    const category = isFast ? 'Advanced Learner' : isSlow ? 'Remedial Track' : 'Continuous Learner';
    const intervention = isFast
      ? 'Honors & Research Projects'
      : isSlow
      ? 'Mandatory 1-on-1 Remedial & Question Banks'
      : 'Standard Course Progression';
    return [
      s.rollNumber,
      `"${s.name}"`,
      s.division || 'A',
      `${s.percentage.toFixed(1)}%`,
      s.cgpa || (s.percentage / 10).toFixed(2),
      category,
      `"${intervention}"`,
      '"Prof. Krrish Sharma"'
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Learners_Categorization_Div_${division}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportFeeClearanceCSV(students, division = 'All') {
  const headers = ['Roll #', 'PRN', 'Student Name', 'Course', 'Division', 'Fee Balance', 'Payment Status', 'Admit Clearance'];
  const rows = students.map((s) => {
    const isPaid = (s.feeBalance || 0) <= 0;
    return [
      s.rollNumber,
      `"${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}"`,
      `"${s.name}"`,
      `"${s.course || 'IT'}"`,
      s.division || 'A',
      isPaid ? 0 : s.feeBalance || 28500,
      isPaid ? 'Paid in Full' : 'Outstanding Dues',
      isPaid ? 'Cleared' : 'Withheld'
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Fee_Clearance_Register_Div_${division}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportHallTicketClearanceCSV(students, division = 'All') {
  const headers = ['Roll #', 'PRN', 'Student Name', 'Division', 'Attendance %', 'Fee Clearance', 'Admit Status', 'Verification Code'];
  const rows = students.map((s) => {
    const isEligible = s.percentage >= 75 && (s.feeBalance || 0) <= 0;
    return [
      s.rollNumber,
      `"${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}"`,
      `"${s.name}"`,
      s.division || 'A',
      `${s.percentage.toFixed(1)}%`,
      (s.feeBalance || 0) <= 0 ? 'Clear' : 'Pending',
      isEligible ? 'Issued & Valid' : 'Blocked / Withheld',
      `"HT-2026-${s.rollNumber}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Hall_Ticket_Clearance_Div_${division}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportStudentsRosterCSV(students, division = 'All') {
  const headers = ['Roll #', 'PRN', 'Student Name', 'Course', 'Division', 'Email', 'Attendance %', 'CGPA'];
  const rows = students.map((s) => [
    s.rollNumber,
    `"${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}"`,
    `"${s.name}"`,
    `"${s.course || 'IT'}"`,
    s.division || 'A',
    `"${s.email || ''}"`,
    `${Number(s.percentage || 75).toFixed(1)}%`,
    s.cgpa || (Number(s.percentage || 75) / 10).toFixed(2)
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Student_Roster_Div_${division}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * ============================================================================
 * 1. OFFICIAL EXCEL EXPORT (PROPER FORMATTED .XLS SPREADSHEET)
 * ============================================================================
 * Exports student roster in proper Excel-compatible formatted spreadsheet with:
 * - Institutional university masthead & metadata
 * - Department, division, semester, and timestamp header
 * - Executive statistics summary (Total enrolled, Attendance eligible, Defaulters, Distinction)
 * - Styled column headers with fill color & contrast text
 * - Clean cell borders, alternating zebra rows, centered roll numbers, formatted percentages
 * - Opens cleanly in Microsoft Excel, Google Sheets, and LibreOffice Calc
 */
export function exportStudentRosterExcel(students, meta = {}) {
  const department = meta.department || meta.course || 'All Departments';
  const division = meta.division || 'All Divisions';
  const semester = meta.semester || 'Semester 6';
  const academicYear = meta.academicYear || '2025-2026';
  const generatedDate = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Sort strictly by roll number ascending
  const sortedStudents = [...students].sort((a, b) => {
    const rA = parseInt(a.rollNumber, 10) || 0;
    const rB = parseInt(b.rollNumber, 10) || 0;
    return rA - rB;
  });

  const totalCount = sortedStudents.length;
  const eligibleCount = sortedStudents.filter((s) => Number(s.percentage || 0) >= 75).length;
  const defaulterCount = totalCount - eligibleCount;
  const distinctionCount = sortedStudents.filter((s) => Number(s.percentage || 0) >= 90).length;
  const avgAtt = totalCount > 0 ? (sortedStudents.reduce((acc, s) => acc + Number(s.percentage || 0), 0) / totalCount).toFixed(1) : '0.0';

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<!--[if gte mso 9]>
<xml>
  <x:ExcelWorkbook>
    <x:ExcelWorksheets>
      <x:ExcelWorksheet>
        <x:Name>Student Roster</x:Name>
        <x:WorksheetOptions>
          <x:DisplayGridlines/>
        </x:WorksheetOptions>
      </x:ExcelWorksheet>
    </x:ExcelWorksheets>
  </x:ExcelWorkbook>
</xml>
<![endif]-->
<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
<style>
  table { border-collapse: collapse; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
  .univ-banner { background-color: #0f172a; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; height: 38px; vertical-align: middle; }
  .sub-banner { background-color: #1e293b; color: #94a3b8; font-size: 10pt; text-align: center; height: 24px; vertical-align: middle; }
  .meta-cell { background-color: #f1f5f9; color: #334155; font-size: 10pt; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px; }
  .meta-val { background-color: #ffffff; color: #0f172a; font-size: 10pt; border: 1px solid #cbd5e1; padding: 6px 10px; }
  .stat-hdr { background-color: #e2e8f0; color: #0f172a; font-weight: bold; text-align: center; border: 1px solid #cbd5e1; }
  .th-header { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #0f172a; height: 30px; vertical-align: middle; font-size: 10.5pt; }
  .td-cell { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: middle; font-size: 10pt; }
  .td-center { text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: middle; font-size: 10pt; }
  .td-right { text-align: right; border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: middle; font-size: 10pt; }
  .row-even { background-color: #f8fafc; }
  .row-odd { background-color: #ffffff; }
  .badge-pass { background-color: #dcfce7; color: #15803d; font-weight: bold; text-align: center; }
  .badge-fail { background-color: #fee2e2; color: #b91c1c; font-weight: bold; text-align: center; }
  .badge-dist { background-color: #fef3c7; color: #b45309; font-weight: bold; text-align: center; }
</style>
</head>
<body>
  <table>
    <!-- Institutional Masthead -->
    <tr>
      <th colspan="11" class="univ-banner">EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</th>
    </tr>
    <tr>
      <th colspan="11" class="sub-banner">AFFILIATED TO STATE UNIVERSITY · ACCREDITED NAAC 'A++' · OFFICIAL STUDENT DIRECTORY & AUDIT REGISTER</th>
    </tr>
    <tr><td colspan="11" style="height: 10px;"></td></tr>

    <!-- Administrative Meta -->
    <tr>
      <td class="meta-cell">Department:</td>
      <td class="meta-val" colspan="2"><b>${department}</b></td>
      <td class="meta-cell">Division:</td>
      <td class="meta-val" colspan="2"><b>${division}</b></td>
      <td class="meta-cell">Semester:</td>
      <td class="meta-val" colspan="2"><b>${semester} (${academicYear})</b></td>
      <td class="meta-cell">Generated On:</td>
      <td class="meta-val"><b>${generatedDate}</b></td>
    </tr>
    <tr>
      <td class="meta-cell">Total Enrolled:</td>
      <td class="meta-val"><b>${totalCount}</b></td>
      <td class="meta-cell">Avg Attendance:</td>
      <td class="meta-val"><b>${avgAtt}%</b></td>
      <td class="meta-cell">Eligible (&ge;75%):</td>
      <td class="meta-val" style="color: #15803d;"><b>${eligibleCount}</b></td>
      <td class="meta-cell">Defaulters (&lt;75%):</td>
      <td class="meta-val" style="color: #b91c1c;"><b>${defaulterCount}</b></td>
      <td class="meta-cell">Distinction (&ge;90%):</td>
      <td class="meta-val" colspan="2" style="color: #b45309;"><b>${distinctionCount}</b></td>
    </tr>
    <tr><td colspan="11" style="height: 12px;"></td></tr>

    <!-- Table Column Headers -->
    <thead>
      <tr>
        <th class="th-header" style="width: 70px;">Roll #</th>
        <th class="th-header" style="width: 130px;">PRN / Enrolment</th>
        <th class="th-header" style="width: 220px; text-align: left; padding-left: 10px;">Student Full Name</th>
        <th class="th-header" style="width: 100px;">Department</th>
        <th class="th-header" style="width: 80px;">Division</th>
        <th class="th-header" style="width: 220px; text-align: left; padding-left: 10px;">Email Address</th>
        <th class="th-header" style="width: 110px;">Contact Phone</th>
        <th class="th-header" style="width: 100px;">Attendance %</th>
        <th class="th-header" style="width: 80px;">CGPA</th>
        <th class="th-header" style="width: 120px;">Fee Standing</th>
        <th class="th-header" style="width: 140px;">Hall Ticket Status</th>
      </tr>
    </thead>

    <!-- Table Body -->
    <tbody>
      ${sortedStudents.map((s, idx) => {
        const roll = s.rollNumber;
        const prn = s.prn || `RBT24${(s.course || 'IT').toUpperCase()}${String(roll).padStart(3, '0')}`;
        const name = s.name || 'Student Candidate';
        const course = s.course || department;
        const div = s.division || (division !== 'All' ? division : 'A');
        const email = s.email || `student.${roll}@edutrack.edu`;
        const phone = s.phone || '+91 98201 54321';
        const att = Number(s.percentage || 75);
        const cgpa = s.cgpa || (att / 10 + 0.15).toFixed(2);
        const feeBalance = Number(s.feeBalance !== undefined ? s.feeBalance : (att < 75 ? 40000 : 0));
        const isFeeOk = feeBalance <= 0;
        const isEligible = att >= 75 && isFeeOk;
        const rowClass = idx % 2 === 0 ? 'row-even' : 'row-odd';

        return `
      <tr class="${rowClass}">
        <td class="td-center"><b>${roll}</b></td>
        <td class="td-center" style="font-family: Consolas, monospace;">${prn}</td>
        <td class="td-cell" style="font-weight: 600;">${name}</td>
        <td class="td-center">${course}</td>
        <td class="td-center">Div ${div}</td>
        <td class="td-cell">${email}</td>
        <td class="td-center">${phone}</td>
        <td class="td-right ${att >= 75 ? 'badge-pass' : 'badge-fail'}"><b>${att.toFixed(1)}%</b></td>
        <td class="td-center"><b>${cgpa}</b></td>
        <td class="td-center ${isFeeOk ? 'badge-pass' : 'badge-fail'}"><b>${isFeeOk ? '✓ Paid in Full' : `₹${feeBalance.toLocaleString('en-IN')} Due`}</b></td>
        <td class="td-center ${isEligible ? 'badge-pass' : 'badge-fail'}"><b>${isEligible ? '✓ Unlocked / Issued' : '⚠️ Gatekeeper Hold'}</b></td>
      </tr>`;
      }).join('')}
    </tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedDept = String(department).replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedDiv = String(division).replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `EduTrack_Student_Roster_${sanitizedDept}_Div_${sanitizedDiv}_${new Date().toISOString().slice(0, 10)}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ============================================================================
 * 2. PRINT STUDENT ROSTER (OFFICIAL INSTITUTIONAL PRINT REGISTER)
 * ============================================================================
 * Generates and prints an official university student roster document with:
 * - Institutional university letterhead & accreditation banner
 * - Department, division, semester, and date summary
 * - Statistical KPI audit blocks
 * - Clean table with Roll No, PRN, Name, Attendance %, CGPA, Fee Status, and Invigilator Sign
 * - Signatures for Class Teacher, Head of Department, and Dean
 * - Automatic window.print() trigger
 */
export function printStudentRoster(students, meta = {}) {
  const printWindow = window.open('', '_blank', 'width=1080,height=850');
  if (!printWindow) {
    alert('Please allow popups to print official student roster.');
    return;
  }

  const department = meta.department || meta.course || 'Information Technology';
  const division = meta.division || 'A';
  const semester = meta.semester || 'Semester 6';
  const academicYear = meta.academicYear || 'Academic Year 2025 - 2026';
  const generatedDate = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Sort strictly by roll number ascending
  const sortedStudents = [...students].sort((a, b) => {
    const rA = parseInt(a.rollNumber, 10) || 0;
    const rB = parseInt(b.rollNumber, 10) || 0;
    return rA - rB;
  });

  const totalCount = sortedStudents.length;
  const eligibleCount = sortedStudents.filter((s) => Number(s.percentage || 0) >= 75).length;
  const defaulterCount = totalCount - eligibleCount;
  const distinctionCount = sortedStudents.filter((s) => Number(s.percentage || 0) >= 90).length;
  const avgAtt = totalCount > 0 ? (sortedStudents.reduce((acc, s) => acc + Number(s.percentage || 0), 0) / totalCount).toFixed(1) : '0.0';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduTrack Official Student Roster - ${department} (Div ${division})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 20px; }
    .sheet-card { max-width: 940px; margin: 0 auto; background: #ffffff; padding: 24px 28px; border-radius: 10px; border: 1.5px solid #0f172a; box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
    .univ-header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px; }
    .univ-name { font-size: 19px; font-weight: 900; letter-spacing: -0.01em; text-transform: uppercase; color: #0f172a; }
    .univ-sub { font-size: 9.5px; font-weight: 700; color: #475569; letter-spacing: 0.04em; margin-top: 2px; }
    .dept-title { font-size: 12px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 5px; }
    .doc-pill { display: inline-block; background: #0f172a; color: #ffffff; padding: 3px 14px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.06em; margin-top: 6px; text-transform: uppercase; }
    
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; font-size: 10px; }
    .meta-item { display: flex; flex-direction: column; }
    .meta-lbl { font-size: 8px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .meta-val { font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 1px; }

    .stats-bar { display: flex; justify-content: space-between; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 14px; margin-bottom: 14px; font-size: 10px; }
    .stat-badge { font-weight: 700; color: #1e40af; }
    .stat-badge b { color: #0f172a; }

    table.roster-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 16px; }
    table.roster-table th { background: #0f172a; color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 8.5px; padding: 7px 6px; border: 1px solid #0f172a; text-align: center; }
    table.roster-table td { padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; color: #1e293b; }
    table.roster-table tr:nth-child(even) { background: #f8fafc; }
    .name-col { text-align: left !important; font-weight: 700; color: #0f172a; }
    .prn-col { font-family: monospace; font-size: 9px; }
    
    .badge-ok { color: #15803d; font-weight: 800; }
    .badge-bad { color: #b91c1c; font-weight: 800; }
    .badge-dist { color: #b45309; font-weight: 800; }

    .signs-row { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; margin-top: 16px; border-top: 1.5px solid #0f172a; }
    .sign-box { text-align: center; width: 180px; }
    .sig-script { font-family: 'Brush Script MT', cursive, serif; font-size: 19px; color: #0f172a; margin-bottom: 2px; }
    .sign-title { font-size: 8.5px; font-weight: 800; color: #475569; text-transform: uppercase; border-top: 1px solid #94a3b8; padding-top: 4px; }

    .doc-footer { margin-top: 12px; display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 6px; }

    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet-card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 16px; display: flex; gap: 10px; justify-content: center;">
    <button onclick="window.print()" style="background: #0f172a; color: #ffffff; padding: 9px 22px; border: none; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; display: inline-flex; alignItems: center; gap: 6px;">
      🖨️ Print Student Roster / Save as PDF
    </button>
    <button onclick="window.close()" style="background: #f1f5f9; color: #334155; padding: 9px 18px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
      ✕ Close Preview
    </button>
  </div>

  <div class="sheet-card">
    <div class="univ-header">
      <div class="univ-name">EduTrack Institute of Technology (Autonomous)</div>
      <div class="univ-sub">AFFILIATED TO STATE UNIVERSITY · APPROVED BY AICTE & UGC · ACCREDITED NAAC 'A++'</div>
      <div class="dept-title">Department of ${department} · Official Class Directory & Audit Register</div>
      <div class="doc-pill">Class Attendance, Academic Standing & Clearance Roster</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-lbl">Department & Course</span>
        <span class="meta-val">${department}</span>
      </div>
      <div class="meta-item">
        <span class="meta-lbl">Division / Batch</span>
        <span class="meta-val">Division ${division}</span>
      </div>
      <div class="meta-item">
        <span class="meta-lbl">Semester & Year</span>
        <span class="meta-val">${semester} (${academicYear})</span>
      </div>
      <div class="meta-item">
        <span class="meta-lbl">Report Generated</span>
        <span class="meta-val">${generatedDate}</span>
      </div>
    </div>

    <div class="stats-bar">
      <span class="stat-badge">Total Candidates: <b>${totalCount}</b></span>
      <span class="stat-badge">Average Attendance: <b>${avgAtt}%</b></span>
      <span class="stat-badge">Finals Cleared (&ge;75%): <b style="color: #15803d;">${eligibleCount}</b></span>
      <span class="stat-badge">Defaulters (&lt;75%): <b style="color: #b91c1c;">${defaulterCount}</b></span>
      <span class="stat-badge">Distinction (&ge;90%): <b style="color: #b45309;">${distinctionCount}</b></span>
    </div>

    <table class="roster-table">
      <thead>
        <tr>
          <th style="width: 45px;">Roll #</th>
          <th style="width: 100px;">PRN</th>
          <th class="name-col" style="padding-left: 8px;">Candidate Full Name</th>
          <th style="width: 55px;">Div</th>
          <th style="width: 75px;">Attendance</th>
          <th style="width: 55px;">CGPA</th>
          <th style="width: 85px;">Fee Status</th>
          <th style="width: 100px;">Hall Ticket Status</th>
          <th style="width: 90px;">Candidate Sign</th>
        </tr>
      </thead>
      <tbody>
        ${sortedStudents.map((s) => {
          const roll = s.rollNumber;
          const prn = s.prn || `RBT24${(s.course || 'IT').toUpperCase()}${String(roll).padStart(3, '0')}`;
          const name = s.name || 'Student Candidate';
          const div = s.division || division;
          const att = Number(s.percentage || 75);
          const cgpa = s.cgpa || (att / 10 + 0.15).toFixed(2);
          const feeBalance = Number(s.feeBalance !== undefined ? s.feeBalance : (att < 75 ? 40000 : 0));
          const isFeeOk = feeBalance <= 0;
          const isEligible = att >= 75 && isFeeOk;

          return `
        <tr>
          <td style="font-weight: 800;">${roll}</td>
          <td class="prn-col">${prn}</td>
          <td class="name-col" style="padding-left: 8px;">${name}</td>
          <td>${div}</td>
          <td class="${att >= 75 ? 'badge-ok' : 'badge-bad'}">${att.toFixed(1)}%</td>
          <td style="font-weight: 700;">${cgpa}</td>
          <td class="${isFeeOk ? 'badge-ok' : 'badge-bad'}">${isFeeOk ? 'Paid' : `₹${feeBalance.toLocaleString('en-IN')}`}</td>
          <td class="${isEligible ? 'badge-ok' : 'badge-bad'}">${isEligible ? '✓ Released' : '⚠️ Withheld'}</td>
          <td></td>
        </tr>`;
        }).join('')}
      </tbody>
    </table>

    <div class="signs-row">
      <div class="sign-box">
        <div class="sig-script">Prof. Krrish Sharma</div>
        <div class="sign-title">Class Teacher / Proctor</div>
      </div>
      <div class="sign-box">
        <div class="sig-script">Dr. S. R. Joshi</div>
        <div class="sign-title">Head of Department (${department})</div>
      </div>
      <div class="sign-box">
        <div class="sig-script">Dr. M. K. Deshmukh</div>
        <div class="sign-title">Dean / Controller of Exams</div>
      </div>
    </div>

    <div class="doc-footer">
      <span>Official Autonomous Record · EduTrack Campus ERP System</span>
      <span>Confidential Department Document · Page 1 of 1</span>
      <span>Security Verification: EDUTRACK-ROSTER-2026-OK</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * ============================================================================
 * 3. BATCH HALL TICKETS GENERATION (1 STUDENT PER PAGE, SORTED BY ROLL NUMBER)
 * ============================================================================
 * Prints all students' hall tickets at once, where:
 * - Students are strictly sorted by Roll Number ascending
 * - Each student's complete official hall ticket renders on a dedicated A4 page
 * - Strictly paginated with @media print { page-break-after: always; break-after: page; }
 * - Includes complete combined examination schedule, photo, barcode, and signature lines
 */
export function printBatchHallTickets(students, options = {}) {
  if (!students || students.length === 0) {
    alert('No students selected for hall ticket batch printing.');
    return;
  }

  // Sort strictly by roll number ascending (e.g. 101, 102, 103...)
  const sortedStudents = [...students].sort((a, b) => {
    const rA = parseInt(a.rollNumber, 10) || 0;
    const rB = parseInt(b.rollNumber, 10) || 0;
    return rA - rB;
  });

  const printWindow = window.open('', '_blank', 'width=1040,height=900');
  if (!printWindow) {
    alert('Please allow popups to print official hall tickets.');
    return;
  }

  const semester = options.semester || 'Semester 6';
  const examSeason = options.season || 'Winter 2026';
  const totalCount = sortedStudents.length;
  const firstRoll = sortedStudents[0].rollNumber;
  const lastRoll = sortedStudents[sortedStudents.length - 1].rollNumber;

  const defaultPapers = [
    { paperCode: 'IT-301', subjectName: 'Core Java & Object-Oriented Frameworks', category: 'Theory Written', date: 'Nov 10, 2026', day: 'Tuesday', time: '10:00 AM - 01:00 PM', room: 'Exam Hall A-101', seatNo: 'Desk #14 (Block A)' },
    { paperCode: 'IT-302', subjectName: 'Database Management Systems & Transactions', category: 'Theory Written', date: 'Nov 13, 2026', day: 'Friday', time: '10:00 AM - 01:00 PM', room: 'Exam Hall A-102', seatNo: 'Desk #14 (Block A)' },
    { paperCode: 'IT-303', subjectName: 'Distributed Systems & Cloud Computing', category: 'Theory Written', date: 'Nov 17, 2026', day: 'Tuesday', time: '10:00 AM - 01:00 PM', room: 'Exam Hall B-201', seatNo: 'Desk #14 (Block B)' },
    { paperCode: 'IT-304', subjectName: 'Computer Networks & Network Security', category: 'Theory Written', date: 'Nov 20, 2026', day: 'Friday', time: '10:00 AM - 01:00 PM', room: 'Exam Hall B-202', seatNo: 'Desk #14 (Block B)' },
    { paperCode: 'IT-301L', subjectName: 'Core Java Programming Laboratory Viva', category: 'Practical Lab & Viva', date: 'Nov 24, 2026', day: 'Tuesday', time: '09:00 AM - 01:00 PM', room: 'Computing Lab A-1', seatNo: 'Terminal #08' },
    { paperCode: 'IT-302L', subjectName: 'DBMS & SQL Performance Laboratory Viva', category: 'Practical Lab & Viva', date: 'Nov 26, 2026', day: 'Thursday', time: '01:30 PM - 05:30 PM', room: 'Computing Lab A-2', seatNo: 'Terminal #08' },
    { paperCode: 'IT-305', subjectName: 'Capstone Project Phase 1 Board Defense', category: 'Project Defense', date: 'Dec 01, 2026', day: 'Tuesday', time: '09:30 AM - 04:30 PM', room: 'Seminar Hall 1', seatNo: 'Panel 2' }
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Batch Hall Tickets - Roll #${firstRoll} to #${lastRoll} (${totalCount} Students)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm 8mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    body {
      background: #f1f5f9;
      color: #0f172a;
      padding: 20px;
    }
    .batch-control-bar {
      max-width: 900px;
      margin: 0 auto 20px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .batch-control-title {
      font-size: 14px;
      font-weight: 800;
    }
    .batch-control-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .batch-control-btn {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }
    .batch-control-btn:hover {
      background: #1d4ed8;
    }

    /* EACH STUDENT'S HALL TICKET PAGE */
    .batch-hall-ticket-page {
      max-width: 860px;
      margin: 0 auto 30px auto;
      background: #ffffff;
      padding: 22px 26px;
      border-radius: 8px;
      border: 1.5px solid #0f172a;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      position: relative;
    }

    .univ-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .univ-title {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }
    .univ-sub {
      font-size: 8.5px;
      color: #475569;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-top: 2px;
    }
    .exam-office {
      font-size: 10px;
      color: #2563eb;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 3px;
    }
    .doc-pill {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      padding: 2.5px 12px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
      margin-top: 4px;
      text-transform: uppercase;
    }

    .cred-grid {
      display: grid;
      grid-template-columns: 1fr 120px;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 10px;
    }
    .fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 12px;
      font-size: 10px;
    }
    .kv {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 2px;
    }
    .lbl {
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 8px;
    }
    .val {
      font-weight: 700;
      color: #0f172a;
    }
    .photo-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #cbd5e1;
      padding-left: 8px;
    }
    .photo-box {
      width: 65px;
      height: 75px;
      border: 1.5px solid #64748b;
      border-radius: 4px;
      overflow: hidden;
      background: #e2e8f0;
      margin-bottom: 3px;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    table.sched-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      margin-bottom: 8px;
    }
    table.sched-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8px;
      padding: 5px 4px;
      border: 1px solid #cbd5e1;
      text-align: center;
    }
    table.sched-table td {
      padding: 4px 5px;
      border: 1px solid #e2e8f0;
      text-align: center;
      color: #1e293b;
    }
    table.sched-table tr:nth-child(even) {
      background: #fafafa;
    }
    .title-col {
      text-align: left !important;
      font-weight: 600;
      font-size: 9px;
    }
    .tag-theory {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5px;
      font-weight: 700;
    }
    .tag-lab {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5px;
      font-weight: 700;
    }
    .tag-proj {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5px;
      font-weight: 700;
    }

    .rules-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 10px;
      font-size: 8px;
      color: #475569;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    .rules-box strong {
      color: #0f172a;
    }

    .sign-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;
      margin-top: 4px;
      border-top: 1px solid #cbd5e1;
    }
    .sign-box {
      text-align: center;
      width: 140px;
    }
    .sign-box-rect {
      width: 100%;
      height: 28px;
      border: 1px dashed #cbd5e1;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.5px;
      color: #94a3b8;
    }
    .sig-script {
      font-family: 'Brush Script MT', cursive, serif;
      font-size: 16px;
      color: #0f172a;
    }
    .sign-lbl {
      font-size: 7.5px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      border-top: 1px solid #94a3b8;
      padding-top: 2px;
    }

    .foot-stamp {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5px;
      color: #94a3b8;
      border-top: 1px dashed #e2e8f0;
      padding-top: 4px;
    }

    /* CRITICAL PRINT STYLES: 1 STUDENT PER PAGE ACCORDING TO ROLL NO */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .no-print, .batch-control-bar {
        display: none !important;
      }
      .batch-hall-ticket-page {
        margin: 0 !important;
        border: 1.5px solid #0f172a !important;
        box-shadow: none !important;
        padding: 10px 14px !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        min-height: 280mm !important;
        max-height: 290mm !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
      }
      .batch-hall-ticket-page:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
    }
  </style>
</head>
<body>
  <div class="batch-control-bar no-print">
    <div>
      <div class="batch-control-title">🖨️ Batch Hall Tickets Deck: ${totalCount} Candidates Ready</div>
      <div class="batch-control-meta">Strictly ordered by Roll Number (${firstRoll} - ${lastRoll}) · 1 Student Admit Card per A4 Page</div>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="batch-control-btn" onclick="window.print()">
        <span>Print All ${totalCount} Hall Tickets (A4)</span>
      </button>
      <button class="batch-control-btn" style="background: #334155;" onclick="window.close()">
        <span>✕ Close</span>
      </button>
    </div>
  </div>

  ${sortedStudents.map((s, pageIndex) => {
    const sName = s.name || 'Candidate';
    const roll = s.rollNumber;
    const seatNo = s.seatNumber || `2024-IT-${String(roll).padStart(3, '0')}`;
    const prn = s.prn || `RBT24${(s.course || 'IT').toUpperCase()}${String(roll).padStart(3, '0')}`;
    const program = s.program || `B.Tech in ${s.course === 'IT' ? 'Information Technology' : (s.course || 'Information Technology')}`;
    const division = s.division ? (String(s.division).startsWith('Div') ? s.division : `Div ${s.division}`) : 'Div A';
    const center = s.center || 'Campus Center #04 (Examination Block A & B)';
    const attPct = Number(s.percentage || 75).toFixed(1);
    const avatarUrl = s.avatarUrl || (Number(roll) % 2 === 0 ? '/assets/male_student_avatar_2.jpg' : '/assets/student_avatar.jpg');
    const isCleared = Number(s.percentage || 75) >= 75 && Number(s.feeBalance || 0) <= 0;

    return `
  <div class="batch-hall-ticket-page" id="hall-ticket-roll-${roll}">
    <div>
      <div class="univ-header">
        <div class="univ-title">EduTrack Institute of Technology (Autonomous)</div>
        <div class="univ-sub">AFFILIATED TO STATE UNIVERSITY · APPROVED BY AICTE & UGC · ACCREDITED NAAC 'A++'</div>
        <div class="exam-office">Office of the Controller of Examinations · End-Semester Examination Admit Card</div>
        <div class="doc-pill">${examSeason} Examination Hall Ticket · All Subjects Combined</div>
      </div>

      <div class="cred-grid">
        <div class="fields">
          <div class="kv"><span class="lbl">Candidate Name:</span><span class="val">${sName.toUpperCase()}</span></div>
          <div class="kv"><span class="lbl">Roll Number / Div:</span><span class="val" style="color: #2563eb;">#${roll} (${division})</span></div>
          <div class="kv"><span class="lbl">Seat Number:</span><span class="val" style="font-family: monospace; color: #2563eb;">${seatNo}</span></div>
          <div class="kv"><span class="lbl">PRN / Enrolment No:</span><span class="val" style="font-family: monospace;">${prn}</span></div>
          <div class="kv"><span class="lbl">Degree & Program:</span><span class="val">${program}</span></div>
          <div class="kv"><span class="lbl">Semester:</span><span class="val">${semester} (${examSeason})</span></div>
          <div class="kv"><span class="lbl">Exam Center & Block:</span><span class="val">${center}</span></div>
          <div class="kv"><span class="lbl">Admit Clearance:</span><span class="val" style="color: ${isCleared ? '#059669' : '#dc2626'};">${isCleared ? '✓ Cleared & Issued' : '⚠️ Provisional Hold'} (${attPct}% Att)</span></div>
        </div>

        <div class="photo-col">
          <div class="photo-box">
            <img src="${avatarUrl}" alt="${sName}" onerror="this.src='/assets/student_avatar.jpg'" />
          </div>
          <div style="font-size: 7.5px; font-family: monospace; font-weight: 700; color: #0f172a;">|||| | ||||| | |||</div>
          <div style="font-size: 7px; color: #64748b; font-family: monospace;">HT-${roll}</div>
        </div>
      </div>

      <div class="banner-bar">
        <span>Combined Examination Schedule (All 7 Registered Papers · Theory, Practical & Project)</span>
        <span>Autonomous CBCS Scheme 2026</span>
      </div>

      <table class="sched-table">
        <thead>
          <tr>
            <th style="width: 25px;">#</th>
            <th style="width: 60px;">Paper Code</th>
            <th class="title-col">Course Title</th>
            <th style="width: 85px;">Category</th>
            <th style="width: 75px;">Date & Day</th>
            <th style="width: 95px;">Time Slot</th>
            <th style="width: 90px;">Venue / Desk</th>
            <th style="width: 55px;">Invigilator</th>
          </tr>
        </thead>
        <tbody>
          ${defaultPapers.map((p, idx) => {
            const isLab = p.category.includes('Practical');
            const isProj = p.category.includes('Project');
            const tagClass = isLab ? 'tag-lab' : isProj ? 'tag-proj' : 'tag-theory';
            return `
            <tr>
              <td>${idx + 1}</td>
              <td style="font-family: monospace; font-weight: 800;">${p.paperCode}</td>
              <td class="title-col">${p.subjectName}</td>
              <td><span class="${tagClass}">${p.category}</span></td>
              <td>${p.date}</td>
              <td style="font-weight: 700;">${p.time}</td>
              <td>${p.room}</td>
              <td></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <div class="rules-box">
        <strong>Mandatory Examination Directives:</strong>
        1. Candidates must produce this printed Hall Ticket along with their RFID Student Identity Smart Card at the examination hall entrance.
        2. Mobile phones, programmable calculators, smartwatch devices, and digital media are strictly prohibited inside the hall.
        3. Candidates must be seated at their designated desk 15 minutes before paper commencement. No candidate will be admitted after 30 minutes from start.
      </div>
    </div>

    <div>
      <div class="sign-row">
        <div class="sign-box">
          <div class="sign-box-rect">Candidate Sign in Invigilator Presence</div>
          <div class="sign-lbl">Candidate Signature</div>
        </div>
        <div class="sign-box">
          <div class="sig-script">Prof. Krrish Sharma</div>
          <div class="sign-lbl">Faculty Proctor / Mentor</div>
        </div>
        <div class="sign-box">
          <div class="sig-script">Dr. M. K. Deshmukh</div>
          <div class="sign-lbl">Controller of Examinations</div>
        </div>
      </div>

      <div class="foot-stamp">
        <span>EduTrack ERP Batch Admit Card · Candidate Roll #${roll}</span>
        <span>Page ${pageIndex + 1} of ${totalCount} (Strict Roll No. Order)</span>
        <span>Barcode Ref: HT-2026-${roll}-${prn}</span>
      </div>
    </div>
  </div>`;
  }).join('')}

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * ============================================================================
 * 4. COMPREHENSIVE STUDENT 360° DOSSIER GENERATOR (FULL DATA, MULTI-PAGE A4)
 * ============================================================================
 * Generates an official university-grade academic dossier containing ALL sections:
 * - Demographics, Personal Bio, PRN, Roll #, Degree, Avatar & Barcode
 * - Subject-wise Marks Table (CIE, Midterm, Practical, Total %, Letter Grade, Teacher)
 * - Academic KPI Tiles: CGPA, SGPA, Percentage, Earned Credits, Best & Weak Subject
 * - Tuition & Institutional Accounts Ledger (Total fee, paid, balance, transactions table)
 * - Physical & Lab Attendance Audit (Lectures attended/conducted, defaulter metrics, remedial classes needed)
 * - Coursework Submissions (All assignments, timestamps, filenames, scores, faculty remarks)
 * - 4-Tier Examination Clearance & Gatekeeper Status
 * - Official Institutional Signatures (Candidate, Proctor, HOD, Dean)
 *
 * Uses strict page-break CSS (@media print) to flow gracefully across multiple A4 pages
 * without clipping any sections or tables.
 */
export function buildStudentComprehensiveDossierHtml(student, pageIndex = 0, totalStudents = 1) {
  const matched = (PRESET_STUDENT_PERSONAS || []).find(
    (p) => p.rollNumber === Number(student.rollNumber) || p.id === student.id
  ) || {};

  const roll = student.rollNumber || matched.rollNumber || 101;
  const name = student.name || matched.name || 'Candidate';
  const percentage = Number(student.percentage || matched.percentage || 75.0);
  const isDefaulter = percentage < 75;
  const isTopper = percentage >= 90;
  const isFirstClass = percentage >= 75;
  const deptCode = (student.course || matched.course || 'IT').toUpperCase();
  const division = student.division || matched.division || 'A';
  const prn = student.prn || matched.prn || `PRN-RBT24${deptCode}${String(roll).padStart(3, '0')}`;
  const semester = student.semester || matched.semester || 'Semester 6';
  const year = student.year || matched.year || 3;
  const program = student.program || matched.programFull || `B.Tech in ${deptCode === 'IT' ? 'Information Technology' : deptCode}`;
  const email = student.email || matched.email || `student.${roll}@edutrack.edu`;
  const phone = student.phone || matched.phone || '+91 98765 43210';
  const gender = student.gender || matched.gender || (Number(roll) % 2 === 0 ? 'Male' : 'Female');
  const admissionYear = student.admissionYear || matched.admissionYear || 2024;
  const cgpa = (matched.cgpa || (percentage / 10 + 0.15)).toFixed(2);
  const sgpa = (matched.sgpa || (percentage / 10 + 0.25)).toFixed(2);
  const earnedCredits = isDefaulter ? 20.0 : 24.0;
  const totalCredits = 24.0;
  const standing = isTopper ? 'First Class with Distinction' : isFirstClass ? 'First Class' : 'Pass Standing';
  const avatarUrl = student.avatarUrl || matched.avatarUrl || (Number(roll) % 2 === 0 ? '/assets/male_student_avatar_2.jpg' : '/assets/student_avatar.jpg');

  // Tuition & Accounts calculation
  const feeTotal = Number(student.feeTotal || 85000);
  const feePaid = Number(
    student.feePaid !== undefined
      ? student.feePaid
      : isDefaulter || Number(roll) === 102 || Number(roll) === 105
        ? 45000
        : 85000
  );
  const feeBalance = Math.max(0, feeTotal - feePaid);
  const isFeePaid = feePaid >= feeTotal;

  // Attendance metrics
  const totalLectures = 84;
  const attendedLectures = Math.round((percentage / 100) * totalLectures);
  const missedLectures = totalLectures - attendedLectures;
  const lecturesNeededFor75 = isDefaulter
    ? Math.max(1, Math.ceil((0.75 * totalLectures - attendedLectures) / (1 - 0.75)))
    : 0;

  // Calibrated Subject Marks
  const scale = percentage / 100;
  const subjects = [
    { code: `${deptCode}-301`, name: 'Core Java & OOP Frameworks', type: 'Theory', cie: Math.min(30, Math.round(28 * scale + 2)), midterm: Math.min(50, Math.round(48 * scale + 2)), practical: Math.min(25, Math.round(24 * scale + 1)), total: Math.min(100, Math.round(percentage + 4)), grade: percentage >= 85 ? 'O' : percentage >= 75 ? 'A+' : 'A', teacher: 'Prof. Krrish Sharma' },
    { code: `${deptCode}-302`, name: 'Database Management Systems & SQL', type: 'Theory', cie: Math.min(30, Math.round(26 * scale + 1)), midterm: Math.min(50, Math.round(44 * scale + 1)), practical: Math.min(25, Math.round(22 * scale)), total: Math.min(100, Math.round(percentage + 1)), grade: percentage >= 80 ? 'A+' : percentage >= 65 ? 'A' : 'B+', teacher: 'Prof. Anjali Mehta' },
    { code: `${deptCode}-303`, name: 'Operating Systems & System Architecture', type: 'Theory', cie: Math.min(30, Math.round(24 * scale)), midterm: Math.min(50, Math.round(42 * scale - 2)), practical: Math.min(25, Math.round(20 * scale)), total: Math.min(100, Math.round(percentage - 3)), grade: percentage >= 75 ? 'A' : 'B+', teacher: 'Dr. Suresh Verma' },
    { code: `${deptCode}-304`, name: 'Computer Networks & Security', type: 'Theory', cie: Math.min(30, Math.round(22 * scale - 1)), midterm: Math.min(50, Math.round(38 * scale - 3)), practical: Math.min(25, Math.round(18 * scale)), total: Math.min(100, Math.round(percentage - 6)), grade: percentage >= 70 ? 'B+' : 'B', teacher: 'Prof. R. Deshmukh' },
    { code: `${deptCode}-301L`, name: 'Core Java Programming Laboratory', type: 'Practical Lab', cie: Math.min(30, Math.round(29 * scale + 1)), midterm: Math.min(50, Math.round(47 * scale + 3)), practical: Math.min(25, Math.round(25 * scale)), total: Math.min(100, Math.round(percentage + 6)), grade: 'O', teacher: 'Prof. Krrish Sharma' }
  ];

  const bestSub = [...subjects].sort((a, b) => b.total - a.total)[0];
  const weakSub = [...subjects].sort((a, b) => a.total - b.total)[0];

  // Coursework Submissions
  const submissions = [
    { title: 'JDBC Student Management Project', subject: 'Core Java (IT-301)', date: '2026-10-02', file: `${name.replace(/\s+/g, '_')}_JDBC_Project.zip`, score: isDefaulter ? '14 / 20' : '19 / 20', status: 'Graded', remarks: isDefaulter ? 'Basic implementation works; parameter binding and exception handling require revision.' : 'Outstanding DAO architecture, HikariCP connection pool, and well-structured queries.' },
    { title: 'Collections & Generics Framework Lab', subject: 'Java Lab (IT-301L)', date: '2026-09-29', file: 'Collections_Generics_Lab.zip', score: isDefaulter ? '18 / 25' : '24 / 25', status: 'Graded', remarks: isDefaulter ? 'Lab journal complete. Oral viva answers were satisfactory.' : 'Full marks in code execution and concurrent collection algorithms.' },
    { title: 'Relational Schema Normalization & BCNF', subject: 'DBMS (IT-302)', date: '2026-09-22', file: 'DBMS_Normalization_Report.pdf', score: isDefaulter ? '15 / 20' : '18 / 20', status: 'Graded', remarks: 'Correct functional dependency diagrams and decomposition proofs.' },
    { title: 'Multi-threaded TCP Socket Client-Server', subject: 'Networks (IT-304)', date: isDefaulter ? 'Pending' : '2026-10-03', file: isDefaulter ? 'Not Submitted' : 'Socket_Server_Module.zip', score: isDefaulter ? '0 / 20' : '18 / 20', status: isDefaulter ? 'Overdue' : 'Graded', remarks: isDefaulter ? 'Assignment overdue. Candidate reminded to submit to avoid internal marks deduction.' : 'Verified bidirectional packet exchange on Linux host.' }
  ];

  // Fee ledger
  const feeLedger = [
    { txnId: 'TXN-88219-HDFC', date: '2026-08-10', term: 'Term 1 Tuition & Campus Infrastructure', mode: 'HDFC NetBanking', amount: 45000, status: 'Settled', receiptNo: 'REC-2026-00412' },
    { txnId: isFeePaid ? 'TXN-91104-UPI' : 'PENDING-TERM-2', date: isFeePaid ? '2026-08-14' : '2026-10-25', term: 'Term 2 Examination & Laboratory Dues', mode: isFeePaid ? 'Axis Bank UPI' : 'Pending Payment', amount: 40000, status: isFeePaid ? 'Settled' : 'Pending Dues', receiptNo: isFeePaid ? 'REC-2026-00891' : '--' }
  ];

  return `
  <div class="student-dossier-packet" id="student-dossier-roll-${roll}">
    <!-- ==================== INSTITUTIONAL LETTERHEAD ==================== -->
    <div class="dossier-header avoid-break">
      <div class="univ-logo-title">EduTrack Institute of Technology (Autonomous)</div>
      <div class="univ-sub">AFFILIATED TO STATE UNIVERSITY · APPROVED BY AICTE & UGC · ACCREDITED NAAC 'A++'</div>
      <div class="univ-dept">Office of the Registrar & Academic Affairs · Comprehensive Student 360° Record</div>
      <div class="doc-badge">Official Cumulative Student Dossier & Performance Audit</div>
    </div>

    <!-- ==================== DEMOGRAPHICS & PROFILE ==================== -->
    <div class="profile-meta-grid avoid-break">
      <div class="profile-info-fields">
        <div class="p-row"><span class="p-lbl">Student Full Name:</span><span class="p-val" style="font-size: 13px; color: #0f172a;"><b>${name.toUpperCase()}</b></span></div>
        <div class="p-row"><span class="p-lbl">Roll Number & Div:</span><span class="p-val" style="color: #2563eb;"><b>#${roll} (Division ${division})</b></span></div>
        <div class="p-row"><span class="p-lbl">Unique PRN / Enrolment:</span><span class="p-val" style="font-family: monospace;"><b>${prn}</b></span></div>
        <div class="p-row"><span class="p-lbl">Degree & Program:</span><span class="p-val"><b>${program}</b></span></div>
        <div class="p-row"><span class="p-lbl">Current Year & Semester:</span><span class="p-val"><b>Year ${year} · ${semester} (Winter 2026)</b></span></div>
        <div class="p-row"><span class="p-lbl">Official Email:</span><span class="p-val">${email}</span></div>
        <div class="p-row"><span class="p-lbl">Contact Phone:</span><span class="p-val">${phone}</span></div>
        <div class="p-row"><span class="p-lbl">Gender & Admission Year:</span><span class="p-val">${gender} · Batch of ${admissionYear}</span></div>
        <div class="p-row"><span class="p-lbl">Academic Standing:</span><span class="p-val" style="color: ${isTopper ? '#b45309' : isFirstClass ? '#15803d' : '#0284c7'};"><b>${standing}</b></span></div>
      </div>

      <div class="photo-badge-col">
        <div class="avatar-frame">
          <img src="${avatarUrl}" alt="${name}" onerror="this.src='/assets/student_avatar.jpg'" />
        </div>
        <div class="barcode-mock">||||| | |||| | ||| | |||||</div>
        <div class="barcode-text">PRN: ${prn}</div>
        <div class="status-stamp ${isDefaulter ? 'stamp-warn' : 'stamp-ok'}">
          ${isDefaulter ? '⚠️ ATTENDANCE DEFAULTER' : '✓ GOOD STANDING'}
        </div>
      </div>
    </div>

    <!-- ==================== EXECUTIVE KPI CARDS ==================== -->
    <div class="kpi-grid avoid-break">
      <div class="kpi-card">
        <div class="kpi-lbl">Cumulative CGPA</div>
        <div class="kpi-val" style="color: #0284c7;">${cgpa} <span style="font-size: 10px; color: #64748b;">/ 10.0</span></div>
        <div class="kpi-sub">SGPA: ${sgpa} · Credits: ${earnedCredits} / ${totalCredits}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-lbl">Academic Percentage</div>
        <div class="kpi-val" style="color: ${isTopper ? '#d97706' : '#15803d'};">${percentage.toFixed(1)}%</div>
        <div class="kpi-sub">${standing}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-lbl">Total Fee Accounts</div>
        <div class="kpi-val" style="color: ${isFeePaid ? '#15803d' : '#b91c1c'};">₹${feePaid.toLocaleString('en-IN')}</div>
        <div class="kpi-sub">${isFeePaid ? '✓ Paid in Full' : `₹${feeBalance.toLocaleString('en-IN')} Due`}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-lbl">Attendance Rate</div>
        <div class="kpi-val" style="color: ${isDefaulter ? '#b91c1c' : '#15803d'};">${percentage.toFixed(1)}%</div>
        <div class="kpi-sub">${attendedLectures} of ${totalLectures} lectures (${isDefaulter ? `${lecturesNeededFor75} remedial needed` : 'Eligible'})</div>
      </div>
    </div>

    <!-- ==================== SECTION 1: MARKS & EVALUATION ==================== -->
    <div class="sec-box avoid-break">
      <div class="sec-title-bar">
        <span>SECTION 1: SEMESTER ACADEMIC PERFORMANCE & SUBJECT-WISE EVALUATION</span>
        <span>Top: ${bestSub.name} (${bestSub.total}%)</span>
      </div>
      <table class="dossier-table">
        <thead>
          <tr>
            <th style="width: 70px;">Code</th>
            <th style="text-align: left; padding-left: 8px;">Subject / Course Title</th>
            <th style="width: 70px;">Type</th>
            <th style="width: 60px;">CIE (30)</th>
            <th style="width: 65px;">Mid (50)</th>
            <th style="width: 60px;">Prac (25)</th>
            <th style="width: 65px;">Total %</th>
            <th style="width: 50px;">Grade</th>
            <th style="width: 130px; text-align: left; padding-left: 6px;">Course Instructor</th>
          </tr>
        </thead>
        <tbody>
          ${subjects.map((sub) => `
          <tr>
            <td style="font-weight: 800; font-family: monospace;">${sub.code}</td>
            <td style="text-align: left; padding-left: 8px; font-weight: 600;">${sub.name}</td>
            <td><span class="${sub.type.includes('Lab') ? 'pill-lab' : 'pill-theory'}">${sub.type}</span></td>
            <td>${sub.cie}</td>
            <td>${sub.midterm}</td>
            <td>${sub.practical}</td>
            <td style="font-weight: 800; color: #0f172a;">${sub.total}%</td>
            <td><span class="grade-pill">${sub.grade}</span></td>
            <td style="text-align: left; padding-left: 6px; font-size: 8.5px; color: #475569;">${sub.teacher}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="sec-note">
        <strong>Academic Evaluation Summary:</strong> Candidate has attained <strong>${earnedCredits}</strong> credits out of <strong>${totalCredits}</strong> allocated. Highest performance recorded in <strong>${bestSub.name}</strong> (${bestSub.total}%), with focus area identified in <strong>${weakSub.name}</strong> (${weakSub.total}%).
      </div>
    </div>

    <!-- ==================== SECTION 2: FINANCIAL ACCOUNTS LEDGER ==================== -->
    <div class="sec-box avoid-break">
      <div class="sec-title-bar">
        <span>SECTION 2: TUITION FEE & FINANCIAL ACCOUNTS LEDGER</span>
        <span>Balance: ₹${feeBalance.toLocaleString('en-IN')} (${isFeePaid ? 'Settled' : 'Action Required'})</span>
      </div>
      <table class="dossier-table">
        <thead>
          <tr>
            <th style="width: 120px;">Transaction ID</th>
            <th style="width: 85px;">Payment Date</th>
            <th style="text-align: left; padding-left: 8px;">Installment / Fee Particulars</th>
            <th style="width: 110px;">Payment Mode</th>
            <th style="width: 85px;">Amount (₹)</th>
            <th style="width: 80px;">Status</th>
            <th style="width: 100px;">Official Receipt</th>
          </tr>
        </thead>
        <tbody>
          ${feeLedger.map((f) => `
          <tr>
            <td style="font-family: monospace; font-size: 8.5px;">${f.txnId}</td>
            <td>${f.date}</td>
            <td style="text-align: left; padding-left: 8px;">${f.term}</td>
            <td>${f.mode}</td>
            <td style="font-weight: 800;">₹${f.amount.toLocaleString('en-IN')}</td>
            <td><span class="${f.status === 'Settled' ? 'badge-ok' : 'badge-warn'}">${f.status}</span></td>
            <td style="font-family: monospace; font-size: 8.5px;">${f.receiptNo}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- ==================== SECTION 3: ATTENDANCE & REMEDIAL AUDIT ==================== -->
    <div class="sec-box avoid-break">
      <div class="sec-title-bar">
        <span>SECTION 3: PHYSICAL & LABORATORY ATTENDANCE COMPLIANCE</span>
        <span>${attendedLectures} / ${totalLectures} Classes Attended (${percentage.toFixed(1)}%)</span>
      </div>
      <div class="att-audit-row">
        <div class="att-stat-cell">
          <span class="att-lbl">Aggregate Attendance</span>
          <span class="att-val" style="color: ${isDefaulter ? '#b91c1c' : '#15803d'};">${percentage.toFixed(1)}%</span>
        </div>
        <div class="att-stat-cell">
          <span class="att-lbl">Conducted Sessions</span>
          <span class="att-val">${totalLectures} Lectures</span>
        </div>
        <div class="att-stat-cell">
          <span class="att-lbl">Physically Attended</span>
          <span class="att-val">${attendedLectures} Lectures</span>
        </div>
        <div class="att-stat-cell">
          <span class="att-lbl">Authoritative Standing</span>
          <span class="att-val" style="color: ${isDefaulter ? '#b91c1c' : '#15803d'};">${isDefaulter ? '⚠️ Defaulter List' : '✓ Finals Eligible'}</span>
        </div>
      </div>
      ${isDefaulter ? `
      <div class="alert-box-warn">
        <strong>Mandatory Defaulter Remedial Directive:</strong> Candidate's attendance of ${percentage.toFixed(1)}% is below the statutory 75.0% threshold. Candidate must complete <strong>${lecturesNeededFor75}</strong> consecutive makeup/remedial laboratory sessions without unexcused absences prior to admit card clearance.
      </div>` : `
      <div class="alert-box-ok">
        <strong>Attendance Good Standing:</strong> Candidate meets and exceeds the mandatory institutional 75% classroom and laboratory attendance requirements for term grant and final exam clearance.
      </div>`}
    </div>

    <!-- ==================== SECTION 4: COURSEWORK SUBMISSIONS ==================== -->
    <div class="sec-box avoid-break">
      <div class="sec-title-bar">
        <span>SECTION 4: COURSEWORK DELIVERABLES & FACULTY EVALUATION LOG</span>
        <span>${submissions.length} Continuous Assessment Artifacts</span>
      </div>
      <table class="dossier-table">
        <thead>
          <tr>
            <th style="width: 20px;">#</th>
            <th style="text-align: left; padding-left: 8px;">Assignment / Deliverable Title</th>
            <th style="width: 100px;">Subject</th>
            <th style="width: 75px;">Date</th>
            <th style="width: 60px;">Score</th>
            <th style="width: 65px;">Status</th>
            <th style="text-align: left; padding-left: 8px;">Evaluator Remarks & Feedback</th>
          </tr>
        </thead>
        <tbody>
          ${submissions.map((sub, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td style="text-align: left; padding-left: 8px; font-weight: 600;">${sub.title}</td>
            <td>${sub.subject}</td>
            <td>${sub.date}</td>
            <td style="font-weight: 800;">${sub.score}</td>
            <td><span class="${sub.status === 'Graded' ? 'badge-ok' : 'badge-warn'}">${sub.status}</span></td>
            <td style="text-align: left; padding-left: 8px; font-size: 8.5px; color: #475569;">${sub.remarks}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- ==================== SECTION 5: 4-TIER CLEARANCE ==================== -->
    <div class="sec-box avoid-break">
      <div class="sec-title-bar">
        <span>SECTION 5: 4-TIER INSTITUTIONAL EXAMINATION CLEARANCES</span>
        <span>Admit Card: ${percentage >= 75 && isFeePaid ? 'HT-2026-' + roll : 'Provisional / On Hold'}</span>
      </div>
      <div class="clearance-row">
        <div class="clear-cell">
          <div class="clear-tier">Tier 1: Accounts Office</div>
          <div class="clear-val ${isFeePaid ? 'c-ok' : 'c-warn'}">${isFeePaid ? '✓ Fees Paid in Full' : `⚠️ ₹${feeBalance.toLocaleString('en-IN')} Due`}</div>
        </div>
        <div class="clear-cell">
          <div class="clear-tier">Tier 2: Lab & Department</div>
          <div class="clear-val c-ok">✓ Journals & Term Work Cleared</div>
        </div>
        <div class="clear-cell">
          <div class="clear-tier">Tier 3: Central Library</div>
          <div class="clear-val c-ok">✓ Books Returned · No Dues</div>
        </div>
        <div class="clear-cell">
          <div class="clear-tier">Tier 4: Exam Cell Gatekeeper</div>
          <div class="clear-val ${percentage >= 75 && isFeePaid ? 'c-ok' : 'c-warn'}">${percentage >= 75 && isFeePaid ? '✓ Hall Ticket Issued' : '⚠️ Gatekeeper Hold'}</div>
        </div>
      </div>
    </div>

    <!-- ==================== SECTION 6: INSTITUTIONAL SIGNATURES ==================== -->
    <div class="signatures-wrapper avoid-break">
      <div class="sign-block">
        <div class="sign-placeholder">Candidate Signature</div>
        <div class="sign-lbl">Student Declaration</div>
        <div class="sign-sub">Authenticity Certified</div>
      </div>
      <div class="sign-block">
        <div class="sign-script">Prof. Krrish Sharma</div>
        <div class="sign-lbl">Class Teacher / Proctor</div>
        <div class="sign-sub">Dept. of ${deptCode}</div>
      </div>
      <div class="sign-block">
        <div class="sign-script">Dr. S. R. Joshi</div>
        <div class="sign-lbl">Head of Department</div>
        <div class="sign-sub">Academic Approval</div>
      </div>
      <div class="sign-block">
        <div class="sign-script">Dr. M. K. Deshmukh</div>
        <div class="sign-lbl">Controller of Exams / Registrar</div>
        <div class="sign-sub">Official Autonomous Seal</div>
      </div>
    </div>

    <!-- ==================== FOOTER ==================== -->
    <div class="dossier-footer avoid-break">
      <span>EduTrack Autonomous Campus ERP · Official Dossier Record #${roll}</span>
      <span>${totalStudents > 1 ? `Student ${pageIndex + 1} of ${totalStudents} (Class Deck)` : 'Confidential Student Cumulative File'}</span>
      <span>Security Hash: SHA256-${prn}-${roll}-VERIFIED</span>
    </div>
  </div>`;
}

/**
 * Common Stylesheet for Official Student Dossiers (Screen + Print)
 */
function getComprehensiveDossierStyles() {
  return `
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    body {
      background: #f1f5f9;
      color: #0f172a;
      padding: 20px;
    }
    .batch-control-bar {
      max-width: 900px;
      margin: 0 auto 20px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .batch-control-title {
      font-size: 14px;
      font-weight: 800;
    }
    .batch-control-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .batch-control-btn {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }
    .batch-control-btn:hover {
      background: #1d4ed8;
    }

    /* DOSSIER CONTAINER */
    .student-dossier-packet {
      max-width: 880px;
      margin: 0 auto 30px auto;
      background: #ffffff;
      padding: 24px 28px;
      border-radius: 10px;
      border: 1.5px solid #0f172a;
      box-shadow: 0 4px 18px rgba(0,0,0,0.06);
    }

    .dossier-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .univ-logo-title {
      font-size: 19px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }
    .univ-sub {
      font-size: 8.5px;
      color: #475569;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-top: 2px;
    }
    .univ-dept {
      font-size: 10.5px;
      color: #2563eb;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 3px;
    }
    .doc-badge {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      padding: 3px 14px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
      margin-top: 5px;
      text-transform: uppercase;
    }

    .profile-meta-grid {
      display: grid;
      grid-template-columns: 1fr 140px;
      gap: 14px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .profile-info-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 14px;
      font-size: 10px;
    }
    .p-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 2px;
    }
    .p-lbl {
      color: #64748b;
      font-weight: 700;
      font-size: 8.5px;
      text-transform: uppercase;
    }
    .p-val {
      font-weight: 600;
      color: #1e293b;
    }
    .photo-badge-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #cbd5e1;
      padding-left: 10px;
    }
    .avatar-frame {
      width: 70px;
      height: 80px;
      border: 1.5px solid #64748b;
      border-radius: 6px;
      overflow: hidden;
      background: #e2e8f0;
      margin-bottom: 3px;
    }
    .avatar-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .barcode-mock {
      font-size: 7.5px;
      font-family: monospace;
      font-weight: 800;
      color: #0f172a;
    }
    .barcode-text {
      font-size: 7px;
      color: #64748b;
      font-family: monospace;
    }
    .status-stamp {
      font-size: 7.5px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
      text-align: center;
    }
    .stamp-ok {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .stamp-warn {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    .kpi-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .kpi-lbl {
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
    }
    .kpi-val {
      font-size: 15px;
      font-weight: 900;
      margin: 2px 0;
    }
    .kpi-sub {
      font-size: 8px;
      color: #64748b;
      font-weight: 600;
    }

    .sec-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .sec-title-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 5px 10px;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }

    table.dossier-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
    }
    table.dossier-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8px;
      padding: 5px 6px;
      border-bottom: 1px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
      text-align: center;
    }
    table.dossier-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      text-align: center;
      color: #1e293b;
    }
    table.dossier-table tr:nth-child(even) {
      background: #fafafa;
    }
    .pill-theory {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5px;
      font-weight: 700;
    }
    .pill-lab {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5px;
      font-weight: 700;
    }
    .grade-pill {
      font-weight: 900;
      color: #0f172a;
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 8px;
    }
    .sec-note {
      padding: 6px 10px;
      font-size: 8px;
      color: #475569;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .badge-ok {
      color: #15803d;
      font-weight: 800;
    }
    .badge-warn {
      color: #b91c1c;
      font-weight: 800;
    }

    .att-audit-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 8px 12px;
      gap: 10px;
      background: #ffffff;
    }
    .att-stat-cell {
      display: flex;
      flex-direction: column;
    }
    .att-lbl {
      font-size: 8px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .att-val {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 1px;
    }
    .alert-box-warn {
      background: #fff7ed;
      border-top: 1px solid #ffedd5;
      color: #c2410c;
      padding: 6px 10px;
      font-size: 8px;
      line-height: 1.35;
    }
    .alert-box-ok {
      background: #f0fdf4;
      border-top: 1px solid #dcfce7;
      color: #15803d;
      padding: 6px 10px;
      font-size: 8px;
      line-height: 1.35;
    }

    .clearance-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      padding: 8px 10px;
      background: #ffffff;
    }
    .clear-cell {
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 8px;
    }
    .clear-tier {
      font-size: 7.5px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
    }
    .clear-val {
      font-size: 9px;
      font-weight: 800;
      margin-top: 2px;
    }
    .c-ok {
      color: #15803d;
    }
    .c-warn {
      color: #b91c1c;
    }

    .signatures-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 14px;
      margin-top: 10px;
      border-top: 1.5px solid #0f172a;
    }
    .sign-block {
      text-align: center;
      width: 160px;
    }
    .sign-placeholder {
      width: 100%;
      height: 28px;
      border: 1px dashed #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.5px;
      color: #94a3b8;
      margin-bottom: 3px;
    }
    .sign-script {
      font-family: 'Brush Script MT', cursive, serif;
      font-size: 16px;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .sign-lbl {
      font-size: 8px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      border-top: 1px solid #94a3b8;
      padding-top: 2px;
    }
    .sign-sub {
      font-size: 7px;
      color: #94a3b8;
    }

    .dossier-footer {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5px;
      color: #94a3b8;
      border-top: 1px dashed #cbd5e1;
      padding-top: 5px;
    }

    /* PRINT MULTI-PAGE FLOW & ZERO CLIPPING */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .no-print, .batch-control-bar {
        display: none !important;
      }
      .student-dossier-packet {
        max-width: 100% !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        padding: 6mm 4mm !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: auto !important;
        break-inside: auto !important;
      }
      .student-dossier-packet:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  `;
}

/**
 * Print Comprehensive Student 360° Dossier (Single Student, Full Multi-Page Record)
 */
export function printComprehensiveStudentDossier(student, options = {}) {
  const printWindow = window.open('', '_blank', 'width=1040,height=900');
  if (!printWindow) {
    alert('Please allow popups to print official student dossier.');
    return;
  }

  const sName = student.name || 'Candidate';
  const roll = student.rollNumber || '101';
  const htmlContent = buildStudentComprehensiveDossierHtml(student, 0, 1);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Comprehensive Dossier - ${sName} (#${roll})</title>
  <style>${getComprehensiveDossierStyles()}</style>
</head>
<body>
  <div class="batch-control-bar no-print">
    <div>
      <div class="batch-control-title">🖨️ Official Student Comprehensive Dossier</div>
      <div class="batch-control-meta">Complete 360° Academic Record, Financial Ledger & Coursework Portfolio · ${sName} (#${roll})</div>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="batch-control-btn" onclick="window.print()">
        <span>Print Full Record / Save PDF</span>
      </button>
      <button class="batch-control-btn" style="background: #334155;" onclick="window.close()">
        <span>✕ Close</span>
      </button>
    </div>
  </div>

  ${htmlContent}

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Print All Students Complete Data / Comprehensive Dossiers (Batch Mode)
 * - Strictly sorted by Roll Number ascending
 * - Each student's full multi-page record starts on a fresh page
 * - Contains all sections: demographics, marks, fee ledger, attendance, coursework, clearances, signatures
 */
export function printAllStudentsComprehensiveDossiers(students, options = {}) {
  if (!students || students.length === 0) {
    alert('No students selected for printing complete dossiers.');
    return;
  }

  // Sort strictly by roll number ascending
  const sortedStudents = [...students].sort((a, b) => {
    const rA = parseInt(a.rollNumber, 10) || 0;
    const rB = parseInt(b.rollNumber, 10) || 0;
    return rA - rB;
  });

  const printWindow = window.open('', '_blank', 'width=1080,height=920');
  if (!printWindow) {
    alert('Please allow popups to print official dossiers.');
    return;
  }

  const totalCount = sortedStudents.length;
  const firstRoll = sortedStudents[0].rollNumber;
  const lastRoll = sortedStudents[sortedStudents.length - 1].rollNumber;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>All Students Complete Data Packet - Roll #${firstRoll} to #${lastRoll} (${totalCount} Students)</title>
  <style>${getComprehensiveDossierStyles()}</style>
</head>
<body>
  <div class="batch-control-bar no-print">
    <div>
      <div class="batch-control-title">🖨️ Complete Student Dossiers Deck: ${totalCount} Candidates</div>
      <div class="batch-control-meta">Full 360° Academic Records (Marks, Fees, Attendance, Submissions, Signatures) · Roll #${firstRoll} - #${lastRoll}</div>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="batch-control-btn" onclick="window.print()">
        <span>Print All ${totalCount} Student Records (Batch)</span>
      </button>
      <button class="batch-control-btn" style="background: #334155;" onclick="window.close()">
        <span>✕ Close</span>
      </button>
    </div>
  </div>

  ${sortedStudents.map((s, idx) => buildStudentComprehensiveDossierHtml(s, idx, totalCount)).join('')}

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 600);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}




