/**
 * EduTrack Official Announcements & Circulars Dataset
 * Pre-populated with realistic academic announcements featuring role-based audience segregation.
 * 
 * Target Audiences:
 * - 'students': Visible to Students and Admins. Hidden from Teachers.
 * - 'teachers': Visible to Teachers and Admins. Hidden from Students.
 * - 'all': Campus-wide notices visible to Students, Teachers, and Admins.
 */

export const INITIAL_ANNOUNCEMENTS = [
  // ==========================================
  // STUDENT SPECIFIC ANNOUNCEMENTS
  // ==========================================
  {
    id: 1,
    title: 'Semester 6 Final Examination Schedule Released',
    semester: 'Semester 6',
    department: 'Examination Cell',
    audience: 'students',
    date: 'Oct 02, 2026',
    time: '09:30 AM',
    tag: 'Examination',
    priority: 'urgent',
    readBy: [],
    message: 'The official timetable for end-semester theory examinations and practical lab evaluations has been published. Theory papers begin Nov 10, practicals from Oct 28. Download hall tickets from the student portal before Oct 18.',
    author: 'Controller of Examinations',
    attachment: 'Sem6_Exam_Timetable_2026.pdf',
    details: 'Theory examinations will be conducted in Morning (10:00 AM - 01:00 PM) and Afternoon (02:00 PM - 05:00 PM) shifts. Seating charts will be displayed on the notice board 30 minutes before exam commencement. RFID identity cards are strictly required.'
  },
  {
    id: 2,
    title: 'Capstone Project Final Submission & Viva Guidelines',
    semester: 'Semester 6',
    department: 'Department of IT',
    audience: 'students',
    date: 'Sep 29, 2026',
    time: '11:15 AM',
    tag: 'Academic',
    priority: 'important',
    readBy: [],
    message: 'All Semester 6 IT students must submit their complete Capstone Project documentation, IEEE-format research paper, and verified GitHub repository link before Oct 20 for guide sign-off.',
    author: 'Prof. Krrish Sharma (Project Coordinator)',
    attachment: 'Capstone_Submission_Template.docx',
    details: 'Project groups must verify that their source code is deployed on the college server or accessible via verified staging link. Plagiarism in final dissertation documents must not exceed 10% on Turnitin.'
  },
  {
    id: 3,
    title: 'Tier-1 Campus Placement Drive: Eligibility & Registration',
    semester: 'Semester 6',
    department: 'Training & Placement Cell',
    audience: 'students',
    date: 'Sep 28, 2026',
    time: '02:00 PM',
    tag: 'Placement',
    priority: 'important',
    readBy: [],
    message: 'Pre-placement talks and technical coding assessments by Google, Microsoft, and Oracle commence next week. Minimum 75% aggregate marks and zero active backlogs required to participate.',
    author: 'Director of Career Services',
    attachment: 'Placement_Drive_Schedule.pdf',
    details: 'Online assessment will comprise Data Structures, Algorithms, System Design, and Aptitude. Students should carry 3 hardcopies of their resume and wear formal dress code for interviews.'
  },
  {
    id: 4,
    title: 'Database Management Systems Lab Evaluation #3',
    semester: 'Semester 6',
    department: 'Computer Engineering',
    audience: 'students',
    date: 'Sep 25, 2026',
    time: '10:00 AM',
    tag: 'Lab Notice',
    priority: 'normal',
    readBy: [],
    message: 'Hands-on practical evaluation covering B+ Trees, Indexing, and JDBC Transaction Management will be held during regular batch lab timings this Thursday in Lab A-1.',
    author: 'Prof. Anjali Mehta',
    attachment: 'Lab3_Evaluation_Rubric.pdf',
    details: 'Each student will receive a unique transactional scenario. Evaluation criteria: Query efficiency (30%), JDBC connection handling (40%), and Viva defense (30%).'
  },
  {
    id: 5,
    title: 'Remedial Re-Assessment & Arrear Clearance Registration',
    semester: 'Semester 4',
    department: 'Academic Affairs',
    audience: 'students',
    date: 'Sep 22, 2026',
    time: '04:30 PM',
    tag: 'Academic',
    priority: 'normal',
    readBy: [],
    message: 'Registrations are open for Semester 4 remedial classes in Discrete Mathematics and Microprocessors. Forms available at the Registrar counter until Oct 10.',
    author: 'Academic Dean',
    attachment: 'Remedial_Form_2026.pdf',
    details: 'Remedial sessions will be conducted by senior faculty on Saturdays. Attendance in at least 80% of remedial lectures is required to appear in the supplementary re-test.'
  },
  {
    id: 6,
    title: 'Semester 5 Official Grade Cards & Transcript Distribution',
    semester: 'Semester 5',
    department: 'Registrar Office',
    audience: 'students',
    date: 'Sep 20, 2026',
    time: '01:30 PM',
    tag: 'Academic',
    priority: 'normal',
    readBy: [],
    message: 'Original printed grade cards with official hologram seals for Semester 5 are available for collection at Academic Counter #3 between 11:00 AM and 03:00 PM.',
    author: 'Registrar',
    attachment: 'GradeCard_Collection_Schedule.pdf',
    details: 'Students must clear any pending library book dues and laboratory equipment liabilities before physical collection of grade cards.'
  },

  // ==========================================
  // TEACHER / FACULTY SPECIFIC ANNOUNCEMENTS
  // ==========================================
  {
    id: 101,
    title: 'Department Board: Mid-Term Question Paper Submission Deadline',
    semester: 'All Semesters',
    department: 'Examination Committee',
    audience: 'teachers',
    date: 'Oct 02, 2026',
    time: '08:45 AM',
    tag: 'Examination',
    priority: 'urgent',
    readBy: [],
    message: 'All course faculty instructors must submit two moderated sets of End-Semester question papers along with full Bloom taxonomy mapping and scheme of valuation to the Exam Cell by Oct 12.',
    author: 'Controller of Examinations',
    attachment: 'QuestionPaper_Moderation_Format.docx',
    details: 'Question papers must strictly comply with the revised 2024 Outcome-Based Education (OBE) rubrics with explicit Course Outcome (CO) tags for every question.'
  },
  {
    id: 102,
    title: 'NAAC Peer Team Visit: Course File & Attendance Register Audit',
    semester: 'All Semesters',
    department: 'Internal Quality Assurance Cell (IQAC)',
    audience: 'teachers',
    date: 'Sep 30, 2026',
    time: '11:00 AM',
    tag: 'Administrative',
    priority: 'important',
    readBy: [],
    message: 'Mandatory verification of teacher course files, continuous evaluation registers, and student mentorship logs will take place on Monday, Oct 06 at the IQAC Boardroom.',
    author: 'IQAC Director',
    attachment: 'CourseFile_Checklist_2026.pdf',
    details: 'Please ensure that lecture delivery percentages, assignment question copies, sample answer sheets (top, average, weak), and remedial action records are signed and indexed.'
  },
  {
    id: 103,
    title: 'Semester 6 End-Term Practical Invigilation & Examiner Duty Roster',
    semester: 'Semester 6',
    department: 'Department of IT',
    audience: 'teachers',
    date: 'Sep 27, 2026',
    time: '02:30 PM',
    tag: 'Lab Notice',
    priority: 'important',
    readBy: [],
    message: 'The finalized duty roster pairing internal faculty with appointed university external examiners for Capstone Project and Java Lab vivas has been published.',
    author: 'Head of Department (IT)',
    attachment: 'Faculty_Invigilation_Roster_Sem6.pdf',
    details: 'Faculty assigned to morning sessions must report to the Central Examination Control Room at 08:30 AM for briefing and confidential marks entry portal access.'
  },
  {
    id: 104,
    title: 'Faculty Research Grant & Conference Sponsorship Applications Open',
    semester: 'All Semesters',
    department: 'Research & Development (R&D) Cell',
    audience: 'teachers',
    date: 'Sep 24, 2026',
    time: '04:00 PM',
    tag: 'Academic',
    priority: 'normal',
    readBy: [],
    message: 'Applications are invited from full-time faculty for institutional seed grants (up to ₹2,50,000) and Scopus/Web of Science indexed conference registration fee reimbursements.',
    author: 'Dean (Research & Innovation)',
    attachment: 'SeedGrant_Proposal_Format.docx',
    details: 'Proposals must involve inter-disciplinary student participation and address one of the institutional focus areas: Cloud Architecture, AI in Healthcare, or Embedded IoT.'
  },
  {
    id: 105,
    title: 'Biometric Attendance Reconciliation & Leave Normalization for September',
    semester: 'All Semesters',
    department: 'Human Resources & Administration',
    audience: 'teachers',
    date: 'Sep 21, 2026',
    time: '09:15 AM',
    tag: 'Administrative',
    priority: 'normal',
    readBy: [],
    message: 'Faculty members are requested to review their monthly biometric punch logs and regularize pending On-Duty (OD) or Casual Leave applications on the ERP portal before Oct 05.',
    author: 'Registrar (Admin & HR)',
    attachment: 'Faculty_Leave_Norms.pdf',
    details: 'Unreconciled punch records after Oct 05 will be processed automatically per standard institutional leave regulations.'
  },

  // ==========================================
  // CAMPUS-WIDE ANNOUNCEMENTS (VISIBLE TO ALL)
  // ==========================================
  {
    id: 201,
    title: 'Central Library Digital Portal Access & Physical Book Returns',
    semester: 'All Semesters',
    department: 'Central Library',
    audience: 'all',
    date: 'Sep 20, 2026',
    time: '01:00 PM',
    tag: 'Library',
    priority: 'normal',
    readBy: [],
    message: 'Institutional subscriptions to IEEE Xplore, ACM Digital Library, and Springer Nature have been renewed for 2026–27. Physical books overdue by more than 14 days must be returned without fine by Oct 15.',
    author: 'Chief Librarian',
    attachment: 'Digital_Library_Access_Guide.pdf',
    details: 'Remote off-campus access is enabled via institutional LDAP credentials or EduTrack OpenAthens proxy. 24/7 digital repository access is available.'
  },
  {
    id: 202,
    title: 'Annual Inter-Collegiate Tech Symposium: Spark 2026',
    semester: 'All Semesters',
    department: 'Student Council & Faculty Board',
    audience: 'all',
    date: 'Sep 18, 2026',
    time: '03:45 PM',
    tag: 'Campus Event',
    priority: 'normal',
    readBy: [],
    message: 'Registrations are now open for the 24-hour Hackathon, RoboWars, Paper Presentations, and Code Debugging. Grand prize pool worth ₹2,50,000. Form teams of 2 to 4 members.',
    author: 'Convener, Tech Fest 2026',
    attachment: 'Spark2026_Rulebook.pdf',
    details: 'Faculty mentors can register as track chairs and jury members. Student participants must obtain an online event pass from the symposium registration desk.'
  },
  {
    id: 203,
    title: 'Campus Wi-Fi 6 Upgradation & Scheduled Core Network Maintenance',
    semester: 'All Semesters',
    department: 'IT Infrastructure & Network Operations',
    audience: 'all',
    date: 'Sep 15, 2026',
    time: '05:30 PM',
    tag: 'Administrative',
    priority: 'normal',
    readBy: [],
    message: 'Core network switch upgradation to Wi-Fi 6 will occur this Sunday, Oct 04, from 02:00 AM to 06:00 AM. Intranet and portal access will experience brief intermittent downtime.',
    author: 'Chief Technology Officer',
    attachment: 'Network_Maintenance_Advisory.pdf',
    details: 'After maintenance, high-speed 10Gbps campus fiber connectivity will be live across Academic Blocks, Hostels, and Research Labs.'
  }
];

export const SEMESTER_OPTIONS = [
  'All Semesters',
  'Semester 6',
  'Semester 5',
  'Semester 4',
  'Semester 3',
  'Semester 2',
  'Semester 1'
];
