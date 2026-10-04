package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.Assignment;
import com.krrish.studentmanagement.model.AssignmentSubmission;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure JDBC Data Access Object for Assignment & Student Submissions operations.
 */
public class AssignmentDAO {

    public boolean create(Assignment assignment) throws SQLException {
        String sql = "INSERT INTO assignments (title, subject_code, deadline, total_marks, status) "
                   + "VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, assignment.getTitle());
            ps.setString(2, assignment.getSubjectCode());
            ps.setDate(3, assignment.getDeadline());
            ps.setInt(4, assignment.getTotalMarks());
            ps.setString(5, assignment.getStatus() != null ? assignment.getStatus() : "Active");
            return ps.executeUpdate() > 0;
        }
    }

    public List<Assignment> findAll() throws SQLException {
        List<Assignment> list = new ArrayList<>();
        String sql = "SELECT id, title, subject_code, deadline, total_marks, status FROM assignments ORDER BY deadline ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Assignment(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("subject_code"),
                        rs.getDate("deadline"),
                        rs.getInt("total_marks"),
                        rs.getString("status")
                ));
            }
        }
        return list;
    }

    /**
     * Submit or update an assignment deliverable from a student.
     */
    public boolean submitDeliverable(int assignmentId, int rollNumber, String fileName, String notes) throws SQLException {
        String sql = "INSERT INTO assignment_submissions (assignment_id, roll_number, file_name, notes, status) "
                   + "VALUES (?, ?, ?, ?, 'Submitted') "
                   + "ON DUPLICATE KEY UPDATE file_name = VALUES(file_name), notes = VALUES(notes), status = 'Submitted', submitted_at = CURRENT_TIMESTAMP";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, assignmentId);
            ps.setInt(2, rollNumber);
            ps.setString(3, fileName);
            ps.setString(4, notes);
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Grade a student's assignment deliverable and assign marks.
     */
    public boolean gradeSubmission(int assignmentId, int rollNumber, int score, String notes) throws SQLException {
        String sql = "INSERT INTO assignment_submissions (assignment_id, roll_number, score, notes, status) "
                   + "VALUES (?, ?, ?, ?, 'Graded') "
                   + "ON DUPLICATE KEY UPDATE score = VALUES(score), notes = VALUES(notes), status = 'Graded'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, assignmentId);
            ps.setInt(2, rollNumber);
            ps.setInt(3, score);
            ps.setString(4, notes);
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Get all submissions for an assignment.
     */
    public List<AssignmentSubmission> findSubmissionsByAssignment(int assignmentId) throws SQLException {
        List<AssignmentSubmission> list = new ArrayList<>();
        String sql = "SELECT id, assignment_id, roll_number, file_name, score, status, notes, submitted_at "
                   + "FROM assignment_submissions WHERE assignment_id = ? ORDER BY roll_number ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, assignmentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new AssignmentSubmission(
                            rs.getInt("id"),
                            rs.getInt("assignment_id"),
                            rs.getInt("roll_number"),
                            rs.getString("file_name"),
                            (Integer) rs.getObject("score"),
                            rs.getString("status"),
                            rs.getString("notes"),
                            rs.getTimestamp("submitted_at")
                    ));
                }
            }
        }
        return list;
    }

    /**
     * Get all submissions and marks for a specific student.
     */
    public List<AssignmentSubmission> findSubmissionsByStudent(int rollNumber) throws SQLException {
        List<AssignmentSubmission> list = new ArrayList<>();
        String sql = "SELECT id, assignment_id, roll_number, file_name, score, status, notes, submitted_at "
                   + "FROM assignment_submissions WHERE roll_number = ? ORDER BY assignment_id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, rollNumber);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new AssignmentSubmission(
                            rs.getInt("id"),
                            rs.getInt("assignment_id"),
                            rs.getInt("roll_number"),
                            rs.getString("file_name"),
                            (Integer) rs.getObject("score"),
                            rs.getString("status"),
                            rs.getString("notes"),
                            rs.getTimestamp("submitted_at")
                    ));
                }
            }
        }
        return list;
    }
}
