const mysql = require('mysql2/promise');
require('dotenv').config();

// Κοινόχρηστη σύνδεση MariaDB για όλες τις υπηρεσίες.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`Connected to MariaDB database: ${process.env.DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

testConnection();

module.exports = pool;