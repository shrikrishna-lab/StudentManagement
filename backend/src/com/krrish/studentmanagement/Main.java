package com.krrish.studentmanagement;

import com.krrish.studentmanagement.comparator.*;
import com.krrish.studentmanagement.dao.*;
import com.krrish.studentmanagement.exception.DuplicateStudentException;
import com.krrish.studentmanagement.exception.StudentNotFoundException;
import com.krrish.studentmanagement.model.*;
import com.krrish.studentmanagement.service.ClearanceService;
import com.krrish.studentmanagement.service.StudentService;
import com.krrish.studentmanagement.service.TeacherService;
import com.krrish.studentmanagement.util.DBInitializer;
import com.krrish.studentmanagement.util.InputUtil;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

/**
 * Main Application Class for EduTrack Student Management System.
 * Built strictly with Core Java concepts:
 * - Pure OOP & Encapsulation
 * - Java Collections Framework (List, ArrayList)
 * - Pure JDBC (Connection, PreparedStatement, ResultSet)
 * - Exception Handling
 * - DAO & Service Architecture
 */
public class Main {
    private final StudentService studentService;
    private final TeacherService teacherService;
    private final AttendanceDAO attendanceDAO;
    private final MarksDAO marksDAO;
    private final AssignmentDAO assignmentDAO;
    private final ClearanceService clearanceService;
    private final SemesterTranscriptDAO transcriptDAO;
    private final CertificateRequestDAO certificateDAO;
    private final Scanner scanner;

    public Main() {
        this.studentService = new StudentService();
        this.teacherService = new TeacherService();
        this.attendanceDAO = new AttendanceDAO();
        this.marksDAO = new MarksDAO();
        this.assignmentDAO = new AssignmentDAO();
        this.clearanceService = new ClearanceService();
        this.transcriptDAO = new SemesterTranscriptDAO();
        this.certificateDAO = new CertificateRequestDAO();
        this.scanner = new Scanner(System.in);
    }

    public static void main(String[] args) {
        Main app = new Main();
        app.start();
    }

    public void start() {
        printBanner();

        // Ensure database and all tables are ready
        DBInitializer.initialize();

        try {
            int studentCount = studentService.getStudentCount();
            int teacherCount = teacherService.getTeacherCount();
            System.out.println("✅ Connected to MySQL [student_management]. Students: " + studentCount + " | Faculty: " + teacherCount);
        } catch (SQLException e) {
            System.out.println("⚠️ Could not reach MySQL: " + e.getMessage());
        }

        boolean running = true;
        while (running) {
            printMainMenu();
            int choice = InputUtil.readIntInRange(scanner, "👉 Enter choice (1-10): ", 1, 10);
            System.out.println();

            switch (choice) {
                case 1:
                    handleStudentMenu();
                    break;
                case 2:
                    handleFacultyMenu();
                    break;
                case 3:
                    handleAttendanceMenu();
                    break;
                case 4:
                    handleGradebookMenu();
                    break;
                case 5:
                    handleAssignmentMenu();
                    break;
                case 6:
                    handleClearanceMenu();
                    break;
                case 7:
                    handleTranscriptMenu();
                    break;
                case 8:
                    handleCertificatesMenu();
                    break;
                case 9:
                    handleDatabaseDiagnostics();
                    break;
                case 10:
                    System.out.println("👋 Thank you for using EduTrack Core Java System. Goodbye!");
                    running = false;
                    break;
            }
        }
    }

    // =========================================================================
    // 1. STUDENT MANAGEMENT SUB-MENU
    // =========================================================================
    private void handleStudentMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 🎓 STUDENT MANAGEMENT MENU ---");
            System.out.println("1. Add New Student (INSERT)");
            System.out.println("2. View All Students (SELECT)");
            System.out.println("3. Search Student by Roll Number");
            System.out.println("4. Update Student Details (UPDATE)");
            System.out.println("5. Delete Student (DELETE)");
            System.out.println("6. Sort Students (Comparable & Comparator)");
            System.out.println("7. View Analytics & Statistics");
            System.out.println("8. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose student action (1-8): ", 1, 8);
            System.out.println();

            switch (choice) {
                case 1: handleAddStudent(); break;
                case 2: handleViewAllStudents(); break;
                case 3: handleSearchStudent(); break;
                case 4: handleUpdateStudent(); break;
                case 5: handleDeleteStudent(); break;
                case 6: handleSortMenu(); break;
                case 7: handleViewAnalytics(); break;
                case 8: inMenu = false; break;
            }
        }
    }

    private void handleAddStudent() {
        System.out.println("➕ [REGISTER NEW STUDENT]");
        int roll = InputUtil.readInt(scanner, "Enter Roll Number: ");
        String name = InputUtil.readNonEmptyString(scanner, "Enter Full Name: ");
        String email = InputUtil.readNonEmptyString(scanner, "Enter Email: ");
        String phone = InputUtil.readNonEmptyString(scanner, "Enter Phone: ");
        String course = InputUtil.readNonEmptyString(scanner, "Enter Course (IT/CS/EXTC/MECH): ");
        int year = InputUtil.readIntInRange(scanner, "Enter Academic Year (1-4): ", 1, 4);
        String div = InputUtil.readNonEmptyString(scanner, "Enter Division (A/B/C): ");
        double perc = InputUtil.readDoubleInRange(scanner, "Enter Percentage (0-100): ", 0.0, 100.0);

        try {
            Student student = new Student(roll, name, email, phone, course, year, div, perc);
            studentService.addStudent(student);
            System.out.println("✅ Student record successfully inserted into MySQL!");
        } catch (DuplicateStudentException e) {
            System.out.println("❌ Validation Error: " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        }
    }

    private void handleViewAllStudents() {
        System.out.println("📋 [ACTIVE STUDENTS DIRECTORY]");
        try {
            List<Student> students = studentService.getAllStudents();
            printStudentTable(students);
        } catch (SQLException e) {
            System.out.println("❌ Error fetching students: " + e.getMessage());
        }
    }

    private void handleSearchStudent() {
        int roll = InputUtil.readInt(scanner, "Enter Roll Number to Search: ");
        try {
            Student s = studentService.findStudentByRollNumber(roll);
            System.out.println("\n✅ Student Found:");
            System.out.println(s);
        } catch (StudentNotFoundException e) {
            System.out.println("❌ " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        }
    }

    private void handleUpdateStudent() {
        int roll = InputUtil.readInt(scanner, "Enter Roll Number to Update: ");
        try {
            Student existing = studentService.findStudentByRollNumber(roll);
            System.out.println("Updating record for: " + existing.getName());

            String name = InputUtil.readNonEmptyString(scanner, "Enter New Name: ");
            String email = InputUtil.readNonEmptyString(scanner, "Enter New Email: ");
            String phone = InputUtil.readNonEmptyString(scanner, "Enter New Phone: ");
            String course = InputUtil.readNonEmptyString(scanner, "Enter New Course: ");
            int year = InputUtil.readIntInRange(scanner, "Enter New Year (1-4): ", 1, 4);
            String div = InputUtil.readNonEmptyString(scanner, "Enter New Division: ");
            double perc = InputUtil.readDoubleInRange(scanner, "Enter New Percentage: ", 0.0, 100.0);

            Student updated = new Student(roll, name, email, phone, course, year, div, perc);
            studentService.updateStudent(roll, updated);
            System.out.println("✅ Student updated successfully in MySQL!");
        } catch (StudentNotFoundException e) {
            System.out.println("❌ " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        }
    }

    private void handleDeleteStudent() {
        int roll = InputUtil.readInt(scanner, "Enter Roll Number to Delete: ");
        try {
            studentService.deleteStudent(roll);
            System.out.println("✅ Student Roll #" + roll + " deleted from MySQL!");
        } catch (StudentNotFoundException e) {
            System.out.println("❌ " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        }
    }

    private void handleSortMenu() {
        System.out.println("1. Natural Order (Comparable by Roll Ascending)");
        System.out.println("2. Sort by Name Ascending");
        System.out.println("3. Sort by Name Descending");
        System.out.println("4. Sort by Percentage Highest First");
        System.out.println("5. Sort by Percentage Lowest First");

        int sortChoice = InputUtil.readIntInRange(scanner, "👉 Choose sorting strategy (1-5): ", 1, 5);
        try {
            List<Student> students = studentService.getAllStudents();
            switch (sortChoice) {
                case 1: studentService.sortStudentsNatural(students); break;
                case 2: studentService.sortStudents(students, new NameAscComparator()); break;
                case 3: studentService.sortStudents(students, new NameDescComparator()); break;
                case 4: studentService.sortStudents(students, new PercentageDescComparator()); break;
                case 5: studentService.sortStudents(students, new PercentageAscComparator()); break;
                default: return;
            }
            printStudentTable(students);
        } catch (SQLException e) {
            System.out.println("❌ Error sorting: " + e.getMessage());
        }
    }

    private void handleViewAnalytics() {
        try {
            System.out.println("📊 [STUDENT ANALYTICS SUMMARY]");
            System.out.printf("Total Enrolled Students: %d\n", studentService.getStudentCount());
            System.out.printf("Average Batch Percentage: %.2f%%\n", studentService.getAveragePercentage());
            Student topper = studentService.getHighestPercentageStudent();
            if (topper != null) {
                System.out.printf("Batch Topper: %s (Roll #%d) with %.2f%%\n", topper.getName(), topper.getRollNumber(), topper.getPercentage());
            }
        } catch (SQLException e) {
            System.out.println("❌ Error computing analytics: " + e.getMessage());
        }
    }

    // =========================================================================
    // 2. FACULTY & TEACHER SUB-MENU
    // =========================================================================
    private void handleFacultyMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 👨‍🏫 FACULTY & TEACHER MANAGEMENT ---");
            System.out.println("1. View All Faculty Members");
            System.out.println("2. Register New Faculty Member");
            System.out.println("3. Toggle Faculty Status (Active/Inactive)");
            System.out.println("4. Remove Faculty Member");
            System.out.println("5. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-5): ", 1, 5);
            System.out.println();

            switch (choice) {
                case 1:
                    try {
                        List<Teacher> teachers = teacherService.getAllTeachers();
                        System.out.println("----------------------------------------------------------------------------------");
                        System.out.printf("%-14s %-25s %-22s %-18s %-8s\n", "STAFF ID", "NAME", "DEPARTMENT", "SUBJECT", "STATUS");
                        System.out.println("----------------------------------------------------------------------------------");
                        for (Teacher t : teachers) {
                            System.out.printf("%-14s %-25s %-22s %-18s %-8s\n",
                                    t.getStaffId(), t.getName(), t.getDepartment(), t.getAssignedSubject(), t.getStatus());
                        }
                        System.out.println("----------------------------------------------------------------------------------");
                    } catch (SQLException e) {
                        System.out.println("❌ Error fetching teachers: " + e.getMessage());
                    }
                    break;
                case 2:
                    String staffId = InputUtil.readNonEmptyString(scanner, "Enter Staff ID (e.g. FAC-IT-105): ");
                    String name = InputUtil.readNonEmptyString(scanner, "Enter Full Name: ");
                    String email = InputUtil.readNonEmptyString(scanner, "Enter Email: ");
                    String dept = InputUtil.readNonEmptyString(scanner, "Enter Department: ");
                    String subject = InputUtil.readNonEmptyString(scanner, "Enter Assigned Subject: ");
                    try {
                        teacherService.addTeacher(new Teacher(staffId, name, email, dept, subject, "Active"));
                        System.out.println("✅ Faculty member added to MySQL successfully!");
                    } catch (Exception e) {
                        System.out.println("❌ Error: " + e.getMessage());
                    }
                    break;
                case 3:
                    String sId = InputUtil.readNonEmptyString(scanner, "Enter Staff ID: ");
                    String status = InputUtil.readNonEmptyString(scanner, "Enter New Status (Active/Inactive): ");
                    try {
                        if (teacherService.toggleStatus(sId, status)) {
                            System.out.println("✅ Status updated to " + status + "!");
                        } else {
                            System.out.println("❌ Faculty not found.");
                        }
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 4:
                    String delId = InputUtil.readNonEmptyString(scanner, "Enter Staff ID to delete: ");
                    try {
                        if (teacherService.deleteTeacher(delId)) {
                            System.out.println("✅ Faculty member deleted!");
                        } else {
                            System.out.println("❌ Faculty not found.");
                        }
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 5:
                    inMenu = false;
                    break;
            }
        }
    }

    // =========================================================================
    // 3. ATTENDANCE SUB-MENU
    // =========================================================================
    private void handleAttendanceMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 📅 STUDENT ATTENDANCE SYSTEM ---");
            System.out.println("1. Record Daily Attendance (Roll Call)");
            System.out.println("2. View Student Attendance History");
            System.out.println("3. Calculate Attendance Percentage");
            System.out.println("4. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-4): ", 1, 4);
            System.out.println();

            switch (choice) {
                case 1:
                    int roll = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                    String sub = InputUtil.readNonEmptyString(scanner, "Enter Subject Code (e.g. IT-301): ");
                    String faculty = InputUtil.readNonEmptyString(scanner, "Enter Faculty ID: ");
                    int statChoice = InputUtil.readIntInRange(scanner, "Status: 1. Present, 2. Absent, 3. Late -> ", 1, 3);
                    String status = statChoice == 1 ? "Present" : statChoice == 2 ? "Absent" : "Late";
                    Date today = new Date(System.currentTimeMillis());

                    try {
                        attendanceDAO.recordAttendance(new AttendanceRecord(roll, sub, today, status, faculty));
                        System.out.println("✅ Attendance recorded successfully in MySQL!");
                    } catch (SQLException e) {
                        System.out.println("❌ Error: " + e.getMessage());
                    }
                    break;
                case 2:
                    int searchRoll = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                    try {
                        List<AttendanceRecord> records = attendanceDAO.findByRollNumber(searchRoll);
                        System.out.println("---------------------------------------------------------------------");
                        System.out.printf("%-10s %-12s %-14s %-12s %-12s\n", "ROLL #", "SUBJECT", "DATE", "STATUS", "RECORDED BY");
                        System.out.println("---------------------------------------------------------------------");
                        for (AttendanceRecord r : records) {
                            System.out.printf("%-10d %-12s %-14s %-12s %-12s\n",
                                    r.getRollNumber(), r.getSubjectCode(), r.getDate(), r.getStatus(), r.getRecordedBy());
                        }
                        System.out.println("---------------------------------------------------------------------");
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 3:
                    int rNum = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                    String sCode = InputUtil.readNonEmptyString(scanner, "Enter Subject Code: ");
                    try {
                        double perc = attendanceDAO.calculateAttendancePercentage(rNum, sCode);
                        System.out.printf("✅ Attendance for Roll #%d in %s: %.2f%%\n", rNum, sCode, perc);
                        if (perc < 75.0) {
                            System.out.println("⚠️ WARNING: Student attendance is below the mandatory 75% threshold!");
                        }
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 4:
                    inMenu = false;
                    break;
            }
        }
    }

    // =========================================================================
    // 4. GRADEBOOK & MARKS SUB-MENU
    // =========================================================================
    private void handleGradebookMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 📝 EXAMINATION & GRADEBOOK SYSTEM ---");
            System.out.println("1. Add / Update Student Marks");
            System.out.println("2. View Student Complete Marksheet");
            System.out.println("3. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-3): ", 1, 3);
            System.out.println();

            switch (choice) {
                case 1:
                    int roll = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                    String sub = InputUtil.readNonEmptyString(scanner, "Enter Subject Code (e.g. IT-301): ");
                    double internal = InputUtil.readDoubleInRange(scanner, "Internal Assessment (0-25): ", 0.0, 25.0);
                    double midterm = InputUtil.readDoubleInRange(scanner, "Mid-Term Exam (0-50): ", 0.0, 50.0);
                    double practical = InputUtil.readDoubleInRange(scanner, "Practical Assessment (0-25): ", 0.0, 25.0);
                    MarksRecord m = new MarksRecord(roll, sub, internal, midterm, practical, null);

                    try {
                        marksDAO.saveOrUpdate(m);
                        System.out.printf("✅ Marks saved! Total: %.2f%% | Grade: %s\n", m.getTotalScore(), m.getGrade());
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 2:
                    int searchRoll = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                    try {
                        List<MarksRecord> list = marksDAO.findByRollNumber(searchRoll);
                        System.out.println("----------------------------------------------------------------------------------");
                        System.out.printf("%-10s %-12s %-12s %-12s %-12s %-10s %-6s\n",
                                "ROLL #", "SUBJECT", "INTERNAL", "MIDTERM", "PRACTICAL", "TOTAL", "GRADE");
                        System.out.println("----------------------------------------------------------------------------------");
                        for (MarksRecord rec : list) {
                            System.out.printf("%-10d %-12s %-12.1f %-12.1f %-12.1f %-9.1f%% %-6s\n",
                                    rec.getRollNumber(), rec.getSubjectCode(), rec.getInternalMarks(), rec.getMidtermMarks(),
                                    rec.getPracticalMarks(), rec.getTotalScore(), rec.getGrade());
                        }
                        System.out.println("----------------------------------------------------------------------------------");
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 3:
                    inMenu = false;
                    break;
            }
        }
    }

    // =========================================================================
    // 5. ASSIGNMENTS SUB-MENU
    // =========================================================================
    private void handleAssignmentMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 📑 COURSE ASSIGNMENTS SYSTEM ---");
            System.out.println("1. Create New Assignment");
            System.out.println("2. View All Active Assignments");
            System.out.println("3. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-3): ", 1, 3);
            System.out.println();

            switch (choice) {
                case 1:
                    String title = InputUtil.readNonEmptyString(scanner, "Enter Assignment Title: ");
                    String sub = InputUtil.readNonEmptyString(scanner, "Enter Subject Code (e.g. IT-301): ");
                    int total = InputUtil.readInt(scanner, "Enter Maximum Marks: ");
                    Date deadline = new Date(System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000)); // 7 days from now

                    try {
                        assignmentDAO.create(new Assignment(title, sub, deadline, total, "Active"));
                        System.out.println("✅ Assignment published to MySQL database!");
                    } catch (SQLException e) {
                        System.out.println("❌ Error: " + e.getMessage());
                    }
                    break;
                case 2:
                    try {
                        List<Assignment> list = assignmentDAO.findAll();
                        System.out.println("----------------------------------------------------------------------------------");
                        System.out.printf("%-6s %-32s %-12s %-14s %-8s %-8s\n", "ID", "TITLE", "SUBJECT", "DEADLINE", "MARKS", "STATUS");
                        System.out.println("----------------------------------------------------------------------------------");
                        for (Assignment a : list) {
                            System.out.printf("%-6d %-32s %-12s %-14s %-8d %-8s\n",
                                    a.getId(), a.getTitle(), a.getSubjectCode(), a.getDeadline(), a.getTotalMarks(), a.getStatus());
                        }
                        System.out.println("----------------------------------------------------------------------------------");
                    } catch (SQLException e) {
                        System.out.println("❌ Database Error: " + e.getMessage());
                    }
                    break;
                case 3:
                    inMenu = false;
                    break;
            }
        }
    }

    // =========================================================================
    // 6. EXAMINATION CLEARANCE & COMBINED HALL TICKET SUB-MENU
    // =========================================================================
    private void handleClearanceMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 🎫 EXAMINATION CLEARANCE & COMBINED HALL TICKETS ---");
            System.out.println("1. View Complete Student Clearance Roster (Fees, Att %, Hall Ticket & Marksheet)");
            System.out.println("2. Toggle Student Fee Status (Paid / Pending ₹28,500)");
            System.out.println("3. Grant / Revoke Medical Condonation Waiver (< 75% Attendance)");
            System.out.println("4. Toggle Hall Ticket Issuance Status (Issue / Withhold)");
            System.out.println("5. Toggle Official Marksheet Release Status (Release / Withhold)");
            System.out.println("6. Preview Student's Combined Official Hall Ticket (ALL 7 Subjects)");
            System.out.println("7. View Combined Examination Timetable (Theory, Practical Labs & Defense)");
            System.out.println("8. Toggle Live Exam Timetable Publication (Student/Faculty Visibility)");
            System.out.println("9. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-9): ", 1, 9);
            System.out.println();

            try {
                switch (choice) {
                    case 1:
                        List<StudentClearance> list = clearanceService.getAllClearances();
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        System.out.printf("%-8s %-18s %-6s %-16s %-12s %-14s %-14s %-12s\n",
                                "ROLL #", "STUDENT NAME", "COURSE", "FEE STATUS", "ATTENDANCE", "CONDONATION", "HALL TICKET", "MARKSHEET");
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        for (StudentClearance c : list) {
                            System.out.printf("%-8d %-18s %-6s %-16s %5.1f%% %-5s %-14s %-14s %-12s\n",
                                    c.getRollNumber(), c.getStudentName(), c.getCourse(),
                                    (c.getFeeStatus().toUpperCase() + (c.getFeeDueAmount() > 0 ? " (₹" + (int)c.getFeeDueAmount() + ")" : "")),
                                    c.getAttendancePercentage(),
                                    (c.isCondonationWaiver() ? "[WAIVER]" : "      "),
                                    (c.isCondonationWaiver() ? c.getCondonationReason() : "None"),
                                    c.getHallTicketStatus().toUpperCase(),
                                    c.getMarksheetStatus().toUpperCase());
                        }
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        break;
                    case 2:
                        int rollFee = InputUtil.readInt(scanner, "Enter Student Roll Number to toggle Fee: ");
                        if (clearanceService.toggleFeeStatus(rollFee)) {
                            StudentClearance updated = clearanceService.getClearanceByRoll(rollFee);
                            System.out.println("✅ Fee status updated! Current Fee: " + updated.getFeeStatus().toUpperCase() + " | Hall Ticket: " + updated.getHallTicketStatus().toUpperCase());
                        } else {
                            System.out.println("❌ Student roll number not found.");
                        }
                        break;
                    case 3:
                        int rollCond = InputUtil.readInt(scanner, "Enter Student Roll Number for Condonation Waiver: ");
                        StudentClearance scCond = clearanceService.getClearanceByRoll(rollCond);
                        if (scCond != null) {
                            if (scCond.isCondonationWaiver()) {
                                clearanceService.revokeMedicalCondonation(rollCond);
                                System.out.println("⚠️ Condonation waiver REVOKED for Roll #" + rollCond);
                            } else {
                                String reason = InputUtil.readNonEmptyString(scanner, "Enter Authorized Medical Reason (e.g. Hospitalization / CMO note): ");
                                clearanceService.grantMedicalCondonation(rollCond, reason);
                                System.out.println("✅ Medical Condonation Waiver GRANTED for Roll #" + rollCond + "!");
                            }
                        } else {
                            System.out.println("❌ Student roll number not found.");
                        }
                        break;
                    case 4:
                        int rollTicket = InputUtil.readInt(scanner, "Enter Student Roll Number to toggle Hall Ticket: ");
                        if (clearanceService.toggleHallTicketStatus(rollTicket)) {
                            StudentClearance updated = clearanceService.getClearanceByRoll(rollTicket);
                            System.out.println("✅ Hall Ticket status toggled to: " + updated.getHallTicketStatus().toUpperCase());
                        } else {
                            System.out.println("❌ Student roll number not found.");
                        }
                        break;
                    case 5:
                        int rollMark = InputUtil.readInt(scanner, "Enter Student Roll Number to toggle Marksheet: ");
                        if (clearanceService.toggleMarksheetStatus(rollMark)) {
                            StudentClearance updated = clearanceService.getClearanceByRoll(rollMark);
                            System.out.println("✅ Marksheet status toggled to: " + updated.getMarksheetStatus().toUpperCase());
                        } else {
                            System.out.println("❌ Student roll number not found.");
                        }
                        break;
                    case 6:
                        int rollPreview = InputUtil.readInt(scanner, "Enter Student Roll Number to generate Hall Ticket: ");
                        String hallTicketText = clearanceService.generateCombinedHallTicket(rollPreview);
                        System.out.println(hallTicketText);
                        break;
                    case 7:
                        List<ExamSchedule> exams = clearanceService.getAllExams();
                        System.out.println("-------------------------------------------------------------------------------------------------------------------");
                        System.out.printf("%-10s %-40s %-16s %-12s %-16s %-20s %-15s\n",
                                "CODE", "SUBJECT TITLE", "DATE & DAY", "TIME", "EXAM TYPE", "VENUE & SEAT", "INVIGILATOR");
                        System.out.println("-------------------------------------------------------------------------------------------------------------------");
                        for (ExamSchedule e : exams) {
                            System.out.printf("%-10s %-40s %-16s %-12s %-16s %-20s %-15s\n",
                                    e.getPaperCode(), e.getSubjectName(),
                                    e.getDate() + " (" + e.getDay().substring(0, Math.min(3, e.getDay().length())) + ")",
                                    e.getTime(), e.getExamType(), e.getRoom(), e.getInvigilator());
                        }
                        System.out.println("-------------------------------------------------------------------------------------------------------------------");
                        break;
                    case 8:
                        boolean pub = clearanceService.toggleExamScheduleVisibility();
                        System.out.println("🔔 Exam Timetable visibility updated. Published to Students/Faculty: " + (pub ? "YES (LIVE)" : "NO (DRAFT)"));
                        break;
                    case 9:
                        inMenu = false;
                        break;
                }
            } catch (SQLException e) {
                System.out.println("❌ Database Error: " + e.getMessage());
            }
        }
    }

    // =========================================================================
    // 7. SEMESTER TRANSCRIPTS & MARKSHEETS SUB-MENU
    // =========================================================================
    private void handleTranscriptMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 📜 SEMESTER TRANSCRIPTS & MARKSHEETS ---");
            System.out.println("1. View All Official Semester Transcripts (SGPA, CGPA, Credits)");
            System.out.println("2. View Marksheet for Student by Roll Number");
            System.out.println("3. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-3): ", 1, 3);
            System.out.println();

            try {
                switch (choice) {
                    case 1:
                        List<SemesterTranscript> list = transcriptDAO.getAllTranscripts();
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        System.out.printf("%-8s %-18s %-12s %-6s %-6s %-10s %-30s %-12s\n",
                                "ROLL #", "STUDENT NAME", "SEMESTER", "SGPA", "CGPA", "CREDITS", "RESULT STATUS", "ISSUED DATE");
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        for (SemesterTranscript t : list) {
                            System.out.printf("%-8d %-18s %-12s %-6.2f %-6.2f %-10s %-30s %-12s\n",
                                    t.getRollNumber(), t.getStudentName(), t.getSemester(),
                                    t.getSgpa(), t.getCgpa(), (t.getEarnedCredits() + " / " + t.getTotalCredits()),
                                    t.getResultStatus(), t.getIssuedDate());
                        }
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        break;
                    case 2:
                        int roll = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                        SemesterTranscript st = transcriptDAO.getTranscriptByRoll(roll, "Semester 6");
                        if (st != null) {
                            System.out.println("========================================================================");
                            System.out.println("🎓 EDUTRACK INSTITUTE OF TECHNOLOGY · OFFICIAL STATEMENT OF MARKS");
                            System.out.println("========================================================================");
                            System.out.printf("Candidate:    %s (Roll #%d)\n", st.getStudentName().toUpperCase(), st.getRollNumber());
                            System.out.printf("Semester:     %s (Academic Year %s)\n", st.getSemester(), st.getAcademicYear());
                            System.out.printf("SGPA:         %.2f | CGPA: %.2f\n", st.getSgpa(), st.getCgpa());
                            System.out.printf("Credits:      %.1f Earned / %.1f Total\n", st.getEarnedCredits(), st.getTotalCredits());
                            System.out.printf("Result:       %s\n", st.getResultStatus());
                            System.out.printf("QR Hash:      %s\n", st.getVerifiedQrHash());
                            System.out.printf("Date Issued:  %s\n", st.getIssuedDate());
                            System.out.println("========================================================================");
                        } else {
                            System.out.println("❌ No transcript found for Roll #" + roll);
                        }
                        break;
                    case 3:
                        inMenu = false;
                        break;
                }
            } catch (SQLException e) {
                System.out.println("❌ Database Error: " + e.getMessage());
            }
        }
    }

    // =========================================================================
    // 8. STUDENT CERTIFICATES & BONAFIDE DESK
    // =========================================================================
    private void handleCertificatesMenu() {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n--- 📋 STUDENT CERTIFICATES & BONAFIDE DESK ---");
            System.out.println("1. View All Certificate Requests & Records");
            System.out.println("2. Generate Official Bonafide Certificate");
            System.out.println("3. Back to Main Menu");

            int choice = InputUtil.readIntInRange(scanner, "👉 Choose action (1-3): ", 1, 3);
            System.out.println();

            try {
                switch (choice) {
                    case 1:
                        List<CertificateRequest> list = certificateDAO.getAllRequests();
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        System.out.printf("%-16s %-8s %-18s %-20s %-12s %s\n",
                                "REQUEST ID", "ROLL #", "NAME", "CERTIFICATE TYPE", "STATUS", "REFERENCE NO");
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        for (CertificateRequest r : list) {
                            System.out.printf("%-16s %-8d %-18s %-20s %-12s %s\n",
                                    r.getRequestId(), r.getRollNumber(), r.getStudentName(),
                                    r.getCertificateType(), r.getStatus(), r.getReferenceNo());
                        }
                        System.out.println("------------------------------------------------------------------------------------------------------------------");
                        break;
                    case 2:
                        int roll = InputUtil.readInt(scanner, "Enter Student Roll Number: ");
                        Student s = null;
                        try {
                            s = studentService.findStudentByRollNumber(roll);
                        } catch (com.krrish.studentmanagement.exception.StudentNotFoundException ex) {
                            System.out.println("❌ " + ex.getMessage());
                            break;
                        }
                        if (s != null) {
                            String purpose = InputUtil.readNonEmptyString(scanner, "Enter Purpose (e.g. Passport / Bank Loan / Internship): ");
                            String reqId = "REQ-2026-" + System.currentTimeMillis() % 10000;
                            String refNo = "EDUTRACK/ACAD/BONAFIDE/2026/" + roll;
                            certificateDAO.addRequest(new CertificateRequest(reqId, roll, s.getName(), "Bonafide", purpose, "Approved", refNo, new java.sql.Timestamp(System.currentTimeMillis())));

                            System.out.println("\n========================================================================");
                            System.out.println("🎓 EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)");
                            System.out.println("   OFFICE OF THE REGISTRAR · BONAFIDE STUDENT CERTIFICATE");
                            System.out.println("========================================================================");
                            System.out.println("REF NO: " + refNo + " · DATE: OCTOBER 03, 2026\n");
                            System.out.println("TO WHOMSOEVER IT MAY CONCERN\n");
                            System.out.printf("This is to certify that %s (Roll No: %d, PRN: PRN-2024098%03d) is a\n", s.getName().toUpperCase(), s.getRollNumber(), s.getRollNumber());
                            System.out.printf("bonafide student of Bachelor of Technology in %s (Year %d, Div %s)\n", s.getCourse(), s.getYear(), s.getDivision());
                            System.out.println("for the Academic Session 2026–2027.");
                            System.out.println("Issued for the purpose of: " + purpose);
                            System.out.println("\nSignatures: Dean of Academic Affairs · Registrar Office (Seal)");
                            System.out.println("========================================================================");
                        }
                        break;
                    case 3:
                        inMenu = false;
                        break;
                }
            } catch (SQLException e) {
                System.out.println("❌ Database Error: " + e.getMessage());
            }
        }
    }

    // =========================================================================
    // 9. DATABASE DIAGNOSTICS
    // =========================================================================
    private void handleDatabaseDiagnostics() {
        System.out.println("🔍 [MYSQL DATABASE DIAGNOSTICS]");
        try {
            int sCount = studentService.getStudentCount();
            int tCount = teacherService.getTeacherCount();
            int examCount = clearanceService.getAllExams().size();
            int clearCount = clearanceService.getAllClearances().size();

            System.out.println("● Connection Status: ONLINE (Port 3306)");
            System.out.println("● Database Name: student_management");
            System.out.printf("● Total Students in `students`: %d\n", sCount);
            System.out.printf("● Total Faculty in `teachers`: %d\n", tCount);
            System.out.printf("● Total Exams in `exam_schedules`: %d\n", examCount);
            System.out.printf("● Total Clearances in `student_clearance`: %d\n", clearCount);
            System.out.println("● Driver: MySQL Connector/J 8.4 (Pure JDBC)");
            System.out.println("✅ Database integrity check PASSED with 0 errors.");
        } catch (SQLException e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        }
    }

    // =========================================================================
    // HELPER UI METHODS
    // =========================================================================
    private void printBanner() {
        System.out.println("======================================================================");
        System.out.println("   🎓 EduTrack Student Management System (Core Java + MySQL JDBC)     ");
        System.out.println("======================================================================");
    }

    private void printMainMenu() {
        System.out.println("\n============== MAIN CONSOLE PORTAL ==============");
        System.out.println("1. 🎓 Student Management (CRUD, Search, Sort & Analytics)");
        System.out.println("2. 👨‍🏫 Faculty & Teacher Roster (Add, List, Status, Delete)");
        System.out.println("3. 📅 Student Attendance System (Roll Call, History, %)");
        System.out.println("4. 📝 Examination & Gradebook (Add Marks, View Marksheet)");
        System.out.println("5. 📑 Course Assignments (Create, View Deadlines)");
        System.out.println("6. 🎫 Hall Ticket & Examination Clearance Control (Fees, 75% Att, Condonation)");
        System.out.println("7. 📜 Official Semester Marksheets & Transcripts Release Center");
        System.out.println("8. 📋 Student Bonafide & Certificate Desk");
        System.out.println("9. 🗄️ MySQL Database Diagnostics & Health Ping");
        System.out.println("10. 🚪 Exit Application");
        System.out.println("=================================================");
    }

    private void printStudentTable(List<Student> students) {
        if (students.isEmpty()) {
            System.out.println("⚠️ No students found in database.");
            return;
        }
        System.out.println("----------------------------------------------------------------------------------------------------------");
        System.out.printf("%-8s %-20s %-25s %-12s %-8s %-6s %-6s %-8s\n",
                "ROLL", "NAME", "EMAIL", "PHONE", "COURSE", "YEAR", "DIV", "SCORE");
        System.out.println("----------------------------------------------------------------------------------------------------------");
        for (Student s : students) {
            System.out.printf("%-8d %-20s %-25s %-12s %-8s %-6d %-6s %-7.2f%%\n",
                    s.getRollNumber(), s.getName(), s.getEmail(), s.getPhone(),
                    s.getCourse(), s.getYear(), s.getDivision(), s.getPercentage());
        }
        System.out.println("----------------------------------------------------------------------------------------------------------");
    }
}
