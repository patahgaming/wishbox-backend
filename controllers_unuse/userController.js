const user = require('../models/userModel');

// Controller untuk login
const loginUser = (req, res) => {
  const { nama, password } = req.body;

  user.loginUserModel(nama, password, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Sukses login
    res.status(200).json({ message: 'Login berhasil', user });
  });
};
const registerUser = (req, res) => {
  const { nama, password, id_pegawai } = req.body;

  if (!nama || !password || !id_pegawai) {
    return res.status(400).json({ error: 'Nama, password, dan id_pegawai harus disediakan' });
  }

  user.registerUserModel(nama, password, id_pegawai, (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: 'User registered successfully', results });
  });
};

module.exports = { 
  loginUser,
  registerUser
};
