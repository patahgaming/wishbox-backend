const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Maksimum koneksi
});

db.getConnection((err, connection) => {
  if (err) console.error('Database connection failed:', err);
  else console.log('Connected to MySQL');
  if (connection) connection.release();
});

module.exports = db;
