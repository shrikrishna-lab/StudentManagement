package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.MarksRecord;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure JDBC Data Access Object for Marks & Gradebook records.
 */
public class MarksDAO {

    public boolean saveOrUpdate(MarksRecord marks) throws SQLException {
        String sql = "INSERT INTO marks (roll_number, subject_code, internal_marks, midterm_marks, practical_marks, grade) "
                   + "VALUES (?, ?, ?, ?, ?, ?) "
                   + "ON DUPLICATE KEY UPDATE internal_marks = VALUES(internal_marks), "
                   + "midterm_marks = VALUES(midterm_marks), practical_marks = VALUES(practical_marks), "
                   + "grade = VALUES(grade)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, marks.getRollNumber());
            ps.setString(2, marks.getSubjectCode());
            ps.setDouble(3, marks.getInternalMarks());
            ps.setDouble(4, marks.getMidtermMarks());
            ps.setDouble(5, marks.getPracticalMarks());
            ps.setString(6, marks.getGrade());
            return ps.executeUpdate() > 0;
        }
    }

    public List<MarksRecord> findByRollNumber(int rollNumber) throws SQLException {
        List<MarksRecord> list = new ArrayList<>();
        String sql = "SELECT id, roll_number, subject_code, internal_marks, midterm_marks, practical_marks, "
                   + "(internal_marks + midterm_marks + practical_marks) as total, grade "
                   + "FROM marks WHERE roll_number = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, rollNumber);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new MarksRecord(
                            rs.getInt("id"),
                            rs.getInt("roll_number"),
                            rs.getString("subject_code"),
                            rs.getDouble("internal_marks"),
                            rs.getDouble("midterm_marks"),
                            rs.getDouble("practical_marks"),
                            rs.getDouble("total"),
                            rs.getString("grade")
                    ));
                }
            }
        }
        return list;
    }
}
