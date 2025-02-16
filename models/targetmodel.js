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
  static async getTargetsWithPermit(userId, filters = {}) {
    const connection = await db.getConnection();
    try {
      // Base condition: targets that can be viewed by the user
      const baseCondition = `(bound_to = ? OR permit_visible = 1 OR permit_user = ?)`;
      const values = [userId, userId];

      // Add additional filters if provided
      const conditions = [baseCondition];
      if (filters.id_target) {
        conditions.push('id_target = ?');
        values.push(filters.id_target);
      }
      if (filters.permit_user) {
        conditions.push('permit_user = ?');
        values.push(filters.permit_user);
      }
      if (filters.permit_visible !== undefined) {
        conditions.push('permit_visible = ?');
        values.push(filters.permit_visible === 'true' ? 1 : 0);
      }

      // Build final query
      const query = `
SELECT 
    t.id_target,
    td.config AS target_config,
    u1.name AS bound_to_name,
    u2.name AS permit_user_name,
    t.permit_visible,
    t.create_at AS target_created_at
FROM targets t
JOIN target_detail td ON t.id_target_detail = td.id_target_detail
JOIN users u1 ON t.bound_to = u1.id_user
JOIN users u2 ON t.permit_user = u2.id_user
WHERE ${conditions.join(' AND ')}
`;

      const [results] = await connection.query(query, values);
      return results;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }
  static async getTargetDetail(filters = {}) {
    const connection = await db.getConnection();
    try {
      const conditions = [];
      const values = [];
  
      // Jika ada filter berdasarkan id_target_detail, tambahkan ke kondisi
      if (filters.id_target_detail) {
        conditions.push("td.id_target_detail = ?");
        values.push(filters.id_target_detail);
      }
  
      // Query dasar untuk membaca data dari tabel target_detail
      const query = `
        SELECT 
          td.id_target_detail,
          td.config,
          td.create_at
        FROM target_detail td
        ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}
      `;
  
      const [results] = await connection.query(query, values);
      return results;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }
  
}

module.exports = TargetModel;