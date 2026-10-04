package com.krrish.studentmanagement.service;

import com.krrish.studentmanagement.dao.StudentDAO;
import com.krrish.studentmanagement.exception.DuplicateStudentException;
import com.krrish.studentmanagement.exception.StudentNotFoundException;
import com.krrish.studentmanagement.model.Student;

import java.sql.SQLException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Service Layer that manages business logic and coordinates with StudentDAO.
 * Flow:
 * Main -> StudentService -> StudentDAO -> JDBC PreparedStatement -> MySQL
 */
public class StudentService {
    private final StudentDAO studentDAO;

    public StudentService() {
        this.studentDAO = new StudentDAO();
    }

    /**
     * Adds a new student into MySQL.
     * Enforces unique roll number validation.
     */
    public void addStudent(Student student) throws DuplicateStudentException, SQLException {
        if (student == null) {
            throw new IllegalArgumentException("Student details cannot be null.");
        }
        if (studentDAO.existsByRollNumber(student.getRollNumber())) {
            throw new DuplicateStudentException("A student with Roll Number " + student.getRollNumber() + " already exists in MySQL!");
        }
        studentDAO.addStudent(student);
    }

    /**
     * Retrieves all students from MySQL.
     */
    public List<Student> getAllStudents() throws SQLException {
        return studentDAO.getAllStudents();
    }

    /**
     * Checks if a roll number exists in the database.
     */
    public boolean existsByRollNumber(int rollNumber) throws SQLException {
        return studentDAO.existsByRollNumber(rollNumber);
    }

    /**
     * Finds a student by roll number. Throws StudentNotFoundException if not present.
     */
    public Student findStudentByRollNumber(int rollNumber) throws StudentNotFoundException, SQLException {
        Student s = studentDAO.getStudentByRollNumber(rollNumber);
        if (s == null) {
            throw new StudentNotFoundException("No student found in database with Roll Number: " + rollNumber);
        }
        return s;
    }

    /**
     * Searches students by name substring.
     */
    public List<Student> searchByName(String keyword) throws SQLException {
        return studentDAO.searchByName(keyword);
    }

    /**
     * Updates an existing student record in MySQL.
     */
    public void updateStudent(int rollNumber, Student updated) throws StudentNotFoundException, SQLException {
        if (!studentDAO.existsByRollNumber(rollNumber)) {
            throw new StudentNotFoundException("Cannot update: Student with Roll Number " + rollNumber + " does not exist.");
        }
        updated.setRollNumber(rollNumber);
        studentDAO.updateStudent(updated);
    }

    /**
     * Deletes a student from MySQL by roll number.
     */
    public void deleteStudent(int rollNumber) throws StudentNotFoundException, SQLException {
        if (!studentDAO.existsByRollNumber(rollNumber)) {
            throw new StudentNotFoundException("Cannot delete: Student with Roll Number " + rollNumber + " was not found.");
        }
        studentDAO.deleteStudent(rollNumber);
    }

    /**
     * Sorts any retrieved list using Collections.sort() and a Comparator.
     */
    public List<Student> sortStudents(List<Student> list, Comparator<Student> comparator) {
        Collections.sort(list, comparator);
        return list;
    }

    /**
     * Sorts list naturally by rollNumber ascending via Comparable.
     */
    public List<Student> sortStudentsNatural(List<Student> list) {
        Collections.sort(list);
        return list;
    }

    /**
     * Computes the total number of students currently stored in MySQL.
     */
    public int getStudentCount() throws SQLException {
        return studentDAO.getAllStudents().size();
    }

    /**
     * Calculates the batch average percentage from current MySQL records.
     */
    public double getAveragePercentage() throws SQLException {
        List<Student> list = studentDAO.getAllStudents();
        if (list.isEmpty()) {
            return 0.0;
        }
        double sum = 0.0;
        for (Student s : list) {
            sum += s.getPercentage();
        }
        return sum / list.size();
    }

    /**
     * Finds the topper student from MySQL records.
     */
    public Student getHighestPercentageStudent() throws SQLException {
        List<Student> list = studentDAO.getAllStudents();
        if (list.isEmpty()) {
            return null;
        }
        Student topper = list.get(0);
        for (int i = 1; i < list.size(); i++) {
            Student cur = list.get(i);
            if (cur.getPercentage() > topper.getPercentage()) {
                topper = cur;
            }
        }
        return topper;
    }
}
