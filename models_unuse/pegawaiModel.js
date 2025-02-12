const db = require('../config/db');

// Function 45untuk mendapatkan semua pegawai
const getAllPegawaiModel = (callback) => {
  const query = 'SELECT * FROM pegawai';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    return callback(null, results);
  });
};

// Function untuk mendapatkan pegawai berdasarkan id
const getPegawaiByIdModel = (id_pegawai, callback) => {
  const query = 'SELECT * FROM pegawai WHERE id_pegawai = ?'; // pastikan nama kolom benar
  db.query(query, [id_pegawai], (err, results) => { // Tambahkan [id_pegawai] di sini
    if (err) return callback(err);
    return callback(null, results);
  });
};



// Function untuk menambah pegawai baru
const addPegawaiModel = (pegawaiData, callback) => {
    const query = 'INSERT INTO pegawai SET ?';
  
    console.log('Query:', query);
    console.log('Data yang akan dimasukkan:', pegawaiData);
  
    db.query(query, pegawaiData, (err, results) => {
      if (err) {
        console.error('Error inserting data:', err.message); // Logging error yang lebih detail
        return callback(err);
      }
      return callback(null, results);
    });
  };
  const updatePegawaiModel = (pegawaiData, callback) => {
    const query = 'UPDATE pegawai SET nama = ?, validKey = ? WHERE id_pegawai = ?';
  
    console.log('Query:', query);
    console.log('Data yang akan diupdate:', pegawaiData);
  
    // Pastikan id_pegawai ada di pegawaiData
    if (!pegawaiData.id_pegawai) {
      return callback(new Error('ID pegawai tidak disediakan'));
    }
  
    db.query(query, [pegawaiData.nama, pegawaiData.validKey, pegawaiData.id_pegawai], (err, results) => {
      if (err) {
        console.error('Error updating data:', err.message);
        return callback(err);
      }
      return callback(null, results);
    });
  };
  const deletePegawaiModel = (id_pegawai, callback) => {
    const query = 'DELETE FROM pegawai WHERE id_pegawai = ?';
    db.query(query, [id_pegawai], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  };
  const absenPegawaiModel = (data, callback) => {
    if (!data.validKey) {
      return callback(new Error('ValidKey tidak disediakan'));
    }
  
    // Query untuk memeriksa apakah pegawai ada di tabel 'pegawai' berdasarkan validKey
    const checkPegawaiQuery = 'SELECT id_pegawai, nama FROM pegawai WHERE validKey = ?';
  
    db.query(checkPegawaiQuery, [data.validKey], (err, results) => {
      if (err) return callback(err);
  
      if (results.length === 0) {
        // Jika tidak ditemukan, kirim error bahwa pegawai tidak ada
        return callback(new Error('Pegawai tidak ditemukan'));
      }
  
      // Jika ditemukan, ambil id_pegawai dan nama dari hasil query
      const { id_pegawai, nama } = results[0];
  
      // Query untuk memasukkan data ke tabel 'pegawai_absen'
      const insertAbsenQuery = 'INSERT INTO pegawai_absen (id_pegawai, nama, createAt) VALUES (?, ?, NOW())';
  
      // Lakukan insert data ke tabel 'pegawai_absen'
      db.query(insertAbsenQuery, [id_pegawai, nama], (err, results) => {
        if (err) return callback(err);
        
        // Jika berhasil, kembalikan hasil
        return callback(null, results);
      });
    });
  };
  const absenPegawaiGetModel = (callback) => {
    const query = 'SELECT * FROM `pegawai_absen` ORDER BY `createAt` DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.log('Error during query:', err);
        return callback(err);
      }
      console.log('Query results:', results); // Tambahkan log ini
      return callback(null, results);
    });
  };
  const getAbsenPegawaiByQueryModel = (queryTipe, callback) => {
    let query;
  
    // Menentukan query berdasarkan queryTipe
    if (queryTipe === 'desc') {
      query = 'SELECT * FROM `pegawai_absen` ORDER BY `createAt` DESC';
    } else if (queryTipe === 'asc') {
      query = 'SELECT * FROM `pegawai_absen` ORDER BY `createAt` ASC';
    } else if (queryTipe === 'today') {
      query = "SELECT * FROM `pegawai_absen` WHERE DATE(createAt) = CURDATE()";
    } else {
      return callback(new Error('Tipe query tidak valid'), null);
    }
  
    // Eksekusi query
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  };
const loginUserModel = (nama, password, callback) => {
  // Query untuk login menggunakan JOIN
  const query = `
    SELECT u.id_user, u.id_pegawai, p.nama, u.password AS hashedPassword
    FROM user u
    JOIN pegawai p ON u.id_pegawai = p.id_pegawai
    WHERE p.nama = ?;
  `;

  db.query(query, [nama], (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) {
      return callback(new Error('Pegawai tidak ditemukan'));
    }

    const user = results[0];

    // Verifikasi password
    bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
      if (err) return callback(err);
      if (!isMatch) return callback(new Error('Password salah'));

      // Password cocok
      return callback(null, user); // Mengembalikan data pengguna yang login
    });
  });
};
module.exports = {
  getAllPegawaiModel,
  getPegawaiByIdModel,
  addPegawaiModel,
  updatePegawaiModel,
  absenPegawaiModel,
  absenPegawaiGetModel,
  getAbsenPegawaiByQueryModel,
  deletePegawaiModel
};