const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth, isSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.post('/change-password', auth, authController.changePassword);

// Admin management routes (super admin only)
router.get('/admins', auth, isSuperAdmin, authController.getAllAdmins);
router.get('/admins/:id', auth, isSuperAdmin, authController.getAdminById);
router.post('/admins', auth, isSuperAdmin, authController.createAdmin);
router.put('/admins/:id', auth, isSuperAdmin, authController.updateAdmin);
router.delete('/admins/:id', auth, isSuperAdmin, authController.deleteAdmin);

module.exports = router;