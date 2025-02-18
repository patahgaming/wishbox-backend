const TargetModel = require('../models/targetModel');

class TargetController {
  static async createTarget(req, res) {
    const { target, bound_to, permit_user, permit_visible } = req.body;
    
    try {
      const result = await TargetModel.createTarget(target, bound_to, permit_user, permit_visible);
      res.json({ message: 'Target created successfully', id_target: result.id_target });
    } catch (err) {
      res.status(500).json({ message: 'Error creating target', error: err.code });
    }
  }
  static async getTargetsWithPermit(req, res) {
    try {
      const { id_target, permit_user, permit_visible } = req.query;
      
      const filters = {
        id_target,
        permit_user,
        permit_visible
      };

      const results = await TargetModel.getTargetsWithPermit(req.user.id_user, filters);
      res.json(results);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: 'Error getting targets', error: error.code });
    }
  }
  static async getTargetDetail(req, res) {
    try {
      // Ambil filter dari query, misalnya id_target_detail
      const { id_target_detail } = req.query;
      const filters = { id_target_detail };
  
      // Panggil fungsi model untuk mengambil data target_detail berdasarkan filter
      const results = await TargetModel.getTargetDetail(filters);
      res.json(results);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: 'Error getting target detail', error: error.code });
    }
  }
  
}

module.exports = TargetController;