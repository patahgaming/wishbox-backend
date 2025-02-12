const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Cek apakah email sudah digunakan
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.length > 0) return res.status(400).json({ message: 'Email sudah terdaftar' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Simpan user ke database
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Gagal mendaftar' });
          res.status(201).json({ message: 'Registrasi berhasil' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah user ada
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.length === 0) return res.status(400).json({ message: 'Email tidak ditemukan' });

      const user = result[0];

      // Cek password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Password salah' });

      // Buat JWT Token
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Login berhasil', token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
