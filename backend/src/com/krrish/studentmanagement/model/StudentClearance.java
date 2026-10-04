package com.krrish.studentmanagement.model;

/**
 * Model representing Institutional Student Clearance for Examinations and Marksheets.
 * Enforces:
 * 1. Fee Clearance (Paid in full vs Pending balance)
 * 2. Mandatory 75% Attendance (or authorized medical condonation waiver)
 * 3. Hall Ticket issuance & Marksheet release flags
 */
public class StudentClearance {
    private int id;
    private int rollNumber;
    private String studentName;
    private String course;
    private String feeStatus; // "paid" or "pending"
    private double feeDueAmount;
    private double attendancePercentage;
    private double theoryAttendance = 86.00;
    private double labAttendance = 84.00;
    private boolean condonationWaiver;
    private String condonationReason;
    private String hallTicketStatus; // "issued" or "withheld"
    private String marksheetStatus;  // "released" or "withheld"

    public StudentClearance() {}

    public StudentClearance(int rollNumber, String studentName, String course, String feeStatus,
                            double feeDueAmount, double attendancePercentage, boolean condonationWaiver,
                            String condonationReason, String hallTicketStatus, String marksheetStatus) {
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.course = course;
        this.feeStatus = feeStatus;
        this.feeDueAmount = feeDueAmount;
        this.attendancePercentage = attendancePercentage;
        this.theoryAttendance = attendancePercentage + 1.2;
        this.labAttendance = attendancePercentage - 1.2;
        this.condonationWaiver = condonationWaiver;
        this.condonationReason = condonationReason;
        this.hallTicketStatus = hallTicketStatus;
        this.marksheetStatus = marksheetStatus;
    }

    public StudentClearance(int rollNumber, String studentName, String course, String feeStatus,
                            double feeDueAmount, double attendancePercentage, double theoryAttendance,
                            double labAttendance, boolean condonationWaiver, String condonationReason,
                            String hallTicketStatus, String marksheetStatus) {
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.course = course;
        this.feeStatus = feeStatus;
        this.feeDueAmount = feeDueAmount;
        this.attendancePercentage = attendancePercentage;
        this.theoryAttendance = theoryAttendance;
        this.labAttendance = labAttendance;
        this.condonationWaiver = condonationWaiver;
        this.condonationReason = condonationReason;
        this.hallTicketStatus = hallTicketStatus;
        this.marksheetStatus = marksheetStatus;
    }

    /**
     * Institutional Rule: Student is eligible if Fees are Paid in full,
     * AND either attendance is >= 75.0% OR an official condonation waiver was granted.
     */
    public boolean isEligible() {
        boolean feeOk = "paid".equalsIgnoreCase(feeStatus);
        boolean attendanceOk = (attendancePercentage >= 75.00) || condonationWaiver;
        return feeOk && attendanceOk;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRollNumber() { return rollNumber; }
    public void setRollNumber(int rollNumber) { this.rollNumber = rollNumber; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getFeeStatus() { return feeStatus; }
    public void setFeeStatus(String feeStatus) { this.feeStatus = feeStatus; }

    public double getFeeDueAmount() { return feeDueAmount; }
    public void setFeeDueAmount(double feeDueAmount) { this.feeDueAmount = feeDueAmount; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public double getTheoryAttendance() { return theoryAttendance; }
    public void setTheoryAttendance(double theoryAttendance) { this.theoryAttendance = theoryAttendance; }

    public double getLabAttendance() { return labAttendance; }
    public void setLabAttendance(double labAttendance) { this.labAttendance = labAttendance; }

    public boolean isCondonationWaiver() { return condonationWaiver; }
    public void setCondonationWaiver(boolean condonationWaiver) { this.condonationWaiver = condonationWaiver; }

    public String getCondonationReason() { return condonationReason; }
    public void setCondonationReason(String condonationReason) { this.condonationReason = condonationReason; }

    public String getHallTicketStatus() { return hallTicketStatus; }
    public void setHallTicketStatus(String hallTicketStatus) { this.hallTicketStatus = hallTicketStatus; }

    public String getMarksheetStatus() { return marksheetStatus; }
    public void setMarksheetStatus(String marksheetStatus) { this.marksheetStatus = marksheetStatus; }

    @Override
    public String toString() {
        return String.format("Roll #%-4d | %-16s | Fee: %-7s (₹%,.0f) | Att: %5.1f%% %s | Hall Ticket: %-8s | Marksheet: %-8s",
                rollNumber, studentName, feeStatus.toUpperCase(), feeDueAmount,
                attendancePercentage, (condonationWaiver ? "[WAIVER]" : "        "),
                hallTicketStatus.toUpperCase(), marksheetStatus.toUpperCase());
    }
}
