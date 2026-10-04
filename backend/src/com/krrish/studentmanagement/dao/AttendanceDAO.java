package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.AttendanceRecord;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure JDBC Data Access Object for Student Attendance operations.
 */
public class AttendanceDAO {

    public boolean recordAttendance(AttendanceRecord rec) throws SQLException {
        String sql = "INSERT INTO attendance (roll_number, subject_code, date, status, recorded_by) "
                   + "VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, rec.getRollNumber());
            ps.setString(2, rec.getSubjectCode());
            ps.setDate(3, rec.getDate());
            ps.setString(4, rec.getStatus());
            ps.setString(5, rec.getRecordedBy());
            return ps.executeUpdate() > 0;
        }
    }

    public List<AttendanceRecord> findByRollNumber(int rollNumber) throws SQLException {
        List<AttendanceRecord> list = new ArrayList<>();
        String sql = "SELECT id, roll_number, subject_code, date, status, recorded_by FROM attendance "
                   + "WHERE roll_number = ? ORDER BY date DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, rollNumber);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new AttendanceRecord(
                            rs.getInt("id"),
                            rs.getInt("roll_number"),
                            rs.getString("subject_code"),
                            rs.getDate("date"),
                            rs.getString("status"),
                            rs.getString("recorded_by")
                    ));
                }
            }
        }
        return list;
    }

    public double calculateAttendancePercentage(int rollNumber, String subjectCode) throws SQLException {
        String sql = "SELECT COUNT(*) as total, "
                   + "SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as attended "
                   + "FROM attendance WHERE roll_number = ? AND subject_code = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, rollNumber);
            ps.setString(2, subjectCode);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    int total = rs.getInt("total");
                    int attended = rs.getInt("attended");
                    if (total > 0) {
                        return (attended * 100.0) / total;
                    }
                }
            }
        }
        return 100.0; // default if no classes held yet
    }
}
