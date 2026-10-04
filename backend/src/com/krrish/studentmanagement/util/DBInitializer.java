package com.krrish.studentmanagement.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

/**
 * Database Initializer for EduTrack Student Management.
 * Uses Core Java JDBC Statement to auto-verify that database and tables are present.
 */
public class DBInitializer {
    private static final String ROOT_URL = "jdbc:mysql://localhost:3306/?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "shrikrishna@sql77";

    public static void initialize() {
        try (Connection conn = DriverManager.getConnection(ROOT_URL, USER, PASSWORD);
             Statement stmt = conn.createStatement()) {

            // 1. Create database
            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS student_management");
            stmt.executeUpdate("USE student_management");

            // 2. Students Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS students ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "roll_number INT NOT NULL UNIQUE, "
                    + "name VARCHAR(100) NOT NULL, "
                    + "email VARCHAR(100) NOT NULL, "
                    + "phone VARCHAR(20) NOT NULL, "
                    + "course VARCHAR(50) NOT NULL, "
                    + "year INT NOT NULL, "
                    + "division VARCHAR(10) NOT NULL, "
                    + "percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00"
                    + ")");

            // 3. Teachers Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS teachers ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "staff_id VARCHAR(20) NOT NULL UNIQUE, "
                    + "name VARCHAR(100) NOT NULL, "
                    + "email VARCHAR(100) NOT NULL UNIQUE, "
                    + "department VARCHAR(50) NOT NULL, "
                    + "assigned_subject VARCHAR(100) NOT NULL, "
                    + "status VARCHAR(20) DEFAULT 'Active'"
                    + ")");

            // 4. Attendance Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS attendance ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "roll_number INT NOT NULL, "
                    + "subject_code VARCHAR(20) NOT NULL, "
                    + "date DATE NOT NULL, "
                    + "status VARCHAR(20) NOT NULL DEFAULT 'Present', "
                    + "recorded_by VARCHAR(20)"
                    + ")");

            // 5. Marks Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS marks ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "roll_number INT NOT NULL, "
                    + "subject_code VARCHAR(20) NOT NULL, "
                    + "internal_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00, "
                    + "midterm_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00, "
                    + "practical_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00, "
                    + "grade VARCHAR(5) DEFAULT 'A'"
                    + ")");

            // 6. Assignments Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS assignments ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "title VARCHAR(150) NOT NULL, "
                    + "subject_code VARCHAR(20) NOT NULL, "
                    + "deadline DATE NOT NULL, "
                    + "total_marks INT NOT NULL DEFAULT 20, "
                    + "status VARCHAR(20) DEFAULT 'Active'"
                    + ")");

            // 7. Announcements Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS announcements ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "title VARCHAR(200) NOT NULL, "
                    + "message TEXT NOT NULL, "
                    + "department VARCHAR(50) NOT NULL, "
                    + "tag VARCHAR(20) DEFAULT 'General'"
                    + ")");

            // 8. Audit Logs Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS audit_logs ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
                    + "actor_name VARCHAR(100) NOT NULL, "
                    + "action_type VARCHAR(50) NOT NULL, "
                    + "target_module VARCHAR(50) NOT NULL, "
                    + "host_ip VARCHAR(45) DEFAULT '127.0.0.1', "
                    + "status VARCHAR(20) DEFAULT 'Success'"
                    + ")");

            // 9. Exam Schedules Table (Combined All Subjects)
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS exam_schedules ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "paper_code VARCHAR(20) NOT NULL UNIQUE, "
                    + "subject_name VARCHAR(150) NOT NULL, "
                    + "semester VARCHAR(20) NOT NULL DEFAULT 'Semester 6', "
                    + "date VARCHAR(30) NOT NULL, "
                    + "day VARCHAR(20) NOT NULL, "
                    + "time VARCHAR(30) NOT NULL, "
                    + "shift VARCHAR(30) NOT NULL DEFAULT 'Morning Shift', "
                    + "duration VARCHAR(20) NOT NULL DEFAULT '3 Hours', "
                    + "marks INT NOT NULL DEFAULT 100, "
                    + "credits DECIMAL(3, 1) NOT NULL DEFAULT 4.0, "
                    + "exam_type VARCHAR(50) NOT NULL DEFAULT 'Theory Written', "
                    + "room VARCHAR(50) NOT NULL, "
                    + "seating_block VARCHAR(50) NOT NULL, "
                    + "invigilator VARCHAR(100) NOT NULL, "
                    + "is_published BOOLEAN NOT NULL DEFAULT TRUE"
                    + ")");

            // 10. Student Clearance Table (Fee & Attendance Gatekeeper)
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS student_clearance ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "roll_number INT NOT NULL UNIQUE, "
                    + "fee_status VARCHAR(20) NOT NULL DEFAULT 'paid', "
                    + "fee_due_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00, "
                    + "attendance_percentage DECIMAL(5, 2) NOT NULL DEFAULT 85.00, "
                    + "condonation_waiver BOOLEAN NOT NULL DEFAULT FALSE, "
                    + "condonation_reason VARCHAR(255) DEFAULT NULL, "
                    + "hall_ticket_status VARCHAR(20) NOT NULL DEFAULT 'issued', "
                    + "marksheet_status VARCHAR(20) NOT NULL DEFAULT 'released'"
                    + ")");

            // 11. Semester Transcripts Table (Official Marksheets)
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS semester_transcripts ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "roll_number INT NOT NULL, "
                    + "semester VARCHAR(20) NOT NULL DEFAULT 'Semester 6', "
                    + "academic_year VARCHAR(20) NOT NULL DEFAULT '2026–2027', "
                    + "sgpa DECIMAL(4, 2) NOT NULL DEFAULT 8.95, "
                    + "cgpa DECIMAL(4, 2) NOT NULL DEFAULT 8.82, "
                    + "earned_credits DECIMAL(4, 1) NOT NULL DEFAULT 24.0, "
                    + "total_credits DECIMAL(4, 1) NOT NULL DEFAULT 24.0, "
                    + "result_status VARCHAR(50) NOT NULL DEFAULT 'First Class with Distinction', "
                    + "verified_qr_hash VARCHAR(100) NOT NULL, "
                    + "issued_date DATE NOT NULL"
                    + ")");

            // 12. Certificate Requests Table
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS certificate_requests ("
                    + "id INT PRIMARY KEY AUTO_INCREMENT, "
                    + "request_id VARCHAR(50) NOT NULL UNIQUE, "
                    + "roll_number INT NOT NULL, "
                    + "certificate_type VARCHAR(50) NOT NULL, "
                    + "purpose VARCHAR(255) NOT NULL, "
                    + "status VARCHAR(20) NOT NULL DEFAULT 'Approved', "
                    + "reference_no VARCHAR(100) NOT NULL UNIQUE, "
                    + "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                    + ")");
            try {
                stmt.executeUpdate("ALTER TABLE certificate_requests ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            } catch (Exception ignored) {
                // Column already exists
            }

            // Seed default clearance records if table is empty
            var rsCheck = stmt.executeQuery("SELECT COUNT(*) FROM student_clearance");
            if (rsCheck.next() && rsCheck.getInt(1) == 0) {
                stmt.executeUpdate("INSERT INTO student_clearance (roll_number, fee_status, fee_due_amount, attendance_percentage, condonation_waiver, condonation_reason, hall_ticket_status, marksheet_status) VALUES "
                        + "(101, 'paid', 0.00, 89.50, FALSE, NULL, 'issued', 'released'), "
                        + "(102, 'paid', 0.00, 92.40, FALSE, NULL, 'issued', 'released'), "
                        + "(103, 'pending', 28500.00, 71.40, FALSE, NULL, 'withheld', 'withheld'), "
                        + "(104, 'paid', 0.00, 94.00, FALSE, NULL, 'issued', 'released'), "
                        + "(105, 'paid', 0.00, 73.80, TRUE, 'Medical ACL Ligament Condonation', 'issued', 'released')");
            }

            // Seed default combined exam schedule if table is empty
            var rsExams = stmt.executeQuery("SELECT COUNT(*) FROM exam_schedules");
            if (rsExams.next() && rsExams.getInt(1) == 0) {
                stmt.executeUpdate("INSERT INTO exam_schedules (paper_code, subject_name, semester, date, day, time, shift, duration, marks, credits, exam_type, room, seating_block, invigilator, is_published) VALUES "
                        + "('IT-301', 'Core Java & Object-Oriented Frameworks', 'Semester 6', 'Nov 10, 2026', 'Tuesday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall A-101', 'Desk #14 (Block A)', 'Prof. Krrish Sharma', TRUE), "
                        + "('IT-302', 'Database Management Systems & Transactions', 'Semester 6', 'Nov 13, 2026', 'Friday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall A-102', 'Desk #14 (Block A)', 'Prof. Anjali Mehta', TRUE), "
                        + "('IT-303', 'Distributed Systems & Cloud Computing', 'Semester 6', 'Nov 17, 2026', 'Tuesday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall B-201', 'Desk #14 (Block B)', 'Dr. Vivek Joshi', TRUE), "
                        + "('IT-304', 'Computer Networks & Network Security', 'Semester 6', 'Nov 20, 2026', 'Friday', '10:00 AM - 01:00 PM', 'Morning Shift', '3 Hours', 100, 4.0, 'Theory Written', 'Exam Hall B-202', 'Desk #14 (Block B)', 'Prof. Neha Gupta', TRUE), "
                        + "('IT-301L', 'Core Java Programming Laboratory Viva', 'Semester 6', 'Nov 24, 2026', 'Tuesday', '09:00 AM - 01:00 PM', 'Practical Batch 1', '4 Hours', 50, 1.0, 'Practical Lab & Viva', 'Computing Lab A-1', 'Terminal #08', 'Prof. Krrish Sharma', TRUE), "
                        + "('IT-302L', 'DBMS & SQL Performance Laboratory Viva', 'Semester 6', 'Nov 26, 2026', 'Thursday', '01:30 PM - 05:30 PM', 'Practical Batch 2', '4 Hours', 50, 1.0, 'Practical Lab & Viva', 'Computing Lab A-2', 'Terminal #08', 'Prof. Anjali Mehta', TRUE), "
                        + "('IT-305', 'Capstone Project Phase 1 Board Defense', 'Semester 6', 'Dec 01, 2026', 'Tuesday', '09:30 AM - 04:30 PM', 'Board Review', 'Full Day', 100, 3.0, 'Project Defense', 'Seminar Hall 1', 'Panel 2', 'Department Exam Board', TRUE)");
            }

            // Seed default transcripts if table is empty
            var rsTranscripts = stmt.executeQuery("SELECT COUNT(*) FROM semester_transcripts");
            if (rsTranscripts.next() && rsTranscripts.getInt(1) == 0) {
                stmt.executeUpdate("INSERT INTO semester_transcripts (roll_number, semester, academic_year, sgpa, cgpa, earned_credits, total_credits, result_status, verified_qr_hash, issued_date) VALUES "
                        + "(101, 'Semester 6', '2026–2027', 8.95, 8.82, 24.0, 24.0, 'First Class with Distinction', 'QR-EDU-2026-101-VERIFIED', '2026-10-02'), "
                        + "(102, 'Semester 6', '2026–2027', 9.42, 9.35, 24.0, 24.0, 'First Class with Distinction', 'QR-EDU-2026-102-VERIFIED', '2026-10-02'), "
                        + "(104, 'Semester 6', '2026–2027', 9.15, 9.08, 24.0, 24.0, 'First Class with Distinction', 'QR-EDU-2026-104-VERIFIED', '2026-10-02'), "
                        + "(105, 'Semester 6', '2026–2027', 8.20, 8.12, 24.0, 24.0, 'First Class', 'QR-EDU-2026-105-VERIFIED', '2026-10-02')");
            }

            // Seed default certificate requests if empty
            var rsCerts = stmt.executeQuery("SELECT COUNT(*) FROM certificate_requests");
            if (rsCerts.next() && rsCerts.getInt(1) == 0) {
                stmt.executeUpdate("INSERT INTO certificate_requests (request_id, roll_number, certificate_type, purpose, status, reference_no) VALUES "
                        + "('REQ-2026-0891', 101, 'Bonafide', 'Passport & Education Loan Application', 'Approved', 'EDUTRACK/ACAD/BONAFIDE/2026/0891'), "
                        + "('REQ-2026-0892', 101, 'Railway Concession', 'Thane to Campus Suburban Local Rail Pass', 'Approved', 'EDUTRACK/WELFARE/RAIL/2026/0412'), "
                        + "('REQ-2026-0893', 102, 'Internship NOC', 'Summer Research Internship at Microsoft IDC', 'Approved', 'EDUTRACK/TPO/NOC/2026/0119')");
            }

            System.out.println("✅ [Database Ready] Connected to MySQL and verified all academic tables (including Clearance & Multi-Subject Timetable).");
        } catch (Exception e) {
            System.err.println("❌ Database Initialization Error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        initialize();
    }
}
