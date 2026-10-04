/**
 * EduTrack Clearance & Document Release Dataset
 * Manages institutional clearance rules: Fee payments, Attendance thresholds, 
 * Hall Ticket issuance, and Official Marksheet releases.
 */

const STORAGE_KEY_CLEARANCE = 'edutrack_students_clearance';
const STORAGE_KEY_SETTINGS = 'edutrack_clearance_settings';

export const INITIAL_STUDENTS_CLEARANCE = [
  {
    rollNumber: 101,
    name: 'Krrish Sharma',
    email: 'krrish.sharma@example.com',
    course: 'IT',
    year: 3,
    semester: 'Semester 6',
    division: 'A',
    attendance: 89.5,
    attendanceCleared: true,
    condonationGranted: false,
    feeStatus: 'paid', // 'paid' | 'pending'
    feeAmountDue: 0,
    feeClearedDate: 'Sep 10, 2026',
    disciplinaryClearance: 'cleared',
    hallTicketStatus: 'issued', // 'issued' | 'withheld'
    hallTicketWithheldReason: '',
    marksheetStatus: 'released', // 'released' | 'withheld'
    marksheetWithheldReason: '',
    sgpa: '8.95',
    cgpa: '8.88',
    resultClassification: 'First Class with Distinction',
    totalCredits: 22,
    grades: [
      { code: 'IT-301', name: 'Core Java & OOP Frameworks', credits: 4, internal: 24, endterm: 70, total: 94, grade: 'O', gradePoint: 10 },
      { code: 'IT-302', name: 'Database Management Systems', credits: 4, internal: 22, endterm: 66, total: 88, grade: 'A+', gradePoint: 9 },
      { code: 'IT-303', name: 'Distributed Systems & Cloud', credits: 4, internal: 23, endterm: 68, total: 91, grade: 'O', gradePoint: 10 },
      { code: 'IT-304', name: 'Computer Networks & Security', credits: 4, internal: 20, endterm: 60, total: 80, grade: 'A', gradePoint: 8 },
      { code: 'IT-305', name: 'Capstone Project Phase 1', credits: 6, internal: 28, endterm: 65, total: 93, grade: 'O', gradePoint: 10 }
    ]
  },
  {
    rollNumber: 102,
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    course: 'CS',
    year: 2,
    semester: 'Semester 4',
    division: 'B',
    attendance: 94.2,
    attendanceCleared: true,
    condonationGranted: false,
    feeStatus: 'paid',
    feeAmountDue: 0,
    feeClearedDate: 'Sep 05, 2026',
    disciplinaryClearance: 'cleared',
    hallTicketStatus: 'issued',
    hallTicketWithheldReason: '',
    marksheetStatus: 'released',
    marksheetWithheldReason: '',
    sgpa: '9.42',
    cgpa: '9.35',
    resultClassification: 'First Class with Distinction',
    totalCredits: 22,
    grades: [
      { code: 'CS-201', name: 'Data Structures with C++', credits: 4, internal: 25, endterm: 72, total: 97, grade: 'O', gradePoint: 10 },
      { code: 'CS-202', name: 'Computer Architecture & Org', credits: 4, internal: 23, endterm: 68, total: 91, grade: 'O', gradePoint: 10 },
      { code: 'CS-203', name: 'Operating Systems & Linux', credits: 4, internal: 24, endterm: 70, total: 94, grade: 'O', gradePoint: 10 },
      { code: 'CS-204', name: 'Discrete Mathematics', credits: 4, internal: 22, endterm: 67, total: 89, grade: 'A+', gradePoint: 9 },
      { code: 'CS-205', name: 'Data Structures Lab', credits: 6, internal: 29, endterm: 68, total: 97, grade: 'O', gradePoint: 10 }
    ]
  },
  {
    rollNumber: 103,
    name: 'Rohan Patel',
    email: 'rohan.patel@example.com',
    course: 'IT',
    year: 3,
    semester: 'Semester 6',
    division: 'A',
    attendance: 71.4, // DEFAULTER (Below 75%)
    attendanceCleared: false,
    condonationGranted: false,
    feeStatus: 'pending', // PENDING DUES
    feeAmountDue: 28500,
    feeClearedDate: null,
    disciplinaryClearance: 'cleared',
    hallTicketStatus: 'withheld', // WITHHELD DUE TO ATTENDANCE & FEES
    hallTicketWithheldReason: 'Attendance 71.4% (< 75%) and pending tuition dues of ₹28,500.',
    marksheetStatus: 'withheld',
    marksheetWithheldReason: 'Accounts fee clearance pending (₹28,500).',
    sgpa: '7.85',
    cgpa: '7.92',
    resultClassification: 'First Class',
    totalCredits: 22,
    grades: [
      { code: 'IT-301', name: 'Core Java & OOP Frameworks', credits: 4, internal: 18, endterm: 58, total: 76, grade: 'B+', gradePoint: 7 },
      { code: 'IT-302', name: 'Database Management Systems', credits: 4, internal: 19, endterm: 61, total: 80, grade: 'A', gradePoint: 8 },
      { code: 'IT-303', name: 'Distributed Systems & Cloud', credits: 4, internal: 17, endterm: 55, total: 72, grade: 'B+', gradePoint: 7 },
      { code: 'IT-304', name: 'Computer Networks & Security', credits: 4, internal: 20, endterm: 62, total: 82, grade: 'A', gradePoint: 8 },
      { code: 'IT-305', name: 'Capstone Project Phase 1', credits: 6, internal: 24, endterm: 60, total: 84, grade: 'A', gradePoint: 8 }
    ]
  },
  {
    rollNumber: 104,
    name: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    course: 'EXTC',
    year: 1,
    semester: 'Semester 2',
    division: 'C',
    attendance: 88.1,
    attendanceCleared: true,
    condonationGranted: false,
    feeStatus: 'paid',
    feeAmountDue: 0,
    feeClearedDate: 'Sep 12, 2026',
    disciplinaryClearance: 'cleared',
    hallTicketStatus: 'issued',
    hallTicketWithheldReason: '',
    marksheetStatus: 'released',
    marksheetWithheldReason: '',
    sgpa: '8.81',
    cgpa: '8.75',
    resultClassification: 'First Class with Distinction',
    totalCredits: 20,
    grades: [
      { code: 'ES-101', name: 'Engineering Mathematics II', credits: 4, internal: 22, endterm: 65, total: 87, grade: 'A+', gradePoint: 9 },
      { code: 'ES-102', name: 'Digital Electronics & Logic', credits: 4, internal: 23, endterm: 66, total: 89, grade: 'A+', gradePoint: 9 },
      { code: 'ES-103', name: 'Circuit Theory & Networks', credits: 4, internal: 21, endterm: 63, total: 84, grade: 'A', gradePoint: 8 },
      { code: 'CS-102', name: 'Programming in Python', credits: 4, internal: 24, endterm: 68, total: 92, grade: 'O', gradePoint: 10 },
      { code: 'ES-104', name: 'Basic Electronics Lab', credits: 4, internal: 24, endterm: 65, total: 89, grade: 'A+', gradePoint: 9 }
    ]
  },
  {
    rollNumber: 105,
    name: 'Aditya Joshi',
    email: 'aditya.joshi@example.com',
    course: 'CS',
    year: 4,
    semester: 'Semester 8',
    division: 'A',
    attendance: 91.75,
    attendanceCleared: true,
    condonationGranted: false,
    feeStatus: 'paid',
    feeAmountDue: 0,
    feeClearedDate: 'Aug 25, 2026',
    disciplinaryClearance: 'cleared',
    hallTicketStatus: 'issued',
    hallTicketWithheldReason: '',
    marksheetStatus: 'released',
    marksheetWithheldReason: '',
    sgpa: '9.18',
    cgpa: '9.10',
    resultClassification: 'First Class with Distinction',
    totalCredits: 20,
    grades: [
      { code: 'CS-401', name: 'Artificial Intelligence & Robotics', credits: 4, internal: 24, endterm: 69, total: 93, grade: 'O', gradePoint: 10 },
      { code: 'CS-402', name: 'Cloud Native Microservices', credits: 4, internal: 23, endterm: 67, total: 90, grade: 'O', gradePoint: 10 },
      { code: 'CS-403', name: 'Big Data Analytics', credits: 4, internal: 22, endterm: 65, total: 87, grade: 'A+', gradePoint: 9 },
      { code: 'CS-404', name: 'Industry Internship Project', credits: 8, internal: 38, endterm: 58, total: 96, grade: 'O', gradePoint: 10 }
    ]
  }
];

export const DEFAULT_CLEARANCE_SETTINGS = {
  minAttendancePercent: 75,
  requireFeeClearance: true,
  globalHallTicketRelease: true,
  globalMarksheetRelease: true
};

/**
export function getDefaultSubjectBreakdown(course = 'IT') {
  if (course.toUpperCase() === 'CS') {
    return [
      { code: 'CS-201', name: 'Data Structures with C++', type: 'Theory', faculty: 'Dr. Vivek Joshi', totalClasses: 40, attended: 38, percentage: 95.0 },
      { code: 'CS-201L', name: 'Data Structures & Algorithms Lab', type: 'Practical Lab', faculty: 'Dr. Vivek Joshi', totalClasses: 30, attended: 29, percentage: 96.7 },
      { code: 'CS-202', name: 'Computer Architecture & Org', type: 'Theory', faculty: 'Prof. S. Rao', totalClasses: 36, attended: 34, percentage: 94.4 },
      { code: 'CS-203', name: 'Operating Systems & Linux', type: 'Theory', faculty: 'Prof. K. Patel', totalClasses: 35, attended: 32, percentage: 91.4 },
      { code: 'CS-203L', name: 'Linux Shell & Systems Lab', type: 'Practical Lab', faculty: 'Prof. K. Patel', totalClasses: 28, attended: 27, percentage: 96.4 },
      { code: 'CS-204', name: 'Discrete Mathematics', type: 'Theory', faculty: 'Dr. A. Verma', totalClasses: 38, attended: 36, percentage: 94.7 }
    ];
  }
  return [
    { code: 'IT-301', name: 'Core Java & OOP Frameworks', type: 'Theory', faculty: 'Prof. Krrish Sharma', totalClasses: 36, attended: 35, percentage: 97.2 },
    { code: 'IT-301L', name: 'Core Java Programming Lab', type: 'Practical Lab', faculty: 'Prof. Krrish Sharma', totalClasses: 30, attended: 29, percentage: 96.7 },
    { code: 'IT-302', name: 'Database Management Systems', type: 'Theory', faculty: 'Prof. Anjali Mehta', totalClasses: 34, attended: 32, percentage: 94.1 },
    { code: 'IT-302L', name: 'DBMS & SQL Query Optimization Lab', type: 'Practical Lab', faculty: 'Prof. Anjali Mehta', totalClasses: 28, attended: 26, percentage: 92.8 },
    { code: 'IT-303', name: 'Distributed Systems & Cloud', type: 'Theory', faculty: 'Dr. Vivek Joshi', totalClasses: 38, attended: 35, percentage: 92.1 },
    { code: 'IT-304', name: 'Computer Networks & Security', type: 'Theory', faculty: 'Prof. Neha Gupta', totalClasses: 35, attended: 26, percentage: 74.3 }
  ];
}

/**
 * Fetch stored clearance list or initialize with enriched breakdown.
 */
export function getStudentsClearance() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CLEARANCE);
    const rawList = data ? JSON.parse(data) : INITIAL_STUDENTS_CLEARANCE;
    return rawList.map((s) => {
      const breakdown = s.subjectBreakdown && s.subjectBreakdown.length > 0
        ? s.subjectBreakdown
        : getDefaultSubjectBreakdown(s.course);
      const theoryAtt = s.theoryAttendance !== undefined ? Number(s.theoryAttendance) : Math.round((s.attendance - 1.2) * 10) / 10;
      const labAtt = s.labAttendance !== undefined ? Number(s.labAttendance) : Math.min(100, Math.round((s.attendance + 3.4) * 10) / 10);
      return {
        ...s,
        theoryAttendance: theoryAtt,
        labAttendance: labAtt,
        subjectBreakdown: breakdown
      };
    });
  } catch {
    return INITIAL_STUDENTS_CLEARANCE;
  }
}

/**
 * Save updated clearance list and dispatch window event.
 */
export function saveStudentsClearance(list) {
  try {
    localStorage.setItem(STORAGE_KEY_CLEARANCE, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('edutrack_clearance_updated', { detail: { list } }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Get clearance settings.
 */
export function getClearanceSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_CLEARANCE_SETTINGS;
  } catch {
    return DEFAULT_CLEARANCE_SETTINGS;
  }
}

/**
 * Save clearance settings.
 */
export function saveClearanceSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('edutrack_clearance_settings_updated', { detail: { settings } }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Get clearance record for a specific student.
 */
export function getClearanceForStudent(rollNumber) {
  const list = getStudentsClearance();
  const found = list.find((s) => s.rollNumber === Number(rollNumber));
  return found || list[0]; // fallback to first student (Krrish)
}

/**
 * Admin action: Toggle Hall Ticket issuance for a student.
 */
export function toggleStudentHallTicket(rollNumber, forcedState = null) {
  const list = getStudentsClearance();
  const updated = list.map((s) => {
    if (s.rollNumber === Number(rollNumber)) {
      const nextStatus = forcedState !== null ? forcedState : s.hallTicketStatus === 'issued' ? 'withheld' : 'issued';
      return {
        ...s,
        hallTicketStatus: nextStatus,
        hallTicketWithheldReason: nextStatus === 'withheld' ? 'Manual administrative withhold by Exam Cell.' : ''
      };
    }
    return s;
  });
  saveStudentsClearance(updated);
  return updated;
}

/**
 * Admin action: Toggle Marksheet release for a student.
 */
export function toggleStudentMarksheet(rollNumber, forcedState = null) {
  const list = getStudentsClearance();
  const updated = list.map((s) => {
    if (s.rollNumber === Number(rollNumber)) {
      const nextStatus = forcedState !== null ? forcedState : s.marksheetStatus === 'released' ? 'withheld' : 'released';
      return {
        ...s,
        marksheetStatus: nextStatus,
        marksheetWithheldReason: nextStatus === 'withheld' ? 'Marksheet withheld by Administration pending audit.' : ''
      };
    }
    return s;
  });
  saveStudentsClearance(updated);
  return updated;
}

export function updateStudentFeeClearance(rollNumber, status = 'paid') {
  const list = getStudentsClearance();
  const updated = list.map((s) => {
    if (s.rollNumber === Number(rollNumber)) {
      const isPaid = status === 'paid';
      const feeAmount = isPaid ? 0 : 28500;
      const clearedDate = isPaid ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null;
      const hallStatus = (isPaid && s.attendanceCleared) ? 'issued' : s.hallTicketStatus;

      return {
        ...s,
        feeStatus: status,
        feeAmountDue: feeAmount,
        feeClearedDate: clearedDate,
        hallTicketStatus: hallStatus,
        hallTicketWithheldReason: isPaid ? '' : 'Tuition fee dues outstanding (₹28,500).'
      };
    }
    return s;
  });
  saveStudentsClearance(updated);
  return updated;
}

/**
 * Admin action: Toggle Fee Status for a student.
 */
export function toggleStudentFeeStatus(rollNumber) {
  const list = getStudentsClearance();
  const updated = list.map((s) => {
    if (s.rollNumber === Number(rollNumber)) {
      const isPaid = s.feeStatus === 'paid';
      const nextFee = isPaid ? 'pending' : 'paid';
      const feeAmount = isPaid ? 28500 : 0;
      const clearedDate = isPaid ? null : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      // Automatically re-evaluate hall ticket if attendance is also cleared
      const hallStatus = (nextFee === 'paid' && s.attendanceCleared) ? 'issued' : s.hallTicketStatus;

      return {
        ...s,
        feeStatus: nextFee,
        feeAmountDue: feeAmount,
        feeClearedDate: clearedDate,
        hallTicketStatus: hallStatus,
        hallTicketWithheldReason: nextFee === 'pending' ? 'Tuition fee dues outstanding (₹28,500).' : ''
      };
    }
    return s;
  });
  saveStudentsClearance(updated);
  return updated;
}

/**
 * Admin action: Grant attendance condonation waiver.
 */
export function grantCondonationWaiver(rollNumber) {
  const list = getStudentsClearance();
  const updated = list.map((s) => {
    if (s.rollNumber === Number(rollNumber)) {
      const nextWaiver = !s.condonationGranted;
      const attCleared = nextWaiver || s.attendance >= 75;
      const hallStatus = (s.feeStatus === 'paid' && attCleared) ? 'issued' : s.hallTicketStatus;

      return {
        ...s,
        condonationGranted: nextWaiver,
        attendanceCleared: attCleared,
        hallTicketStatus: hallStatus,
        hallTicketWithheldReason: nextWaiver ? '' : s.hallTicketWithheldReason
      };
    }
    return s;
  });
  saveStudentsClearance(updated);
  return updated;
}

/**
 * Admin action: Customise / adjust attendance (Overall, Theory lectures, Practical Labs, and Sub-wise).
 */
export function updateStudentAttendanceData(rollNumber, payload = {}) {
  const {
    overallAttendance,
    attendance,
    theoryAttendance,
    labAttendance,
    condonationGranted,
    subjectBreakdown
  } = payload;

  const list = getStudentsClearance();
  const updated = list.map((s) => {
    if (s.rollNumber === Number(rollNumber)) {
      const attVal = overallAttendance !== undefined 
        ? Number(overallAttendance) 
        : attendance !== undefined 
        ? Number(attendance) 
        : s.attendance;
      const condVal = condonationGranted !== undefined ? Boolean(condonationGranted) : s.condonationGranted;
      const attCleared = attVal >= 75 || condVal;
      const hallStatus = (s.feeStatus === 'paid' && attCleared) ? 'issued' : (attCleared ? s.hallTicketStatus : 'withheld');

      return {
        ...s,
        attendance: attVal,
        theoryAttendance: theoryAttendance !== undefined ? Number(theoryAttendance) : (s.theoryAttendance || (attVal - 2)),
        labAttendance: labAttendance !== undefined ? Number(labAttendance) : (s.labAttendance || (attVal + 4)),
        condonationGranted: condVal,
        attendanceCleared: attCleared,
        hallTicketStatus: hallStatus,
        hallTicketWithheldReason: attCleared ? (s.feeStatus === 'pending' ? 'Tuition fee dues outstanding.' : '') : 'Attendance below 75% institutional threshold.',
        subjectBreakdown: subjectBreakdown || s.subjectBreakdown
      };
    }
    return s;
  });
  saveStudentsClearance(updated);
  return updated;
}

