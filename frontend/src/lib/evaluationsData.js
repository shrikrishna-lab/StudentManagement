/**
 * Teacher Evaluation, Examination Marks & Role-Based Student Management Store
 * Handles:
 *   1. Assignment, CIE Paper, Midterm, End-Sem Theory, and Lab Viva Marks Entry
 *   2. GFM (Guardian Faculty Member) Mentorship Counseling & Intervention Logs
 *   3. Class Teacher Division Management & Status Oversight (Promote / Detain / Remarks)
 */

const STORAGE_KEY_EVALUATIONS = 'edutrack_evaluations_store';
const STORAGE_KEY_GFM_LOGS = 'edutrack_gfm_mentorship_logs';
const STORAGE_KEY_CLASS_TEACHER = 'edutrack_class_teacher_status';

export const ASSESSMENT_TYPES = [
  { id: 'cie', label: 'In-Semester CIE / Unit Test Paper', defaultMaxMarks: 30, icon: 'BookOpen' },
  { id: 'midterm', label: 'Midterm Examination Paper', defaultMaxMarks: 50, icon: 'Award' },
  { id: 'endsem', label: 'End-Semester Theory Exam Paper', defaultMaxMarks: 70, icon: 'FileSpreadsheet' },
  { id: 'lab', label: 'Practical Lab Term Work & Oral Viva', defaultMaxMarks: 25, icon: 'FlaskConical' },
  { id: 'project', label: 'Capstone Project Phase Evaluation', defaultMaxMarks: 50, icon: 'Layers' }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'CIE-IT301-01',
    title: 'Unit Test 1: Collections, Multithreading & Lambdas',
    type: 'cie',
    subjectCode: 'IT-301',
    subjectName: 'Core Java & OOP Frameworks',
    division: 'A',
    maxMarks: 30,
    dueDate: '2026-09-28',
    evaluator: 'Prof. Krrish Sharma',
    status: 'Evaluated'
  },
  {
    id: 'LAB-IT301L-01',
    title: 'Advanced Java Lab Practical Continuous Evaluation',
    type: 'lab',
    subjectCode: 'IT-301L',
    subjectName: 'Advanced Java Programming Lab',
    division: 'A',
    maxMarks: 25,
    dueDate: '2026-10-02',
    evaluator: 'Prof. Krrish Sharma',
    status: 'In Progress'
  },
  {
    id: 'MID-IT301-01',
    title: 'Midterm Autonomous Examination Paper',
    type: 'midterm',
    subjectCode: 'IT-301',
    subjectName: 'Core Java & OOP Frameworks',
    division: 'A',
    maxMarks: 50,
    dueDate: '2026-10-01',
    evaluator: 'Prof. Krrish Sharma',
    status: 'Evaluated'
  }
];

export const INITIAL_STUDENT_MARKS = {
  'CIE-IT301-01': {
    101: { marks: 29, remarks: 'Full marks in Generics & ConcurrentHashMap' },
    102: { marks: 28, remarks: 'Great conceptual clarity' },
    103: { marks: 19, remarks: 'Re-attempt lambda comparator questions' },
    104: { marks: 26, remarks: 'Very good' },
    105: { marks: 18, remarks: 'Remedial problem sheet assigned' },
    106: { marks: 30, remarks: 'Flawless paper presentation' },
    107: { marks: 14, remarks: 'Needs revision in thread synchronization' },
    108: { marks: 25, remarks: 'Good' },
    109: { marks: 17, remarks: 'Average; review collection algorithms' },
    110: { marks: 24, remarks: 'Clear logic' }
  },
  'LAB-IT301L-01': {
    101: { marks: 24, remarks: 'Oral viva answered promptly' },
    102: { marks: 23, remarks: 'Verified execution on Linux terminal' },
    103: { marks: 18, remarks: 'Journal complete, viva average' },
    104: { marks: 22, remarks: 'Verified' },
    105: { marks: 16, remarks: 'Needs practical re-run for socket programming' },
    106: { marks: 25, remarks: 'Full marks in coding viva' },
    107: { marks: 13, remarks: 'Incomplete index signatures' },
    108: { marks: 22, remarks: 'Verified' },
    109: { marks: 17, remarks: 'Fair' },
    110: { marks: 21, remarks: 'Good' }
  },
  'MID-IT301-01': {
    101: { marks: 47, remarks: 'Top scorer in Division A' },
    102: { marks: 46, remarks: 'Excellent descriptive answers' },
    103: { marks: 32, remarks: 'Satisfactory; attend tutorial sessions' },
    104: { marks: 44, remarks: 'Consistent' },
    105: { marks: 29, remarks: 'Borderline pass; personalized guidance needed' },
    106: { marks: 49, remarks: 'Exemplary performance' },
    107: { marks: 26, remarks: 'Remedial coaching recommended' },
    108: { marks: 42, remarks: 'Good' },
    109: { marks: 31, remarks: 'Adequate' },
    110: { marks: 41, remarks: 'Very good' }
  }
};

export const INITIAL_GFM_COUNSELING_LOGS = [
  {
    id: 1,
    rollNumber: 101,
    studentName: 'Krrish Sharma',
    date: '2026-09-24',
    topic: 'Career Guidance & Research Mentorship',
    notes: 'Discussed paper publication in IEEE conference on distributed systems. Candidate advised to lead hackathon team.',
    actionPlan: 'Enrolled in Advanced Algorithm mentorship cohort.',
    status: 'On Track'
  },
  {
    id: 2,
    rollNumber: 103,
    studentName: 'Rohan Patel',
    date: '2026-09-26',
    topic: 'Attendance Deficit & Remedial Schedule',
    notes: 'Attendance currently at 71.4%. Student reported transport difficulties. Agreed to attend extra Thursday makeup labs.',
    actionPlan: 'Daily roll call tracking by Class Teacher; target 76% by mid-term.',
    status: 'Under Mentorship'
  },
  {
    id: 3,
    rollNumber: 105,
    studentName: 'Aditya Joshi',
    date: '2026-09-28',
    topic: 'Academic Improvement & Fee Clearance',
    notes: 'Pending fee balance ₹35,000. Parents contacted and installment plan initiated with Accounts Office.',
    actionPlan: 'Scheduled Saturday 1-on-1 doubt clearing for Data Structures.',
    status: 'Remedial Action'
  }
];

export function getEvaluationsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVALUATIONS);
    if (!raw) {
      const initial = {
        assessments: INITIAL_ASSESSMENTS,
        marksMatrix: INITIAL_STUDENT_MARKS
      };
      localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    const cleanAssessments = (parsed.assessments || []).filter((a) => a.type !== 'assignment');
    const assessments = cleanAssessments.length > 0 ? cleanAssessments : INITIAL_ASSESSMENTS;
    const marksMatrix = { ...(parsed.marksMatrix || INITIAL_STUDENT_MARKS) };
    delete marksMatrix['ASM-IT301-01'];
    return {
      ...parsed,
      assessments,
      marksMatrix
    };
  } catch {
    return {
      assessments: INITIAL_ASSESSMENTS,
      marksMatrix: INITIAL_STUDENT_MARKS
    };
  }
}

export function saveEvaluationsStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save evaluations:', e);
  }
}

export function getGFMCounselingLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GFM_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_GFM_LOGS, JSON.stringify(INITIAL_GFM_COUNSELING_LOGS));
      return INITIAL_GFM_COUNSELING_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GFM_COUNSELING_LOGS;
  }
}

export function saveGFMCounselingLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEY_GFM_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save GFM logs:', e);
  }
}

export function calculateGrade(score, maxScore) {
  if (!maxScore || maxScore <= 0) return { grade: 'N/A', status: 'Pending', pct: 0 };
  const pct = Math.round((Number(score) / Number(maxScore)) * 100);

  if (pct >= 90) return { grade: 'O', status: 'Passed (Outstanding)', pct };
  if (pct >= 80) return { grade: 'A+', status: 'Passed (Distinction)', pct };
  if (pct >= 70) return { grade: 'A', status: 'Passed (First Class)', pct };
  if (pct >= 60) return { grade: 'B+', status: 'Passed (Higher Second)', pct };
  if (pct >= 50) return { grade: 'B', status: 'Passed (Second Class)', pct };
  if (pct >= 40) return { grade: 'C', status: 'Passed (Pass Class)', pct };
  return { grade: 'F', status: 'Failed (Remedial Required)', pct };
}

/**
 * Prints official Evaluation Marks Ledger Sheet
 */
export function printEvaluationMarksLedger(assessment, studentRows = []) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Please allow popups to print the evaluation ledger.');
    return;
  }

  const now = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const avgMarks = studentRows.length > 0
    ? (studentRows.reduce((acc, s) => acc + Number(s.marks || 0), 0) / studentRows.length).toFixed(1)
    : 0;

  const passedCount = studentRows.filter(s => {
    const { pct } = calculateGrade(s.marks, assessment.maxMarks);
    return pct >= 40;
  }).length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Evaluation Marks Ledger - ${assessment.title}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f8fafc; padding: 25px; color: #0f172a; }
    .sheet { max-width: 860px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #cbd5e1; }
    .masthead { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
    .title { font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
    .sub { font-size: 11px; color: #475569; margin-top: 3px; }
    .meta-box { background: #f1f5f9; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 11px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 18px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 9px; text-align: left; }
    th { background: #0f172a; color: #ffffff; font-weight: 700; text-transform: uppercase; font-size: 10px; }
    tr:nth-child(even) { background: #f8fafc; }
    .prn { font-family: monospace; font-weight: 700; color: #1d4ed8; }
    .grade-pass { color: #059669; font-weight: 700; }
    .grade-fail { color: #dc2626; font-weight: 700; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 35px; padding-top: 15px; border-top: 1px dashed #cbd5e1; font-size: 11px; font-weight: 700; }
    .sign-box { text-align: center; width: 220px; }
    .sign-line { border-top: 1px solid #0f172a; margin-top: 35px; padding-top: 5px; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="masthead">
      <div class="title">EDUTRACK AUTONOMOUS INSTITUTE OF TECHNOLOGY</div>
      <div class="sub">Department of Information Technology · Continuous Evaluation & Examination Ledger</div>
      <div style="font-weight: 800; font-size: 13px; margin-top: 8px; color: #1d4ed8; text-transform: uppercase;">
        OFFICIAL COURSE EVALUATION & MARKS AWARD SHEET
      </div>
    </div>

    <div class="meta-box">
      <div><strong>Assessment:</strong> ${assessment.title}</div>
      <div><strong>Course Unit:</strong> ${assessment.subjectCode} (${assessment.subjectName})</div>
      <div><strong>Division:</strong> Div ${assessment.division || 'A'}</div>
      <div><strong>Maximum Marks:</strong> ${assessment.maxMarks} Pts</div>
      <div><strong>Class Average:</strong> ${avgMarks} / ${assessment.maxMarks}</div>
      <div><strong>Pass Result:</strong> ${passedCount} / ${studentRows.length} (${Math.round((passedCount / (studentRows.length || 1)) * 100)}%)</div>
      <div><strong>Evaluator:</strong> ${assessment.evaluator || 'Prof. Krrish Sharma'}</div>
      <div><strong>Evaluation Date:</strong> ${now}</div>
      <div><strong>Authentication:</strong> VERIFIED FACULTY LEDGER</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 45px; text-align: center;">Roll #</th>
          <th style="width: 120px;">Unique PRN</th>
          <th>Student Name</th>
          <th style="width: 75px; text-align: right;">Marks (${assessment.maxMarks})</th>
          <th style="width: 55px; text-align: center;">Grade</th>
          <th style="width: 90px; text-align: center;">Result</th>
          <th>Faculty Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${studentRows.map(s => {
          const { grade, pct } = calculateGrade(s.marks, assessment.maxMarks);
          const isPassed = pct >= 40;
          return `
            <tr>
              <td style="text-align: center; font-weight: 700;">#${s.rollNumber}</td>
              <td><span class="prn">${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}</span></td>
              <td style="font-weight: 600;">${s.name}</td>
              <td style="text-align: right; font-weight: 800;">${s.marks !== undefined ? s.marks : '-'}</td>
              <td style="text-align: center; font-weight: 800; color: ${isPassed ? '#059669' : '#dc2626'};">${grade}</td>
              <td style="text-align: center;">
                <span class="${isPassed ? 'grade-pass' : 'grade-fail'}">${isPassed ? 'PASSED' : 'REMEDIAL'}</span>
              </td>
              <td style="font-size: 10px; color: #475569;">${s.remarks || 'Standard evaluation recorded.'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="sign-row">
      <div class="sign-box">
        <div class="sign-line">Subject Faculty / Examiner</div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Class Teacher (Div ${assessment.division || 'A'})</div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Head of Department (HOD)</div>
      </div>
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

export function exportEvaluationMarksCSV(assessment, studentRows) {
  const headers = ['Roll #', 'PRN', 'Student Name', 'Division', `Marks (Max ${assessment.maxMarks})`, 'Percentage', 'Grade', 'Result', 'Remarks'];
  const rows = studentRows.map((s) => {
    const { grade, pct } = calculateGrade(s.marks, assessment.maxMarks);
    const isPassed = pct >= 40;
    return [
      s.rollNumber,
      `"${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}"`,
      `"${s.name}"`,
      assessment.division || 'A',
      s.marks !== undefined ? s.marks : 0,
      `${pct.toFixed(1)}%`,
      grade,
      isPassed ? 'PASSED' : 'REMEDIAL',
      `"${(s.remarks || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Marks_${assessment.title.replace(/\s+/g, '_')}_${assessment.subjectCode}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

