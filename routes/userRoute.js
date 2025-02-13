const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db'); // Koneksi ke MySQL
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  const { name, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';
  db.query(sql, [name, hashedPassword, email], (err, result) => {
    // First check if there's an error at all
    if (err) {
      // Then check for specific error types
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Handle any other database errors
      return res.status(500).json({ message: 'Error registering user', error: err.code });
    }

    // If no error occurred, send success response
    res.json({ message: 'User registered successfully' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { name, password } = req.body;

  const sql = 'SELECT * FROM users WHERE name = ?';
  db.query(sql, [name], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Get User Profile (butuh token)
router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    const sql = 'SELECT id_user, name FROM users WHERE id_user = ?';
    db.query(sql, [decoded.id_user], (err, results) => {
      if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
      res.json(results[0]);
    });
  });
});

module.exports = router;
