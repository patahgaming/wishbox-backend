const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db'); // Koneksi ke MySQL
const { verifyToken } = require('../middleware');
const TargetController = require('../controllers/targetController');
require('dotenv').config();

//Create Target
router.post('/create', verifyToken, TargetController.createTarget);

router.get('/get-with-permit', verifyToken, async (req, res) => {
    try {
        const connection = await db.getConnection();

        // Ambil filter dari query string
        const { id_target, permit_user, permit_visible } = req.query;

        // Kondisi dasar: target yang boleh dilihat user jika
        // - target dimiliki oleh user (bound_to = req.user.id_user)
        // - atau target bersifat visible (permit_visible = 1)
        // - atau target secara eksplisit diizinkan untuk user (permit_user = req.user.id_user)
        const baseCondition = `(bound_to = ? OR permit_visible = 1 OR permit_user = ?)`;
        const values = [req.user.id_user, req.user.id_user];

        // Tambahkan filter tambahan jika ada
        const conditions = [baseCondition];
        if (id_target) {
            conditions.push('id_target = ?');
            values.push(id_target);
        }
        if (permit_user) {
            conditions.push('permit_user = ?');
            values.push(permit_user);
        }
        if (permit_visible !== undefined) {
            conditions.push('permit_visible = ?');
            values.push(permit_visible === 'true' ? 1 : 0);
        }

        // Buat query final dengan menggabungkan kondisi dasar dan tambahan
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
        connection.release();

        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Error getting targets', error: error.code });
    }
});



router.get('/hello', verifyToken, (req, res) => {
    res.json({ message: 'Hello, this is a protected route' });
});

module.exports = router;
