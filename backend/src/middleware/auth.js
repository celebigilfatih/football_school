const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// JWT token verification middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin from database
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ message: 'Hesabınız devre dışı bırakılmış' });
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }
};

// Admin role check middleware
const isAdmin = (req, res, next) => {
  if (!req.admin || !['admin', 'superadmin'].includes(req.admin.role)) {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmuyor' });
  }
  next();
};

// Super admin check middleware
const isSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmuyor' });
  }
  next();
};

// Export middleware functions
module.exports = { auth, isAdmin, isSuperAdmin }; 