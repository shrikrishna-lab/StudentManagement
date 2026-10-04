package com.krrish.studentmanagement.model;

import java.sql.Date;

/**
 * Model representing an Official Semester Marksheet / Grade Transcript.
 */
public class SemesterTranscript {
    private int id;
    private int rollNumber;
    private String studentName;
    private String semester;
    private String academicYear;
    private double sgpa;
    private double cgpa;
    private double earnedCredits;
    private double totalCredits;
    private String resultStatus;
    private String verifiedQrHash;
    private Date issuedDate;

    public SemesterTranscript() {}

    public SemesterTranscript(int rollNumber, String studentName, String semester, String academicYear,
                              double sgpa, double cgpa, double earnedCredits, double totalCredits,
                              String resultStatus, String verifiedQrHash, Date issuedDate) {
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.semester = semester;
        this.academicYear = academicYear;
        this.sgpa = sgpa;
        this.cgpa = cgpa;
        this.earnedCredits = earnedCredits;
        this.totalCredits = totalCredits;
        this.resultStatus = resultStatus;
        this.verifiedQrHash = verifiedQrHash;
        this.issuedDate = issuedDate;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRollNumber() { return rollNumber; }
    public void setRollNumber(int rollNumber) { this.rollNumber = rollNumber; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public double getSgpa() { return sgpa; }
    public void setSgpa(double sgpa) { this.sgpa = sgpa; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }

    public double getEarnedCredits() { return earnedCredits; }
    public void setEarnedCredits(double earnedCredits) { this.earnedCredits = earnedCredits; }

    public double getTotalCredits() { return totalCredits; }
    public void setTotalCredits(double totalCredits) { this.totalCredits = totalCredits; }

    public String getResultStatus() { return resultStatus; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }

    public String getVerifiedQrHash() { return verifiedQrHash; }
    public void setVerifiedQrHash(String verifiedQrHash) { this.verifiedQrHash = verifiedQrHash; }

    public Date getIssuedDate() { return issuedDate; }
    public void setIssuedDate(Date issuedDate) { this.issuedDate = issuedDate; }

    @Override
    public String toString() {
        return String.format("Roll #%-4d | %-16s | %s | SGPA: %4.2f | CGPA: %4.2f | Credits: %4.1f/%4.1f | %s",
                rollNumber, studentName, semester, sgpa, cgpa, earnedCredits, totalCredits, resultStatus);
    }
}
