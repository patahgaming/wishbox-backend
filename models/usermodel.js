const db = require('./db'); // Adjust path as needed
const bcrypt = require('bcryptjs');

class UserModel {
  static async findByEmail(email) {
    const connection = await db.getConnection();
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const [results] = await connection.execute(sql, [email]);
      return results.length > 0 ? results[0] : null;
    } finally {
      connection.release();
    }
  }
  
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
//yes
module.exports = UserModel;