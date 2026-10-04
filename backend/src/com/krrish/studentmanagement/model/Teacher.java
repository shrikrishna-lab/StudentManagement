package com.krrish.studentmanagement.model;

/**
 * Model class representing a Faculty / Teacher Member.
 * Follows Core Java Encapsulation principles.
 */
public class Teacher {
    private int id;
    private String staffId;
    private String name;
    private String email;
    private String department;
    private String assignedSubject;
    private String status;

    public Teacher() {}

    public Teacher(String staffId, String name, String email, String department, String assignedSubject, String status) {
        this.staffId = staffId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.assignedSubject = assignedSubject;
        this.status = status;
    }

    public Teacher(int id, String staffId, String name, String email, String department, String assignedSubject, String status) {
        this(staffId, name, email, department, assignedSubject, status);
        this.id = id;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAssignedSubject() { return assignedSubject; }
    public void setAssignedSubject(String assignedSubject) { this.assignedSubject = assignedSubject; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return String.format("[%s] %s | Dept: %s | Subject: %s | Status: %s",
                staffId, name, department, assignedSubject, status);
    }
}
