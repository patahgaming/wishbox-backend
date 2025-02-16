const db = require('./db'); // Adjust path as needed

class TargetModel {
  static async createTarget(target, bound_to, permit_user, permit_visible) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into target_detail
      const [result1] = await connection.query(
        'INSERT INTO target_detail (config) VALUES (?)',
        [JSON.stringify(target)]
      );
      const id_target_detail = result1.insertId;

      // Insert into targets
      const [result2] = await connection.query(
        'INSERT INTO targets (id_target_detail, bound_to, permit_user, permit_visible) VALUES (?, ?, ?, ?)',
        [id_target_detail, bound_to, permit_user, permit_visible]
      );

      await connection.commit();
      return { success: true, id_target: result2.insertId };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = TargetModel;