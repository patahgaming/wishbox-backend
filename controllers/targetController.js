const TargetModel = require('../models/targetmodel');

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
}

module.exports = TargetController;