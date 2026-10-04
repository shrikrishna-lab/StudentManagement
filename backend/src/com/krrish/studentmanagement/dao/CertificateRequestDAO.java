package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.CertificateRequest;
import com.krrish.studentmanagement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Student Certificate Requests.
 */
public class CertificateRequestDAO {

    public List<CertificateRequest> getAllRequests() throws SQLException {
        List<CertificateRequest> list = new ArrayList<>();
        String sql = "SELECT r.*, s.name as student_name "
                + "FROM certificate_requests r "
                + "JOIN students s ON r.roll_number = s.roll_number "
                + "ORDER BY r.created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToRequest(rs));
            }
        }
        return list;
    }

    public boolean addRequest(CertificateRequest req) throws SQLException {
        String sql = "INSERT INTO certificate_requests (request_id, roll_number, certificate_type, purpose, status, reference_no) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, req.getRequestId());
            ps.setInt(2, req.getRollNumber());
            ps.setString(3, req.getCertificateType());
            ps.setString(4, req.getPurpose());
            ps.setString(5, req.getStatus());
            ps.setString(6, req.getReferenceNo());

            return ps.executeUpdate() > 0;
        }
    }

    private CertificateRequest mapResultSetToRequest(ResultSet rs) throws SQLException {
        CertificateRequest r = new CertificateRequest();
        r.setId(rs.getInt("id"));
        r.setRequestId(rs.getString("request_id"));
        r.setRollNumber(rs.getInt("roll_number"));
        r.setStudentName(rs.getString("student_name"));
        r.setCertificateType(rs.getString("certificate_type"));
        r.setPurpose(rs.getString("purpose"));
        r.setStatus(rs.getString("status"));
        r.setReferenceNo(rs.getString("reference_no"));
        r.setCreatedAt(rs.getTimestamp("created_at"));
        return r;
    }
}
