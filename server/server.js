require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// MySQL Connection Pool – all credentials via environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});


// Create HTTP and WebSocket Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast helper for real-time WebSocket clients
function broadcast(event, payload = {}) {
  const message = JSON.stringify({
    event,
    payload,
    timestamp: new Date().toISOString()
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('⚡ [WebSocket] Client connected for real-time updates');
  ws.send(JSON.stringify({
    event: 'CONNECTED',
    payload: { status: 'Live WebSocket Realtime Sync active', time: new Date().toISOString() }
  }));

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ event: 'PONG', timestamp: Date.now() }));
      } else if (data.type === 'BROADCAST_NOTICE' || data.event === 'ANNOUNCEMENT_BROADCAST') {
        broadcast('ANNOUNCEMENT_BROADCAST', data.payload || data.notice || data);
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    console.log('🔌 [WebSocket] Client disconnected');
  });
});

// Helper: map DB student row to frontend format
function formatStudentRow(s) {
  return {
    id: s.id,
    rollNumber: Number(s.roll_number),
    prn: s.prn || `RBT24${s.course || 'IT'}${String(s.roll_number).padStart(3, '0')}`,
    name: s.name,
    email: s.email,
    phone: s.phone,
    course: s.course,
    year: Number(s.year),
    division: s.division,
    percentage: Number(s.percentage || 0),
    feeTotal: Number(s.fee_total || 85000),
    feePaid: Number(s.fee_paid || 85000),
    admissionYear: Number(s.admission_year || 2024),
    gender: s.gender || 'Male',
    semester: s.semester || 'Semester 6',
    createdAt: s.created_at
  };
}

// ==========================================
// 1. HEALTH & SYSTEM DIAGNOSTICS
// ==========================================
app.get('/api/health', async (req, res) => {
  const start = Date.now();
  try {
    const [rows] = await pool.query('SELECT 1 as live');
    const latency = Date.now() - start;
    const [[{ studentCount }]] = await pool.query('SELECT COUNT(*) as studentCount FROM students');
    const [[{ teacherCount }]] = await pool.query('SELECT COUNT(*) as teacherCount FROM teachers');
    const [tables] = await pool.query('SHOW TABLES');

    res.json({
      status: 'UP',
      database: 'MySQL 8.0',
      connected: true,
      latencyMs: latency,
      tablesCount: tables.length,
      studentCount,
      teacherCount,
      activeConnections: pool.pool?._allConnections?.length || 1,
      wsClients: wss.clients.size,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      connected: false,
      error: err.message,
      latencyMs: Date.now() - start
    });
  }
});

// ==========================================
// 1B. ANNOUNCEMENT & NOTICE REAL-TIME BROADCAST
// ==========================================
app.post('/api/announcements/broadcast', async (req, res) => {
  try {
    const notice = req.body;
    console.log(`📢 [Real-Time Notice Broadcast] "${notice.title}" | Target: ${notice.audience || 'all'}`);
    broadcast('ANNOUNCEMENT_BROADCAST', notice);
    res.json({
      success: true,
      message: 'Notice broadcasted to all connected students and faculty in real time',
      noticeId: notice.id
    });
  } catch (err) {
    console.error('Error broadcasting announcement:', err);
    res.status(500).json({ error: 'Broadcast failed', details: err.message });
  }
});

// ==========================================
// 2. STUDENTS API (CRUD, Bulk, Analytics)
// ==========================================

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const { search, course, division, year, sort } = req.query;
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    if (course && course !== 'All') {
      query += ' AND UPPER(course) = UPPER(?)';
      params.push(course);
    }
    if (division && division !== 'All') {
      query += ' AND UPPER(division) = UPPER(?)';
      params.push(division);
    }
    if (year && year !== 'All') {
      query += ' AND year = ?';
      params.push(Number(year));
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR roll_number LIKE ? OR prn LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (sort === 'percentage_desc') {
      query += ' ORDER BY percentage DESC';
    } else if (sort === 'percentage_asc') {
      query += ' ORDER BY percentage ASC';
    } else if (sort === 'name') {
      query += ' ORDER BY name ASC';
    } else {
      query += ' ORDER BY course ASC, division ASC, roll_number ASC';
    }

    const [rows] = await pool.query(query, params);
    const formatted = rows.map(formatStudentRow);
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students from MySQL', details: err.message });
  }
});

// GET single student
app.get('/api/students/:rollNumber', async (req, res) => {
  try {
    const roll = Number(req.params.rollNumber);
    const [rows] = await pool.query('SELECT * FROM students WHERE roll_number = ?', [roll]);
    if (rows.length === 0) {
      return res.status(404).json({ error: `Student with Roll Number ${roll} not found.` });
    }

    const student = formatStudentRow(rows[0]);

    // Attach clearance info if exists
    const [clearance] = await pool.query('SELECT * FROM student_clearance WHERE roll_number = ?', [roll]);
    if (clearance.length > 0) {
      student.clearance = clearance[0];
    }

    // Attach marks info
    const [marks] = await pool.query('SELECT * FROM marks WHERE roll_number = ?', [roll]);
    student.marks = marks;

    // Attach attendance info
    const [attendance] = await pool.query('SELECT * FROM attendance WHERE roll_number = ? ORDER BY date DESC', [roll]);
    student.attendance = attendance;

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add student
app.post('/api/students', async (req, res) => {
  try {
    const s = req.body;
    const roll = Number(s.rollNumber);
    const course = (s.course || 'IT').toUpperCase();
    const division = (s.division || 'A').toUpperCase();
    const year = Number(s.year) || 3;
    const percentage = Number(s.percentage) || 75.0;
    const feeTotal = Number(s.feeTotal) || 85000;
    const feePaid = Number(s.feePaid) || 85000;
    const admissionYear = Number(s.admissionYear) || 2024;
    const gender = s.gender || 'Male';
    const semester = s.semester || 'Semester 6';
    const prn = s.prn || `RBT24${course}${String(roll).padStart(3, '0')}`;

    // Uniqueness checks
    const [exists] = await pool.query(
      'SELECT id FROM students WHERE roll_number = ? OR email = ? OR prn = ?',
      [roll, s.email, prn]
    );

    if (exists.length > 0) {
      return res.status(409).json({
        error: `A student with Roll Number ${roll}, email "${s.email}", or PRN "${prn}" already exists!`
      });
    }

    const [result] = await pool.query(
      `INSERT INTO students (roll_number, prn, name, email, phone, course, year, division, percentage, fee_total, fee_paid, admission_year, gender, semester)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [roll, prn, s.name, s.email, s.phone || '0000000000', course, year, division, percentage, feeTotal, feePaid, admissionYear, gender, semester]
    );

    // Auto-create or ensure clearance row
    const feeStatus = feePaid >= feeTotal ? 'paid' : 'pending';
    const dueAmount = Math.max(0, feeTotal - feePaid);
    await pool.query(
      `INSERT INTO student_clearance (roll_number, fee_status, fee_due_amount, attendance_percentage, hall_ticket_status, marksheet_status)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE fee_status = VALUES(fee_status), fee_due_amount = VALUES(fee_due_amount)`,
      [roll, feeStatus, dueAmount, percentage >= 75 ? 85.00 : 70.00, feeStatus === 'paid' ? 'issued' : 'withheld', feeStatus === 'paid' ? 'released' : 'withheld']
    );

    // Auto log audit
    await pool.query(
      `INSERT INTO audit_logs (actor_name, action_type, target_module, host_ip, status)
       VALUES ('System Admin', 'ENROLL_STUDENT', 'Student Management', '127.0.0.1', 'Success')`
    );

    const newStudent = formatStudentRow({
      id: result.insertId,
      roll_number: roll,
      prn,
      name: s.name,
      email: s.email,
      phone: s.phone,
      course,
      year,
      division,
      percentage,
      fee_total: feeTotal,
      fee_paid: feePaid,
      admission_year: admissionYear,
      gender,
      semester,
      created_at: new Date()
    });

    // Instant real-time broadcast to all browser tabs
    broadcast('STUDENT_ADDED', newStudent);

    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update student
app.put('/api/students/:rollNumber', async (req, res) => {
  try {
    const roll = Number(req.params.rollNumber);
    const s = req.body;
    const course = (s.course || 'IT').toUpperCase();
    const division = (s.division || 'A').toUpperCase();
    const year = Number(s.year) || 3;
    const percentage = Number(s.percentage) || 75.0;
    const feeTotal = Number(s.feeTotal) || 85000;
    const feePaid = Number(s.feePaid) || 85000;
    const admissionYear = Number(s.admissionYear) || 2024;
    const gender = s.gender || 'Male';
    const semester = s.semester || 'Semester 6';
    const prn = s.prn || `RBT24${course}${String(roll).padStart(3, '0')}`;

    const [existing] = await pool.query('SELECT * FROM students WHERE roll_number = ?', [roll]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Student #${roll} not found.` });
    }

    await pool.query(
      `UPDATE students SET 
         name = ?, email = ?, phone = ?, course = ?, year = ?, division = ?, percentage = ?,
         fee_total = ?, fee_paid = ?, admission_year = ?, gender = ?, semester = ?, prn = ?
       WHERE roll_number = ?`,
      [s.name, s.email, s.phone, course, year, division, percentage, feeTotal, feePaid, admissionYear, gender, semester, prn, roll]
    );

    // Sync clearance if fee updated
    const feeStatus = feePaid >= feeTotal ? 'paid' : 'pending';
    const dueAmount = Math.max(0, feeTotal - feePaid);
    await pool.query(
      `UPDATE student_clearance SET fee_status = ?, fee_due_amount = ? WHERE roll_number = ?`,
      [feeStatus, dueAmount, roll]
    );

    // Auto log audit
    await pool.query(
      `INSERT INTO audit_logs (actor_name, action_type, target_module, host_ip, status)
       VALUES ('System Admin', 'UPDATE_STUDENT', 'Student Management', '127.0.0.1', 'Success')`
    );

    const updated = formatStudentRow({
      ...existing[0],
      roll_number: roll,
      name: s.name,
      email: s.email,
      phone: s.phone,
      course,
      year,
      division,
      percentage,
      fee_total: feeTotal,
      fee_paid: feePaid,
      admission_year: admissionYear,
      gender,
      semester,
      prn
    });

    broadcast('STUDENT_UPDATED', updated);
    res.json(updated);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:rollNumber', async (req, res) => {
  try {
    const roll = Number(req.params.rollNumber);
    const [existing] = await pool.query('SELECT * FROM students WHERE roll_number = ?', [roll]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Student with Roll Number ${roll} not found.` });
    }

    // Clean up related tables (clearance, attendance, marks)
    await pool.query('DELETE FROM student_clearance WHERE roll_number = ?', [roll]);
    await pool.query('DELETE FROM attendance WHERE roll_number = ?', [roll]);
    await pool.query('DELETE FROM marks WHERE roll_number = ?', [roll]);
    await pool.query('DELETE FROM students WHERE roll_number = ?', [roll]);

    // Audit log
    await pool.query(
      `INSERT INTO audit_logs (actor_name, action_type, target_module, host_ip, status)
       VALUES ('System Admin', 'DELETE_STUDENT', 'Student Management', '127.0.0.1', 'Success')`
    );

    broadcast('STUDENT_DELETED', { rollNumber: roll });
    res.json({ success: true, rollNumber: roll });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST bulk add students
app.post('/api/students/bulk', async (req, res) => {
  const students = req.body;
  if (!Array.isArray(students)) {
    return res.status(400).json({ error: 'Payload must be an array of students' });
  }

  const added = [];
  const errors = [];

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    try {
      const roll = Number(s.rollNumber);
      const course = (s.course || 'IT').toUpperCase();
      const division = (s.division || 'A').toUpperCase();
      const year = Number(s.year) || 3;
      const percentage = Number(s.percentage) || 75.0;
      const feeTotal = Number(s.feeTotal) || 85000;
      const feePaid = Number(s.feePaid) || 85000;
      const admissionYear = Number(s.admissionYear) || 2024;
      const gender = s.gender || 'Male';
      const semester = s.semester || 'Semester 6';
      const prn = s.prn || `RBT24${course}${String(roll).padStart(3, '0')}`;

      const [exists] = await pool.query(
        'SELECT id FROM students WHERE roll_number = ? OR email = ? OR prn = ?',
        [roll, s.email, prn]
      );

      if (exists.length > 0) {
        errors.push(`Row ${i + 1} (Roll #${roll}): Student already exists`);
        continue;
      }

      const [result] = await pool.query(
        `INSERT INTO students (roll_number, prn, name, email, phone, course, year, division, percentage, fee_total, fee_paid, admission_year, gender, semester)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [roll, prn, s.name, s.email, s.phone || '0000000000', course, year, division, percentage, feeTotal, feePaid, admissionYear, gender, semester]
      );

      // Create clearance
      const feeStatus = feePaid >= feeTotal ? 'paid' : 'pending';
      const dueAmount = Math.max(0, feeTotal - feePaid);
      await pool.query(
        `INSERT INTO student_clearance (roll_number, fee_status, fee_due_amount, attendance_percentage, hall_ticket_status, marksheet_status)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE fee_status = VALUES(fee_status)`,
        [roll, feeStatus, dueAmount, 85.00, 'issued', 'released']
      );

      const addedStudent = formatStudentRow({
        id: result.insertId,
        roll_number: roll,
        prn,
        name: s.name,
        email: s.email,
        phone: s.phone,
        course,
        year,
        division,
        percentage,
        fee_total: feeTotal,
        fee_paid: feePaid,
        admission_year: admissionYear,
        gender,
        semester,
        created_at: new Date()
      });

      added.push(addedStudent);
    } catch (e) {
      errors.push(`Row ${i + 1}: ${e.message}`);
    }
  }

  if (added.length > 0) {
    broadcast('STUDENTS_BULK_ADDED', { count: added.length });
  }

  res.json({ added, errors });
});

// GET Student Analytics directly calculated from MySQL
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const [[summary]] = await pool.query(`
      SELECT 
        COUNT(*) as totalStudents,
        IFNULL(AVG(percentage), 0) as averagePercentage,
        IFNULL(MAX(percentage), 0) as highestPercentage,
        IFNULL(SUM(fee_total), 0) as totalFeesRequired,
        IFNULL(SUM(fee_paid), 0) as totalFeesCollected
      FROM students
    `);

    // Top scorer
    const [topScorer] = await pool.query(
      'SELECT * FROM students ORDER BY percentage DESC LIMIT 1'
    );

    // Department breakdown
    const [deptCounts] = await pool.query(`
      SELECT course, COUNT(*) as count, AVG(percentage) as avgGrade 
      FROM students 
      GROUP BY course
    `);

    // Gender breakdown
    const [genderCounts] = await pool.query(`
      SELECT gender, COUNT(*) as count 
      FROM students 
      GROUP BY gender
    `);

    // Fee clearance status
    const [clearanceStats] = await pool.query(`
      SELECT fee_status, COUNT(*) as count 
      FROM student_clearance 
      GROUP BY fee_status
    `);

    res.json({
      total: Number(summary.totalStudents),
      average: Number(Number(summary.averagePercentage).toFixed(2)),
      highest: topScorer.length > 0 ? formatStudentRow(topScorer[0]) : null,
      fees: {
        required: Number(summary.totalFeesRequired),
        collected: Number(summary.totalFeesCollected),
        pending: Math.max(0, Number(summary.totalFeesRequired) - Number(summary.totalFeesCollected))
      },
      departments: deptCounts,
      gender: genderCounts,
      clearance: clearanceStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. CLEARANCE & HALL TICKETS API
// ==========================================
app.get('/api/clearance', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sc.*, s.name, s.course, s.division, s.email, s.prn
      FROM student_clearance sc
      JOIN students s ON sc.roll_number = s.roll_number
      ORDER BY s.course ASC, s.roll_number ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clearance/:rollNumber', async (req, res) => {
  try {
    const roll = Number(req.params.rollNumber);
    const { fee_status, fee_due_amount, attendance_percentage, condonation_waiver, condonation_reason } = req.body;

    // Auto-compute hall ticket & marksheet status
    const isFeePaid = fee_status === 'paid';
    const isAttendanceEligible = Number(attendance_percentage) >= 75.0 || condonation_waiver === true;
    const hallTicket = isFeePaid && isAttendanceEligible ? 'issued' : 'withheld';
    const marksheet = isFeePaid && isAttendanceEligible ? 'released' : 'withheld';

    await pool.query(
      `UPDATE student_clearance SET
         fee_status = ?, fee_due_amount = ?, attendance_percentage = ?,
         condonation_waiver = ?, condonation_reason = ?,
         hall_ticket_status = ?, marksheet_status = ?
       WHERE roll_number = ?`,
      [fee_status, fee_due_amount, attendance_percentage, condonation_waiver, condonation_reason, hallTicket, marksheet, roll]
    );

    const [updated] = await pool.query('SELECT * FROM student_clearance WHERE roll_number = ?', [roll]);
    broadcast('CLEARANCE_UPDATED', updated[0]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. TEACHERS & FACULTY ALLOCATIONS
// ==========================================
app.get('/api/teachers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, fa.designation, fa.class_teacher_division, fa.gfm_cohort, fa.theory_subjects, fa.practical_labs
      FROM teachers t
      LEFT JOIN faculty_allocations fa ON t.staff_id = fa.staff_id
      ORDER BY t.department ASC, t.name ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. EXAM TIMETABLE & SCHEDULES
// ==========================================
app.get('/api/exams', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM exam_schedules ORDER BY STR_TO_DATE(date, "%b %d, %Y") ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. ANNOUNCEMENTS
// ==========================================
app.get('/api/announcements', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const { title, message, department, tag } = req.body;
    const [result] = await pool.query(
      'INSERT INTO announcements (title, message, department, tag) VALUES (?, ?, ?, ?)',
      [title, message, department || 'All Departments', tag || 'General']
    );
    const newAnn = { id: result.insertId, title, message, department, tag, created_at: new Date() };
    broadcast('ANNOUNCEMENT_ADDED', newAnn);
    res.status(201).json(newAnn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. STUDY MATERIALS / REPOSITORY
// ==========================================
app.get('/api/study-materials', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM study_materials ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study-materials', async (req, res) => {
  try {
    const { title, subject_code, category, file_type, file_size, file_url, uploaded_by } = req.body;
    const [result] = await pool.query(
      `INSERT INTO study_materials (title, subject_code, category, file_type, file_size, file_url, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, subject_code, category || 'Lecture Notes', file_type || 'PDF', file_size || '2.5 MB', file_url || '#', uploaded_by || 'Faculty']
    );
    const newMat = { id: result.insertId, ...req.body, created_at: new Date() };
    broadcast('STUDY_MATERIAL_ADDED', newMat);
    res.status(201).json(newMat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. AUDIT LOGS
// ==========================================
app.get('/api/audit-logs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. CERTIFICATES & TRANSCRIPTS
// ==========================================
app.get('/api/certificates', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cr.*, s.name, s.course, s.division 
      FROM certificate_requests cr
      JOIN students s ON cr.roll_number = s.roll_number
      ORDER BY cr.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transcripts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT st.*, s.name, s.course, s.division, s.prn
      FROM semester_transcripts st
      JOIN students s ON st.roll_number = s.roll_number
      ORDER BY st.roll_number ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. SECURITY & CREDENTIAL APPROVALS
// ==========================================
app.get('/api/security/requests', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pcr.*, u.name as userName, u.email as userEmail
      FROM password_change_requests pcr
      LEFT JOIN users u ON pcr.user_id = u.id
      ORDER BY pcr.requested_at DESC
    `);
    const formatted = rows.map((r) => ({
      id: r.request_code || `REQ-SEC-${r.id}`,
      dbId: r.id,
      userId: r.user_id,
      userName: r.userName || r.login_id,
      loginId: r.login_id,
      email: r.userEmail || `${r.login_id.toLowerCase()}@edutrack.edu`,
      role: (r.role || 'Student').toLowerCase(),
      department: r.department || 'Academic Department',
      currentPasswordMasked: '••••••',
      requestedNewPassword: r.new_password_hash,
      reason: r.reason || 'User password change request.',
      status: r.status || 'Pending',
      requestedAt: r.requested_at,
      reviewedAt: r.reviewed_at,
      reviewedBy: r.reviewed_by,
      adminNotes: r.admin_notes
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/security/requests/:id/approve', async (req, res) => {
  try {
    const reqId = req.params.id;
    const { adminName = 'System Administrator', adminNotes = 'Identity confirmed and password updated.' } = req.body;

    const [requests] = await pool.query(
      'SELECT * FROM password_change_requests WHERE request_code = ? OR id = ?',
      [reqId, isNaN(reqId) ? -1 : Number(reqId)]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: 'Security request not found' });
    }

    const target = requests[0];
    const newPass = target.new_password_hash;

    // Update password_change_requests status
    await pool.query(
      `UPDATE password_change_requests 
       SET status = 'Approved', reviewed_at = NOW(), reviewed_by = ?, admin_notes = ?
       WHERE id = ?`,
      [adminName, adminNotes, target.id]
    );

    // Update user password in users table
    await pool.query(
      `UPDATE users SET password = ?, must_change_password = FALSE WHERE id = ? OR login_id = ?`,
      [newPass, target.user_id, target.login_id]
    );

    // Log in audit_logs
    await pool.query(
      `INSERT INTO audit_logs (actor_name, action_type, target_module, host_ip, status)
       VALUES (?, 'APPROVE_PASSWORD_CHANGE', 'Security & Approvals', '127.0.0.1', 'Success')`,
      [adminName]
    );

    const updated = {
      ...target,
      id: target.request_code,
      status: 'Approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminName,
      adminNotes
    };

    broadcast('SECURITY_REQUEST_APPROVED', updated);
    res.json({ success: true, message: `Request #${target.request_code} approved!`, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/security/requests/:id/reject', async (req, res) => {
  try {
    const reqId = req.params.id;
    const { adminName = 'System Administrator', rejectionReason = 'Verification requirements not met.' } = req.body;

    const [requests] = await pool.query(
      'SELECT * FROM password_change_requests WHERE request_code = ? OR id = ?',
      [reqId, isNaN(reqId) ? -1 : Number(reqId)]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: 'Security request not found' });
    }

    const target = requests[0];

    await pool.query(
      `UPDATE password_change_requests 
       SET status = 'Rejected', reviewed_at = NOW(), reviewed_by = ?, admin_notes = ?
       WHERE id = ?`,
      [adminName, rejectionReason, target.id]
    );

    await pool.query(
      `INSERT INTO audit_logs (actor_name, action_type, target_module, host_ip, status)
       VALUES (?, 'REJECT_PASSWORD_CHANGE', 'Security & Approvals', '127.0.0.1', 'Success')`,
      [adminName]
    );

    const updated = {
      ...target,
      id: target.request_code,
      status: 'Rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminName,
      adminNotes: rejectionReason
    };

    broadcast('SECURITY_REQUEST_REJECTED', updated);
    res.json({ success: true, message: `Request #${target.request_code} rejected.`, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/security/requests', async (req, res) => {
  try {
    const { userId, loginId, role, newPassword, reason } = req.body;
    const requestCode = `REQ-SEC-${Date.now().toString().slice(-6)}`;

    const [result] = await pool.query(
      `INSERT INTO password_change_requests (request_code, user_id, login_id, role, new_password_hash, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [requestCode, userId || 1, loginId, role || 'Student', newPassword, reason || 'User requested password change in profile.']
    );

    const newReq = {
      id: requestCode,
      dbId: result.insertId,
      loginId,
      role: (role || 'Student').toLowerCase(),
      requestedNewPassword: newPassword,
      reason,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    broadcast('SECURITY_REQUEST_CREATED', newReq);
    res.status(201).json({ success: true, requestId: requestCode, data: newReq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 11. ASSIGNMENTS API
// ==========================================
app.get('/api/assignments', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, s.name as subject_name, t.name as faculty_name,
        (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) as submissions_count,
        (SELECT COUNT(*) FROM students st WHERE st.course = a.subject_code OR a.subject_code LIKE CONCAT(st.course, '%')) as total_students
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_code = s.code
      LEFT JOIN teachers t ON a.created_by = t.staff_id
      ORDER BY a.deadline ASC
    `);

    const formatted = rows.map((r) => {
      const submissions = Number(r.submissions_count || 0);
      const total = Math.max(1, Number(r.total_students || 40));
      const compliance = Math.min(100, Math.round((submissions / total) * 100));

      return {
        id: r.id,
        title: r.title,
        subjectCode: r.subject_code,
        subject: r.subject_name || r.subject_code,
        deadline: r.deadline ? new Date(r.deadline).toISOString().slice(0, 10) : '2026-10-15',
        totalMarks: r.total_marks || 20,
        createdBy: r.created_by,
        faculty: r.faculty_name || 'Prof. Krrish Sharma',
        submissionsCount: submissions,
        totalStudents: total,
        compliance: `${compliance}%`,
        status: r.status || 'Active'
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assignments', async (req, res) => {
  try {
    const { title, subjectCode, deadline, totalMarks, createdBy } = req.body;
    const [result] = await pool.query(
      `INSERT INTO assignments (title, subject_code, deadline, total_marks, created_by, status)
       VALUES (?, ?, ?, ?, ?, 'Active')`,
      [title, subjectCode || 'IT-301', deadline, totalMarks || 20, createdBy || 'FAC-IT-101']
    );

    const newAssignment = {
      id: result.insertId,
      title,
      subjectCode: subjectCode || 'IT-301',
      subject: subjectCode || 'IT-301',
      deadline,
      totalMarks: totalMarks || 20,
      createdBy: createdBy || 'FAC-IT-101',
      faculty: 'Faculty Instructor',
      submissionsCount: 0,
      totalStudents: 40,
      compliance: '0%',
      status: 'Active'
    };

    broadcast('ASSIGNMENT_CREATED', newAssignment);
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Export app for Vercel serverless functions
module.exports = app;

// Start server only when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  server.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 EduTrack Realtime MySQL Server is LIVE on port ${PORT}`);
    console.log(`📡 WebSocket Realtime Sync available on ws://localhost:${PORT}`);
    console.log(`💾 Connected to MySQL [student_management]`);
    console.log(`=============================================================\n`);
  });
}

