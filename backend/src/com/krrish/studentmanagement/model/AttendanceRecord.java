package com.krrish.studentmanagement.model;

import java.sql.Date;

/**
 * Model class representing a Student Attendance Record.
 */
public class AttendanceRecord {
    private int id;
    private int rollNumber;
    private String subjectCode;
    private Date date;
    private String status; // Present, Absent, Late
    private String recordedBy;

    public AttendanceRecord() {}

    public AttendanceRecord(int rollNumber, String subjectCode, Date date, String status, String recordedBy) {
        this.rollNumber = rollNumber;
        this.subjectCode = subjectCode;
        this.date = date;
        this.status = status;
        this.recordedBy = recordedBy;
    }

    public AttendanceRecord(int id, int rollNumber, String subjectCode, Date date, String status, String recordedBy) {
        this(rollNumber, subjectCode, date, status, recordedBy);
        this.id = id;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRollNumber() { return rollNumber; }
    public void setRollNumber(int rollNumber) { this.rollNumber = rollNumber; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }

    @Override
    public String toString() {
        return String.format("Roll #%d | Subject: %s | Date: %s | Status: %s | Faculty: %s",
                rollNumber, subjectCode, date, status, recordedBy);
    }
}
