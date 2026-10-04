package com.krrish.studentmanagement.model;

import java.sql.Timestamp;

/**
 * Model representing a Student Certificate / Bonafide Request.
 */
public class CertificateRequest {
    private int id;
    private String requestId;
    private int rollNumber;
    private String studentName;
    private String certificateType;
    private String purpose;
    private String status;
    private String referenceNo;
    private Timestamp createdAt;

    public CertificateRequest() {}

    public CertificateRequest(String requestId, int rollNumber, String studentName,
                              String certificateType, String purpose, String status,
                              String referenceNo, Timestamp createdAt) {
        this.requestId = requestId;
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.certificateType = certificateType;
        this.purpose = purpose;
        this.status = status;
        this.referenceNo = referenceNo;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public int getRollNumber() { return rollNumber; }
    public void setRollNumber(int rollNumber) { this.rollNumber = rollNumber; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCertificateType() { return certificateType; }
    public void setCertificateType(String certificateType) { this.certificateType = certificateType; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return String.format("[%s] Roll #%-4d (%s) | Type: %-18s | Status: %-8s | Ref: %s",
                requestId, rollNumber, studentName, certificateType, status, referenceNo);
    }
}
