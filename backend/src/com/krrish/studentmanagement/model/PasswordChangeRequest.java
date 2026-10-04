package com.krrish.studentmanagement.model;

import java.sql.Timestamp;

/**
 * Model class representing a User Password Change Request
 * awaiting Administrator review and approval.
 */
public class PasswordChangeRequest {
    private int id;
    private String requestCode;
    private int userId;
    private String loginId;
    private String role;
    private String newPasswordHash;
    private String reason;
    private String status; // Pending, Approved, Rejected
    private String adminNotes;
    private Timestamp requestedAt;
    private Timestamp reviewedAt;
    private String reviewedBy;

    public PasswordChangeRequest() {}

    public PasswordChangeRequest(String requestCode, int userId, String loginId, String role, String newPasswordHash, String reason) {
        this.requestCode = requestCode;
        this.userId = userId;
        this.loginId = loginId;
        this.role = role;
        this.newPasswordHash = newPasswordHash;
        this.reason = reason;
        this.status = "Pending";
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRequestCode() { return requestCode; }
    public void setRequestCode(String requestCode) { this.requestCode = requestCode; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getLoginId() { return loginId; }
    public void setLoginId(String loginId) { this.loginId = loginId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getNewPasswordHash() { return newPasswordHash; }
    public void setNewPasswordHash(String newPasswordHash) { this.newPasswordHash = newPasswordHash; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public Timestamp getRequestedAt() { return requestedAt; }
    public void setRequestedAt(Timestamp requestedAt) { this.requestedAt = requestedAt; }

    public Timestamp getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Timestamp reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    @Override
    public String toString() {
        return String.format("[%s] Request for %s (%s) | Status: %s | Reason: %s",
                requestCode, loginId, role, status, reason);
    }
}
