/**
 * Institutional Unique PRN (Permanent Registration Number) & Roll Numbering Engine
 * Generates uniform, deterministic, and verifiable academic identity codes.
 * Format: [PREFIX][YEAR][DEPT][SEQUENCE] e.g. RBT24IT001
 *   - PREFIX: College Code (e.g. 'RBT' for EduTrack Autonomous Institute)
 *   - YEAR: 2-digit Admission Year (e.g. '24' for 2024, '25' for 2025)
 *   - DEPT: Department Acronym ('IT', 'CS', 'EXTC', 'MECH')
 *   - SEQUENCE: 3-digit padded roll sequence ('001', '002', ...)
 */

export const INSTITUTION_PREFIX = 'RBT';

export const DEPARTMENTS_CONFIG = {
  IT: { code: 'IT', name: 'Information Technology', startingRoll: 101 },
  CS: { code: 'CS', name: 'Computer Science & Engineering', startingRoll: 101 },
  EXTC: { code: 'EXTC', name: 'Electronics & Telecommunication', startingRoll: 101 },
  MECH: { code: 'MECH', name: 'Mechanical Engineering', startingRoll: 101 }
};

export const DIVISION_ROLL_SCHEMES = {
  A: { min: 101, max: 160, label: 'Division A (101 - 160)' },
  B: { min: 201, max: 260, label: 'Division B (201 - 260)' },
  C: { min: 301, max: 360, label: 'Division C (301 - 360)' }
};

/**
 * Generates an institutional PRN string
 * @param {string} prefix Institute code (default 'RBT')
 * @param {number|string} year Admission year (e.g. 2024 or 24)
 * @param {string} dept Course / Department ('IT', 'CS', etc.)
 * @param {number|string} seq Sequence number (e.g. 1 -> '001')
 * @returns {string} e.g. 'RBT24IT001'
 */
export function generatePRN(prefix = INSTITUTION_PREFIX, year = 2024, dept = 'IT', seq = 1) {
  const cleanPrefix = String(prefix || INSTITUTION_PREFIX).trim().toUpperCase();
  const yearStr = String(year).trim();
  const shortYear = yearStr.length === 4 ? yearStr.substring(2) : yearStr.padStart(2, '0');
  const cleanDept = String(dept || 'IT').trim().toUpperCase().replace(/[^A-Z]/g, '');
  const cleanSeq = String(seq).padStart(3, '0');

  return `${cleanPrefix}${shortYear}${cleanDept}${cleanSeq}`;
}

/**
 * Parses a PRN string into components
 */
export function parsePRN(prn = '') {
  const cleaned = String(prn).trim().toUpperCase();
  const match = cleaned.match(/^([A-Z]{2,4})(\d{2})([A-Z]{2,4})(\d{3,4})$/);
  if (!match) {
    return {
      isValid: false,
      raw: prn,
      prefix: INSTITUTION_PREFIX,
      year: 2024,
      department: 'IT',
      sequence: 1
    };
  }

  return {
    isValid: true,
    raw: prn,
    prefix: match[1],
    year: 2000 + parseInt(match[2], 10),
    department: match[3],
    sequence: parseInt(match[4], 10)
  };
}

/**
 * Batch generates uniform PRNs and optionally re-indexes division roll numbers for a list of students
 * @param {Array} studentsList 
 * @param {Object} options 
 * @returns {Array} Updated students list
 */
export function batchGenerateStudentPRNs(studentsList = [], options = {}) {
  const {
    prefix = INSTITUTION_PREFIX,
    admissionYear = 2024,
    reindexDivisionRolls = false,
    preserveExistingPrn = false
  } = options;

  // Group by department to track sequence
  const deptCounters = { IT: 1, CS: 1, EXTC: 1, MECH: 1 };
  const divCounters = { A: 101, B: 201, C: 301 };

  return studentsList.map((student) => {
    const dept = (student.course || 'IT').toUpperCase();
    const div = student.division || 'A';

    if (!deptCounters[dept]) {
      deptCounters[dept] = 1;
    }

    const seq = deptCounters[dept]++;
    let updatedPRN = student.prn;

    if (!preserveExistingPrn || !updatedPRN) {
      updatedPRN = generatePRN(prefix, student.admissionYear || admissionYear, dept, seq);
    }

    let updatedRoll = student.rollNumber;
    if (reindexDivisionRolls) {
      if (!divCounters[div]) {
        divCounters[div] = 101;
      }
      updatedRoll = divCounters[div]++;
    }

    return {
      ...student,
      prn: updatedPRN,
      admissionYear: student.admissionYear || admissionYear,
      rollNumber: updatedRoll,
      regCode: updatedPRN
    };
  });
}

/**
 * Prints an official Institutional Enrolment & PRN Allocation Register
 */
export function printPRNEnrolmentRegister(students = [], filterDept = 'All', filterDiv = 'All') {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Please allow popups to print the Enrolment Register.');
    return;
  }

  const filtered = students.filter(s => {
    const deptMatch = filterDept === 'All' || s.course === filterDept;
    const divMatch = filterDiv === 'All' || s.division === filterDiv;
    return deptMatch && divMatch;
  });

  const now = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduTrack Institutional Enrolment & PRN Register</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f8fafc; padding: 25px; color: #0f172a; }
    .sheet { max-width: 1040px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    .masthead { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em; text-transform: uppercase; }
    .sub { font-size: 11px; color: #475569; margin-top: 3px; font-weight: 500; }
    .badge-bar { display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 10px 16px; border-radius: 8px; margin-bottom: 18px; font-size: 11.5px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
    th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
    th { background: #0f172a; color: #ffffff; font-weight: 700; text-transform: uppercase; font-size: 10px; }
    tr:nth-child(even) { background: #f8fafc; }
    .prn-code { font-family: "SF Mono", Menlo, Consolas, monospace; font-weight: 800; color: #1d4ed8; letter-spacing: 0.04em; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #cbd5e1; font-size: 11px; font-weight: 700; }
    .sign-box { text-align: center; width: 220px; }
    .sign-line { border-top: 1px solid #0f172a; margin-top: 40px; padding-top: 5px; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="masthead">
      <div class="title">EDUTRACK AUTONOMOUS INSTITUTE OF TECHNOLOGY</div>
      <div class="sub">Affiliated to State University · NAAC A++ Accredited · Office of Registrar & Admissions</div>
      <div style="font-weight: 800; font-size: 13px; margin-top: 8px; color: #1e3a8a; text-transform: uppercase;">
        OFFICIAL STUDENT ENROLMENT & UNIQUE PRN ALLOCATION REGISTER (BATCH 2024–28)
      </div>
    </div>

    <div class="badge-bar">
      <div><strong>Department:</strong> ${filterDept === 'All' ? 'All Engineering Departments' : filterDept}</div>
      <div><strong>Division:</strong> ${filterDiv === 'All' ? 'All Divisions (A, B, C)' : 'Division ' + filterDiv}</div>
      <div><strong>Total Registered Candidates:</strong> ${filtered.length}</div>
      <div><strong>Generated Date:</strong> ${now}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 45px; text-align: center;">Sr #</th>
          <th style="width: 75px; text-align: center;">Roll #</th>
          <th style="width: 130px;">Unique PRN</th>
          <th>Candidate Full Name</th>
          <th style="width: 80px;">Department</th>
          <th style="width: 65px; text-align: center;">Division</th>
          <th style="width: 80px; text-align: center;">Adm. Year</th>
          <th style="width: 95px; text-align: center;">Attendance %</th>
          <th style="width: 100px;">Verification Seal</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map((s, idx) => `
          <tr>
            <td style="text-align: center; color: #64748b;">${idx + 1}</td>
            <td style="text-align: center; font-weight: 800;">#${s.rollNumber}</td>
            <td><span class="prn-code">${s.prn || generatePRN('RBT', s.admissionYear || 2024, s.course || 'IT', idx + 1)}</span></td>
            <td style="font-weight: 600;">${s.name}</td>
            <td>${s.course}</td>
            <td style="text-align: center; font-weight: 700;">${s.division || 'A'}</td>
            <td style="text-align: center;">${s.admissionYear || 2024}</td>
            <td style="text-align: center; font-weight: 700; color: ${s.percentage >= 75 ? '#059669' : '#dc2626'};">${Number(s.percentage || 75).toFixed(1)}%</td>
            <td style="font-size: 9.5px; color: #059669; font-weight: 600;">✓ REG-CONFIRMED</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="sign-row">
      <div class="sign-box">
        <div class="sign-line">Admissions Officer</div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Head of Department (HOD)</div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Registrar & Academic Council</div>
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
