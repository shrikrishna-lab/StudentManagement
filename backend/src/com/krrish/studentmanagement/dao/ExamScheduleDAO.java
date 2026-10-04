package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.ExamSchedule;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Examination Schedules.
 * Interacts with MySQL table 'exam_schedules'.
 */
public class ExamScheduleDAO {

    public List<ExamSchedule> getAllExams() throws SQLException {
        List<ExamSchedule> list = new ArrayList<>();
        String sql = "SELECT * FROM exam_schedules ORDER BY id ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                ExamSchedule exam = mapResultSetToExam(rs);
                list.add(exam);
            }
        }
        return list;
    }

    public List<ExamSchedule> getExamsBySemester(String semester) throws SQLException {
        List<ExamSchedule> list = new ArrayList<>();
        String sql = "SELECT * FROM exam_schedules WHERE semester = ? ORDER BY id ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, semester);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToExam(rs));
                }
            }
        }
        return list;
    }

    public boolean addExam(ExamSchedule exam) throws SQLException {
        String sql = "INSERT INTO exam_schedules (paper_code, subject_name, semester, date, day, "
                + "time, shift, duration, marks, credits, exam_type, room, seating_block, invigilator, is_published) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, exam.getPaperCode());
            ps.setString(2, exam.getSubjectName());
            ps.setString(3, exam.getSemester());
            ps.setString(4, exam.getDate());
            ps.setString(5, exam.getDay());
            ps.setString(6, exam.getTime());
            ps.setString(7, exam.getShift());
            ps.setString(8, exam.getDuration());
            ps.setInt(9, exam.getMarks());
            ps.setDouble(10, exam.getCredits());
            ps.setString(11, exam.getExamType());
            ps.setString(12, exam.getRoom());
            ps.setString(13, exam.getSeatingBlock());
            ps.setString(14, exam.getInvigilator());
            ps.setBoolean(15, exam.isPublished());

            return ps.executeUpdate() > 0;
        }
    }

    public boolean setAllPublishedStatus(boolean published) throws SQLException {
        String sql = "UPDATE exam_schedules SET is_published = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, published);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean isPublished() throws SQLException {
        String sql = "SELECT is_published FROM exam_schedules LIMIT 1";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getBoolean("is_published");
            }
        }
        return true;
    }

    private ExamSchedule mapResultSetToExam(ResultSet rs) throws SQLException {
        ExamSchedule e = new ExamSchedule();
        e.setId(rs.getInt("id"));
        e.setPaperCode(rs.getString("paper_code"));
        e.setSubjectName(rs.getString("subject_name"));
        e.setSemester(rs.getString("semester"));
        e.setDate(rs.getString("date"));
        e.setDay(rs.getString("day"));
        e.setTime(rs.getString("time"));
        e.setShift(rs.getString("shift"));
        e.setDuration(rs.getString("duration"));
        e.setMarks(rs.getInt("marks"));
        e.setCredits(rs.getDouble("credits"));
        e.setExamType(rs.getString("exam_type"));
        e.setRoom(rs.getString("room"));
        e.setSeatingBlock(rs.getString("seating_block"));
        e.setInvigilator(rs.getString("invigilator"));
        e.setPublished(rs.getBoolean("is_published"));
        return e;
    }
}
