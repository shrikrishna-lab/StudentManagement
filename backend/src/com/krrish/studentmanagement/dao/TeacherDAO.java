package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.Teacher;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure JDBC Data Access Object for Teacher / Faculty entities.
 * Demonstrates PreparedStatement, ResultSet, and try-with-resources.
 */
public class TeacherDAO {

    public boolean save(Teacher teacher) throws SQLException {
        String sql = "INSERT INTO teachers (staff_id, name, email, department, assigned_subject, status) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, teacher.getStaffId());
            ps.setString(2, teacher.getName());
            ps.setString(3, teacher.getEmail());
            ps.setString(4, teacher.getDepartment());
            ps.setString(5, teacher.getAssignedSubject());
            ps.setString(6, teacher.getStatus() != null ? teacher.getStatus() : "Active");
            return ps.executeUpdate() > 0;
        }
    }

    public List<Teacher> findAll() throws SQLException {
        List<Teacher> list = new ArrayList<>();
        String sql = "SELECT id, staff_id, name, email, department, assigned_subject, status FROM teachers ORDER BY staff_id";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Teacher(
                        rs.getInt("id"),
                        rs.getString("staff_id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("department"),
                        rs.getString("assigned_subject"),
                        rs.getString("status")
                ));
            }
        }
        return list;
    }

    public Teacher findByStaffId(String staffId) throws SQLException {
        String sql = "SELECT id, staff_id, name, email, department, assigned_subject, status FROM teachers WHERE staff_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, staffId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Teacher(
                            rs.getInt("id"),
                            rs.getString("staff_id"),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("department"),
                            rs.getString("assigned_subject"),
                            rs.getString("status")
                    );
                }
            }
        }
        return null;
    }

    public boolean updateStatus(String staffId, String newStatus) throws SQLException {
        String sql = "UPDATE teachers SET status = ? WHERE staff_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newStatus);
            ps.setString(2, staffId);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean delete(String staffId) throws SQLException {
        String sql = "DELETE FROM teachers WHERE staff_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, staffId);
            return ps.executeUpdate() > 0;
        }
    }

    public int getTeacherCount() throws SQLException {
        String sql = "SELECT COUNT(*) FROM teachers";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }
}
