package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.StudentClearance;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Student Clearance records.
 * Manages institutional gatekeeper rules: Fee status, attendance %, medical waivers,
 * Hall Ticket issuance, and Marksheet release.
 */
public class StudentClearanceDAO {

    public List<StudentClearance> getAllClearances() throws SQLException {
        List<StudentClearance> list = new ArrayList<>();
        String sql = "SELECT c.*, s.name as student_name, s.course "
                + "FROM student_clearance c "
                + "JOIN students s ON c.roll_number = s.roll_number "
                + "ORDER BY c.roll_number ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToClearance(rs));
            }
        }
        return list;
    }

    public StudentClearance getClearanceByRoll(int rollNumber) throws SQLException {
        String sql = "SELECT c.*, s.name as student_name, s.course "
                + "FROM student_clearance c "
                + "JOIN students s ON c.roll_number = s.roll_number "
                + "WHERE c.roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, rollNumber);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToClearance(rs);
                }
            }
        }
        return null;
    }

    public boolean toggleFeeStatus(int rollNumber) throws SQLException {
        StudentClearance current = getClearanceByRoll(rollNumber);
        if (current == null) return false;

        String newFee = "paid".equalsIgnoreCase(current.getFeeStatus()) ? "pending" : "paid";
        double newDue = "pending".equals(newFee) ? 28500.00 : 0.00;

        String sql = "UPDATE student_clearance SET fee_status = ?, fee_due_amount = ? WHERE roll_number = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newFee);
            ps.setDouble(2, newDue);
            ps.setInt(3, rollNumber);
            boolean updated = ps.executeUpdate() > 0;
            if (updated) {
                autoEvaluateClearance(rollNumber);
            }
            return updated;
        }
    }

    public boolean toggleHallTicketStatus(int rollNumber) throws SQLException {
        StudentClearance current = getClearanceByRoll(rollNumber);
        if (current == null) return false;

        String newStatus = "issued".equalsIgnoreCase(current.getHallTicketStatus()) ? "withheld" : "issued";
        String sql = "UPDATE student_clearance SET hall_ticket_status = ? WHERE roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newStatus);
            ps.setInt(2, rollNumber);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean toggleMarksheetStatus(int rollNumber) throws SQLException {
        StudentClearance current = getClearanceByRoll(rollNumber);
        if (current == null) return false;

        String newStatus = "released".equalsIgnoreCase(current.getMarksheetStatus()) ? "withheld" : "released";
        String sql = "UPDATE student_clearance SET marksheet_status = ? WHERE roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newStatus);
            ps.setInt(2, rollNumber);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean setCondonationWaiver(int rollNumber, boolean waiver, String reason) throws SQLException {
        String sql = "UPDATE student_clearance SET condonation_waiver = ?, condonation_reason = ? WHERE roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setBoolean(1, waiver);
            ps.setString(2, reason);
            ps.setInt(3, rollNumber);
            boolean updated = ps.executeUpdate() > 0;
            if (updated) {
                autoEvaluateClearance(rollNumber);
            }
            return updated;
        }
    }

    /**
     * Re-evaluates student institutional eligibility and auto-updates
     * hall_ticket_status and marksheet_status based on institutional bylaws.
     */
    public void autoEvaluateClearance(int rollNumber) throws SQLException {
        StudentClearance c = getClearanceByRoll(rollNumber);
        if (c == null) return;

        boolean eligible = c.isEligible();
        String targetStatus = eligible ? "issued" : "withheld";
        String targetMarksheet = eligible ? "released" : "withheld";

        String sql = "UPDATE student_clearance SET hall_ticket_status = ?, marksheet_status = ? WHERE roll_number = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, targetStatus);
            ps.setString(2, targetMarksheet);
            ps.setInt(3, rollNumber);
            ps.executeUpdate();
        }
    }

    private StudentClearance mapResultSetToClearance(ResultSet rs) throws SQLException {
        StudentClearance c = new StudentClearance();
        c.setId(rs.getInt("id"));
        c.setRollNumber(rs.getInt("roll_number"));
        c.setStudentName(rs.getString("student_name"));
        c.setCourse(rs.getString("course"));
        c.setFeeStatus(rs.getString("fee_status"));
        c.setFeeDueAmount(rs.getDouble("fee_due_amount"));
        c.setAttendancePercentage(rs.getDouble("attendance_percentage"));
        try {
            c.setTheoryAttendance(rs.getDouble("theory_attendance"));
            c.setLabAttendance(rs.getDouble("lab_attendance"));
        } catch (SQLException ignored) {
            c.setTheoryAttendance(rs.getDouble("attendance_percentage") + 1.2);
            c.setLabAttendance(rs.getDouble("attendance_percentage") - 1.2);
        }
        c.setCondonationWaiver(rs.getBoolean("condonation_waiver"));
        c.setCondonationReason(rs.getString("condonation_reason"));
        c.setHallTicketStatus(rs.getString("hall_ticket_status"));
        c.setMarksheetStatus(rs.getString("marksheet_status"));
        return c;
    }
}
