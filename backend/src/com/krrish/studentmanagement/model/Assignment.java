package com.krrish.studentmanagement.model;

import java.sql.Date;

/**
 * Model class representing a Course Assignment.
 */
public class Assignment {
    private int id;
    private String title;
    private String subjectCode;
    private Date deadline;
    private int totalMarks;
    private String status;

    public Assignment() {}

    public Assignment(String title, String subjectCode, Date deadline, int totalMarks, String status) {
        this.title = title;
        this.subjectCode = subjectCode;
        this.deadline = deadline;
        this.totalMarks = totalMarks;
        this.status = status;
    }

    public Assignment(int id, String title, String subjectCode, Date deadline, int totalMarks, String status) {
        this(title, subjectCode, deadline, totalMarks, status);
        this.id = id;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public Date getDeadline() { return deadline; }
    public void setDeadline(Date deadline) { this.deadline = deadline; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return String.format("[%s] %s | Due: %s | Marks: %d | Status: %s",
                subjectCode, title, deadline, totalMarks, status);
    }
}
