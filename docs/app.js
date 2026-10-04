// ==============================================================
// Interactive Architecture Simulator & Live Query Engine
// ==============================================================

const mockDatabase = [
  { id: 1, roll: 101, name: 'Krrish Sharma', email: 'krrish.sharma@example.com', phone: '9876543210', course: 'IT', year: 3, div: 'A', pct: 89.50 },
  { id: 2, roll: 102, name: 'Ananya Verma', email: 'ananya.verma@example.com', phone: '9811223344', course: 'CS', year: 2, div: 'B', pct: 94.20 },
  { id: 3, roll: 103, name: 'Rohan Patel', email: 'rohan.patel@example.com', phone: '9822334455', course: 'IT', year: 3, div: 'A', pct: 78.40 }
];

let currentOperation = 'insert';
let isRunningSim = false;

const codeSnippets = {
  dbconnection: `package com.krrish.studentmanagement.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // JDBC URL pointing to local MySQL instance
    private static final String URL = "jdbc:mysql://localhost:3306/student_management?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "shrikrishna@sql77";

    // Returns a live physical socket connection to MySQL Server on port 3306
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}`,

  studentdao: `package com.krrish.studentmanagement.dao;

import com.krrish.studentmanagement.model.Student;
import com.krrish.studentmanagement.util.DBConnection;
import java.sql.*;
import java.util.*;

public class StudentDAO {

    // 1. CREATE (INSERT)
    public boolean addStudent(Student s) throws SQLException {
        String sql = "INSERT INTO students (roll_number, name, email, phone, course, year, division, percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, s.getRollNumber());
            pstmt.setString(2, s.getName());
            pstmt.setString(3, s.getEmail());
            pstmt.setString(4, s.getPhone());
            pstmt.setString(5, s.getCourse());
            pstmt.setInt(6, s.getYear());
            pstmt.setString(7, s.getDivision());
            pstmt.setDouble(8, s.getPercentage());
            return pstmt.executeUpdate() > 0;
        }
    }

    // 2. READ (SELECT ALL)
    public List<Student> getAllStudents() throws SQLException {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT * FROM students ORDER BY roll_number ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                list.add(new Student(
                    rs.getInt("id"),
                    rs.getInt("roll_number"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("phone"),
                    rs.getString("course"),
                    rs.getInt("year"),
                    rs.getString("division"),
                    rs.getDouble("percentage")
                ));
            }
        }
        return list;
    }
}`,

  studentservice: `package com.krrish.studentmanagement.service;

import com.krrish.studentmanagement.dao.StudentDAO;
import com.krrish.studentmanagement.model.Student;
import com.krrish.studentmanagement.exception.*;
import java.sql.SQLException;
import java.util.List;

public class StudentService {
    private final StudentDAO studentDAO = new StudentDAO();

    // Business Logic: Check duplicates before calling DAO
    public void addStudent(Student student) throws DuplicateStudentException, SQLException {
        if (studentDAO.existsByRollNumber(student.getRollNumber())) {
            throw new DuplicateStudentException("Roll " + student.getRollNumber() + " already exists!");
        }
        studentDAO.addStudent(student);
    }

    public List<Student> getAllStudents() throws SQLException {
        return studentDAO.getAllStudents();
    }
}`,

  studentmodel: `package com.krrish.studentmanagement.model;

public class Student implements Comparable<Student> {
    private int id;
    private int rollNumber;
    private String name;
    private String email;
    private String phone;
    private String course;
    private int year;
    private String division;
    private double percentage;

    public Student(int id, int rollNumber, String name, String email, String phone, String course, int year, String division, double percentage) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.year = year;
        this.division = division;
        this.percentage = percentage;
    }

    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.rollNumber, other.rollNumber);
    }
}`,

  sqlscript: `-- SQL DDL & DML Schema Definition
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    division VARCHAR(10) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL
);

-- Query Demonstration
SELECT * FROM students WHERE percentage >= 85.00;`
};

document.addEventListener('DOMContentLoaded', () => {
  renderDatabaseTable();
  setupCodeTabs();
  setupSimulatorControls();
});

function setupCodeTabs() {
  const tabs = document.querySelectorAll('.code-tab-btn');
  const codeBox = document.getElementById('codeDisplay');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const snippetKey = tab.getAttribute('data-tab');
      codeBox.textContent = codeSnippets[snippetKey] || '// Code snippet not found';
    });
  });

  // Default initial code
  if (codeBox) {
    codeBox.textContent = codeSnippets.studentdao;
  }
}

function setupSimulatorControls() {
  const simBtns = document.querySelectorAll('.sim-btn');
  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunningSim) return;
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentOperation = btn.getAttribute('data-op');
    });
  });

  const runBtn = document.getElementById('runSimBtn');
  if (runBtn) {
    runBtn.addEventListener('click', runSimulation);
  }
}

async function runSimulation() {
  if (isRunningSim) return;
  isRunningSim = true;

  const logBox = document.getElementById('simLog');
  const dbBox = document.getElementById('simDbLive');
  const nodes = document.querySelectorAll('.pipeline-node');
  const packet = document.getElementById('packetIndicator');

  logBox.innerHTML = '';
  packet.style.display = 'block';

  const appendLog = (msg, className = 'log-info') => {
    const div = document.createElement('div');
    div.className = `log-entry ${className}`;
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logBox.appendChild(div);
    logBox.scrollTop = logBox.scrollHeight;
  };

  const setNodeActive = (index) => {
    nodes.forEach((n, i) => {
      if (i === index) {
        n.classList.add('active-node');
        const rect = n.getBoundingClientRect();
        const parentRect = n.parentElement.getBoundingClientRect();
        packet.style.left = `${n.offsetLeft + (n.offsetWidth / 2)}px`;
      } else {
        n.classList.remove('active-node');
      }
    });
  };

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // --- STEP 1: UI / Main Action ---
  setNodeActive(0);
  appendLog(`▶ User initiated action: <strong>${currentOperation.toUpperCase()}</strong>`, 'log-info');
  await wait(600);

  // --- STEP 2: Service Layer ---
  setNodeActive(1);
  appendLog(`Calling <code>StudentService.${getServiceMethod(currentOperation)}</code>`, 'log-info');
  appendLog(`Checking business validations (duplicate roll check, null checks)... Passed!`, 'log-info');
  await wait(700);

  // --- STEP 3: DAO Layer ---
  setNodeActive(2);
  appendLog(`Calling <code>StudentDAO.${getDaoMethod(currentOperation)}</code>`, 'log-info');
  appendLog(`Acquiring JDBC Connection from <code>DBConnection.getConnection()</code>... OK (Port 3306)`, 'log-info');
  await wait(700);

  // --- STEP 4: PreparedStatement ---
  setNodeActive(3);
  const sql = getSqlStatement(currentOperation);
  appendLog(`Preparing SQL statement: <span class="log-sql">${sql}</span>`, 'log-sql');
  appendLog(`Binding typed parameters using <code>pstmt.setInt()</code>, <code>pstmt.setString()</code>...`, 'log-info');
  await wait(800);

  // --- STEP 5: MySQL Server Engine (Port 3306) ---
  setNodeActive(4);
  appendLog(`Transmitting packet over TCP socket (localhost:3306) to MySQL Engine...`, 'log-info');
  appendLog(`MySQL parsed syntax, optimized execution plan, executed query in 1.4ms!`, 'log-success');
  
  // Mutate mock DB
  applyDatabaseMutation(currentOperation);
  renderDatabaseTable();
  await wait(800);

  // --- STEP 6: Response & UI ---
  setNodeActive(5);
  appendLog(`Received response: Rows affected: 1. Processing ResultSet into Student POJO list.`, 'log-success');
  appendLog(`UI updated with latest database state. Simulation complete!`, 'log-info');
  await wait(400);

  nodes.forEach(n => n.classList.remove('active-node'));
  packet.style.display = 'none';
  isRunningSim = false;
}

function getServiceMethod(op) {
  switch (op) {
    case 'insert': return 'addStudent(Student s)';
    case 'select': return 'getAllStudents()';
    case 'update': return 'updateStudent(101, updatedStudent)';
    case 'delete': return 'deleteStudent(103)';
  }
}

function getDaoMethod(op) {
  switch (op) {
    case 'insert': return 'addStudent(s) [executeUpdate]';
    case 'select': return 'getAllStudents() [executeQuery]';
    case 'update': return 'updateStudent(s) [executeUpdate]';
    case 'delete': return 'deleteStudent(103) [executeUpdate]';
  }
}

function getSqlStatement(op) {
  switch (op) {
    case 'insert': return 'INSERT INTO students (roll_number, name, email, phone, course, year, division, percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
    case 'select': return 'SELECT * FROM students ORDER BY roll_number ASC;';
    case 'update': return 'UPDATE students SET percentage = ? WHERE roll_number = ?;';
    case 'delete': return 'DELETE FROM students WHERE roll_number = ?;';
  }
}

function applyDatabaseMutation(op) {
  switch (op) {
    case 'insert': {
      const nextRoll = 100 + mockDatabase.length + 1;
      mockDatabase.push({
        id: mockDatabase.length + 1,
        roll: nextRoll,
        name: `Student ${nextRoll}`,
        email: `student${nextRoll}@example.com`,
        phone: '9899887766',
        course: 'IT',
        year: 3,
        div: 'A',
        pct: Number((75 + Math.random() * 20).toFixed(2))
      });
      break;
    }
    case 'update': {
      if (mockDatabase.length > 0) {
        mockDatabase[0].pct = Number((mockDatabase[0].pct + 1.5).toFixed(2));
      }
      break;
    }
    case 'delete': {
      if (mockDatabase.length > 3) {
        mockDatabase.pop();
      }
      break;
    }
    case 'select':
      break;
  }
}

function renderDatabaseTable() {
  const tbody = document.getElementById('mockDbBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  mockDatabase.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color: var(--accent-amber); font-weight:700;">#${row.id}</td>
      <td style="font-weight:700;">${row.roll}</td>
      <td><strong>${row.name}</strong></td>
      <td style="color: var(--text-muted);">${row.email}</td>
      <td><span class="col-badge">${row.course}</span></td>
      <td>Year ${row.year} (${row.div})</td>
      <td style="color: var(--accent-green); font-weight:700;">${row.pct}%</td>
    `;
    tbody.appendChild(tr);
  });
}
