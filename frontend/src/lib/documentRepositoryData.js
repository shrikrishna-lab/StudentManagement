/**
 * EduTrack Official Academic Document Repository Dataset
 * Authentic institutional records, curriculum syllabi, previous year exam papers (PYQs),
 * laboratory manuals, self-service student certificates, and academic regulations.
 */

export const REPOSITORY_CATEGORIES = {
  syllabus: {
    id: 'syllabus',
    title: 'Curriculum & Course Syllabus',
    shortTitle: 'Syllabus',
    subtitle: 'AICTE CBCS Scheme 2026',
    department: 'Autonomous Academic Council & Board of Studies',
    description: 'Official Credit-Based Choice System (CBCS) curriculum, semester-wise credit distribution, subject course outcomes (COs), program outcomes (POs), and recommended textbooks.',
    documents: [
      {
        id: 'syl-01',
        code: 'SYL-IT-SEM6',
        title: 'B.Tech Information Technology Semester 6 Detailed Syllabus & Scheme 2026',
        format: 'PDF',
        size: '2.4 MB',
        date: 'Oct 01, 2026',
        author: 'Board of Studies (Information Technology)',
        status: 'Active · Autonomous Scheme 2026',
        summary: 'Complete course scheme, weekly lecture hours, tutorial credits, and unit-wise syllabi for Core Java & OOP, DBMS, Distributed Systems, Computer Networks, and Capstone Project Phase 1.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
DEPARTMENT OF INFORMATION TECHNOLOGY
CURRICULUM SCHEME & DETAILED SYLLABUS · SEMESTER 6 (SCHEME 2026)
========================================================================

PROGRAM: BACHELOR OF TECHNOLOGY IN INFORMATION TECHNOLOGY
ACADEMIC YEAR: 2026–2027 · AICTE / UGC AUTONOMOUS FRAMEWORK

1. SEMESTER COURSE DISTRIBUTION MATRIX:
------------------------------------------------------------------------
Course Code | Course Title                              | L-T-P  | Credits
------------------------------------------------------------------------
IT-301      | Core Java & Object-Oriented Frameworks    | 3-0-2  | 4.0
IT-302      | Database Management Systems & Performance | 3-0-2  | 4.0
IT-303      | Distributed Systems & Cloud Computing     | 3-1-0  | 4.0
IT-304      | Computer Networks & Network Security      | 3-0-2  | 4.0
IT-301L     | Core Java Programming Laboratory Viva     | 0-0-2  | 1.0
IT-302L     | DBMS & SQL Query Optimization Lab Viva    | 0-0-2  | 1.0
IT-304L     | Computer Networks & Protocols Lab         | 0-0-2  | 1.0
IT-305      | Capstone Project Phase 1 Board Defense    | 0-0-4  | 3.0
TPO-301     | Placement Aptitude & Soft Skills Studio   | 1-0-2  | 2.0
------------------------------------------------------------------------
TOTAL SEMESTER CREDITS: 24.0 CREDITS (Theory: 16 | Labs & Project: 8)

2. IT-301: CORE JAVA & OOP FRAMEWORKS (UNIT BREAKDOWN):
- Unit 1: Advanced OOP Concepts, Encapsulation, Polymorphism, Abstract Classes, Interfaces, and Records.
- Unit 2: Java Collections Framework (List, Set, Map, ConcurrentHashMap, Streams API, Lambdas).
- Unit 3: Concurrency, Thread Lifecycle, Executors, Thread Pools, and Synchronized Locks.
- Unit 4: JDBC 4.0 Architecture, Connection Pooling (HikariCP), PreparedStatements, and Transaction Isolation.
- Unit 5: Java I/O, NIO.2 Channels, JSON Serialization (Jackson), and RESTful client integrations.

3. PRESCRIBED TEXTBOOKS & REFERENCES:
1. "Core Java Volume I & II", Cay S. Horstmann, 12th Edition, Prentice Hall.
2. "Database System Concepts", Silberschatz, Korth & Sudarshan, 7th Edition, McGraw-Hill.
3. "Distributed Systems: Principles and Paradigms", Andrew S. Tanenbaum & Maarten van Steen.

Approved by: Academic Council Chairman · Registrar Office Sign-off`
      },
      {
        id: 'syl-02',
        code: 'SYL-CS-SEM4',
        title: 'B.Tech Computer Science Semester 4 Core Curriculum & Prerequisite Map',
        format: 'PDF',
        size: '1.8 MB',
        date: 'Sep 25, 2026',
        author: 'Board of Studies (Computer Science)',
        status: 'Active · AICTE Standard',
        summary: 'Syllabus and evaluation scheme for Data Structures & Algorithms, Theory of Computation, Computer Organization & Architecture, and Discrete Mathematics.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY
DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
CURRICULUM SPECIFICATION: SEMESTER 4 (SCHEME 2026)
========================================================================

SEMESTER 4 SUBJECT ALLOCATIONS:
1. CS-201: Data Structures & Algorithms (4 Credits)
   - Stacks, Queues, Binary Search Trees, AVL Trees, Red-Black Trees, Heaps, B-Trees.
   - Graph Algorithms: BFS, DFS, Dijkstra, Kruskal, Prim, Floyd-Warshall.
   - Dynamic Programming, Greedy Methods, Divide & Conquer Complexity Analysis (Master Theorem).
2. CS-202: Theory of Computation & Automata (4 Credits)
   - DFA, NFA, Regular Expressions, Pumping Lemma for Regular Languages.
   - Context-Free Grammars, Pushdown Automata, Turing Machines, Halting Problem.
3. CS-203: Computer Architecture & Organization (3 Credits)
   - MIPS / RISC-V Pipeline Execution, Branch Prediction, Cache Memory Hierarchies.

Recommended Text:
- "Introduction to Algorithms (CLRS)", Cormen, Leiserson, Rivest, Stein, 4th Edition, MIT Press.`
      },
      {
        id: 'syl-03',
        code: 'SYL-AICTE-CR',
        title: 'AICTE Model Curriculum & CBCS Credit Allocation Guidelines',
        format: 'PDF',
        size: '1.2 MB',
        date: 'Sep 10, 2026',
        author: 'Dean of Academic Affairs',
        status: 'Statutory Guideline',
        summary: 'Institutional credit framework detailing basic sciences, professional core, open electives, mandatory non-credit courses, and industry internship requirements for graduation.',
        content: `EDUTRACK AUTONOMOUS ACADEMIC REGULATIONS
AICTE MODEL CURRICULUM CREDIT MATRIX (TOTAL: 160 CREDITS FOR B.TECH)
========================================================================

DEGREE REQUIREMENTS:
1. Basic Sciences (BSC): Physics, Chemistry, Calculus, Linear Algebra (24 Credits)
2. Engineering Sciences (ESC): Engineering Graphics, Basic Electrical, Workshop (20 Credits)
3. Humanities & Social Sciences (HSMC): Technical Communication, Ethics (12 Credits)
4. Professional Core Courses (PCC): Major discipline subjects & labs (56 Credits)
5. Professional Elective Courses (PEC): Advanced specializations (18 Credits)
6. Open Electives (OEC): Multidisciplinary subjects from other departments (12 Credits)
7. Project Work, Seminar & 6-Month Industrial Internship (PROJ): 18 Credits

Minimum CGPA required for degree conferral: 5.00 across 8 semesters.`
      }
    ]
  },

  pyqs: {
    id: 'pyqs',
    title: 'Previous Years\' Question Papers (PYQ)',
    shortTitle: 'PYQ Bank',
    subtitle: 'Solved Papers (2022–2025)',
    department: 'University Controller of Examinations',
    description: 'Authentic university end-semester question papers from past examination cycles with official model answer keys, Bloom\'s taxonomy tags, and step-by-step marking rubrics.',
    documents: [
      {
        id: 'pyq-01',
        code: 'PYQ-IT301-2025',
        title: 'IT-301 Core Java & OOP Frameworks End-Semester Exam Paper (Winter 2025 Solved)',
        format: 'PDF',
        size: '3.1 MB',
        date: 'Jan 15, 2026',
        author: 'Board of Examiners (IT)',
        status: 'Verified Solved Paper',
        summary: 'Full 100-mark theory paper with official answer keys covering inheritance hierarchy, Java Collections internals, HikariCP connection pooling, and multi-threaded race conditions.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
END-SEMESTER EXAMINATION · WINTER 2025
PAPER CODE: IT-301 · SUBJECT: CORE JAVA & OOP FRAMEWORKS
MAX MARKS: 100 · DURATION: 3 HOURS
========================================================================

[QUESTION PAPER & OFFICIAL MODEL SOLUTIONS]

Q1. (Compulsory - 20 Marks):
(a) Explain the memory layout of Java Virtual Machine (Heap, Metaspace, Stack Frames, PC Registers). [10 Marks]
    MODEL SOLUTION SUMMARY:
    - Heap: Shared runtime data area storing object instances and class metadata. Managed by Garbage Collectors (G1GC / ZGC).
    - Metaspace: Stores per-class definitions, method bytecodes, and constant pool; allocated in native memory outside JVM heap.
    - Stack: Thread-private execution frames containing local primitives, reference variables, and operand stacks.
(b) Differentiate between synchronized block and ReentrantLock with a code snippet. [10 Marks]

Q2. (20 Marks):
(a) Write a complete Java program using JDBC PreparedStatement and try-with-resources to execute parameterized SQL transactions with commit and rollback on error. [12 Marks]
(b) Explain HikariCP connection pool configurations (maximumPoolSize, idleTimeout, connectionTimeout). [8 Marks]

Q3. (20 Marks):
(a) Explain Java Streams API: intermediate operations (filter, map) vs terminal operations (collect, reduce). [10 Marks]
(b) Demonstrate solving the Producer-Consumer problem using BlockingQueue. [10 Marks]

Certified by: Chief Moderator & Controller of Examinations`
      },
      {
        id: 'pyq-02',
        code: 'PYQ-IT302-2025',
        title: 'IT-302 Database Management Systems Final Paper (Summer 2025 Solved)',
        format: 'PDF',
        size: '2.8 MB',
        date: 'Jun 20, 2025',
        author: 'Board of Examiners (DBMS)',
        status: 'Verified Solved Paper',
        summary: 'Official solved university exam paper covering BCNF normalization proofs, B+ tree index insertions, ACID transaction schedules, and two-phase locking (2PL) protocols.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
END-SEMESTER EXAMINATION · SUMMER 2025
PAPER CODE: IT-302 · SUBJECT: DATABASE MANAGEMENT SYSTEMS
MAX MARKS: 100 · DURATION: 3 HOURS
========================================================================

[SOLVED MODEL KEY HIGHLIGHTS]

Q1. NORMALIZATION PROOF (15 Marks):
Given Relation R(A, B, C, D, E) with Functional Dependencies:
F = { A -> BC, CD -> E, B -> D, E -> A }
- Candidate Keys: {A}, {B, C}, {C, D}, {E}
- Normal Form: R is in 3NF because all right-hand attributes belong to candidate keys (prime attributes), but NOT in BCNF because in B -> D, B is not a superkey.
- BCNF Decomposition: R1(B, D) and R2(A, B, C, E).

Q2. CONCURRENCY & RECOVERY (15 Marks):
Explain Strict Two-Phase Locking (Strict 2PL) and prove how it prevents cascading rollbacks in transaction management.

Q3. B+ TREE INDEXING (15 Marks):
Construct a B+ Tree of order 4 inserting keys: [12, 24, 36, 48, 60, 72, 84, 96]. Illustrate node splits and root promotions.`
      },
      {
        id: 'pyq-03',
        code: 'PYQ-IT303-2024',
        title: 'IT-303 Distributed Systems & Cloud End-Term Paper (Winter 2024 Solved)',
        format: 'PDF',
        size: '2.2 MB',
        date: 'Dec 22, 2024',
        author: 'Board of Examiners (Cloud & Systems)',
        status: 'Verified Solved Paper',
        summary: 'Questions and solutions on CAP Theorem trade-offs, Raft consensus leader election, Vector Clocks, Lamport timestamps, and Docker container networking.',
        content: `EDUTRACK CONTROLLER OF EXAMINATIONS
END-SEMESTER PAPER: IT-303 (WINTER 2024 SOLVED)
========================================================================
Key topics:
1. Lamport Timestamps vs Vector Clocks: Causality determination formulas.
2. Raft Consensus Algorithm: Randomized election timer preventing split-vote anomalies.
3. Two-Phase Commit (2PC) vs Saga Orchestration for Distributed Microservices.`
      }
    ]
  },

  'lab-manuals': {
    id: 'lab-manuals',
    title: 'Lab Manuals & Practical Journals',
    shortTitle: 'Lab Manuals',
    subtitle: 'Semester 6 Experiments & Code',
    department: 'Department of Information Technology & Engineering Labs',
    description: 'Verified laboratory experiment problem statements, hardware/software setup instructions, sample inputs/outputs, and clean working source code implementations.',
    documents: [
      {
        id: 'lab-01',
        code: 'LAB-IT301L',
        title: 'IT-301L Core Java Programming Lab Journal & Solutions Manual',
        format: 'DOCX',
        size: '3.6 MB',
        date: 'Oct 02, 2026',
        author: 'Prof. Krrish Sharma (Course In-Charge)',
        status: 'Official Lab Manual · 2026',
        summary: '12 graded programming experiments covering OOP design patterns, Multithreaded bank simulator, JDBC Student Management CRUD, and Java NIO chat server.',
        content: `DEPARTMENT OF INFORMATION TECHNOLOGY · EDUTRACK
LABORATORY EXPERIMENT MANUAL: IT-301L
CORE JAVA PROGRAMMING & OOP FRAMEWORKS
========================================================================

EXPERIMENT 1: OBJECT-ORIENTED HIERARCHY & POLYMORPHISM
- Objective: Implement an institutional Payroll Management System demonstrating Method Overriding, Abstract Classes, and Interface segregation.
- Sample Output: Calculates Gross & Net Pay with Tax slabs for Faculty, Staff, and Visiting Lecturers.

EXPERIMENT 5: MULTITHREADED ATM CONCURRENCY SIMULATOR
- Objective: Prevent race conditions across simultaneous debit/credit requests using ReentrantLock and Condition variables.
- Verification: 10 concurrent threads access Account balance ₹50,000 without balance corruption.

EXPERIMENT 8: JDBC 4.0 MYSQL INTEGRATION WITH CONNECTION POOLING
- Objective: Build a complete Student CRUD system connecting to MySQL on localhost:3306 with HikariCP.
- Code snippets and schema creation DDL included.`
      },
      {
        id: 'lab-02',
        code: 'LAB-IT302L',
        title: 'IT-302L Database & MySQL Practical Experiment Journal',
        format: 'DOCX',
        size: '2.9 MB',
        date: 'Sep 28, 2026',
        author: 'Prof. Anjali Mehta (DBMS In-Charge)',
        status: 'Official Lab Manual · 2026',
        summary: '10 practical assignments including ER modeling in MySQL Workbench, complex SQL multi-table joins, Stored Procedures, Triggers, and EXPLAIN query plan optimization.',
        content: `DEPARTMENT OF INFORMATION TECHNOLOGY · EDUTRACK
LABORATORY MANUAL: IT-302L · DATABASE SYSTEMS & SQL
========================================================================

EXPERIMENT 3: ADVANCED DML, AGGREGATE FUNCTIONS & CORRELATED SUBQUERIES
- Tasks:
  1. Find department names where average student percentage exceeds 85%.
  2. Rank students division-wise using DENSE_RANK() OVER (PARTITION BY division ORDER BY percentage DESC).

EXPERIMENT 7: STORED PROCEDURES & PL/SQL CURSORS
- Task: Write a Stored Procedure 'CalculateAttendanceClearance' that marks students as 'Eligible' or 'Withheld' based on the 75% attendance threshold.

EXPERIMENT 9: TRIGGER IMPLEMENTATION FOR AUDIT TRAIL
- Task: Create an AFTER UPDATE trigger on 'student_records' table that logs old vs new values to an 'audit_log' table with timestamp and active MySQL user.`
      },
      {
        id: 'lab-03',
        code: 'LAB-IT304L',
        title: 'IT-304L Computer Networks Packet Analysis & Socket Lab Guide',
        format: 'PDF',
        size: '2.1 MB',
        date: 'Sep 15, 2026',
        author: 'Prof. Neha Gupta (Networks Lead)',
        status: 'Official Lab Manual · 2026',
        summary: 'Hands-on Wireshark packet capture analysis (TCP 3-way handshake, DNS queries, TLS 1.3 handshake) and client-server socket programming in C/Java.',
        content: `DEPARTMENT OF INFORMATION TECHNOLOGY · EDUTRACK
LAB MANUAL: IT-304L · COMPUTER NETWORKS & PROTOCOLS
========================================================================
- Experiment 2: Wireshark Packet Dissection: Analyzing TCP SYN, SYN-ACK, ACK handshake and sliding window flow control.
- Experiment 5: Subnetting & Cisco Packet Tracer VLAN configuration across multi-switch topologies.
- Experiment 8: Multi-threaded Chat Server implementation using Java ServerSocket.`
      }
    ]
  },

  certificates: {
    id: 'certificates',
    title: 'Bonafide & Student Certificate Services',
    shortTitle: 'Certificates',
    subtitle: 'Instant Self-Service Issuance',
    department: 'Office of the Registrar & Student Welfare',
    description: 'Instant self-service generation and download of official university certificates including Bonafide Certificate, Railway/Bus Travel Concession, Internship NOC, and Fee Estimate Certificate.',
    documents: [
      {
        id: 'cert-01',
        code: 'CERT-BONAFIDE',
        title: 'Official Bonafide Student Certificate (Instant Verifiable)',
        format: 'PDF',
        size: '520 KB',
        date: 'Oct 03, 2026',
        author: 'Office of the Registrar',
        status: 'Instant Generator Available',
        summary: 'Official institute letterhead certificate verifying student enrollment, roll number, academic year, and good conduct for Passport, Visa, Bank Account, and Education Loan applications.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
CAMPUS ADMINISTRATION · OFFICE OF THE REGISTRAR
REF NO: EDUTRACK/ACAD/BONAFIDE/2026/0891 · DATE: OCTOBER 03, 2026
========================================================================

TO WHOMSOEVER IT MAY CONCERN

This is to officially certify that:
Candidate Name:   KRRISH SHARMA
Roll Number:      101 (Seat No: 2024-IT-001)
PRN / Enrolment:  PRN-2024098101
Degree / Program: Bachelor of Technology (B.Tech)
Department:       Information Technology
Current Status:   Enrolled in Year 3 (Semester 6), Division A

is a bonafide student of this Institute for the Academic Session 2026–2027.

To the best of our institutional records and faculty evaluation, he/she bears good moral character, academic discipline, and exemplary campus conduct.

This certificate is issued upon the candidate's request for official submission towards PASSPORT / VISA / BANKING / SCHOLARSHIP DOCUMENTATION.

Issued under Institutional Seal:
Dean of Academic Affairs · Registrar Office
EduTrack Institute of Technology (Autonomous)`
      },
      {
        id: 'cert-02',
        code: 'CERT-RAILWAY',
        title: 'Student Railway & State Transport Concession Pass Application Form',
        format: 'PDF',
        size: '480 KB',
        date: 'Sep 20, 2026',
        author: 'Student Welfare & Concession Desk',
        status: 'Official Form',
        summary: 'Subsidized student railway pass application for Indian Railways local suburban trains and State Transport bus transit between home residence and campus.',
        content: `EDUTRACK STUDENT WELFARE CELL
INDIAN RAILWAYS / STATE TRANSPORT PASS APPLICATION
========================================================================
- Student Roll Number: 101
- Journey From: Dombivli / Thane Suburban Station
- Journey To: Campus Station (Station Code: EDU-04)
- Class of Travel: Season Ticket (Monthly / Quarterly) - 2nd Class Subsidized
- Validity: Current Academic Term (Autumn/Winter 2026)`
      },
      {
        id: 'cert-03',
        code: 'CERT-NOC-INTERN',
        title: 'No-Objection Certificate (NOC) for Summer/Winter Industrial Internship',
        format: 'PDF',
        size: '510 KB',
        date: 'Sep 12, 2026',
        author: 'Training & Placement Officer (TPO)',
        status: 'Official NOC',
        summary: 'Official college authorization allowing undergraduate students to pursue accredited software engineering or research internships during semester breaks.',
        content: `EDUTRACK TRAINING & PLACEMENT CELL
NO-OBJECTION CERTIFICATE (NOC): TPO/2026/NOC-412
========================================================================
The Institute has No Objection to student KRRISH SHARMA (Roll #101) pursuing an industrial internship from Nov 25, 2026 to Jan 05, 2027.
The internship credits will be evaluated under Capstone Phase 1 criteria.`
      }
    ]
  },

  regulations: {
    id: 'regulations',
    title: 'Academic Regulations & Grading Rules',
    shortTitle: 'Regulations',
    subtitle: '75% Attendance & Grading Bylaws',
    department: 'Autonomous Academic Council',
    description: 'Statutory institutional rules governing mandatory 75% attendance threshold, medical condonation bylaws, relative 10-point SGPA/CGPA grading, ATKT norms, and exam malpractice ordinances.',
    documents: [
      {
        id: 'reg-01',
        code: 'REG-ATTEND-75',
        title: '75% Mandatory Attendance Bylaw & Medical Condonation Ordinance',
        format: 'PDF',
        size: '1.4 MB',
        date: 'Aug 15, 2026',
        author: 'Academic Council Standing Committee',
        status: 'Statutory Ordinance',
        summary: 'Comprehensive regulations establishing 75% minimum physical classroom & laboratory attendance requirement for exam hall ticket clearance, and medical waiver conditions.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
ACADEMIC ORDINANCE NO. 08: ATTENDANCE & EXAMINATION ELIGIBILITY
========================================================================

1. MINIMUM ATTENDANCE THRESHOLD:
- Every candidate must register at least 75% aggregate physical attendance across all enrolled theory courses and laboratory sessions in the current semester.
- Candidates with attendance between 65.0% and 74.9% may petition the Academic Council for Medical Condonation on producing verified hospital/medical certificates.
- Candidates with attendance below 65.0% are strictly debarred from end-semester examinations and are deemed Defaulters under Ordinance 08-C.

2. EXAMINATION HALL TICKET WITHHOLDING:
- Hall Tickets are automatically withheld by the ERP gatekeeper for any candidate failing the 75% threshold without an authorized Dean waiver.

3. REMEDIAL PROVISIONS:
- Debarred students must re-attend remedial summer terms to recoup lost course attendance.`
      },
      {
        id: 'reg-02',
        code: 'REG-GRADING-10',
        title: '10-Point Relative Grading System & SGPA/CGPA Calculation Rules',
        format: 'PDF',
        size: '980 KB',
        date: 'Jul 28, 2026',
        author: 'Controller of Examinations',
        status: 'Grading Statute',
        summary: 'Official formula for Semester Grade Point Average (SGPA), Cumulative Grade Point Average (CGPA), letter grade boundaries (O, A+, A, B+, B, C, P, F), and credit multipliers.',
        content: `EDUTRACK CONTROLLER OF EXAMINATIONS
STATUTE 12: 10-POINT LETTER GRADING SCALE
========================================================================
Marks Range (%) | Letter Grade | Grade Points | Qualitative Assessment
------------------------------------------------------------------------
90.00 – 100.00  | O            | 10.0         | Outstanding
80.00 – 89.99   | A+           | 9.0          | Excellent
70.00 – 79.99   | A            | 8.0          | Very Good
60.00 – 69.99   | B+           | 7.0          | Good
50.00 – 59.99   | B            | 6.0          | Above Average
45.00 – 49.99   | C            | 5.0          | Average
40.00 – 44.99   | P            | 4.0          | Pass
Below 40.00     | F            | 0.0          | Fail / Re-appear

SGPA Calculation Formula:
SGPA = SUM(Course Credits * Grade Points Earned) / SUM(Total Course Credits)`
      },
      {
        id: 'reg-03',
        code: 'REG-MALPRACTICE',
        title: 'Examination Conduct & Anti-Malpractice Disciplinary Ordinance 14-B',
        format: 'PDF',
        size: '890 KB',
        date: 'Jun 10, 2026',
        author: 'Disciplinary Action Committee',
        status: 'Binding Statute',
        summary: 'Specific penalties for unauthorized notes, smartwatches, digital devices, and impersonation during examinations.',
        content: `EDUTRACK DISCIPLINARY CODE: ORDINANCE 14-B
========================================================================
- Possession of unauthorized written materials: Immediate cancellation of performance in that subject.
- Possession of smartwatches or mobile communication devices: Cancellation of entire semester performance and debarment for one subsequent cycle.
- Impersonation: Permanent expulsion and registration of law enforcement FIR.`
      }
    ]
  },

  'fees-scholarships': {
    id: 'fees-scholarships',
    title: 'Fee Receipts & Scholarship Circulars',
    shortTitle: 'Fees & Aid',
    subtitle: 'Tuition Ledger & State Schemes',
    department: 'Finance & Accounts Department / National Scholarship Cell',
    description: 'Official semester tuition fee structure breakdown, installment payment schedules, government post-matric scholarship notices, and institutional merit concession guidelines.',
    documents: [
      {
        id: 'fee-01',
        code: 'FEE-STR-2026',
        title: 'B.Tech Academic Year 2026–27 Fee Structure & Tuition Component Breakdown',
        format: 'PDF',
        size: '1.1 MB',
        date: 'Aug 01, 2026',
        author: 'Finance & Accounts Officer',
        status: 'Official Fee Schedule',
        summary: 'Approved tuition, development fee, laboratory consumable charges, examination cell fees, and library insurance deposits for undergraduate degree programs.',
        content: `EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
ACADEMIC YEAR 2026–2027 · ANNUAL FEE STRUCTURE
PROGRAM: B.TECH (INFORMATION TECHNOLOGY / COMPUTER SCIENCE)
========================================================================
Tuition Fee Component:                ₹ 1,12,000.00
Development Fund:                     ₹   18,500.00
Advanced Computing & Lab Consumables: ₹   14,000.00
University Examination & Marksheet:   ₹    4,500.00
Library Digital Access & Insurance:   ₹    2,500.00
Gymkhana & Campus Amenities:          ₹    3,500.00
------------------------------------------------------------------------
TOTAL ANNUAL FEES:                    ₹ 1,55,000.00 (Split into 2 Semesters)`
      },
      {
        id: 'fee-02',
        code: 'SCH-MAHA-DBT',
        title: 'State & National Post-Matric Scholarship Scheme (DBT Portal Guidelines)',
        format: 'PDF',
        size: '1.6 MB',
        date: 'Jul 15, 2026',
        author: 'Institutional Scholarship Welfare Cell',
        status: 'Active Circular',
        summary: 'Direct Benefit Transfer (DBT) application procedures for government merit, reserved category, EWS, and Rajarshi Shahu Maharaj fee reimbursement schemes.',
        content: `EDUTRACK SCHOLARSHIP NOTIFICATION · ACADEMIC YEAR 2026–27
GOVERNMENT POST-MATRIC DIRECT BENEFIT TRANSFER (DBT)
========================================================================
Eligible students may claim up to 100% tuition concession.
Required documents: Income Certificate (< ₹8 Lakhs), Domicile, Caste Validity, and Aadhaar-seeded Bank Account.`
      }
    ]
  }
};

export const PRIMARY_CATEGORY_KEYS = [
  'syllabus',
  'pyqs',
  'lab-manuals',
  'certificates',
  'regulations',
  'fees-scholarships'
];

const STORAGE_KEY_REPOSITORY = 'edutrack_custom_repository_docs_v2';

export function loadAllRepositoryCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPOSITORY);
    if (raw) {
      const customDocs = JSON.parse(raw);
      // Merge custom documents into base categories
      const merged = { ...REPOSITORY_CATEGORIES };
      Object.keys(customDocs).forEach((catId) => {
        if (merged[catId]) {
          merged[catId] = {
            ...merged[catId],
            documents: customDocs[catId]
          };
        }
      });
      return merged;
    }
  } catch (e) {
    console.error('Failed to load custom repository documents:', e);
  }
  return REPOSITORY_CATEGORIES;
}

export function saveRepositoryDocument(categoryId, docData) {
  const currentCategories = loadAllRepositoryCategories();
  const cat = currentCategories[categoryId] || currentCategories.syllabus;
  const docs = [...(cat.documents || [])];

  const docId = docData.id || `doc-${Date.now()}`;
  const newDoc = {
    id: docId,
    code: (docData.code || `DOC-${categoryId.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`).trim(),
    title: (docData.title || 'Official Institutional Document').trim(),
    format: docData.format || 'PDF',
    size: docData.size || '1.8 MB',
    date: docData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    author: (docData.author || 'Academic Board').trim(),
    status: docData.status || 'Active Official Record',
    summary: (docData.summary || 'Official academic repository record verified for institutional reference.').trim(),
    content: docData.content || `EDUTRACK OFFICIAL ACADEMIC DOCUMENT\nCODE: ${docData.code}\nTITLE: ${docData.title}\n============================================================\nDocument contents authenticated and approved by the academic governing body.`
  };

  const existingIdx = docs.findIndex((d) => String(d.id) === String(docId));
  if (existingIdx >= 0) {
    docs[existingIdx] = newDoc;
  } else {
    docs.unshift(newDoc);
  }

  // Save to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPOSITORY);
    const customDocs = raw ? JSON.parse(raw) : {};
    customDocs[categoryId] = docs;
    localStorage.setItem(STORAGE_KEY_REPOSITORY, JSON.stringify(customDocs));
    window.dispatchEvent(new CustomEvent('edutrack_repository_updated', { detail: { categoryId, doc: newDoc } }));
  } catch (e) {
    console.error(e);
  }

  return newDoc;
}

export function deleteRepositoryDocument(categoryId, docId) {
  const currentCategories = loadAllRepositoryCategories();
  const cat = currentCategories[categoryId] || currentCategories.syllabus;
  const filtered = (cat.documents || []).filter((d) => String(d.id) !== String(docId));

  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPOSITORY);
    const customDocs = raw ? JSON.parse(raw) : {};
    customDocs[categoryId] = filtered;
    localStorage.setItem(STORAGE_KEY_REPOSITORY, JSON.stringify(customDocs));
    window.dispatchEvent(new CustomEvent('edutrack_repository_updated', { detail: { categoryId, docId } }));
  } catch (e) {
    console.error(e);
  }

  return filtered;
}

export function loadAllRepositoryCategoryList() {
  const catObj = loadAllRepositoryCategories();
  if (Array.isArray(catObj)) return catObj;
  return PRIMARY_CATEGORY_KEYS.map((key) => catObj[key]).filter(Boolean);
}

export const CATEGORY_LIST = PRIMARY_CATEGORY_KEYS.map((key) => REPOSITORY_CATEGORIES[key]);

export const getCategoryById = (id) => {
  const legacyMap = {
    sops: 'syllabus',
    contracts: 'regulations',
    templates: 'certificates',
    policies: 'regulations',
    knowledge: 'pyqs',
    archive: 'fees-scholarships'
  };
  const targetId = legacyMap[id] || id;
  const categories = loadAllRepositoryCategories();
  return categories[targetId] || categories.syllabus;
};

