const mysql = require('mysql2/promise');

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'shrikrishna@sql77',
      database: 'student_management'
    });
    console.log('✅ Connected to MySQL successfully!');
    const [tables] = await conn.query('SHOW TABLES');
    console.log('Tables in student_management:');
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [[{ count }]] = await conn.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`  - ${tableName} (${count} rows)`);
    }
    const [students] = await conn.query('SELECT * FROM students LIMIT 5');
    console.log('Sample students from DB:');
    console.log(JSON.stringify(students, null, 2));
    await conn.end();
  } catch (err) {
    console.error('❌ MySQL error:', err.message);
  }
}

test();
