const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const sqlFilePath = path.join(__dirname, '..', 'database', 'student_management.sql');
  let fullSql = fs.readFileSync(sqlFilePath, 'utf8');
  // Separate out procedure
  const procSplit = fullSql.indexOf('-- STORED PROCEDURE:');
  const baseSql = procSplit !== -1 ? fullSql.substring(0, procSplit) : fullSql;

  console.log('Connecting to MySQL to execute student_management.sql...');
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'shrikrishna@sql77',
    multipleStatements: true
  });

  try {
    await conn.query(baseSql);
    console.log('✅ Base schema and seed data applied successfully!');

    try {
      await conn.query('DROP PROCEDURE IF EXISTS student_management.sp_EvaluateStudentExamClearance');
      await conn.query(`
        CREATE PROCEDURE student_management.sp_EvaluateStudentExamClearance(IN p_roll_number INT)
        BEGIN
            DECLARE v_fee_status VARCHAR(10);
            DECLARE v_attendance DECIMAL(5, 2);
            DECLARE v_condonation BOOLEAN;
            
            SELECT fee_status, attendance_percentage, condonation_waiver
            INTO v_fee_status, v_attendance, v_condonation
            FROM student_management.student_clearance
            WHERE roll_number = p_roll_number;
            
            IF v_fee_status = 'paid' AND (v_attendance >= 75.00 OR v_condonation = TRUE) THEN
                UPDATE student_management.student_clearance
                SET hall_ticket_status = 'issued', marksheet_status = 'released'
                WHERE roll_number = p_roll_number;
            ELSE
                UPDATE student_management.student_clearance
                SET hall_ticket_status = 'withheld', marksheet_status = 'withheld'
                WHERE roll_number = p_roll_number;
            END IF;
        END
      `);
      console.log('✅ Stored procedure created!');
    } catch (procErr) {
      console.warn('⚠️ Stored procedure notice:', procErr.message);
    }

    // Check existing columns in students
    const [cols] = await conn.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'student_management' AND TABLE_NAME = 'students'");
    const existingCols = new Set(cols.map(c => c.COLUMN_NAME.toLowerCase()));

    if (!existingCols.has('fee_total')) {
      await conn.query('ALTER TABLE student_management.students ADD COLUMN fee_total DECIMAL(10,2) DEFAULT 85000.00');
    }
    if (!existingCols.has('fee_paid')) {
      await conn.query('ALTER TABLE student_management.students ADD COLUMN fee_paid DECIMAL(10,2) DEFAULT 85000.00');
    }
    if (!existingCols.has('admission_year')) {
      await conn.query('ALTER TABLE student_management.students ADD COLUMN admission_year INT DEFAULT 2024');
    }
    if (!existingCols.has('gender')) {
      await conn.query('ALTER TABLE student_management.students ADD COLUMN gender VARCHAR(20) DEFAULT "Male"');
    }
    if (!existingCols.has('semester')) {
      await conn.query('ALTER TABLE student_management.students ADD COLUMN semester VARCHAR(20) DEFAULT "Semester 6"');
    }

    // Populate default values for new columns
    await conn.query(`
      UPDATE student_management.students SET 
        fee_total = 85000, 
        fee_paid = CASE WHEN roll_number IN (102, 106, 110) THEN 45000 ELSE 85000 END,
        admission_year = 2024,
        semester = 'Semester 6',
        gender = CASE WHEN roll_number IN (103, 104, 107, 108, 109) THEN 'Female' ELSE 'Male' END
    `);

    console.log('✅ Rich student columns verified & initialized!');

    // Log table counts
    const [tables] = await conn.query('SHOW TABLES FROM student_management');
    console.log('\n📊 student_management Tables & Row Counts:');
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [[{ count }]] = await conn.query(`SELECT COUNT(*) as count FROM student_management.\`${tableName}\``);
      console.log(`  ✓ ${tableName.padEnd(35)} : ${count} rows`);
    }
  } catch (err) {
    console.error('❌ Error executing database script:', err.message);
  } finally {
    await conn.end();
  }
}

initDatabase();
