package com.krrish.studentmanagement.model;

import java.sql.Timestamp;

/**
 * Model class representing User Authentication Credentials.
 * Supports PRN, Staff ID, or Email authentication.
 */
public class UserCredential {
    private int id;
    private String loginId;
    private String name;
    private String email;
    private String password;
    private String role;
    private String status;
    private boolean mustChangePassword;
    private Timestamp createdAt;

    public UserCredential() {}

    public UserCredential(String loginId, String name, String email, String password, String role, String status, boolean mustChangePassword) {
        this.loginId = loginId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.mustChangePassword = mustChangePassword;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getLoginId() { return loginId; }
    public void setLoginId(String loginId) { this.loginId = loginId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return String.format("[%s] %s (%s) - %s | Status: %s", loginId, name, role, email, status);
    }
}
