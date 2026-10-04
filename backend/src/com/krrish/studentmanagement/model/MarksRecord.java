package com.krrish.studentmanagement.model;

/**
 * Model class representing a Student Marks / Gradebook Record.
 */
public class MarksRecord {
    private int id;
    private int rollNumber;
    private String subjectCode;
    private double internalMarks; // Max: 25
    private double midtermMarks;  // Max: 50
    private double practicalMarks;// Max: 25
    private double totalScore;    // Max: 100
    private String grade;

    public MarksRecord() {}

    public MarksRecord(int rollNumber, String subjectCode, double internalMarks, double midtermMarks, double practicalMarks, String grade) {
        this.rollNumber = rollNumber;
        this.subjectCode = subjectCode;
        this.internalMarks = internalMarks;
        this.midtermMarks = midtermMarks;
        this.practicalMarks = practicalMarks;
        this.totalScore = internalMarks + midtermMarks + practicalMarks;
        this.grade = grade != null ? grade : calculateGrade(this.totalScore);
    }

    public MarksRecord(int id, int rollNumber, String subjectCode, double internalMarks, double midtermMarks, double practicalMarks, double totalScore, String grade) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.subjectCode = subjectCode;
        this.internalMarks = internalMarks;
        this.midtermMarks = midtermMarks;
        this.practicalMarks = practicalMarks;
        this.totalScore = totalScore;
        this.grade = grade;
    }

    public static String calculateGrade(double total) {
        if (total >= 90) return "A+";
        if (total >= 80) return "A";
        if (total >= 70) return "B+";
        if (total >= 60) return "B";
        if (total >= 50) return "C";
        if (total >= 40) return "D";
        return "F";
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRollNumber() { return rollNumber; }
    public void setRollNumber(int rollNumber) { this.rollNumber = rollNumber; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(double internalMarks) { this.internalMarks = internalMarks; }

    public double getMidtermMarks() { return midtermMarks; }
    public void setMidtermMarks(double midtermMarks) { this.midtermMarks = midtermMarks; }

    public double getPracticalMarks() { return practicalMarks; }
    public void setPracticalMarks(double practicalMarks) { this.practicalMarks = practicalMarks; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double totalScore) { this.totalScore = totalScore; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    @Override
    public String toString() {
        return String.format("Roll #%d | %s | Internal: %.1f/25 | Mid: %.1f/50 | Pract: %.1f/25 | Total: %.1f%% | Grade: %s",
                rollNumber, subjectCode, internalMarks, midtermMarks, practicalMarks, totalScore, grade);
    }
}
