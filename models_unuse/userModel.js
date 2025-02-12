const db = require('../config/db');
const bcrypt = require('bcrypt'); // Pastikan bcrypt sudah diinstal

// Model untuk login
const loginUserModel = (nama, password, callback) => {
  console.log(`Trying to login user with name: ${nama}`); // Debug log

  const query = `
    SELECT u.id_user, u.id_pegawai, p.nama, u.password AS hashedPassword
    FROM user u
    JOIN pegawai p ON u.id_pegawai = p.id_pegawai
    WHERE p.nama = ?;
  `;

  db.query(query, [nama], (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Debug log
      return callback(err);
    }

    if (results.length === 0) {
      console.log('No user found with the given name'); // Debug log
      return callback(new Error('Pegawai tidak ditemukan'));
    }

    const user = results[0];

    bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err); // Debug log
        return callback(err);
      }

      if (!isMatch) {
        console.log('Password does not match'); // Debug log
        return callback(new Error('Password salah'));
      }

      // Password matches
      console.log('Login successful for user:', user); // Debug log
      return callback(null, user);
    });
  });
};

// Model untuk register
const registerUserModel = (nama, password, id_pegawai, callback) => {
  // Hash password sebelum menyimpannya ke database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    // Query untuk memasukkan data ke tabel user
    const query = 'INSERT INTO user (id_pegawai, password, CreateAt) VALUES (?, ?, NOW())';

    db.query(query, [id_pegawai, hashedPassword], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  });
};

module.exports = { 
  loginUserModel, 
  registerUserModel 
};
