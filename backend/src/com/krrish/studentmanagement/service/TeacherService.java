package com.krrish.studentmanagement.service;

import com.krrish.studentmanagement.dao.TeacherDAO;
import com.krrish.studentmanagement.model.Teacher;

import java.sql.SQLException;
import java.util.List;

/**
 * Service Layer for Teacher operations.
 * Demonstrates business logic separation and validation in Core Java.
 */
public class TeacherService {
    private final TeacherDAO teacherDAO;

    public TeacherService() {
        this.teacherDAO = new TeacherDAO();
    }

    public boolean addTeacher(Teacher teacher) throws SQLException {
        if (teacher.getStaffId() == null || teacher.getStaffId().trim().isEmpty()) {
            throw new IllegalArgumentException("Staff ID cannot be empty.");
        }
        if (teacher.getName() == null || teacher.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Teacher name cannot be empty.");
        }
        Teacher existing = teacherDAO.findByStaffId(teacher.getStaffId());
        if (existing != null) {
            throw new IllegalArgumentException("Faculty member with Staff ID " + teacher.getStaffId() + " already exists.");
        }
        return teacherDAO.save(teacher);
    }

    public List<Teacher> getAllTeachers() throws SQLException {
        return teacherDAO.findAll();
    }

    public Teacher getTeacherByStaffId(String staffId) throws SQLException {
        return teacherDAO.findByStaffId(staffId);
    }

    public boolean toggleStatus(String staffId, String newStatus) throws SQLException {
        return teacherDAO.updateStatus(staffId, newStatus);
    }

    public boolean deleteTeacher(String staffId) throws SQLException {
        return teacherDAO.delete(staffId);
    }

    public int getTeacherCount() throws SQLException {
        return teacherDAO.getTeacherCount();
    }
}
