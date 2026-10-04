-- ==============================================================================
-- EduTrack Database Schema & Seed Data
-- ==============================================================================

-- 1. Create and Select Database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Disable foreign key checks temporarily for clean initialization
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS view_examination_clearance_roster;
DROP VIEW IF EXISTS view_combined_exam_schedule;
DROP TABLE IF EXISTS password_change_requests;
DROP TABLE IF EXISTS faculty_allocations;
DROP TABLE IF EXISTS study_materials;
DROP TABLE IF EXISTS certificate_requests;
DROP TABLE IF EXISTS semester_transcripts;
DROP TABLE IF EXISTS student_clearance;
DROP TABLE IF EXISTS exam_schedules;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS assignment_submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS students;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 1. STUDENTS TABLE
-- ==============================================================================
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number INT NOT NULL UNIQUE,
    prn VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    division VARCHAR(5) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. TEACHERS TABLE (Faculty Roster)
-- ==============================================================================
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    assigned_subject VARCHAR(100) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. DEPARTMENTS TABLE
-- ==============================================================================
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    hod VARCHAR(100) NOT NULL,
    intake_limit INT NOT NULL DEFAULT 60
);

-- ==============================================================================
-- 4. SUBJECTS TABLE (Academic Courses Catalog)
-- ==============================================================================
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    credits INT NOT NULL DEFAULT 4,
    staff_id VARCHAR(20),
    FOREIGN KEY (department_code) REFERENCES departments(code) ON UPDATE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES teachers(staff_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==============================================================================
-- 5. ATTENDANCE TABLE (Daily & Subject-Wise Roll Call)
-- ==============================================================================
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number INT NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
    recorded_by VARCHAR(20),
    FOREIGN KEY (roll_number) REFERENCES students(roll_number) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON UPDATE CASCADE,
    UNIQUE KEY unique_daily_attendance (roll_number, subject_code, date)
);

-- ==============================================================================
-- 6. MARKS TABLE (Examination & Gradebook Records)
-- ==============================================================================
CREATE TABLE marks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number INT NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    internal_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- Max: 25
    midterm_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00,  -- Max: 50
    practical_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00,-- Max: 25
    total_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (internal_marks + midterm_marks + practical_marks) STORED,
    grade VARCHAR(5) DEFAULT 'A',
    FOREIGN KEY (roll_number) REFERENCES students(roll_number) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON UPDATE CASCADE,
    UNIQUE KEY unique_student_subject_marks (roll_number, subject_code)
);

-- ==============================================================================
-- 7. ASSIGNMENTS TABLE
-- ==============================================================================
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    deadline DATE NOT NULL,
    total_marks INT NOT NULL DEFAULT 20,
    created_by VARCHAR(20),
    status ENUM('Active', 'Closed') DEFAULT 'Active',
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES teachers(staff_id) ON DELETE SET NULL
);

-- ==============================================================================
-- 8. ASSIGNMENT SUBMISSIONS TABLE
-- ==============================================================================
CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    roll_number INT NOT NULL,
    file_name VARCHAR(150),
    notes TEXT,
    score INT DEFAULT NULL,
    status ENUM('Pending', 'Submitted', 'Graded') DEFAULT 'Submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (roll_number) REFERENCES students(roll_number) ON DELETE CASCADE,
    UNIQUE KEY unique_student_assignment (assignment_id, roll_number)
);

-- ==============================================================================
-- 9. ANNOUNCEMENTS TABLE (Campus & Class Circulars)
-- ==============================================================================
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    department VARCHAR(50) NOT NULL,
    tag ENUM('Important', 'Event', 'Academic', 'General') DEFAULT 'General',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 10. USERS TABLE (Authentication & Role Credentials)
-- ==============================================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Teacher', 'Student') NOT NULL,
    status ENUM('Active', 'Suspended') DEFAULT 'Active',
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 10B. PASSWORD CHANGE REQUESTS TABLE (Two-Tier Admin Approval Workflow)
-- ==============================================================================
CREATE TABLE password_change_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    login_id VARCHAR(50) NOT NULL,
    role ENUM('Admin', 'Teacher', 'Student') NOT NULL,
    new_password_hash VARCHAR(255) NOT NULL,
    reason VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    admin_notes VARCHAR(255),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(100) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================================
-- 10C. FACULTY ALLOCATIONS TABLE (Class Teacher, GFM & Lab Roles)
-- ==============================================================================
CREATE TABLE faculty_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(100) DEFAULT 'Assistant Professor',
    class_teacher_division VARCHAR(10) DEFAULT 'None',
    gfm_cohort VARCHAR(100) DEFAULT 'None',
    theory_subjects TEXT,
    practical_labs TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES teachers(staff_id) ON DELETE CASCADE
);

-- ==============================================================================
-- 11. AUDIT LOGS TABLE (Institutional Security Audit Trail)
-- ==============================================================================
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_module VARCHAR(50) NOT NULL,
    host_ip VARCHAR(45) DEFAULT '127.0.0.1',
    status VARCHAR(20) DEFAULT 'Success'
);

-- ==============================================================================
-- 12. EXAM SCHEDULES TABLE (Combined Theory & Practical Schedules)
-- ==============================================================================
CREATE TABLE exam_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paper_code VARCHAR(20) NOT NULL UNIQUE,
    subject_name VARCHAR(150) NOT NULL,
    semester VARCHAR(20) NOT NULL DEFAULT 'Semester 6',
    date VARCHAR(30) NOT NULL,
    day VARCHAR(20) NOT NULL,
    time VARCHAR(30) NOT NULL,
    shift VARCHAR(30) NOT NULL DEFAULT 'Morning Shift',
    duration VARCHAR(20) NOT NULL DEFAULT '3 Hours',
    marks INT NOT NULL DEFAULT 100,
    credits DECIMAL(3, 1) NOT NULL DEFAULT 4.0,
    exam_type ENUM('Theory Written', 'Practical Lab & Viva', 'Project Defense') NOT NULL DEFAULT 'Theory Written',
    room VARCHAR(50) NOT NULL,
    seating_block VARCHAR(50) NOT NULL,
    invigilator VARCHAR(100) NOT NULL,
    co_invigilator VARCHAR(100) DEFAULT 'Department Proctor',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 13. STUDENT CLEARANCE TABLE (Hall Ticket & Marksheet Gatekeeper)
-- ==============================================================================
CREATE TABLE student_clearance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number INT NOT NULL UNIQUE,
    fee_status ENUM('paid', 'pending') NOT NULL DEFAULT 'paid',
    fee_due_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    attendance_percentage DECIMAL(5, 2) NOT NULL DEFAULT 85.00,
    theory_attendance DECIMAL(5, 2) NOT NULL DEFAULT 86.00,
    lab_attendance DECIMAL(5, 2) NOT NULL DEFAULT 84.00,
    condonation_waiver BOOLEAN NOT NULL DEFAULT FALSE,
    condonation_reason VARCHAR(255) DEFAULT NULL,
    hall_ticket_status ENUM('issued', 'withheld') NOT NULL DEFAULT 'issued',
    marksheet_status ENUM('released', 'withheld') NOT NULL DEFAULT 'released',
    hall_ticket_issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marksheet_released_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roll_number) REFERENCES students(roll_number) ON DELETE CASCADE
);

-- ==============================================================================
-- 14. STUDY MATERIALS TABLE (Lecture Notes, Question Banks & Lab Manuals)
-- ==============================================================================
CREATE TABLE study_materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    category ENUM('Lecture Notes', 'Lab Manual', 'Question Bank', 'Reference Book', 'Syllabus') NOT NULL DEFAULT 'Lecture Notes',
    file_type VARCHAR(20) NOT NULL DEFAULT 'PDF',
    file_size VARCHAR(20) NOT NULL DEFAULT '2.4 MB',
    file_url VARCHAR(255) DEFAULT '#',
    uploaded_by VARCHAR(100) NOT NULL DEFAULT 'Prof. Krrish Sharma',
    downloads INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON UPDATE CASCADE
);

-- ==============================================================================
-- 14. SEMESTER TRANSCRIPTS TABLE (Official Marksheets & Grade Ledger)
-- ==============================================================================
CREATE TABLE semester_transcripts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number INT NOT NULL,
    semester VARCHAR(20) NOT NULL DEFAULT 'Semester 6',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026–2027',
    sgpa DECIMAL(4, 2) NOT NULL DEFAULT 8.95,
    cgpa DECIMAL(4, 2) NOT NULL DEFAULT 8.82,
    earned_credits DECIMAL(4, 1) NOT NULL DEFAULT 24.0,
    total_credits DECIMAL(4, 1) NOT NULL DEFAULT 24.0,
    result_status VARCHAR(50) NOT NULL DEFAULT 'First Class with Distinction',
    verified_qr_hash VARCHAR(100) NOT NULL,
    issued_date DATE NOT NULL,
    FOREIGN KEY (roll_number) REFERENCES students(roll_number) ON DELETE CASCADE,
    UNIQUE KEY unique_student_semester_transcript (roll_number, semester)
);

-- ==============================================================================
-- 15. CERTIFICATE REQUESTS TABLE (Student Bonafide & Services)
-- ==============================================================================
CREATE TABLE certificate_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(50) NOT NULL UNIQUE,
    roll_number INT NOT NULL,
    certificate_type ENUM('Bonafide', 'Railway Concession', 'Internship NOC', 'Fee Estimate') NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status ENUM('Approved', 'Pending', 'Rejected') NOT NULL DEFAULT 'Approved',
    reference_no VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roll_number) REFERENCES students(roll_number) ON DELETE CASCADE
);

-- ==============================================================================
-- SEED DATA: Realistic Academic & Examination Records
-- ==============================================================================

-- 1. Seed Departments
INSERT INTO departments (code, name, hod, intake_limit) VALUES
('IT', 'Information Technology', 'Prof. Krrish Sharma', 120),
('CS', 'Computer Science', 'Dr. Vivek Joshi', 120),
('EXTC', 'Electronics & Telecommunications', 'Dr. Sanjay Verma', 90),
('MECH', 'Mechanical Engineering', 'Prof. Rajesh Nair', 60);

-- 2. Seed Teachers
INSERT INTO teachers (staff_id, name, email, department, assigned_subject, status) VALUES
('FAC-IT-101', 'Prof. Krrish Sharma', 'krrish.faculty@edutrack.edu', 'Information Technology', 'Core Java & OOP', 'Active'),
('FAC-CS-102', 'Dr. Vivek Joshi', 'v.joshi@edutrack.edu', 'Computer Science', 'Data Structures & Algorithms', 'Active'),
('FAC-IT-103', 'Prof. Neha Mehta', 'n.mehta@edutrack.edu', 'Information Technology', 'Database Systems (MySQL)', 'Active'),
('FAC-EXTC-104', 'Dr. Sanjay Verma', 's.verma@edutrack.edu', 'Electronics & Telecom', 'Digital Electronics', 'Active');

-- 3. Seed Subjects
INSERT INTO subjects (code, name, department_code, semester, credits, staff_id) VALUES
('IT-301', 'Core Java & OOP Frameworks', 'IT', 'Sem 6', 4, 'FAC-IT-101'),
('IT-302', 'Database Systems (MySQL)', 'IT', 'Sem 6', 4, 'FAC-IT-103'),
('IT-303', 'Distributed Systems & Cloud', 'IT', 'Sem 6', 4, 'FAC-CS-102'),
('IT-304', 'Computer Networks & Security', 'IT', 'Sem 6', 4, 'FAC-EXTC-104'),
('CS-201', 'Data Structures & Algorithms', 'CS', 'Sem 4', 4, 'FAC-CS-102'),
('EXTC-101', 'Digital Electronics', 'EXTC', 'Sem 2', 3, 'FAC-EXTC-104');

-- 4. Seed Students (Ordered & Sequentially Incrementing Department & Division Wise)
INSERT INTO students (roll_number, prn, name, email, phone, course, year, division, percentage) VALUES
(101, 'RBT24IT001', 'Krrish Sharma', 'krrish.sharma@edutrack.edu', '+91 98765 43210', 'IT', 3, 'A', 94.20),
(102, 'RBT24IT002', 'Rohan Patel', 'rohan.patel@edutrack.edu', '+91 98223 34455', 'IT', 3, 'A', 71.40),
(103, 'RBT24IT003', 'Pooja Nair', 'pooja.nair@edutrack.edu', '+91 98556 67788', 'IT', 3, 'A', 95.80),
(104, 'RBT24IT004', 'Meera Iyer', 'meera.iyer@edutrack.edu', '+91 98778 89900', 'IT', 3, 'A', 89.10),
(105, 'RBT24IT005', 'Tanmay Deshmukh', 'tanmay.d@edutrack.edu', '+91 98889 90011', 'IT', 3, 'B', 64.00),
(106, 'RBT24CS001', 'Aditya Joshi', 'aditya.joshi@edutrack.edu', '+91 98445 56677', 'CS', 4, 'A', 68.20),
(107, 'RBT24CS002', 'Riya Sen', 'riya.sen@edutrack.edu', '+91 98990 01122', 'CS', 3, 'A', 86.40),
(108, 'RBT24CS003', 'Ananya Verma', 'ananya.verma@edutrack.edu', '+91 98112 23344', 'CS', 3, 'B', 92.50),
(109, 'RBT24EXTC001', 'Sneha Kulkarni', 'sneha.k@edutrack.edu', '+91 98334 45566', 'EXTC', 2, 'A', 88.00),
(110, 'RBT24MECH001', 'Vikram Singh', 'vikram.singh@edutrack.edu', '+91 98667 78899', 'MECH', 2, 'A', 56.50);

-- 5. Seed Attendance (Roll Call Matrix)
INSERT INTO attendance (roll_number, subject_code, date, status, recorded_by) VALUES
(101, 'IT-301', '2026-10-01', 'Present', 'FAC-IT-101'),
(101, 'IT-301', '2026-10-02', 'Present', 'FAC-IT-101'),
(101, 'IT-302', '2026-10-01', 'Present', 'FAC-IT-103'),
(102, 'IT-301', '2026-10-01', 'Absent', 'FAC-IT-101'),
(103, 'IT-301', '2026-10-01', 'Present', 'FAC-IT-101'),
(104, 'IT-301', '2026-10-01', 'Present', 'FAC-IT-101'),
(105, 'IT-301', '2026-10-01', 'Absent', 'FAC-IT-101'),
(106, 'CS-201', '2026-10-01', 'Absent', 'FAC-CS-102'),
(107, 'IT-301', '2026-10-01', 'Present', 'FAC-IT-101'),
(108, 'IT-301', '2026-10-01', 'Present', 'FAC-IT-101'),
(109, 'IT-301', '2026-10-01', 'Present', 'FAC-IT-101'),
(110, 'IT-301', '2026-10-01', 'Absent', 'FAC-IT-101');

-- 6. Seed Marks (Internal, Midterm, Practical Evaluation)
INSERT INTO marks (roll_number, subject_code, internal_marks, midterm_marks, practical_marks, grade) VALUES
(101, 'IT-301', 24.00, 48.00, 24.00, 'A+'),
(101, 'IT-302', 22.00, 44.00, 23.00, 'A'),
(102, 'IT-301', 16.00, 32.00, 18.00, 'B'),
(103, 'IT-301', 25.00, 49.00, 25.00, 'O'),
(104, 'IT-301', 22.00, 42.00, 22.00, 'A'),
(105, 'IT-301', 15.00, 31.00, 17.00, 'B'),
(106, 'CS-201', 14.00, 29.00, 16.00, 'C'),
(107, 'IT-301', 21.00, 41.00, 21.00, 'A'),
(108, 'IT-301', 23.00, 46.00, 23.50, 'A+'),
(109, 'IT-301', 22.00, 44.00, 22.00, 'A'),
(110, 'IT-301', 12.00, 26.00, 13.00, 'F');

-- 7. Seed Assignments
INSERT INTO assignments (id, title, subject_code, deadline, total_marks, created_by, status) VALUES
(1, 'JDBC Student Management Project', 'IT-301', '2026-10-08', 20, 'FAC-IT-101', 'Active'),
(2, 'Collections Framework & Generics Lab', 'IT-301', '2026-10-14', 25, 'FAC-IT-101', 'Active'),
(3, 'Normalization 3NF/BCNF Schema Design', 'IT-302', '2026-10-18', 25, 'FAC-IT-103', 'Active');

-- 7B. Seed Assignment Submissions & Teacher Marks Evaluation
INSERT INTO assignment_submissions (assignment_id, roll_number, file_name, score, status, notes) VALUES
(1, 101, 'JDBC_Student_System_v2.zip', 19, 'Graded', 'Excellent HikariCP pool and clean DAO pattern implementation.'),
(1, 102, 'Mini_Project_JDBC.zip', 14, 'Graded', 'Basic implementation; needs prepared statement parameter binding.'),
(1, 103, 'JDBC_Enterprise_App.zip', 20, 'Graded', 'Outstanding work with clean singleton pattern and JUnit tests.'),
(1, 104, 'Meera_JDBC_Project.zip', 18, 'Graded', 'Proper ER mapping and query optimization.'),
(1, 105, 'Tanmay_JDBC_Lab.zip', 15, 'Graded', 'Satisfactory; code formatting needs Oracle convention.'),
(1, 106, 'Java_JDBC_Solution.zip', 12, 'Graded', 'Submission delayed; missing transaction rollback handling.'),
(1, 107, 'Riya_JDBC_Module.zip', 17, 'Graded', 'Good database normalization and user session management.'),
(1, 108, 'JDBC_CRUD_Application.zip', 18, 'Graded', 'Good schema architecture and solid error handling.'),
(1, 109, 'StudentManagement_JDBC.zip', 17, 'Graded', 'Well tested with sample dataset and clear README.'),
(1, 110, NULL, NULL, 'Pending', 'Submission pending. Follow-up needed by Class Teacher.'),

(2, 101, 'Generics_Lab_Record.pdf', 24, 'Graded', 'Full marks in ConcurrentHashMap and custom comparator test.'),
(2, 102, 'Lab_Report_Collections.pdf', 16, 'Graded', 'Re-attempt lambda comparator questions in remedial session.'),
(2, 103, 'Pooja_Collections_Lab.pdf', 25, 'Graded', 'Flawless paper presentation and clean code snippets.'),
(2, 104, 'Collections_Generics_Report.pdf', 21, 'Graded', 'Good explanation of bounded type parameters.'),
(2, 105, 'Lab4_Collections_Tanmay.pdf', 16, 'Graded', 'Average; review collection sorting algorithms.'),
(2, 106, NULL, NULL, 'Pending', 'Pending student upload.'),
(2, 107, 'Riya_Lab4_Generics.pdf', 22, 'Graded', 'Clear logic and thorough edge cases covered.'),
(2, 108, 'Collections_Lab_Ananya.pdf', 23, 'Graded', 'Demonstrated deep understanding of iterator and iterable interfaces.'),
(2, 109, 'Generics_Assignment_Sneha.pdf', 22, 'Graded', 'Very neat documentation with output screenshots.'),
(2, 110, NULL, NULL, 'Pending', 'Needs revision in thread synchronization before submission.');

-- 8. Seed Announcements
INSERT INTO announcements (title, message, department, tag) VALUES
('Semester 6 Exam Schedule Released', 'Theory and laboratory timetable is published under Timetable.', 'Examination Cell', 'Important'),
('Institutional Marksheets Live on Portal', 'Eligible candidates may download verified semester grade sheets.', 'Controller of Examinations', 'Academic'),
('Spring Hackathon 2026 Registration Open', 'Form teams of 4 members for the upcoming 36-hr hackathon.', 'Information Technology', 'Event');

-- 9. Seed Users (PRN / Staff ID / Email Multi-Role Authentication)
INSERT INTO users (login_id, name, email, password, role, status, must_change_password) VALUES
('ADM-SYS-001', 'System Administrator', 'admin@edutrack.edu', 'admin', 'Admin', 'Active', FALSE),
('FAC-IT-101', 'Prof. Krrish Sharma', 'teacher@edutrack.edu', 'teacher', 'Teacher', 'Active', FALSE),
('FAC-CS-102', 'Dr. Vivek Joshi', 'v.joshi@edutrack.edu', 'teacher', 'Teacher', 'Active', FALSE),
('FAC-IT-103', 'Prof. Neha Mehta', 'n.mehta@edutrack.edu', 'teacher', 'Teacher', 'Active', FALSE),
('FAC-EXTC-104', 'Dr. Sanjay Verma', 's.verma@edutrack.edu', 'teacher', 'Teacher', 'Active', FALSE),
('RBT24IT001', 'Krrish Sharma', 'krrish.sharma@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24IT002', 'Rohan Patel', 'rohan.patel@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24IT003', 'Pooja Nair', 'pooja.nair@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24IT004', 'Meera Iyer', 'meera.iyer@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24IT005', 'Tanmay Deshmukh', 'tanmay.d@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24CS001', 'Aditya Joshi', 'aditya.joshi@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24CS002', 'Riya Sen', 'riya.sen@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24CS003', 'Ananya Verma', 'ananya.verma@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24EXTC001', 'Sneha Kulkarni', 'sneha.k@edutrack.edu', 'student', 'Student', 'Active', FALSE),
('RBT24MECH001', 'Vikram Singh', 'vikram.singh@edutrack.edu', 'student', 'Student', 'Active', FALSE);

-- 9B. Seed Password Change Requests (Two-Tier Admin Approval Queue)
INSERT INTO password_change_requests (request_code, user_id, login_id, role, new_password_hash, reason, status) VALUES
('REQ-SEC-2026-001', 8, 'RBT24IT002', 'Student', 'RohanSecure#2026', 'Temporary password expired; requesting permanent private credentials.', 'Pending'),
('REQ-SEC-2026-002', 3, 'FAC-CS-102', 'Teacher', 'Joshi@CSdept2026', 'Periodic departmental security rotation.', 'Approved');

-- 9C. Seed Faculty Allocations
INSERT INTO faculty_allocations (staff_id, name, department, designation, class_teacher_division, gfm_cohort, theory_subjects, practical_labs) VALUES
('FAC-IT-101', 'Prof. Krrish Sharma', 'Information Technology', 'Associate Professor & Class Teacher', 'Div A', 'Roll 101 - 120 (Div A)', 'IT-301 Core Java & OOP Frameworks, IT-303 Distributed Systems', 'IT-301L Advanced Java Lab'),
('FAC-CS-102', 'Dr. Vivek Joshi', 'Computer Science', 'Professor & HOD', 'Div B', 'Roll 201 - 220 (Div B)', 'IT-303 Distributed Systems & Cloud', 'CS-303L Cloud Systems Lab'),
('FAC-IT-103', 'Prof. Neha Mehta', 'Information Technology', 'Assistant Professor & GFM', 'Div A', 'Roll 121 - 140 (Div A)', 'IT-302 Database Management Systems', 'IT-302L DBMS & SQL Lab');

-- 10. Seed Combined Examination Schedule (ALL Subjects for Semester 6)
INSERT INTO exam_schedules (paper_code, subject_name, semester, date, day, time, shift, duration, marks, credits, exam_type, room, seating_block, invigilator, is_published) VALUES
('IT-301', 'Core Java & Object-Oriented Frameworks', 'Semester 6', 'Nov 10, 2026', 'Tuesday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall A-101', 'Desk #14 (Block A)', 'Prof. Krrish Sharma', TRUE),
('IT-302', 'Database Management Systems & Transactions', 'Semester 6', 'Nov 13, 2026', 'Friday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall A-102', 'Desk #14 (Block A)', 'Prof. Anjali Mehta', TRUE),
('IT-303', 'Distributed Systems & Cloud Computing', 'Semester 6', 'Nov 17, 2026', 'Tuesday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall B-201', 'Desk #14 (Block B)', 'Dr. Vivek Joshi', TRUE),
('IT-304', 'Computer Networks & Network Security', 'Semester 6', 'Nov 20, 2026', 'Friday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall B-202', 'Desk #14 (Block B)', 'Prof. Neha Gupta', TRUE),
('IT-301L', 'Core Java Programming Laboratory Viva', 'Semester 6', 'Nov 24, 2026', 'Tuesday', '09:00 AM - 01:00 PM', 'Practical Batch 1', '4 Hours', 50, 1.0, 'Practical Lab & Viva', 'Computing Lab A-1', 'Terminal #08 (Lab A-1)', 'Prof. Krrish Sharma & Ext. Board', TRUE),
('IT-302L', 'DBMS & SQL Performance Laboratory Viva', 'Semester 6', 'Nov 26, 2026', 'Thursday', '01:30 PM - 05:30 PM', 'Practical Batch 2', '4 Hours', 50, 1.0, 'Practical Lab & Viva', 'Computing Lab A-2', 'Terminal #08 (Lab A-2)', 'Prof. Anjali Mehta & Ext. Board', TRUE),
('IT-305', 'Capstone Project Phase 1 Board Defense', 'Semester 6', 'Dec 01, 2026', 'Tuesday', '09:30 AM - 04:30 PM', 'Board Review Session', 'Full Day', 100, 3.0, 'Project Defense', 'Seminar Hall 1', 'Project Board Panel 2', 'Department Examination Board', TRUE);

-- 11. Seed Student Clearance Records (Fee & Attendance Gatekeeper)
INSERT INTO student_clearance (roll_number, fee_status, fee_due_amount, attendance_percentage, theory_attendance, lab_attendance, condonation_waiver, condonation_reason, hall_ticket_status, marksheet_status) VALUES
(101, 'paid', 0.00, 94.20, 95.00, 93.40, FALSE, NULL, 'issued', 'released'),
(102, 'pending', 40000.00, 71.40, 72.50, 70.30, FALSE, NULL, 'withheld', 'withheld'),
(103, 'paid', 0.00, 95.80, 96.50, 95.00, FALSE, NULL, 'issued', 'released'),
(104, 'paid', 0.00, 89.10, 90.00, 88.20, FALSE, NULL, 'issued', 'released'),
(105, 'paid', 0.00, 64.00, 65.00, 63.00, FALSE, NULL, 'withheld', 'withheld'),
(106, 'pending', 35000.00, 68.20, 70.00, 66.40, FALSE, NULL, 'withheld', 'withheld'),
(107, 'paid', 0.00, 86.40, 88.00, 84.80, FALSE, NULL, 'issued', 'released'),
(108, 'paid', 0.00, 92.50, 94.00, 91.00, FALSE, NULL, 'issued', 'released'),
(109, 'paid', 0.00, 88.00, 89.00, 87.00, FALSE, NULL, 'issued', 'released'),
(110, 'pending', 50000.00, 56.50, 58.00, 55.00, FALSE, NULL, 'withheld', 'withheld');

-- 11b. Seed Study Materials (Curated Subject Notes & Manuals)
INSERT INTO study_materials (title, subject_code, category, file_type, file_size, uploaded_by, downloads) VALUES
('Core Java Architecture & JVM Deep Dive', 'IT-301', 'Lecture Notes', 'PDF', '4.2 MB', 'Prof. Krrish Sharma', 142),
('JDBC Transactions & Connection Pooling Guide', 'IT-301', 'Lecture Notes', 'PDF', '2.8 MB', 'Prof. Krrish Sharma', 98),
('Java Advanced Programming Lab Manual (Semester 6)', 'IT-301', 'Lab Manual', 'PDF', '5.1 MB', 'Prof. Krrish Sharma', 165),
('Relational Schema Normalization & BCNF Notes', 'IT-302', 'Lecture Notes', 'PDF', '3.6 MB', 'Prof. Anjali Mehta', 120),
('SQL Optimization & Indexing Lab Guide', 'IT-302', 'Lab Manual', 'PDF', '4.0 MB', 'Prof. Anjali Mehta', 110),
('Distributed Consensus & CAP Theorem Primer', 'IT-303', 'Lecture Notes', 'PDF', '3.1 MB', 'Dr. Vivek Joshi', 85);

-- 12. Seed Semester Transcripts
INSERT INTO semester_transcripts (roll_number, semester, academic_year, sgpa, cgpa, earned_credits, total_credits, result_status, verified_qr_hash, issued_date) VALUES
(101, 'Semester 6', '2026–2027', 8.95, 8.82, 24.0, 24.0, 'First Class with Distinction', 'QR-EDU-2026-101-VERIFIED', '2026-10-02'),
(102, 'Semester 6', '2026–2027', 9.42, 9.35, 24.0, 24.0, 'First Class with Distinction', 'QR-EDU-2026-102-VERIFIED', '2026-10-02'),
(104, 'Semester 6', '2026–2027', 9.15, 9.08, 24.0, 24.0, 'First Class with Distinction', 'QR-EDU-2026-104-VERIFIED', '2026-10-02'),
(105, 'Semester 6', '2026–2027', 8.20, 8.12, 24.0, 24.0, 'First Class', 'QR-EDU-2026-105-VERIFIED', '2026-10-02');

-- 13. Seed Certificate Requests
INSERT INTO certificate_requests (request_id, roll_number, certificate_type, purpose, status, reference_no) VALUES
('REQ-2026-0891', 101, 'Bonafide', 'Passport & Education Loan Application', 'Approved', 'EDUTRACK/ACAD/BONAFIDE/2026/0891'),
('REQ-2026-0892', 101, 'Railway Concession', 'Thane to Campus Suburban Local Rail Pass', 'Approved', 'EDUTRACK/WELFARE/RAIL/2026/0412'),
('REQ-2026-0893', 102, 'Internship NOC', 'Summer Research Internship at Microsoft IDC', 'Approved', 'EDUTRACK/TPO/NOC/2026/0119');

-- 14. Seed Audit Logs
INSERT INTO audit_logs (actor_name, action_type, target_module, host_ip, status) VALUES
('System Administrator', 'DATABASE_INITIALIZATION', 'MySQL DDL & Clearance Schema', '127.0.0.1', 'Success'),
('Controller of Examinations', 'PUBLISH_EXAM_SCHEDULE', 'Semester 6 Combined Timetable', '192.168.1.10', 'Success'),
('Dean of Academic Affairs', 'GRANT_CONDONATION', 'Roll #105 Medical Waiver', '192.168.1.15', 'Success');

-- ==============================================================================
-- DATABASE VIEWS & STORED PROCEDURES
-- ==============================================================================

-- VIEW 1: Institutional Clearance Roster
CREATE OR REPLACE VIEW view_examination_clearance_roster AS
SELECT 
    s.roll_number,
    s.name,
    s.course,
    s.year,
    s.division,
    c.attendance_percentage,
    c.fee_status,
    c.fee_due_amount,
    c.condonation_waiver,
    c.condonation_reason,
    c.hall_ticket_status,
    c.marksheet_status,
    CASE 
        WHEN c.fee_status = 'paid' AND (c.attendance_percentage >= 75.00 OR c.condonation_waiver = TRUE) THEN 'Eligible'
        ELSE 'Clearance Hold'
    END AS computed_eligibility
FROM students s
LEFT JOIN student_clearance c ON s.roll_number = c.roll_number;

-- VIEW 2: Complete Combined Subjects Exam Schedule
CREATE OR REPLACE VIEW view_combined_exam_schedule AS
SELECT 
    paper_code,
    subject_name,
    semester,
    exam_type,
    duration,
    marks,
    credits,
    date,
    day,
    time,
    shift,
    room,
    seating_block,
    invigilator,
    is_published
FROM exam_schedules
ORDER BY STR_TO_DATE(date, '%b %d, %Y') ASC;

-- STORED PROCEDURE: Evaluate & Auto-Update Student Clearance Status
DELIMITER //
CREATE PROCEDURE sp_EvaluateStudentExamClearance(IN p_roll_number INT)
BEGIN
    DECLARE v_fee_status VARCHAR(10);
    DECLARE v_attendance DECIMAL(5, 2);
    DECLARE v_condonation BOOLEAN;
    
    SELECT fee_status, attendance_percentage, condonation_waiver
    INTO v_fee_status, v_attendance, v_condonation
    FROM student_clearance
    WHERE roll_number = p_roll_number;
    
    IF v_fee_status = 'paid' AND (v_attendance >= 75.00 OR v_condonation = TRUE) THEN
        UPDATE student_clearance
        SET hall_ticket_status = 'issued', marksheet_status = 'released'
        WHERE roll_number = p_roll_number;
    ELSE
        UPDATE student_clearance
        SET hall_ticket_status = 'withheld', marksheet_status = 'withheld'
        WHERE roll_number = p_roll_number;
    END IF;
END //
DELIMITER ;
