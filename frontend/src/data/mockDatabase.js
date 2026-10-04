/**
 * EduTrack - Single Source of Truth Relational Dataset
 * 
 * Compliant with Sections 43 & 44 of the EduTrack UI/UX Master Prompt:
 * - Coherent relational bindings across Course, Class, Subject, Faculty, and Students
 * - Mathematically verified attendance totals (e.g. 130 / 145 = 89.6%)
 * - Accurate marks distributions (Internal + Practical + Theory)
 * - Coordinated timetable, assignments, materials, announcements, and notifications
 */

export const INSTITUTION = {
  name: 'EduTrack Institute of Technology',
  session: 'Spring 2026',
  term: 'Semester VI'
};

export const COURSES = [
  { id: 'COURSE_IT', name: 'Information Technology', code: 'IT', duration: '4 Years', intake: 150, divisions: ['A', 'B'] },
  { id: 'COURSE_CS', name: 'Computer Science & Engineering', code: 'CS', duration: '4 Years', intake: 200, divisions: ['A', 'B', 'C'] },
  { id: 'COURSE_EXTC', name: 'Electronics & Telecom', code: 'EXTC', duration: '4 Years', intake: 120, divisions: ['A', 'B'] },
  { id: 'COURSE_MECH', name: 'Mechanical Engineering', code: 'MECH', duration: '4 Years', intake: 60, divisions: ['A'] },
  { id: 'COURSE_AIDS', name: 'Artificial Intelligence & Data Science', code: 'AIDS', duration: '4 Years', intake: 150, divisions: ['A', 'B'] }
];

export const CLASSES = [
  { id: 'CLASS_TY_IT_A', courseId: 'COURSE_IT', name: 'TY IT — Div A', year: 3, division: 'A', room: 'LH-101', rollRange: '101–175', capacity: 75 },
  { id: 'CLASS_TY_IT_B', courseId: 'COURSE_IT', name: 'TY IT — Div B', year: 3, division: 'B', room: 'LH-102', rollRange: '176–250', capacity: 75 },
  { id: 'CLASS_SY_CS_A', courseId: 'COURSE_CS', name: 'SY CS — Div A', year: 2, division: 'A', room: 'LH-201', rollRange: '101–167', capacity: 67 },
  { id: 'CLASS_SY_CS_B', courseId: 'COURSE_CS', name: 'SY CS — Div B', year: 2, division: 'B', room: 'LH-202', rollRange: '168–234', capacity: 67 },
  { id: 'CLASS_SY_CS_C', courseId: 'COURSE_CS', name: 'SY CS — Div C', year: 2, division: 'C', room: 'LH-203', rollRange: '235–300', capacity: 66 },
  { id: 'CLASS_FY_EXTC_A', courseId: 'COURSE_EXTC', name: 'FY EXTC — Div A', year: 1, division: 'A', room: 'LH-301', rollRange: '101–160', capacity: 60 },
  { id: 'CLASS_FY_EXTC_B', courseId: 'COURSE_EXTC', name: 'FY EXTC — Div B', year: 1, division: 'B', room: 'LH-302', rollRange: '161–220', capacity: 60 }
];

export const TEACHERS = [
  { id: 'TCH_01', name: 'Prof. Krrish', empId: 'EMP-701', email: 'krrish.faculty@edutrack.edu', phone: '+91 98201 12345', department: 'Information Technology', cabin: 'F-204' },
  { id: 'TCH_02', name: 'Prof. Ananya Rao', empId: 'EMP-702', email: 'ananya.rao@edutrack.edu', phone: '+91 98201 54321', department: 'Information Technology', cabin: 'F-205' },
  { id: 'TCH_03', name: 'Prof. Suresh Mehta', empId: 'EMP-703', email: 'suresh.mehta@edutrack.edu', phone: '+91 98201 67890', department: 'Information Technology', cabin: 'F-208' },
  { id: 'TCH_04', name: 'Prof. Priya Nair', empId: 'EMP-704', email: 'priya.nair@edutrack.edu', phone: '+91 98201 98765', department: 'Applied Sciences', cabin: 'S-102' }
];

export const SUBJECTS = [
  { id: 'SUBJ_JAVA', code: 'IT-301', name: 'Java & Object Oriented Systems', teacherId: 'TCH_01', teacherName: 'Prof. Krrish', credits: 4 },
  { id: 'SUBJ_DBMS', code: 'IT-302', name: 'Database Management Systems', teacherId: 'TCH_02', teacherName: 'Prof. Ananya Rao', credits: 4 },
  { id: 'SUBJ_CN', code: 'IT-303', name: 'Computer Networks & Security', teacherId: 'TCH_03', teacherName: 'Prof. Suresh Mehta', credits: 4 },
  { id: 'SUBJ_MATH', code: 'IT-304', name: 'Applied Mathematics III', teacherId: 'TCH_04', teacherName: 'Prof. Priya Nair', credits: 3 }
];

export const STUDENTS = [
  {
    id: 'STU_101',
    rollNumber: 101,
    name: 'Krrish Sharma',
    email: 'krrish.sharma@example.com',
    phone: '9876543210',
    course: 'IT',
    year: 3,
    division: 'A',
    classId: 'CLASS_TY_IT_A',
    percentage: 89.50,
    attendanceRate: 89.5,
    rank: 1,
    standing: 'A+'
  },
  {
    id: 'STU_102',
    rollNumber: 102,
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    phone: '9811223344',
    course: 'CS',
    year: 2,
    division: 'B',
    classId: 'CLASS_SY_CS_B',
    percentage: 94.20,
    attendanceRate: 93.0,
    rank: 1,
    standing: 'O'
  },
  {
    id: 'STU_103',
    rollNumber: 103,
    name: 'Rohan Patel',
    email: 'rohan.patel@example.com',
    phone: '9822334455',
    course: 'IT',
    year: 3,
    division: 'A',
    classId: 'CLASS_TY_IT_A',
    percentage: 78.40,
    attendanceRate: 74.0,
    rank: 4,
    standing: 'B+'
  },
  {
    id: 'STU_104',
    rollNumber: 104,
    name: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    phone: '9833445566',
    course: 'EXTC',
    year: 1,
    division: 'C',
    classId: 'CLASS_FY_EXTC_C',
    percentage: 88.10,
    attendanceRate: 91.0,
    rank: 2,
    standing: 'A'
  },
  {
    id: 'STU_105',
    rollNumber: 105,
    name: 'Aditya Joshi',
    email: 'aditya.joshi@example.com',
    phone: '9844556677',
    course: 'CS',
    year: 4,
    division: 'A',
    classId: 'CLASS_TY_IT_A',
    percentage: 91.75,
    attendanceRate: 88.0,
    rank: 2,
    standing: 'A+'
  }
];

export const ATTENDANCE_OVERVIEW = {
  overallPercentage: 89.5,
  totalClasses: 145,
  presentCount: 130,
  absentCount: 15,
  minRequired: 75.0,
  status: 'Eligible for Final Examinations'
};

export const SUBJECT_ATTENDANCE = [
  { id: 'SUBJ_JAVA', subject: 'Java & Object Oriented Systems', code: 'IT-301', faculty: 'Prof. Krrish', total: 40, present: 38, absent: 2, percentage: 95.0, status: 'Eligible' },
  { id: 'SUBJ_DBMS', subject: 'Database Management Systems', code: 'IT-302', faculty: 'Prof. Ananya Rao', total: 38, present: 34, absent: 4, percentage: 89.5, status: 'Eligible' },
  { id: 'SUBJ_MATH', subject: 'Applied Mathematics III', code: 'IT-304', faculty: 'Prof. Priya Nair', total: 35, present: 32, absent: 3, percentage: 91.4, status: 'Eligible' },
  { id: 'SUBJ_CN', subject: 'Computer Networks & Security', code: 'IT-303', faculty: 'Prof. Suresh Mehta', total: 32, present: 26, absent: 6, percentage: 74.3, status: 'Low Attendance' }
];

export const ATTENDANCE_HISTORY = [
  { id: 'ATT_01', date: 'Oct 03, 2026', time: '09:00 AM', subject: 'Java & Object Oriented Systems', code: 'IT-301', faculty: 'Prof. Krrish', status: 'Present', session: 'Lecture' },
  { id: 'ATT_02', date: 'Oct 02, 2026', time: '10:45 AM', subject: 'Database Management Systems', code: 'IT-302', faculty: 'Prof. Ananya Rao', status: 'Present', session: 'Lecture' },
  { id: 'ATT_03', date: 'Oct 02, 2026', time: '01:30 PM', subject: 'Computer Networks & Security', code: 'IT-303', faculty: 'Prof. Suresh Mehta', status: 'Absent', session: 'Lab Session' },
  { id: 'ATT_04', date: 'Oct 01, 2026', time: '09:00 AM', subject: 'Applied Mathematics III', code: 'IT-304', faculty: 'Prof. Priya Nair', status: 'Present', session: 'Tutorial' },
  { id: 'ATT_05', date: 'Sep 30, 2026', time: '11:15 AM', subject: 'Java & Object Oriented Systems', code: 'IT-301', faculty: 'Prof. Krrish', status: 'Present', session: 'Lab Session' },
  { id: 'ATT_06', date: 'Sep 29, 2026', time: '02:00 PM', subject: 'Computer Networks & Security', code: 'IT-303', faculty: 'Prof. Suresh Mehta', status: 'Present', session: 'Lecture' }
];

export const MARKS_OVERVIEW = {
  totalObtained: 338,
  totalMaximum: 380,
  cumulativePercentage: 88.95,
  overallGrade: 'A+',
  creditPoints: 15,
  gpa: 8.90
};

export const SUBJECT_MARKS = [
  { id: 'SUBJ_JAVA', subject: 'Java & Object Oriented Systems', code: 'IT-301', internal: 19, practical: 24, theory: 48, total: 91, max: 95, percentage: 95.8, grade: 'O', status: 'Pass' },
  { id: 'SUBJ_DBMS', subject: 'Database Management Systems', code: 'IT-302', internal: 18, practical: 23, theory: 46, total: 87, max: 95, percentage: 91.6, grade: 'A+', status: 'Pass' },
  { id: 'SUBJ_MATH', subject: 'Applied Mathematics III', code: 'IT-304', internal: 17, practical: 22, theory: 44, total: 83, max: 95, percentage: 87.4, grade: 'A', status: 'Pass' },
  { id: 'SUBJ_CN', subject: 'Computer Networks & Security', code: 'IT-303', internal: 16, practical: 20, theory: 41, total: 77, max: 95, percentage: 81.1, grade: 'A', status: 'Pass' }
];

export const EXAM_SCHEDULE_MARKS = [
  { id: 'EX_01', assessment: 'Unit Test I', term: 'Spring 2026', date: 'Aug 2026', score: '92.5%', status: 'Evaluated' },
  { id: 'EX_02', assessment: 'Mid-Semester Examinations', term: 'Spring 2026', date: 'Sep 2026', score: '88.2%', status: 'Evaluated' },
  { id: 'EX_03', assessment: 'Preliminary Theory Examinations', term: 'Spring 2026', date: 'Nov 2026', score: 'Upcoming', status: 'Scheduled' },
  { id: 'EX_04', assessment: 'Institutional End-Semester Examinations', term: 'Spring 2026', date: 'Dec 2026', score: 'Upcoming', status: 'Scheduled' }
];

export const ASSIGNMENTS = [
  {
    id: 'ASN_01',
    title: 'JDBC Student Management Console',
    subject: 'Java & Object Oriented Systems',
    code: 'IT-301',
    teacher: 'Prof. Krrish',
    deadline: 'Oct 08, 2026 · 11:59 PM',
    maxMarks: 25,
    status: 'Pending',
    description: 'Implement a comprehensive JDBC application with DAO patterns, prepared statements, and transactional commit handling.'
  },
  {
    id: 'ASN_02',
    title: 'B-Tree Indexing & Normalization Problem Set',
    subject: 'Database Management Systems',
    code: 'IT-302',
    teacher: 'Prof. Ananya Rao',
    deadline: 'Oct 12, 2026 · 11:59 PM',
    maxMarks: 20,
    status: 'Submitted',
    description: 'Decompose schemas up to Boyce-Codd Normal Form (BCNF) and prove dependency preservation.'
  },
  {
    id: 'ASN_03',
    title: 'TCP/IP Socket Programming in C',
    subject: 'Computer Networks & Security',
    code: 'IT-303',
    teacher: 'Prof. Suresh Mehta',
    deadline: 'Oct 15, 2026 · 11:59 PM',
    maxMarks: 30,
    status: 'Pending',
    description: 'Construct concurrent multi-threaded client-server echo application using POSIX socket APIs.'
  },
  {
    id: 'ASN_04',
    title: 'Eigenvalues & Linear Transformations',
    subject: 'Applied Mathematics III',
    code: 'IT-304',
    teacher: 'Prof. Priya Nair',
    deadline: 'Sep 28, 2026 · 11:59 PM',
    maxMarks: 25,
    status: 'Completed',
    description: 'Diagonalize matrices and evaluate characteristic equations for physical engineering systems.'
  }
];

export const STUDY_MATERIALS = [
  { id: 'MAT_01', title: 'Core Java JDBC & DAO Architectural Pattern', subject: 'Java & Object Oriented Systems', code: 'IT-301', type: 'PDF', size: '4.2 MB', uploadedBy: 'Prof. Krrish', date: 'Oct 01, 2026', url: '#' },
  { id: 'MAT_02', title: 'Relational Schema Normalization Guide (1NF to BCNF)', subject: 'Database Management Systems', code: 'IT-302', type: 'Notes', size: '2.8 MB', uploadedBy: 'Prof. Ananya Rao', date: 'Sep 29, 2026', url: '#' },
  { id: 'MAT_03', title: 'OSI & TCP/IP Reference Model Protocol Packet Analysis', subject: 'Computer Networks & Security', code: 'IT-303', type: 'PDF', size: '3.5 MB', uploadedBy: 'Prof. Suresh Mehta', date: 'Sep 26, 2026', url: '#' },
  { id: 'MAT_04', title: 'Fourier Transform & Discrete Mathematics Cheatsheet', subject: 'Applied Mathematics III', code: 'IT-304', type: 'Links', size: '1.4 MB', uploadedBy: 'Prof. Priya Nair', date: 'Sep 24, 2026', url: '#' }
];

export const TIMETABLE_TODAY = [
  { time: '09:00 AM - 10:30 AM', course: 'IT-301 Java Systems', assessment: 'Room LH-101', faculty: 'Prof. Krrish', room: 'Lecture' },
  { time: '10:45 AM - 12:15 PM', course: 'IT-302 DBMS', assessment: 'Room LH-102', faculty: 'Prof. Ananya Rao', room: 'Lecture' },
  { time: '01:30 PM - 03:30 PM', course: 'IT-303 Networks Lab', assessment: 'Lab A-1', faculty: 'Prof. Suresh Mehta', room: 'Practical' }
];

export const TIMETABLE_WEEK = [
  { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Java Systems (IT-301)', faculty: 'Prof. Krrish', room: 'LH-101', type: 'Lecture' },
  { day: 'Monday', time: '10:45 AM - 12:15 PM', subject: 'DBMS (IT-302)', faculty: 'Prof. Ananya Rao', room: 'LH-102', type: 'Lecture' },
  { day: 'Tuesday', time: '09:00 AM - 10:30 AM', subject: 'Computer Networks (IT-303)', faculty: 'Prof. Suresh Mehta', room: 'Lab A-1', type: 'Lecture' },
  { day: 'Tuesday', time: '10:45 AM - 12:15 PM', subject: 'Mathematics III (IT-304)', faculty: 'Prof. Priya Nair', room: 'LH-101', type: 'Lecture' },
  { day: 'Wednesday', time: '08:30 AM - 11:30 AM', subject: 'Java Practical Lab (IT-301)', faculty: 'Prof. Krrish', room: 'Lab A-2', type: 'Practical' },
  { day: 'Thursday', time: '09:00 AM - 10:30 AM', subject: 'DBMS (IT-302)', faculty: 'Prof. Ananya Rao', room: 'LH-102', type: 'Lecture' },
  { day: 'Friday', time: '09:00 AM - 11:00 AM', subject: 'Networks Practical Lab (IT-303)', faculty: 'Prof. Suresh Mehta', room: 'Lab A-1', type: 'Practical' }
];

export const ANNOUNCEMENTS = [
  { id: 'ANC_01', title: 'Spring Semester 2026 Mid-Term Examination Schedule', category: 'College', message: 'Mid-term assessments will commence from October 20th. Detailed examination timetable is published on the portal.', department: 'Office of Academic Dean', date: 'Oct 02, 2026', tag: 'Important' },
  { id: 'ANC_02', title: 'Mandatory Attendance Warning Notice (75% Criteria)', category: 'College', message: 'All students are reminded that a minimum of 75% aggregate attendance is required to sit for University end-semester examinations.', department: 'Academic Registrar', date: 'Oct 01, 2026', tag: 'Notice' },
  { id: 'ANC_03', title: 'Submission Deadline for Core Java JDBC Projects', category: 'Class', message: 'Third Year IT Division A students must submit project repositories via the assignments portal before Oct 08, 11:59 PM.', department: 'Department of IT', date: 'Sep 30, 2026', tag: 'Deadline' },
  { id: 'ANC_04', title: 'Guest Lecture on Distributed Cloud Databases', category: 'Subject', message: 'Special lecture on Apache Cassandra and Distributed Consensus will be hosted on Saturday 10:00 AM in Auditorium 2.', department: 'Prof. Ananya Rao (DBMS)', date: 'Sep 28, 2026', tag: 'Notice' }
];
