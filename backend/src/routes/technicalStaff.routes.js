const express = require('express');
const router = express.Router();
const technicalStaffController = require('../controllers/technicalStaff.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', technicalStaffController.getAllStaff);
router.get('/:id', technicalStaffController.getStaffById);
router.get('/position/:position', technicalStaffController.getStaffByPosition);

// Protected routes (admin only)
router.post('/', auth, isAdmin, technicalStaffController.createStaff);
router.put('/:id', auth, isAdmin, technicalStaffController.updateStaff);
router.delete('/:id', auth, isAdmin, technicalStaffController.deleteStaff);

module.exports = router; 