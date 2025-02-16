const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

class AuthController {
  static async login(req, res) {
    console.log("Incoming request body:", req.body); // Debugging
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
      // Find user by email
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Verify password
      const isMatch = await UserModel.verifyPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create JWT token
      const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '69h' });
      
      res.json({ token });
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: 'Error logging in', error: error.code });
    }
  }
}

module.exports = AuthController;