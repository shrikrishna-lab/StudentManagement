# 🎓 Student Management System (Java + MySQL JDBC)

A complete, beginner-friendly Student Management System built with **Core Java**, **MySQL Database**, and **Beginner JDBC**, accompanied by a **React + Vite** dashboard.

---

## 🏗️ Architecture & Data Flow

```text
       ┌────────────────────────┐
       │     MySQL Workbench    │  (Visual query tool)
       └───────────┬────────────┘
                   │ Port 3306
                   ▼
       ┌────────────────────────┐
       │      MySQL Server      │  (Port 3306)
       │  [student_management]  │  (Table: 'students')
       └───────────▲────────────┘
                   │ JDBC PreparedStatement
       ┌───────────┴────────────┐
       │     StudentDAO.java    │  (Pure SQL & JDBC)
       └───────────▲────────────┘
                   │
       ┌───────────┴────────────┐
       │   StudentService.java  │  (Business Logic & Validation)
       └───────────▲────────────┘
                   │
       ┌───────────┴────────────┐
       │       Main.java        │  (Console Menu Application)
       └────────────────────────┘
```

---

## 📂 Project Structure

```text
StudentManagement/
├── database/
│   └── student_management.sql                 # Database creation & beginner SQL queries
├── run_backend.bat                            # 1-Click execution script for Java + MySQL
│
├── backend/
│   ├── lib/
│   │   └── mysql-connector-j-8.4.0.jar        # Official MySQL JDBC Driver
│   ├── bin/                                   # Compiled .class bytecode
│   └── src/com/krrish/studentmanagement/
│       ├── Main.java                          # Console UI, menu loop, user prompts
│       ├── model/
│       │   └── Student.java                   # Encapsulated model with 'id', 'rollNumber', Comparable
│       ├── dao/
│       │   └── StudentDAO.java                # Pure JDBC CRUD (PreparedStatement & ResultSet)
│       ├── service/
│       │   └── StudentService.java            # Business logic, duplicate checks, sorting, analytics
│       ├── comparator/                        # 6 Sorting Comparator classes
│       ├── exception/                         # StudentNotFoundException, DuplicateStudentException
│       └── util/
│           ├── DBConnection.java              # DriverManager.getConnection()
│           ├── DBInitializer.java             # Auto-checks database & table existence
│           └── InputUtil.java                 # Exception-safe Scanner inputs
│
└── frontend/                                  # Soft Pastel macOS-Style Dashboard (React + Vite)
    ├── src/
    │   ├── pages/ (AdminPanel, TeacherPanel, StudentPanel, Students, Schedule)
    │   └── components/ (Sidebar with toggle, Header with role switcher, etc.)
    ├── package.json
    └── vite.config.js
```

---

## 🚀 How to Run and Test in MySQL Workbench

### 1. Run the Java Application
Double-click [run_backend.bat](file:///d:/Mini%20Projects/StudentManagement/run_backend.bat) or run in PowerShell:
```powershell
.\run_backend.bat
```

### 2. See the Magic in MySQL Workbench
1. Open **MySQL Workbench**.
2. Run this query in your query tab:
   ```sql
   USE student_management;
   SELECT * FROM students;
   ```
3. In your Java console, choose **Option 1 (Add Student)** and enter a new student (e.g., Roll: 104, Name: Priya Singh).
4. Go back to MySQL Workbench and re-run `SELECT * FROM students;`!
   * You will see the new row appear instantly!
