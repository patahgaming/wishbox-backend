const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db'); // Koneksi ke MySQL
require('dotenv').config();

module.exports = router;
