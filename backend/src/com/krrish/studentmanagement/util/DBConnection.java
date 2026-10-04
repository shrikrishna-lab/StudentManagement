package com.krrish.studentmanagement.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Utility class responsible solely for establishing a connection to MySQL.
 * Demonstrates:
 * 1. JDBC URL structure: jdbc:mysql://localhost:3306/student_management
 * 2. DriverManager.getConnection()
 */
public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/student_management?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "shrikrishna@sql77";

    /**
     * Establishes and returns a fresh Connection to the MySQL database.
     * Caller is responsible for closing the connection (or using try-with-resources).
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
