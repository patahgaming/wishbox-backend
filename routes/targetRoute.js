const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./../models/db'); // Koneksi ke MySQL
const { verifyToken } = require('./../middleware');
const TargetController = require('./../controllers/targetController');
require('dotenv').config();

//Create Target
router.post('/create', verifyToken, TargetController.createTarget);

router.get('/get-with-permit', verifyToken, TargetController.getTargetsWithPermit);

router.get('/get-detail', verifyToken, TargetController.getTargetDetail);

router.get('/hello', verifyToken, (req, res) => {
    res.json({ message: 'Hello, this is a protected route' });
});

module.exports = router;
