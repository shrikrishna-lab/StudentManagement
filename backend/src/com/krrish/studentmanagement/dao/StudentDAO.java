package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.Student;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) for Student entities.
 * Handles pure JDBC CRUD operations using:
 * - Connection
 * - PreparedStatement (prevents SQL injection)
 * - ResultSet
 * - executeQuery() and executeUpdate()
 */
public class StudentDAO {

    /**
     * Inserts a new student record into MySQL.
     * The 'id' column is auto-incremented by MySQL.
     */
    public boolean addStudent(Student student) throws SQLException {
        String sql = "INSERT INTO students (roll_number, name, email, phone, course, year, division, percentage) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, student.getRollNumber());
            pstmt.setString(2, student.getName());
            pstmt.setString(3, student.getEmail());
            pstmt.setString(4, student.getPhone());
            pstmt.setString(5, student.getCourse());
            pstmt.setInt(6, student.getYear());
            pstmt.setString(7, student.getDivision());
            pstmt.setDouble(8, student.getPercentage());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Retrieves all student records from MySQL ordered by roll_number.
     */
    public List<Student> getAllStudents() throws SQLException {
        List<Student> students = new ArrayList<>();
        String sql = "SELECT id, roll_number, name, email, phone, course, year, division, percentage "
                   + "FROM students ORDER BY roll_number ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("id");
                int rollNumber = rs.getInt("roll_number");
                String name = rs.getString("name");
                String email = rs.getString("email");
                String phone = rs.getString("phone");
                String course = rs.getString("course");
                int year = rs.getInt("year");
                String division = rs.getString("division");
                double percentage = rs.getDouble("percentage");

                Student s = new Student(id, rollNumber, name, email, phone, course, year, division, percentage);
                students.add(s);
            }
        }
        return students;
    }

    /**
     * Finds a single student by unique roll number.
     * Returns null if not found.
     */
    public Student getStudentByRollNumber(int rollNumber) throws SQLException {
        String sql = "SELECT id, roll_number, name, email, phone, course, year, division, percentage "
                   + "FROM students WHERE roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, rollNumber);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new Student(
                        rs.getInt("id"),
                        rs.getInt("roll_number"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("course"),
                        rs.getInt("year"),
                        rs.getString("division"),
                        rs.getDouble("percentage")
                    );
                }
            }
        }
        return null;
    }

    /**
     * Searches students by name (case-insensitive partial match).
     */
    public List<Student> searchByName(String keyword) throws SQLException {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT id, roll_number, name, email, phone, course, year, division, percentage "
                   + "FROM students WHERE LOWER(name) LIKE ? ORDER BY roll_number ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, "%" + keyword.toLowerCase() + "%");

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(new Student(
                        rs.getInt("id"),
                        rs.getInt("roll_number"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("course"),
                        rs.getInt("year"),
                        rs.getString("division"),
                        rs.getDouble("percentage")
                    ));
                }
            }
        }
        return list;
    }

    /**
     * Updates an existing student's details using their roll number.
     */
    public boolean updateStudent(Student student) throws SQLException {
        String sql = "UPDATE students SET name = ?, email = ?, phone = ?, course = ?, "
                   + "year = ?, division = ?, percentage = ? WHERE roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, student.getName());
            pstmt.setString(2, student.getEmail());
            pstmt.setString(3, student.getPhone());
            pstmt.setString(4, student.getCourse());
            pstmt.setInt(5, student.getYear());
            pstmt.setString(6, student.getDivision());
            pstmt.setDouble(7, student.getPercentage());
            pstmt.setInt(8, student.getRollNumber());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Deletes a student from MySQL by roll number.
     */
    public boolean deleteStudent(int rollNumber) throws SQLException {
        String sql = "DELETE FROM students WHERE roll_number = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, rollNumber);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Checks if a roll number already exists.
     */
    public boolean existsByRollNumber(int rollNumber) throws SQLException {
        String sql = "SELECT 1 FROM students WHERE roll_number = ? LIMIT 1";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, rollNumber);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        }
    }
}
