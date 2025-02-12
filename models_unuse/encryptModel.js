const db = require('../config/db');
const crypto = require('crypto');

const generateValidKey = (nama, id) => {
  // Menggabungkan nama dan id, lalu menghasilkan hash SHA-256
  const data = `${nama}${id}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  generateValidKey
};
