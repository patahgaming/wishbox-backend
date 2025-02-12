const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawaiController');
const UserController  = require('../controllers/userController');

// Endpoint untuk mendapatkan semua pegawai
router.get('/pegawai', pegawaiController.getPegawai);

// Endpoint untuk mendapatkan pegawai berdasarkan ID
router.get('/pegawai/:id_pegawai', pegawaiController.getPegawaiById);

// Endpoint untuk menambah pegawai baru
router.post('/pegawai', pegawaiController.createPegawai);

// Endpoint untuk mengupdate pegawai
router.put('/pegawai/:id_pegawai', pegawaiController.putPegawai);

// Endpoint untuk menghapus pegawai
router.delete('/pegawai/:id_pegawai', pegawaiController.deletePegawai);

router.post('/absen/pegawai', pegawaiController.absenPegawai);

router.get('/absen/pegawai', pegawaiController.getAbsenPegawai);
router.get('/absen/pegawai/:queryTipe', pegawaiController.getAbsenPegawaiByQuery);

// Endpoint untuk membuat QR Code
router.get('/pegawai/:id_pegawai/qrcode', pegawaiController.createQrForPegawai);


// Route untuk login
router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);

module.exports = router;
