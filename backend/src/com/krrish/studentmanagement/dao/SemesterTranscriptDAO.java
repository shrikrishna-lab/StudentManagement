package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.SemesterTranscript;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Official Semester Transcripts (Marksheets).
 */
public class SemesterTranscriptDAO {

    public List<SemesterTranscript> getAllTranscripts() throws SQLException {
        List<SemesterTranscript> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as student_name "
                + "FROM semester_transcripts t "
                + "JOIN students s ON t.roll_number = s.roll_number "
                + "ORDER BY t.roll_number ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToTranscript(rs));
            }
        }
        return list;
    }

    public SemesterTranscript getTranscriptByRoll(int rollNumber, String semester) throws SQLException {
        String sql = "SELECT t.*, s.name as student_name "
                + "FROM semester_transcripts t "
                + "JOIN students s ON t.roll_number = s.roll_number "
                + "WHERE t.roll_number = ? AND t.semester = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, rollNumber);
            ps.setString(2, semester);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToTranscript(rs);
                }
            }
        }
        return null;
    }

    private SemesterTranscript mapResultSetToTranscript(ResultSet rs) throws SQLException {
        SemesterTranscript t = new SemesterTranscript();
        t.setId(rs.getInt("id"));
        t.setRollNumber(rs.getInt("roll_number"));
        t.setStudentName(rs.getString("student_name"));
        t.setSemester(rs.getString("semester"));
        t.setAcademicYear(rs.getString("academic_year"));
        t.setSgpa(rs.getDouble("sgpa"));
        t.setCgpa(rs.getDouble("cgpa"));
        t.setEarnedCredits(rs.getDouble("earned_credits"));
        t.setTotalCredits(rs.getDouble("total_credits"));
        t.setResultStatus(rs.getString("result_status"));
        t.setVerifiedQrHash(rs.getString("verified_qr_hash"));
        t.setIssuedDate(rs.getDate("issued_date"));
        return t;
    }
}
