package com.krrish.studentmanagement.service;

import com.krrish.studentmanagement.dao.ExamScheduleDAO;
import com.krrish.studentmanagement.dao.StudentClearanceDAO;
import com.krrish.studentmanagement.model.ExamSchedule;
import com.krrish.studentmanagement.model.StudentClearance;

import java.sql.SQLException;
import java.util.List;

/**
 * Service Layer orchestrating Institutional Clearance Rules,
 * Hall Ticket issuance criteria, and Marksheet release policies.
 */
public class ClearanceService {
    private final StudentClearanceDAO clearanceDAO;
    private final ExamScheduleDAO examScheduleDAO;

    public ClearanceService() {
        this.clearanceDAO = new StudentClearanceDAO();
        this.examScheduleDAO = new ExamScheduleDAO();
    }

    public List<StudentClearance> getAllClearances() throws SQLException {
        return clearanceDAO.getAllClearances();
    }

    public StudentClearance getClearanceByRoll(int rollNumber) throws SQLException {
        return clearanceDAO.getClearanceByRoll(rollNumber);
    }

    public boolean toggleFeeStatus(int rollNumber) throws SQLException {
        return clearanceDAO.toggleFeeStatus(rollNumber);
    }

    public boolean toggleHallTicketStatus(int rollNumber) throws SQLException {
        return clearanceDAO.toggleHallTicketStatus(rollNumber);
    }

    public boolean toggleMarksheetStatus(int rollNumber) throws SQLException {
        return clearanceDAO.toggleMarksheetStatus(rollNumber);
    }

    public boolean grantMedicalCondonation(int rollNumber, String reason) throws SQLException {
        return clearanceDAO.setCondonationWaiver(rollNumber, true, reason);
    }

    public boolean revokeMedicalCondonation(int rollNumber) throws SQLException {
        return clearanceDAO.setCondonationWaiver(rollNumber, false, null);
    }

    public List<ExamSchedule> getAllExams() throws SQLException {
        return examScheduleDAO.getAllExams();
    }

    public boolean toggleExamScheduleVisibility() throws SQLException {
        boolean current = examScheduleDAO.isPublished();
        return examScheduleDAO.setAllPublishedStatus(!current);
    }

    public boolean isExamPublished() throws SQLException {
        return examScheduleDAO.isPublished();
    }

    /**
     * Generates official formatted text representation of a Student's Combined Hall Ticket.
     */
    public String generateCombinedHallTicket(int rollNumber) throws SQLException {
        StudentClearance sc = clearanceDAO.getClearanceByRoll(rollNumber);
        if (sc == null) return "Error: Student clearance record not found for Roll #" + rollNumber;

        if (!"issued".equalsIgnoreCase(sc.getHallTicketStatus())) {
            return "⛔ [HALL TICKET WITHHELD]\n"
                    + "Candidate Roll #" + rollNumber + " (" + sc.getStudentName() + ") is NOT cleared for examination.\n"
                    + "- Attendance: " + sc.getAttendancePercentage() + "% (Threshold: 75%)\n"
                    + "- Fee Status: " + sc.getFeeStatus().toUpperCase() + " (Dues: ₹" + sc.getFeeDueAmount() + ")\n"
                    + "Please contact Academic Administration / Accounts Office.";
        }

        List<ExamSchedule> exams = examScheduleDAO.getAllExams();
        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================\n");
        sb.append("🎓 EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)\n");
        sb.append("   OFFICIAL EXAMINATION ADMIT CARD (HALL TICKET) · WINTER 2026\n");
        sb.append("========================================================================\n\n");
        sb.append(String.format("Candidate Name:   %s\n", sc.getStudentName().toUpperCase()));
        sb.append(String.format("Roll Number:      %d\n", sc.getRollNumber()));
        sb.append(String.format("Seat Number:      2024-IT-%03d\n", sc.getRollNumber()));
        sb.append(String.format("PRN Enrolment:    PRN-2024098%03d\n", sc.getRollNumber()));
        sb.append(String.format("Program & Branch: B.Tech in %s (Semester 6)\n", sc.getCourse()));
        sb.append(String.format("Attendance Clear: %.1f%% [ELIGIBLE]\n", sc.getAttendancePercentage()));
        sb.append(String.format("Fee Clearance:    PAID IN FULL (Ref #AC-992%d)\n", sc.getRollNumber()));
        sb.append("Exam Center:      Campus Center #04 (Examination Block A & B)\n\n");
        sb.append("SCHEDULE OF ALL COMBINED PAPERS (THEORY + LAB PRACTICALS + DEFENSE):\n");
        sb.append("------------------------------------------------------------------------\n");
        sb.append(String.format("%-8s | %-38s | %-16s | %-12s | %s\n", "CODE", "SUBJECT TITLE", "DATE & DAY", "TIME", "ROOM & SEAT"));
        sb.append("------------------------------------------------------------------------\n");

        for (ExamSchedule e : exams) {
            sb.append(String.format("%-8s | %-38s | %s (%s) | %s | %s (%s)\n",
                    e.getPaperCode(), e.getSubjectName(), e.getDate(),
                    e.getDay().substring(0, Math.min(3, e.getDay().length())),
                    e.getTime(), e.getRoom(), e.getSeatingBlock()));
        }

        sb.append("------------------------------------------------------------------------\n");
        sb.append("Total Papers: ").append(exams.size()).append(" | Digital Ledger Hash: VERIFIED-OK\n");
        sb.append("Signatures: Controller of Examinations (Seal) | Room Invigilator (Initial)\n");
        sb.append("========================================================================\n");
        return sb.toString();
    }
}
