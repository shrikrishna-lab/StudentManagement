/**
 * EduTrack Timetable & Examination Schedule Datasets
 * Includes weekly academic lecture timetables and official end-semester examination schedules.
 */

export const WEEKLY_CLASS_SCHEDULE = {
  'Semester 6': {
    Monday: [
      {
        id: 1,
        time: '08:30 AM - 10:30 AM',
        courseCode: 'IT-301',
        courseName: 'Core Java & OOP Frameworks',
        sessionType: 'Theory Lecture',
        faculty: 'Prof. Krrish Sharma',
        room: 'Room 302',
        division: 'Div A',
        status: 'completed'
      },
      {
        id: 2,
        time: '10:45 AM - 12:45 PM',
        courseCode: 'IT-302',
        courseName: 'Database Management Systems',
        sessionType: 'Theory Lecture',
        faculty: 'Prof. Anjali Mehta',
        room: 'Room 302',
        division: 'Div A',
        status: 'active'
      },
      {
        id: 3,
        time: '01:30 PM - 03:30 PM',
        courseCode: 'IT-301L',
        courseName: 'Core Java Programming Lab',
        sessionType: 'Practical Lab',
        faculty: 'Prof. Krrish Sharma',
        room: 'Lab A-1',
        division: 'Div A (Batch 1)',
        status: 'upcoming'
      },
      {
        id: 4,
        time: '03:45 PM - 05:00 PM',
        courseCode: 'IT-303',
        courseName: 'Distributed Systems & Cloud',
        sessionType: 'Tutorial Session',
        faculty: 'Dr. Vivek Joshi',
        room: 'Room 304',
        division: 'Div A',
        status: 'upcoming'
      }
    ],
    Tuesday: [
      {
        id: 5,
        time: '09:00 AM - 11:00 AM',
        courseCode: 'IT-304',
        courseName: 'Computer Networks & Security',
        sessionType: 'Theory Lecture',
        faculty: 'Prof. Neha Gupta',
        room: 'Room 301',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 6,
        time: '11:15 AM - 01:15 PM',
        courseCode: 'IT-302L',
        courseName: 'DBMS & SQL Query Optimization Lab',
        sessionType: 'Practical Lab',
        faculty: 'Prof. Anjali Mehta',
        room: 'Lab A-2',
        division: 'Div A (Batch 2)',
        status: 'scheduled'
      },
      {
        id: 7,
        time: '02:00 PM - 04:00 PM',
        courseCode: 'IT-305',
        courseName: 'Capstone Project Phase 1 Mentorship',
        sessionType: 'Project Studio',
        faculty: 'Prof. Krrish Sharma & Dept Board',
        room: 'Innovation Center',
        division: 'Div A',
        status: 'scheduled'
      }
    ],
    Wednesday: [
      {
        id: 8,
        time: '08:30 AM - 10:30 AM',
        courseCode: 'IT-303',
        courseName: 'Distributed Systems & Cloud',
        sessionType: 'Theory Lecture',
        faculty: 'Dr. Vivek Joshi',
        room: 'Room 302',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 9,
        time: '10:45 AM - 12:45 PM',
        courseCode: 'IT-301',
        courseName: 'Core Java & Multi-threading Frameworks',
        sessionType: 'Theory Lecture',
        faculty: 'Prof. Krrish Sharma',
        room: 'Room 302',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 10,
        time: '01:30 PM - 03:30 PM',
        courseCode: 'IT-304L',
        courseName: 'Network Packet Analysis Lab',
        sessionType: 'Practical Lab',
        faculty: 'Prof. Neha Gupta',
        room: 'Lab A-4',
        division: 'Div A (Batch 1)',
        status: 'scheduled'
      }
    ],
    Thursday: [
      {
        id: 11,
        time: '09:00 AM - 11:00 AM',
        courseCode: 'IT-302',
        courseName: 'Database Management Systems & Transactions',
        sessionType: 'Theory Lecture',
        faculty: 'Prof. Anjali Mehta',
        room: 'Room 301',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 12,
        time: '11:15 AM - 01:15 PM',
        courseCode: 'IT-304',
        courseName: 'Computer Networks & Security',
        sessionType: 'Theory Lecture',
        faculty: 'Prof. Neha Gupta',
        room: 'Room 301',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 13,
        time: '02:00 PM - 04:30 PM',
        courseCode: 'IT-301L',
        courseName: 'Full Stack JDBC & Spring Boot Lab',
        sessionType: 'Practical Lab',
        faculty: 'Prof. Krrish Sharma',
        room: 'Lab A-1',
        division: 'Div A (Batch 2)',
        status: 'scheduled'
      }
    ],
    Friday: [
      {
        id: 14,
        time: '08:30 AM - 10:30 AM',
        courseCode: 'IT-303',
        courseName: 'Distributed Systems & Cloud Clusters',
        sessionType: 'Theory Lecture',
        faculty: 'Dr. Vivek Joshi',
        room: 'Room 302',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 15,
        time: '10:45 AM - 12:45 PM',
        courseCode: 'IT-305',
        courseName: 'Capstone Project Progress Review',
        sessionType: 'Seminar Evaluation',
        faculty: 'Department Board',
        room: 'Auditorium 2',
        division: 'Div A',
        status: 'scheduled'
      },
      {
        id: 16,
        time: '01:30 PM - 03:30 PM',
        courseCode: 'LIB-301',
        courseName: 'Research Paper Writing & Library Hour',
        sessionType: 'Guided Study',
        faculty: 'Chief Librarian',
        room: 'Digital Library',
        division: 'Div A',
        status: 'scheduled'
      }
    ],
    Saturday: [
      {
        id: 17,
        time: '09:00 AM - 11:30 AM',
        courseCode: 'REM-301',
        courseName: 'Remedial Doubt-Clearing & Tutorial Hour',
        sessionType: 'Remedial Session',
        faculty: 'Prof. Krrish Sharma / Dr. Vivek Joshi',
        room: 'Room 304',
        division: 'All Batches',
        status: 'scheduled'
      },
      {
        id: 18,
        time: '12:00 PM - 02:00 PM',
        courseCode: 'TPO-301',
        courseName: 'Placement Aptitude & Coding Mock Contests',
        sessionType: 'Placement Prep',
        faculty: 'Placement Training Team',
        room: 'Lab A-3',
        division: 'Semester 6',
        status: 'scheduled'
      }
    ]
  }
};

export const INITIAL_EXAM_SCHEDULE = [
  // ===================== IT DEPARTMENT EXAMS =====================
  {
    id: 'exam-01',
    department: 'IT',
    division: 'All',
    paperCode: 'IT-301',
    subjectName: 'Core Java & Object-Oriented Frameworks',
    date: 'Nov 10, 2026',
    day: 'Tuesday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Examination Hall A-101',
    seatingBlock: 'Desk #01 to #60',
    invigilator: 'Prof. Krrish Sharma',
    coInvigilator: 'Prof. Sneha Deshmukh',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Programmable calculators strictly barred. Carry Hall Ticket & RFID Smart ID.'
  },
  {
    id: 'exam-02',
    department: 'IT',
    division: 'All',
    paperCode: 'IT-302',
    subjectName: 'Database Management Systems & Transactions',
    date: 'Nov 13, 2026',
    day: 'Friday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Examination Hall A-102',
    seatingBlock: 'Desk #01 to #60',
    invigilator: 'Prof. Anjali Mehta',
    coInvigilator: 'Dr. K. Patel',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Standard non-programmable scientific calculator permitted (Casio fx-991ES or equivalent).'
  },
  {
    id: 'exam-03',
    department: 'IT',
    division: 'All',
    paperCode: 'IT-303',
    subjectName: 'Distributed Systems & Cloud Computing',
    date: 'Nov 17, 2026',
    day: 'Tuesday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Examination Hall B-201',
    seatingBlock: 'Desk #61 to #120',
    invigilator: 'Dr. Vivek Joshi',
    coInvigilator: 'Prof. Neha Gupta',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Open network diagrams book is NOT allowed. Comprehensive Bloom question format.'
  },
  {
    id: 'exam-04',
    department: 'IT',
    division: 'All',
    paperCode: 'IT-304',
    subjectName: 'Computer Networks & Network Security',
    date: 'Nov 20, 2026',
    day: 'Friday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Examination Hall B-202',
    seatingBlock: 'Desk #61 to #120',
    invigilator: 'Prof. Neha Gupta',
    coInvigilator: 'Prof. S. Rao',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Standard cipher and protocol reference sheets will be provided by invigilator.'
  },
  {
    id: 'exam-05',
    department: 'IT',
    division: 'Div A',
    paperCode: 'IT-301L',
    subjectName: 'Core Java Programming Laboratory Viva',
    date: 'Nov 24, 2026',
    day: 'Tuesday',
    time: '09:00 AM - 01:00 PM',
    shift: 'Practical Morning Batch',
    duration: '4 Hours',
    marks: 50,
    examType: 'Practical Lab & Viva',
    room: 'Computing Lab A-1',
    seatingBlock: 'Batch 1 (Roll #101–135)',
    invigilator: 'Prof. Krrish Sharma',
    coInvigilator: 'External University Examiner',
    reportingTime: '08:45 AM',
    status: 'Scheduled',
    instructions: 'Bring signed lab journal and certified GitHub code repository printouts.'
  },

  // ===================== COMPUTER SCIENCE EXAMS =====================
  {
    id: 'exam-cs-01',
    department: 'CS',
    division: 'All',
    paperCode: 'CS-301',
    subjectName: 'Advanced Data Structures & Algorithms Analysis',
    date: 'Nov 11, 2026',
    day: 'Wednesday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Auditorium Hall CS-1',
    seatingBlock: 'Desk #01 to #67 (Div A)',
    invigilator: 'Dr. Radhika Sen',
    coInvigilator: 'Prof. A. Mukherjee',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Algorithm trace sheets provided. Strict pseudocode indentation required.'
  },
  {
    id: 'exam-cs-02',
    department: 'CS',
    division: 'All',
    paperCode: 'CS-302',
    subjectName: 'Operating System Internals & Kernel Architecture',
    date: 'Nov 14, 2026',
    day: 'Saturday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Auditorium Hall CS-2',
    seatingBlock: 'Desk #68 to #134 (Div B)',
    invigilator: 'Dr. Vivek Joshi',
    coInvigilator: 'Prof. Priya Nair',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Assembly code references allowed for thread scheduling problems.'
  },
  {
    id: 'exam-cs-03',
    department: 'CS',
    division: 'Div A',
    paperCode: 'CS-301L',
    subjectName: 'Advanced Algorithms Laboratory Practical Exam',
    date: 'Nov 25, 2026',
    day: 'Wednesday',
    time: '09:30 AM - 01:30 PM',
    shift: 'Practical Morning Batch',
    duration: '4 Hours',
    marks: 50,
    examType: 'Practical Lab & Viva',
    room: 'Computing Lab B-2',
    seatingBlock: 'Batch 1 (Roll #101–135)',
    invigilator: 'Dr. Radhika Sen',
    coInvigilator: 'External University Assessor',
    reportingTime: '09:00 AM',
    status: 'Scheduled',
    instructions: 'Live timed coding challenge on isolated campus intranet server.'
  },

  // ===================== ELECTRONICS & TELECOM EXAMS =====================
  {
    id: 'exam-extc-01',
    department: 'EXTC',
    division: 'All',
    paperCode: 'EXTC-301',
    subjectName: 'Signals & Systems Analysis',
    date: 'Nov 12, 2026',
    day: 'Thursday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Hall EXTC-201',
    seatingBlock: 'Desk #01 to #60',
    invigilator: 'Dr. Suresh Rao',
    coInvigilator: 'Prof. M. Kulkarni',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Fourier & Laplace transform tables will be distributed.'
  },
  {
    id: 'exam-extc-02',
    department: 'EXTC',
    division: 'Div A',
    paperCode: 'EXTC-301L',
    subjectName: 'DSP & Signal Simulation Laboratory Viva',
    date: 'Nov 27, 2026',
    day: 'Friday',
    time: '01:30 PM - 05:30 PM',
    shift: 'Practical Afternoon Batch',
    duration: '4 Hours',
    marks: 50,
    examType: 'Practical Lab & Viva',
    room: 'Hardware Lab H-1',
    seatingBlock: 'Batch 1 (Roll #101–130)',
    invigilator: 'Dr. Suresh Rao',
    coInvigilator: 'External University Examiner',
    reportingTime: '01:00 PM',
    status: 'Scheduled',
    instructions: 'MATLAB / Simulink filter design demonstration required.'
  },

  // ===================== MECHANICAL ENGINEERING EXAMS =====================
  {
    id: 'exam-mech-01',
    department: 'MECH',
    division: 'All',
    paperCode: 'MECH-301',
    subjectName: 'Thermodynamics & Heat Transfer Fundamentals',
    date: 'Nov 16, 2026',
    day: 'Monday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'Mechanical Block Hall M-1',
    seatingBlock: 'Desk #01 to #60',
    invigilator: 'Dr. Hemant Patil',
    coInvigilator: 'Prof. Rajesh Shinde',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Steam tables and Mollier charts are permitted.'
  },

  // ===================== AI & DATA SCIENCE EXAMS =====================
  {
    id: 'exam-aids-01',
    department: 'AIDS',
    division: 'All',
    paperCode: 'AIDS-301',
    subjectName: 'Machine Learning Foundations & Statistical Learning',
    date: 'Nov 18, 2026',
    day: 'Wednesday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    duration: '3 Hours',
    marks: 100,
    examType: 'Theory Written',
    room: 'AI Center Hall 1',
    seatingBlock: 'Desk #01 to #75',
    invigilator: 'Dr. Meera Nambiar',
    coInvigilator: 'Prof. Tanmay Roy',
    reportingTime: '09:20 AM',
    status: 'Scheduled',
    instructions: 'Calculators allowed. Statistical distribution tables will be provided.'
  }
];

export const EXAM_TIMETABLE_STORAGE_KEY = 'edutrack_exam_timetable_published';
export const EXAM_SCHEDULE_STORAGE_KEY = 'edutrack_exam_schedule_items';

/**
 * Helper to fetch whether the exam timetable is published to students & teachers.
 * Defaults to true.
 */
export function getExamPublishedStatus() {
  try {
    const val = localStorage.getItem(EXAM_TIMETABLE_STORAGE_KEY);
    if (val === null) return true; // default published
    return JSON.parse(val);
  } catch {
    return true;
  }
}

/**
 * Helper to set whether the exam timetable is published.
 */
export function setExamPublishedStatus(published) {
  try {
    localStorage.setItem(EXAM_TIMETABLE_STORAGE_KEY, JSON.stringify(published));
    window.dispatchEvent(new CustomEvent('edutrack_exam_visibility_changed', { detail: { published } }));
  } catch (e) {
    console.error(e);
  }
}

export const DEPARTMENT_WEEKLY_SCHEDULES = {
  IT: WEEKLY_CLASS_SCHEDULE['Semester 6'],
  CS: {
    Monday: [
      { id: 'cs-1', time: '08:30 AM - 10:30 AM', courseCode: 'CS-301', courseName: 'Advanced Data Structures & Algorithms', sessionType: 'Theory Lecture', faculty: 'Dr. Radhika Sen', room: 'Hall CS-1', division: 'Div A', status: 'completed' },
      { id: 'cs-2', time: '10:45 AM - 12:45 PM', courseCode: 'CS-302', courseName: 'Operating System Internals & Linux Kernel', sessionType: 'Theory Lecture', faculty: 'Dr. Vivek Joshi', room: 'Hall CS-1', division: 'Div A', status: 'active' },
      { id: 'cs-3', time: '01:30 PM - 03:30 PM', courseCode: 'CS-301L', courseName: 'Algorithms Complexity Lab', sessionType: 'Practical Lab', faculty: 'Dr. Radhika Sen', room: 'Computing Lab B-2', division: 'Div A (Batch 1)', status: 'upcoming' },
      { id: 'cs-4', time: '03:45 PM - 05:00 PM', courseCode: 'CS-304', courseName: 'Artificial Intelligence & Search Heuristics', sessionType: 'Theory Lecture', faculty: 'Prof. Priya Nair', room: 'Hall CS-2', division: 'Div A', status: 'upcoming' }
    ],
    Tuesday: [
      { id: 'cs-5', time: '09:00 AM - 11:00 AM', courseCode: 'CS-302', courseName: 'OS Concurrency & Process Scheduling', sessionType: 'Theory Lecture', faculty: 'Dr. Vivek Joshi', room: 'Hall CS-1', division: 'Div A', status: 'scheduled' },
      { id: 'cs-6', time: '11:15 AM - 01:15 PM', courseCode: 'CS-303L', courseName: 'Cloud & Kubernetes Systems Lab', sessionType: 'Practical Lab', faculty: 'Prof. A. Mukherjee', room: 'Computing Lab B-1', division: 'Div A (Batch 2)', status: 'scheduled' }
    ],
    Wednesday: [
      { id: 'cs-7', time: '08:30 AM - 10:30 AM', courseCode: 'CS-304', courseName: 'Machine Learning & Neural Architectures', sessionType: 'Theory Lecture', faculty: 'Prof. Priya Nair', room: 'Hall CS-1', division: 'Div A', status: 'scheduled' },
      { id: 'cs-8', time: '10:45 AM - 12:45 PM', courseCode: 'CS-301', courseName: 'Graph Theory & Dynamic Programming', sessionType: 'Tutorial Session', faculty: 'Dr. Radhika Sen', room: 'Hall CS-1', division: 'Div A', status: 'scheduled' }
    ],
    Thursday: [
      { id: 'cs-9', time: '09:00 AM - 11:00 AM', courseCode: 'CS-302', courseName: 'Operating System Memory Management', sessionType: 'Theory Lecture', faculty: 'Dr. Vivek Joshi', room: 'Hall CS-1', division: 'Div A', status: 'scheduled' },
      { id: 'cs-10', time: '01:30 PM - 03:30 PM', courseCode: 'CS-301L', courseName: 'Algorithms Lab Session', sessionType: 'Practical Lab', faculty: 'Dr. Radhika Sen', room: 'Computing Lab B-2', division: 'Div A', status: 'scheduled' }
    ],
    Friday: [
      { id: 'cs-11', time: '08:30 AM - 10:30 AM', courseCode: 'CS-305', courseName: 'Software Engineering & Agile Scrum Studio', sessionType: 'Project Studio', faculty: 'Faculty Team', room: 'Innovation Hub', division: 'Div A', status: 'scheduled' }
    ],
    Saturday: [
      { id: 'cs-12', time: '10:00 AM - 12:00 PM', courseCode: 'TPO-301', courseName: 'Competitive Coding & FAANG Interview Prep', sessionType: 'Placement Prep', faculty: 'TPO Mentors', room: 'Auditorium CS-1', division: 'All Divisions', status: 'scheduled' }
    ]
  },
  EXTC: {
    Monday: [
      { id: 'extc-1', time: '08:30 AM - 10:30 AM', courseCode: 'EXTC-301', courseName: 'Signals & Systems Analysis', sessionType: 'Theory Lecture', faculty: 'Dr. Suresh Rao', room: 'Hall EXTC-201', division: 'Div A', status: 'completed' },
      { id: 'extc-2', time: '10:45 AM - 12:45 PM', courseCode: 'EXTC-302', courseName: 'Microcontrollers & Embedded Architectures', sessionType: 'Theory Lecture', faculty: 'Prof. M. Kulkarni', room: 'Hall EXTC-201', division: 'Div A', status: 'active' },
      { id: 'extc-3', time: '01:30 PM - 03:30 PM', courseCode: 'EXTC-301L', courseName: 'DSP & Signal Simulation Lab', sessionType: 'Practical Lab', faculty: 'Dr. Suresh Rao', room: 'Hardware Lab H-1', division: 'Div A (Batch 1)', status: 'upcoming' }
    ],
    Tuesday: [
      { id: 'extc-4', time: '09:00 AM - 11:00 AM', courseCode: 'EXTC-303', courseName: 'Electromagnetic Waves & Transmission Lines', sessionType: 'Theory Lecture', faculty: 'Prof. S. Joshi', room: 'Hall EXTC-202', division: 'Div A', status: 'scheduled' }
    ],
    Wednesday: [
      { id: 'extc-5', time: '08:30 AM - 10:30 AM', courseCode: 'EXTC-301', courseName: 'Fourier & Z-Transforms Applications', sessionType: 'Theory Lecture', faculty: 'Dr. Suresh Rao', room: 'Hall EXTC-201', division: 'Div A', status: 'scheduled' }
    ],
    Thursday: [
      { id: 'extc-6', time: '09:00 AM - 11:00 AM', courseCode: 'EXTC-302', courseName: 'ARM Cortex & RTOS Fundamentals', sessionType: 'Theory Lecture', faculty: 'Prof. M. Kulkarni', room: 'Hall EXTC-201', division: 'Div A', status: 'scheduled' }
    ],
    Friday: [
      { id: 'extc-7', time: '10:00 AM - 12:00 PM', courseCode: 'EXTC-305', courseName: 'Mini Project & PCB Fabrication Lab', sessionType: 'Practical Lab', faculty: 'Lab Instructors', room: 'Hardware Lab H-2', division: 'Div A', status: 'scheduled' }
    ],
    Saturday: [
      { id: 'extc-8', time: '10:00 AM - 12:00 PM', courseCode: 'TPO-301', courseName: 'VLSI Core Industry Placement Training', sessionType: 'Placement Prep', faculty: 'Industry Experts', room: 'Hall EXTC-201', division: 'All Divisions', status: 'scheduled' }
    ]
  },
  MECH: {
    Monday: [
      { id: 'mech-1', time: '08:30 AM - 10:30 AM', courseCode: 'MECH-301', courseName: 'Thermodynamics & Heat Transfer Fundamentals', sessionType: 'Theory Lecture', faculty: 'Dr. Hemant Patil', room: 'Hall M-1', division: 'Div A', status: 'completed' },
      { id: 'mech-2', time: '10:45 AM - 12:45 PM', courseCode: 'MECH-302', courseName: 'Fluid Mechanics & Turbomachinery', sessionType: 'Theory Lecture', faculty: 'Prof. Rajesh Shinde', room: 'Hall M-1', division: 'Div A', status: 'active' },
      { id: 'mech-3', time: '01:30 PM - 03:30 PM', courseCode: 'MECH-301L', courseName: 'CAD/CAM Solid Modeling Lab', sessionType: 'Practical Lab', faculty: 'Prof. Rajesh Shinde', room: 'Design Lab M-1', division: 'Div A (Batch 1)', status: 'upcoming' }
    ],
    Tuesday: [
      { id: 'mech-4', time: '09:00 AM - 11:00 AM', courseCode: 'MECH-303', courseName: 'Theory of Machines & Mechanisms', sessionType: 'Theory Lecture', faculty: 'Dr. Hemant Patil', room: 'Hall M-2', division: 'Div A', status: 'scheduled' }
    ],
    Wednesday: [
      { id: 'mech-5', time: '08:30 AM - 10:30 AM', courseCode: 'MECH-301', courseName: 'Thermal Power Systems & Refrigeration', sessionType: 'Theory Lecture', faculty: 'Dr. Hemant Patil', room: 'Hall M-1', division: 'Div A', status: 'scheduled' }
    ],
    Thursday: [
      { id: 'mech-6', time: '09:00 AM - 11:00 AM', courseCode: 'MECH-302', courseName: 'Hydraulics & Pneumatics Systems', sessionType: 'Theory Lecture', faculty: 'Prof. Rajesh Shinde', room: 'Hall M-1', division: 'Div A', status: 'scheduled' }
    ],
    Friday: [
      { id: 'mech-7', time: '10:00 AM - 12:00 PM', courseCode: 'MECH-305', courseName: 'Manufacturing Processes Workshop', sessionType: 'Workshop Session', faculty: 'Workshop Superintendents', room: 'Central Workshop', division: 'Div A', status: 'scheduled' }
    ],
    Saturday: [
      { id: 'mech-8', time: '10:00 AM - 12:00 PM', courseCode: 'TPO-301', courseName: 'Automotive & Design Industry Aptitude', sessionType: 'Placement Prep', faculty: 'TPO Faculty', room: 'Hall M-1', division: 'All Divisions', status: 'scheduled' }
    ]
  },
  AIDS: {
    Monday: [
      { id: 'aids-1', time: '08:30 AM - 10:30 AM', courseCode: 'AIDS-301', courseName: 'Machine Learning Foundations & Supervised Learning', sessionType: 'Theory Lecture', faculty: 'Dr. Meera Nambiar', room: 'AI Hall 1', division: 'Div A', status: 'completed' },
      { id: 'aids-2', time: '10:45 AM - 12:45 PM', courseCode: 'AIDS-302', courseName: 'Deep Neural Networks & PyTorch Framework', sessionType: 'Theory Lecture', faculty: 'Prof. Tanmay Roy', room: 'AI Hall 1', division: 'Div A', status: 'active' },
      { id: 'aids-3', time: '01:30 PM - 03:30 PM', courseCode: 'AIDS-301L', courseName: 'GPU Model Training & Fine-Tuning Lab', sessionType: 'Practical Lab', faculty: 'Dr. Meera Nambiar', room: 'AI Cluster 1', division: 'Div A (Batch 1)', status: 'upcoming' }
    ],
    Tuesday: [
      { id: 'aids-4', time: '09:00 AM - 11:00 AM', courseCode: 'AIDS-303', courseName: 'Big Data Engineering & Apache Spark', sessionType: 'Theory Lecture', faculty: 'Prof. Tanmay Roy', room: 'AI Hall 2', division: 'Div A', status: 'scheduled' }
    ],
    Wednesday: [
      { id: 'aids-5', time: '08:30 AM - 10:30 AM', courseCode: 'AIDS-301', courseName: 'Unsupervised Learning & Clustering Algorithms', sessionType: 'Theory Lecture', faculty: 'Dr. Meera Nambiar', room: 'AI Hall 1', division: 'Div A', status: 'scheduled' }
    ],
    Thursday: [
      { id: 'aids-6', time: '09:00 AM - 11:00 AM', courseCode: 'AIDS-302', courseName: 'Convolutional & Recurrent Networks (CNN & RNN)', sessionType: 'Theory Lecture', faculty: 'Prof. Tanmay Roy', room: 'AI Hall 1', division: 'Div A', status: 'scheduled' }
    ],
    Friday: [
      { id: 'aids-7', time: '10:00 AM - 12:00 PM', courseCode: 'AIDS-305', courseName: 'Natural Language Processing & LLMs Studio', sessionType: 'Project Studio', faculty: 'AI Lab Team', room: 'AI Cluster 2', division: 'Div A', status: 'scheduled' }
    ],
    Saturday: [
      { id: 'aids-8', time: '10:00 AM - 12:00 PM', courseCode: 'TPO-301', courseName: 'Kaggle Masterclass & AI Roles Placement Prep', sessionType: 'Placement Prep', faculty: 'TPO Mentors', room: 'AI Hall 1', division: 'All Divisions', status: 'scheduled' }
    ]
  }
};

const WEEKLY_SCHEDULES_STORAGE_KEY = 'edutrack_weekly_class_schedules_v2';

export function loadAllWeeklySchedules() {
  try {
    const raw = localStorage.getItem(WEEKLY_SCHEDULES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load weekly schedules:', e);
  }
  return DEPARTMENT_WEEKLY_SCHEDULES;
}

export function saveAllWeeklySchedules(schedules) {
  try {
    localStorage.setItem(WEEKLY_SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
    window.dispatchEvent(new CustomEvent('edutrack_weekly_schedule_updated', { detail: schedules }));
  } catch (e) {
    console.error('Failed to save weekly schedules:', e);
  }
}

export function getWeeklyClassSchedule(department = 'IT', semester = 'Semester 6', division = 'Div A') {
  const allSchedules = loadAllWeeklySchedules();
  const deptKey = department.toUpperCase();
  const matchedDept = allSchedules[deptKey] || allSchedules['IT'] || DEPARTMENT_WEEKLY_SCHEDULES['IT'];
  return matchedDept;
}

export function saveWeeklyClassSession(department = 'IT', day = 'Monday', sessionData) {
  const allSchedules = { ...loadAllWeeklySchedules() };
  const deptKey = department.toUpperCase();
  
  if (!allSchedules[deptKey]) {
    allSchedules[deptKey] = {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: []
    };
  }

  const dayList = allSchedules[deptKey][day] ? [...allSchedules[deptKey][day]] : [];
  const sessionId = sessionData.id || `sess-${Date.now()}`;

  const newSession = {
    id: sessionId,
    time: sessionData.time || '09:00 AM - 11:00 AM',
    courseCode: (sessionData.courseCode || 'IT-301').trim(),
    courseName: (sessionData.courseName || 'Course Subject').trim(),
    sessionType: sessionData.sessionType || 'Theory Lecture',
    faculty: (sessionData.faculty || 'Assigned Faculty').trim(),
    room: (sessionData.room || 'Room 302').trim(),
    division: (sessionData.division || 'Div A').trim(),
    status: sessionData.status || 'scheduled'
  };

  const existingIdx = dayList.findIndex((s) => String(s.id) === String(sessionId));
  if (existingIdx >= 0) {
    dayList[existingIdx] = newSession;
  } else {
    dayList.push(newSession);
  }

  allSchedules[deptKey][day] = dayList;
  saveAllWeeklySchedules(allSchedules);
  return newSession;
}

export function deleteWeeklyClassSession(department = 'IT', day = 'Monday', sessionId) {
  const allSchedules = { ...loadAllWeeklySchedules() };
  const deptKey = department.toUpperCase();

  if (allSchedules[deptKey] && allSchedules[deptKey][day]) {
    allSchedules[deptKey][day] = allSchedules[deptKey][day].filter(
      (s) => String(s.id) !== String(sessionId)
    );
    saveAllWeeklySchedules(allSchedules);
  }

  return allSchedules;
}

export function loadExamSchedule() {
  try {
    const saved = localStorage.getItem(EXAM_SCHEDULE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_EXAM_SCHEDULE;
  } catch {
    return INITIAL_EXAM_SCHEDULE;
  }
}

export function saveExamSchedule(items) {
  try {
    localStorage.setItem(EXAM_SCHEDULE_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('edutrack_exam_schedule_updated', { detail: { items } }));
  } catch (e) {
    console.error(e);
  }
}

export function updateExamSession(id, updatedExam) {
  const current = loadExamSchedule();
  const updated = current.map((item) => {
    if (String(item.id) === String(id)) {
      return { ...item, ...updatedExam };
    }
    return item;
  });
  saveExamSchedule(updated);
  return updated;
}

export function deleteExamSession(id) {
  const current = loadExamSchedule();
  const updated = current.filter((item) => String(item.id) !== String(id));
  saveExamSchedule(updated);
  return updated;
}

