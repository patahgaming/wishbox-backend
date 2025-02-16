const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db'); // Koneksi ke MySQL
const { verifyToken } = require('../middleware');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  console.log("Incoming request body:", req.body); // Debugging
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';

    // Koneksi ke database menggunakan async/await
    const connection = await db.getConnection();
    const [result] = await connection.execute(sql, [name, hashedPassword, email]);
    
    connection.release(); // Pastikan koneksi dilepas setelah query selesai
    res.json({ message: 'User registered successfully' });

  } catch (error) {
    console.error("Database error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.code });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log("Incoming request body:", req.body); // Debugging

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Dapatkan koneksi database
    const connection = await db.getConnection();
    
    // Cari user berdasarkan email
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [results] = await connection.execute(sql, [email]);
    
    // Lepaskan koneksi setelah query selesai
    connection.release();

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    
    // Bandingkan password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Buat token JWT
    const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '69h' });

    res.json({ token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Error logging in', error: error.code });
  }
});



// Get User Profile (butuh token)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Ambil koneksi database
    const connection = await db.getConnection();
    
    // Query database
    const sql = 'SELECT id_user, name FROM users WHERE id_user = ?';
    const [results] = await connection.execute(sql, [req.user.id_user]);

    // Lepaskan koneksi setelah query selesai
    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: 'Error retrieving profile', error: error.code });
  }
});


module.exports = router;
