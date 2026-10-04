package com.krrish.studentmanagement.model;

import java.sql.Timestamp;

/**
 * Model representing an assignment deliverable submission and faculty evaluation marks.
 */
public class AssignmentSubmission {
    private int id;
    private int assignmentId;
    private int rollNumber;
    private String fileName;
    private String notes;
    private Integer score;
    private String status;
    private Timestamp submittedAt;

    public AssignmentSubmission() {}

    public AssignmentSubmission(int assignmentId, int rollNumber, String fileName, Integer score, String status, String notes) {
        this.assignmentId = assignmentId;
        this.rollNumber = rollNumber;
        this.fileName = fileName;
        this.score = score;
        this.status = status;
        this.notes = notes;
    }

    public AssignmentSubmission(int id, int assignmentId, int rollNumber, String fileName, Integer score, String status, String notes, Timestamp submittedAt) {
        this(assignmentId, rollNumber, fileName, score, status, notes);
        this.id = id;
        this.submittedAt = submittedAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getAssignmentId() { return assignmentId; }
    public void setAssignmentId(int assignmentId) { this.assignmentId = assignmentId; }

    public int getRollNumber() { return rollNumber; }
    public void setRollNumber(int rollNumber) { this.rollNumber = rollNumber; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Timestamp submittedAt) { this.submittedAt = submittedAt; }
}
